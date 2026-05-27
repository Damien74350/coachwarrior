// Wallet inspector: detect chain from address and pull balances + recent activity
// using free, key-less public endpoints.

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export type Chain = "evm" | "bitcoin" | "solana";

export interface WalletHolding {
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  contract?: string;
  priceUsd: number | null;
  valueUsd: number | null;
  icon?: string;
}

export interface WalletTx {
  hash: string;
  ts: number; // ms
  date: string;
  direction: "in" | "out" | "self";
  counterparty?: string | null;
  amount: number;
  symbol: string;
  valueUsd?: number | null;
  kind: "native" | "token";
  explorerUrl: string;
}

export interface WalletSummary {
  chain: Chain;
  address: string;
  shortAddress: string;
  totalValueUsd: number | null;
  nativeBalance: number;
  nativeSymbol: string;
  nativePriceUsd: number | null;
  holdings: WalletHolding[];
  txs: WalletTx[];
  explorerUrl: string;
  txCount?: number | null;
  firstSeen?: string | null;
  lastSeen?: string | null;
  dataSource: string;
}

export function detectChain(input: string): Chain | null {
  const a = input.trim();
  if (/^0x[a-fA-F0-9]{40}$/.test(a)) return "evm";
  if (/^(bc1[a-z0-9]{20,87}|[13][a-zA-Z0-9]{24,34})$/.test(a)) return "bitcoin";
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(a) && !a.startsWith("0x")) return "solana";
  return null;
}

