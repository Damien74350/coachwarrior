"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import AssetView from "@/components/AssetView";
import WalletView from "@/components/WalletView";
import MarketSentimentCard from "@/components/MarketSentiment";
import type { MarketSentiment, SearchHit } from "@/lib/types";
import { Sparkles, PlayCircle, Wallet, X } from "lucide-react";

interface RecentItem {
  kind: "crypto" | "stock" | "wallet";
  id?: string;
  subKind?: "equity" | "etf" | "index" | "crypto";
  symbol: string;
  name: string;
  walletAddress?: string;
}

const CRYPTO_PICKS: SearchHit[] = [
  { kind: "crypto", id: "bitcoin", symbol: "BTC", name: "Bitcoin", thumb: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { kind: "crypto", id: "ethereum", symbol: "ETH", name: "Ethereum", thumb: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { kind: "crypto", id: "solana", symbol: "SOL", name: "Solana" },
  { kind: "crypto", id: "binancecoin", symbol: "BNB", name: "BNB" },
  { kind: "crypto", id: "ripple", symbol: "XRP", name: "XRP" },
  { kind: "crypto", id: "cardano", symbol: "ADA", name: "Cardano" },
];

const STOCK_PICKS: SearchHit[] = [
  { kind: "stock", subKind: "equity", id: "AAPL", symbol: "AAPL", name: "Apple Inc." },
  { kind: "stock", subKind: "equity", id: "NVDA", symbol: "NVDA", name: "NVIDIA" },
  { kind: "stock", subKind: "equity", id: "TSLA", symbol: "TSLA", name: "Tesla" },
  { kind: "stock", subKind: "equity", id: "MSFT", symbol: "MSFT", name: "Microsoft" },
  { kind: "stock", subKind: "equity", id: "GOOGL", symbol: "GOOGL", name: "Alphabet" },
  { kind: "stock", subKind: "equity", id: "AMZN", symbol: "AMZN", name: "Amazon" },
];

const ETF_PICKS: SearchHit[] = [
  { kind: "stock", subKind: "etf", id: "SPY", symbol: "SPY", name: "SPDR S&P 500 ETF" },
  { kind: "stock", subKind: "etf", id: "QQQ", symbol: "QQQ", name: "Invesco QQQ (Nasdaq 100)" },
  { kind: "stock", subKind: "etf", id: "VOO", symbol: "VOO", name: "Vanguard S&P 500" },
  { kind: "stock", subKind: "etf", id: "VTI", symbol: "VTI", name: "Vanguard Total Stock Market" },
  { kind: "stock", subKind: "etf", id: "IWM", symbol: "IWM", name: "iShares Russell 2000" },
  { kind: "stock", subKind: "etf", id: "GLD", symbol: "GLD", name: "SPDR Gold Shares" },
  { kind: "stock", subKind: "etf", id: "IBIT", symbol: "IBIT", name: "iShares Bitcoin Trust" },
  { kind: "stock", subKind: "etf", id: "ARKK", symbol: "ARKK", name: "ARK Innovation ETF" },
];

type Selection =
  | { type: "asset"; hit: SearchHit }
  | { type: "wallet"; address: string }
  | null;

export default function Home() {
  const [sel, setSel] = useState<Selection>(null);
  const [history, setHistory] = useState<RecentItem[]>([]);
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cw:history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/sentiment")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setSentiment(j))
      .catch(() => {});
  }, []);

  function persist(next: RecentItem[]) {
    setHistory(next);
    try {
      localStorage.setItem("cw:history", JSON.stringify(next));
    } catch {}
  }

  function pickAsset(h: SearchHit) {
    setSel({ type: "asset", hit: h });
    const filtered = history.filter(
      (x) => !(x.kind === h.kind && x.id === h.id && !x.walletAddress)
    );
    persist([{ kind: h.kind, id: h.id, symbol: h.symbol, name: h.name, subKind: h.subKind }, ...filtered].slice(0, 10));
  }

  function pickWallet(address: string) {
    setSel({ type: "wallet", address });
    const filtered = history.filter((x) => !(x.kind === "wallet" && x.walletAddress === address));
    const entry: RecentItem = {
      kind: "wallet",
      symbol: address.slice(0, 8) + "…",
      name: address,
      walletAddress: address,
    };
    persist([entry, ...filtered].slice(0, 10));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> CoachWarrior · Intelligence financière
        </div>
        <h1 className="mt-4 bg-gradient-to-br from-white via-white to-muted bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Cryptos · Actions · ETF · Wallets
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-sm text-muted sm:text-base">
          Prix live, indicateurs techniques, sentiment de marché, et inspection de wallet
          (Ethereum, Bitcoin, Solana) — tout en un.
        </p>
      </header>

      <div className="mb-4">
        <SearchBar onSelect={pickAsset} onWallet={pickWallet} />
      </div>

      {!sel && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => pickAsset({ kind: "crypto", id: "__demo__", symbol: "DEMO", name: "Mode démo" })}
            className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
          >
            <PlayCircle className="h-4 w-4" />
            Lancer la démo (sans API)
          </button>
        </div>
      )}

      {sel && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setSel(null)}
            className="inline-flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-xs text-muted hover:bg-surfaceAlt hover:text-white"
          >
            <X className="h-3.5 w-3.5" /> Fermer
          </button>
        </div>
      )}

      {!sel && (
        <div className="space-y-6">
          {sentiment && (sentiment.cryptoIndex !== null || sentiment.stockIndex !== null) && (
            <MarketSentimentCard sentiment={sentiment} focus="both" />
          )}

          {history.length > 0 && (
            <Section title="Récemment consultés">
              {history.map((h, i) => (
                <button
                  key={`h-${i}-${h.kind}-${h.id || h.walletAddress}`}
                  onClick={() =>
                    h.kind === "wallet" && h.walletAddress
                      ? pickWallet(h.walletAddress)
                      : pickAsset(h as SearchHit)
                  }
                  className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surfaceAlt"
                >
                  {h.kind === "wallet" ? (
                    <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-accent">
                      Wallet
                    </span>
                  ) : (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        h.kind === "crypto"
                          ? "bg-accent2/10 text-accent2"
                          : h.subKind === "etf"
                          ? "bg-warning/10 text-warning"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {h.kind === "crypto" ? "Crypto" : h.subKind === "etf" ? "ETF" : "Action"}
                    </span>
                  )}
                  <span className="font-semibold">{h.symbol}</span>
                  <span className="truncate text-muted">{h.name}</span>
                </button>
              ))}
            </Section>
          )}

          <Section title="Top cryptos">
            {CRYPTO_PICKS.map((h) => (
              <PickButton key={`c-${h.id}`} hit={h} onPick={pickAsset} />
            ))}
          </Section>

          <Section title="Top actions">
            {STOCK_PICKS.map((h) => (
              <PickButton key={`s-${h.id}`} hit={h} onPick={pickAsset} />
            ))}
          </Section>

          <Section title="ETF populaires">
            {ETF_PICKS.map((h) => (
              <PickButton key={`e-${h.id}`} hit={h} onPick={pickAsset} />
            ))}
          </Section>

          <div className="glass rounded-2xl p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Wallet className="h-4 w-4 text-accent" />
              Inspecter un wallet
            </div>
            <p className="text-sm text-muted">
              Collez une adresse Ethereum (<code className="text-xs">0x…</code>), Bitcoin
              (<code className="text-xs">bc1…/1…/3…</code>) ou Solana dans la barre de recherche
              ci-dessus pour voir les avoirs, la valeur totale en USD, et l'historique des
              transactions (entrées = achats / réceptions).
            </p>
          </div>
        </div>
      )}

      {sel?.type === "asset" && (
        <AssetView key={`${sel.hit.kind}-${sel.hit.id}`} hit={sel.hit} />
      )}
      {sel?.type === "wallet" && (
        <WalletView key={`w-${sel.address}`} address={sel.address} />
      )}

      <footer className="mt-12 text-center text-xs text-muted">
        Sources : CoinGecko, Yahoo Finance, Stooq, alternative.me, CNN Business, Ethplorer,
        Blockstream, Solana RPC. Cet outil ne constitue pas un conseil en investissement.
      </footer>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs uppercase tracking-wider text-muted">{title}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function PickButton({ hit, onPick }: { hit: SearchHit; onPick: (h: SearchHit) => void }) {
  return (
    <button
      onClick={() => onPick(hit)}
      className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surfaceAlt"
    >
      <span
        className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
          hit.kind === "crypto"
            ? "bg-accent2/10 text-accent2"
            : hit.subKind === "etf"
            ? "bg-warning/10 text-warning"
            : "bg-accent/10 text-accent"
        }`}
      >
        {hit.kind === "crypto" ? "Crypto" : hit.subKind === "etf" ? "ETF" : "Action"}
      </span>
      <span className="font-semibold">{hit.symbol}</span>
      <span className="text-muted">{hit.name}</span>
    </button>
  );
}