function shorten(a: string): string {
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

// ===================== Ethereum / EVM (Ethplorer + freekey) =====================

interface EthplorerTokenInfo {
  address: string;
  name?: string;
  symbol?: string;
  decimals?: string | number;
  price?: { rate?: number };
  image?: string;
}
interface EthplorerToken {
  tokenInfo: EthplorerTokenInfo;
  balance: number;
}
interface EthplorerAddrInfo {
  address: string;
  ETH: { balance: number; price?: { rate?: number } };
  countTxs?: number;
  tokens?: EthplorerToken[];
}
interface EthplorerOp {
  timestamp: number;
  transactionHash: string;
  type: string;
  value: string | number;
  from?: string;
  to?: string;
  tokenInfo?: EthplorerTokenInfo;
}
interface EthplorerHistResp {
  operations?: EthplorerOp[];
}

async function getEvmWallet(address: string): Promise<WalletSummary> {
  const url = `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`;
  const histUrl = `https://api.ethplorer.io/getAddressHistory/${address}?apiKey=freekey&limit=50`;

  const [infoRes, histRes] = await Promise.all([
    fetch(url, { headers: { "User-Agent": BROWSER_UA }, next: { revalidate: 60 } }),
    fetch(histUrl, { headers: { "User-Agent": BROWSER_UA }, next: { revalidate: 60 } }),
  ]);
  if (!infoRes.ok) throw new Error(`Ethplorer HTTP ${infoRes.status}`);
  const info = (await infoRes.json()) as EthplorerAddrInfo;
  const hist = histRes.ok ? ((await histRes.json()) as EthplorerHistResp) : { operations: [] };

  const nativeBalance = info.ETH?.balance ?? 0;
  const nativePrice = info.ETH?.price?.rate ?? null;

  const holdings: WalletHolding[] = [];
  // Native ETH
  if (nativeBalance > 0) {
    holdings.push({
      symbol: "ETH",
      name: "Ethereum",
      balance: nativeBalance,
      decimals: 18,
      priceUsd: nativePrice,
      valueUsd: nativePrice ? nativeBalance * nativePrice : null,
    });
  }
  for (const t of info.tokens || []) {
    const dec = parseInt(String(t.tokenInfo.decimals ?? 18), 10) || 18;
    const bal = Number(t.balance) / Math.pow(10, dec);
    if (!Number.isFinite(bal) || bal <= 0) continue;
    const price = t.tokenInfo.price?.rate ?? null;
    holdings.push({
      symbol: (t.tokenInfo.symbol || "?").slice(0, 12),
      name: t.tokenInfo.name || t.tokenInfo.symbol || "Unknown",
      balance: bal,
      decimals: dec,
      contract: t.tokenInfo.address,
      priceUsd: price,
      valueUsd: price ? bal * price : null,
      icon: t.tokenInfo.image
        ? `https://ethplorer.io${t.tokenInfo.image}`
        : undefined,
    });
  }
  holdings.sort((a, b) => (b.valueUsd ?? 0) - (a.valueUsd ?? 0));

  const totalValueUsd = holdings.reduce((sum, h) => sum + (h.valueUsd ?? 0), 0);

  const me = address.toLowerCase();
  const txs: WalletTx[] = (hist.operations || []).slice(0, 50).map((op) => {
    const from = (op.from || "").toLowerCase();
    const to = (op.to || "").toLowerCase();
    const direction: "in" | "out" | "self" =
      from === me && to === me ? "self" : to === me ? "in" : "out";
    const dec = parseInt(String(op.tokenInfo?.decimals ?? 18), 10) || 18;
    const amount = Number(op.value) / Math.pow(10, dec);
    const price = op.tokenInfo?.price?.rate ?? null;
    return {
      hash: op.transactionHash,
      ts: op.timestamp * 1000,
      date: new Date(op.timestamp * 1000).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      direction,
      counterparty: direction === "in" ? op.from : op.to,
      amount,
      symbol: op.tokenInfo?.symbol || "ETH",
      valueUsd: price ? amount * price : null,
      kind: "token",
      explorerUrl: `https://etherscan.io/tx/${op.transactionHash}`,
    };
  });

  return {
    chain: "evm",
    address,
    shortAddress: shorten(address),
    totalValueUsd: totalValueUsd > 0 ? totalValueUsd : null,
    nativeBalance,
    nativeSymbol: "ETH",
    nativePriceUsd: nativePrice,
    holdings,
    txs,
    explorerUrl: `https://etherscan.io/address/${address}`,
    txCount: info.countTxs ?? null,
    dataSource: "Ethplorer",
  };
}

// ===================== Bitcoin (Blockstream Esplora) =====================

interface BlockstreamAddr {
  address: string;
  chain_stats: { funded_txo_sum: number; spent_txo_sum: number; tx_count: number };
  mempool_stats: { funded_txo_sum: number; spent_txo_sum: number };
}
interface BlockstreamTx {
  txid: string;
  status: { block_time?: number; confirmed: boolean };
  vin: Array<{ prevout?: { scriptpubkey_address?: string; value: number } }>;
  vout: Array<{ scriptpubkey_address?: string; value: number }>;
}

async function getBtcPriceUsd(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      { headers: { "User-Agent": BROWSER_UA }, next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const j = (await res.json()) as { bitcoin?: { usd?: number } };
    return j.bitcoin?.usd ?? null;
  } catch {
    return null;
  }
}

async function getBitcoinWallet(address: string): Promise<WalletSummary> {
  const base = "https://blockstream.info/api";
  const [addrRes, txsRes, price] = await Promise.all([
    fetch(`${base}/address/${address}`, {
      headers: { "User-Agent": BROWSER_UA },
      next: { revalidate: 60 },
    }),
    fetch(`${base}/address/${address}/txs`, {
      headers: { "User-Agent": BROWSER_UA },
      next: { revalidate: 60 },
    }),
    getBtcPriceUsd(),
  ]);
  if (!addrRes.ok) throw new Error(`Blockstream HTTP ${addrRes.status}`);
  const addr = (await addrRes.json()) as BlockstreamAddr;
  const txs = txsRes.ok ? ((await txsRes.json()) as BlockstreamTx[]) : [];

  const sats = addr.chain_stats.funded_txo_sum - addr.chain_stats.spent_txo_sum;
  const btc = sats / 1e8;
  const totalValueUsd = price ? btc * price : null;

  const mapped: WalletTx[] = txs.slice(0, 50).map((t) => {
    let inAmount = 0;
    let outAmount = 0;
    for (const o of t.vout) if (o.scriptpubkey_address === address) inAmount += o.value;
    for (const i of t.vin) if (i.prevout?.scriptpubkey_address === address) outAmount += i.prevout.value;
    const net = (inAmount - outAmount) / 1e8;
    const direction: "in" | "out" | "self" = net > 0 ? "in" : net < 0 ? "out" : "self";
    const amount = Math.abs(net);
    const counterparty =
      direction === "in"
        ? t.vin[0]?.prevout?.scriptpubkey_address || null
        : t.vout.find((v) => v.scriptpubkey_address !== address)?.scriptpubkey_address || null;
    const ts = (t.status.block_time ?? Date.now() / 1000) * 1000;
    return {
      hash: t.txid,
      ts,
      date: new Date(ts).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      direction,
      counterparty,
      amount,
      symbol: "BTC",
      valueUsd: price ? amount * price : null,
      kind: "native",
      explorerUrl: `https://blockstream.info/tx/${t.txid}`,
    };
  });

  const holdings: WalletHolding[] =
    btc > 0
      ? [
          {
            symbol: "BTC",
            name: "Bitcoin",
            balance: btc,
            decimals: 8,
            priceUsd: price,
            valueUsd: totalValueUsd,
          },
        ]
      : [];

  return {
    chain: "bitcoin",
    address,
    shortAddress: shorten(address),
    totalValueUsd,
    nativeBalance: btc,
    nativeSymbol: "BTC",
    nativePriceUsd: price,
    holdings,
    txs: mapped,
    explorerUrl: `https://blockstream.info/address/${address}`,
    txCount: addr.chain_stats.tx_count,
    dataSource: "Blockstream",
  };
}

// ===================== Solana (public RPC) =====================

interface SolRpcResp<T> {
  result?: T;
  error?: { code: number; message: string };
}

async function rpcCall<T>(body: object): Promise<T> {
  const res = await fetch("https://api.mainnet-beta.solana.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": BROWSER_UA },
    body: JSON.stringify(body),
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Solana RPC HTTP ${res.status}`);
  const j = (await res.json()) as SolRpcResp<T>;
  if (j.error) throw new Error(`Solana RPC: ${j.error.message}`);
  return j.result as T;
}

async function getSolPriceUsd(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { headers: { "User-Agent": BROWSER_UA }, next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const j = (await res.json()) as { solana?: { usd?: number } };
    return j.solana?.usd ?? null;
  } catch {
    return null;
  }
}

async function getSolanaWallet(address: string): Promise<WalletSummary> {
  type BalanceRes = { value: number };
  type SignaturesRes = Array<{ signature: string; blockTime: number | null; err: unknown }>;

  const [balanceRes, sigsRes, price] = await Promise.all([
    rpcCall<BalanceRes>({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [address, { commitment: "finalized" }],
    }),
    rpcCall<SignaturesRes>({
      jsonrpc: "2.0",
      id: 2,
      method: "getSignaturesForAddress",
      params: [address, { limit: 25 }],
    }).catch(() => [] as SignaturesRes),
    getSolPriceUsd(),
  ]);

  const sol = (balanceRes?.value || 0) / 1e9;
  const totalValueUsd = price ? sol * price : null;

  const txs: WalletTx[] = (sigsRes || []).map((s) => {
    const ts = (s.blockTime ?? Date.now() / 1000) * 1000;
    return {
      hash: s.signature,
      ts,
      date: new Date(ts).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      direction: "self",
      counterparty: null,
      amount: 0,
      symbol: "SOL",
      valueUsd: null,
      kind: "native",
      explorerUrl: `https://solscan.io/tx/${s.signature}`,
    };
  });

  const holdings: WalletHolding[] =
    sol > 0
      ? [
          {
            symbol: "SOL",
            name: "Solana",
            balance: sol,
            decimals: 9,
            priceUsd: price,
            valueUsd: totalValueUsd,
          },
        ]
      : [];

  return {
    chain: "solana",
    address,
    shortAddress: shorten(address),
    totalValueUsd,
    nativeBalance: sol,
    nativeSymbol: "SOL",
    nativePriceUsd: price,
    holdings,
    txs,
    explorerUrl: `https://solscan.io/account/${address}`,
    txCount: null,
    dataSource: "Solana RPC",
  };
}

// ===================== Dispatch =====================

export async function getWallet(address: string): Promise<WalletSummary> {
  const chain = detectChain(address);
  if (!chain) throw new Error("Adresse non reconnue (ETH/BTC/SOL attendues).");
  if (chain === "evm") return getEvmWallet(address);
  if (chain === "bitcoin") return getBitcoinWallet(address);
  return getSolanaWallet(address);
}
