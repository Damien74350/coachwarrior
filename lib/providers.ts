import type { AssetResponse, AssetSummary, PricePoint, SearchHit } from "./types";
import { analyze } from "./indicators";

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJSON<T>(url: string, init?: RequestInit, attempts = 3): Promise<T> {
  let lastErr: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          "User-Agent": BROWSER_UA,
          Accept: "application/json,text/plain,*/*",
          "Accept-Language": "en-US,en;q=0.9",
          ...(init?.headers || {}),
        },
        next: { revalidate: 60 },
      });
      if (res.status === 429 || res.status === 502 || res.status === 503) {
        await sleep(500 * (i + 1));
        continue;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }
      return (await res.json()) as T;
    } catch (e) {
      lastErr = e;
      await sleep(300 * (i + 1));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

function isFiniteNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// =================== CoinGecko ===================

interface CGSearchResp {
  coins: Array<{
    id: string;
    name: string;
    api_symbol: string;
    symbol: string;
    market_cap_rank: number | null;
    thumb: string;
    large: string;
  }>;
}

export async function searchCrypto(q: string): Promise<SearchHit[]> {
  try {
    const data = await fetchJSON<CGSearchResp>(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`
    );
    return (data.coins || []).slice(0, 8).map((c) => ({
      kind: "crypto" as const,
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      thumb: c.large || c.thumb,
      marketCapRank: c.market_cap_rank,
    }));
  } catch {
    return [];
  }
}

interface CGCoinResp {
  id: string;
  symbol: string;
  name: string;
  image?: { large?: string; small?: string };
  market_cap_rank?: number | null;
  categories?: string[];
  description?: { en?: string };
  links?: { homepage?: string[] };
  market_data?: {
    current_price?: Record<string, number>;
    market_cap?: Record<string, number>;
    total_volume?: Record<string, number>;
    high_24h?: Record<string, number>;
    low_24h?: Record<string, number>;
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    price_change_percentage_1y?: number;
    ath?: Record<string, number>;
    ath_date?: Record<string, string>;
    atl?: Record<string, number>;
    atl_date?: Record<string, string>;
    circulating_supply?: number;
    total_supply?: number | null;
    max_supply?: number | null;
  };
}

interface CGMarketChartResp {
  prices: Array<[number, number]>;
}

interface CGMarketsResp {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  price_change_percentage_30d_in_currency?: number | null;
  price_change_percentage_1y_in_currency?: number | null;
  ath: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_date: string | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
}

export async function getCrypto(id: string): Promise<AssetResponse> {
  // Always pull the chart first (cheap, rarely rate-limited).
  const chart = await fetchJSON<CGMarketChartResp>(
    `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
      id
    )}/market_chart?vs_currency=usd&days=365&interval=daily`
  );

  const rawHistory = (chart.prices || []).filter(
    (p) => Array.isArray(p) && isFiniteNum(p[0]) && isFiniteNum(p[1])
  );
  if (rawHistory.length < 10) {
    throw new Error(`Historique insuffisant pour ${id} (CoinGecko n'a renvoyé que ${rawHistory.length} points).`);
  }
  const history: PricePoint[] = rawHistory.map((p) => ({
    t: p[0],
    c: p[1],
    date: new Date(p[0]).toISOString().slice(0, 10),
  }));

  // Try the detailed endpoint, fallback to /markets, then to chart-only.
  let info: CGCoinResp | null = null;
  let market: CGMarketsResp | null = null;
  try {
    info = await fetchJSON<CGCoinResp>(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
        id
      )}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
      undefined,
      2
    );
  } catch {
    try {
      const arr = await fetchJSON<CGMarketsResp[]>(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
          id
        )}&price_change_percentage=24h,7d,30d,1y`,
        undefined,
        2
      );
      market = arr?.[0] ?? null;
    } catch {
      // fall through to chart-only
    }
  }

  const md = info?.market_data;
  const prices = history.map((p) => p.c);
  const lastPrice = prices[prices.length - 1];
  const change = (n: number) =>
    prices.length > n ? ((lastPrice - prices[prices.length - 1 - n]) / prices[prices.length - 1 - n]) * 100 : null;

  const summary: AssetSummary = {
    kind: "crypto",
    id,
    symbol: (info?.symbol || market?.symbol || id).toUpperCase(),
    name: info?.name || market?.name || id,
    image: info?.image?.large || info?.image?.small || market?.image,
    currency: "USD",
    price: md?.current_price?.usd ?? market?.current_price ?? lastPrice,
    change24h: md?.price_change_percentage_24h ?? market?.price_change_percentage_24h ?? change(1),
    change7d:
      md?.price_change_percentage_7d ?? market?.price_change_percentage_7d_in_currency ?? change(7),
    change30d:
      md?.price_change_percentage_30d ?? market?.price_change_percentage_30d_in_currency ?? change(30),
    change1y:
      md?.price_change_percentage_1y ?? market?.price_change_percentage_1y_in_currency ?? change(365),
    marketCap: md?.market_cap?.usd ?? market?.market_cap ?? null,
    volume24h: md?.total_volume?.usd ?? market?.total_volume ?? null,
    high24h: md?.high_24h?.usd ?? market?.high_24h ?? null,
    low24h: md?.low_24h?.usd ?? market?.low_24h ?? null,
    ath: md?.ath?.usd ?? market?.ath ?? null,
    athDate: md?.ath_date?.usd ?? market?.ath_date ?? null,
    atl: md?.atl?.usd ?? market?.atl ?? null,
    atlDate: md?.atl_date?.usd ?? market?.atl_date ?? null,
    circulatingSupply: md?.circulating_supply ?? market?.circulating_supply ?? null,
    totalSupply: md?.total_supply ?? market?.total_supply ?? null,
    maxSupply: md?.max_supply ?? market?.max_supply ?? null,
    marketCapRank: info?.market_cap_rank ?? market?.market_cap_rank ?? null,
    homepage: info?.links?.homepage?.find((u) => !!u) || null,
    description: info?.description?.en?.split("\n")[0] || null,
    categories: info?.categories?.filter(Boolean) || [],
  };

  return { summary, history, analysis: analyze(prices) };
}

// =================== Yahoo Finance (stocks) ===================

interface YahooSearchResp {
  quotes: Array<{
    symbol: string;
    shortname?: string;
    longname?: string;
    exchange?: string;
    quoteType?: string;
    typeDisp?: string;
    sector?: string;
    industry?: string;
  }>;
}

export async function searchStock(q: string): Promise<SearchHit[]> {
  try {
    const data = await fetchJSON<YahooSearchResp>(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`
    );
    return (data.quotes || [])
      .filter((q) => q.symbol && (q.quoteType === "EQUITY" || q.quoteType === "ETF" || q.quoteType === "INDEX"))
      .slice(0, 8)
      .map((q) => ({
        kind: "stock" as const,
        id: q.symbol,
        symbol: q.symbol,
        name: q.longname || q.shortname || q.symbol,
        exchange: q.exchange,
      }));
  } catch {
    return [];
  }
}

interface YahooChartResp {
  chart: {
    result?: Array<{
      meta: {
        currency?: string;
        symbol?: string;
        exchangeName?: string;
        regularMarketPrice?: number;
        chartPreviousClose?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        regularMarketVolume?: number;
        longName?: string;
        shortName?: string;
      };
      timestamp: number[];
      indicators: { quote: Array<{ close: (number | null)[] }> };
    }>;
    error?: { code: string; description: string } | null;
  };
}

interface YahooQuoteSummaryResp {
  quoteSummary: {
    result?: Array<{
      assetProfile?: { sector?: string; industry?: string; longBusinessSummary?: string; website?: string };
      summaryDetail?: {
        marketCap?: { raw?: number };
        trailingPE?: { raw?: number };
        dividendYield?: { raw?: number };
        beta?: { raw?: number };
      };
      defaultKeyStatistics?: {
        sharesOutstanding?: { raw?: number };
        bookValue?: { raw?: number };
        forwardPE?: { raw?: number };
      };
      price?: {
        currency?: string;
        longName?: string;
        shortName?: string;
        exchangeName?: string;
        regularMarketChangePercent?: { raw?: number };
        marketCap?: { raw?: number };
      };
      summaryProfile?: { sector?: string; industry?: string; website?: string; longBusinessSummary?: string };
    }>;
    error?: { code: string; description: string } | null;
  };
}

// Some Yahoo currency codes (e.g. GBp) aren't valid ISO codes; coerce them.
function normalizeCurrency(c: string | undefined | null): string {
  if (!c) return "USD";
  const map: Record<string, string> = { GBp: "GBP", ZAc: "ZAR", ILA: "ILS" };
  return map[c] || c.toUpperCase();
}

// Stooq fallback — CSV daily data, very lenient, no auth.
async function getStockFromStooq(sym: string): Promise<AssetResponse> {
  const stooqSym = sym.includes(".") ? sym.toLowerCase() : `${sym.toLowerCase()}.us`;
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSym)}&i=d`;
  const res = await fetch(url, {
    headers: { "User-Agent": BROWSER_UA, Accept: "text/csv,text/plain,*/*" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Stooq HTTP ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split("\n");
  if (lines.length < 30 || !lines[0].toLowerCase().includes("date")) {
    throw new Error(`Stooq: pas de données pour ${sym}`);
  }
  const history: PricePoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length < 5) continue;
    const date = parts[0];
    const c = parseFloat(parts[4]);
    if (!Number.isFinite(c)) continue;
    const t = new Date(date).getTime();
    if (!Number.isFinite(t)) continue;
    history.push({ t, c, date });
  }
  history.sort((a, b) => a.t - b.t);
  if (history.length < 30) throw new Error(`Stooq: historique insuffisant pour ${sym}`);

  const prices = history.map((p) => p.c);
  const price = prices[prices.length - 1];
  const prev = prices[prices.length - 2] ?? price;
  const change = (n: number) =>
    prices.length > n ? ((price - prices[prices.length - 1 - n]) / prices[prices.length - 1 - n]) * 100 : null;

  const last52 = prices.slice(-252);
  const summary: AssetSummary = {
    kind: "stock",
    id: sym,
    symbol: sym,
    name: sym,
    currency: "USD",
    price,
    change24h: prev ? ((price - prev) / prev) * 100 : null,
    change7d: change(7),
    change30d: change(30),
    change1y: change(252),
    marketCap: null,
    volume24h: null,
    high24h: null,
    low24h: null,
    ath: null,
    atl: null,
    exchange: stooqSym.endsWith(".us") ? "US" : stooqSym.split(".").pop()?.toUpperCase() || null,
    fiftyTwoWeekHigh: last52.length > 0 ? Math.max(...last52) : null,
    fiftyTwoWeekLow: last52.length > 0 ? Math.min(...last52) : null,
    peRatio: null,
    dividendYield: null,
    beta: null,
    bookValue: null,
    sharesOutstanding: null,
    homepage: null,
    description: `Données de prix fournies par Stooq.`,
  };
  return { summary, history, analysis: analyze(prices) };
}

export async function getStock(symbol: string): Promise<AssetResponse> {
  const sym = symbol.toUpperCase();
  const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    sym
  )}?range=2y&interval=1d`;
  const summaryUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(
    sym
  )}?modules=assetProfile,summaryDetail,defaultKeyStatistics,price,summaryProfile`;

  let chart: YahooChartResp | null = null;
  try {
    chart = await fetchJSON<YahooChartResp>(chartUrl, undefined, 2);
  } catch (e) {
    // Yahoo blocks many cloud IPs — fall back to Stooq for the price data.
    try {
      return await getStockFromStooq(sym);
    } catch (e2) {
      const msg = e instanceof Error ? e.message : String(e);
      const msg2 = e2 instanceof Error ? e2.message : String(e2);
      throw new Error(`Yahoo: ${msg} | Stooq: ${msg2}`);
    }
  }
  const results = chart?.chart.result;
  if (!results || results.length === 0) {
    return await getStockFromStooq(sym);
  }
  // quoteSummary often requires a crumb cookie nowadays — try it, but don't block on failure.
  const sum = await fetchJSON<YahooQuoteSummaryResp>(summaryUrl, undefined, 2).catch(() => null);

  const r = results[0];
  const closes = r.indicators.quote[0]?.close || [];
  const timestamps = r.timestamp || [];

  const history: PricePoint[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const c = closes[i];
    if (!isFiniteNum(c)) continue;
    history.push({ t: timestamps[i] * 1000, c, date: new Date(timestamps[i] * 1000).toISOString().slice(0, 10) });
  }
  if (history.length < 30) {
    try {
      return await getStockFromStooq(sym);
    } catch {
      throw new Error(`Historique insuffisant pour ${sym}`);
    }
  }

  const prices = history.map((p) => p.c);
  const price = isFiniteNum(r.meta.regularMarketPrice) ? r.meta.regularMarketPrice : prices[prices.length - 1];
  const prevClose = isFiniteNum(r.meta.chartPreviousClose) ? r.meta.chartPreviousClose : prices[prices.length - 2] ?? price;
  const change24h = prevClose ? ((price - prevClose) / prevClose) * 100 : null;

  const change = (n: number) =>
    prices.length > n ? ((price - prices[prices.length - 1 - n]) / prices[prices.length - 1 - n]) * 100 : null;

  const s = sum?.quoteSummary.result?.[0];
  const profile = s?.assetProfile || s?.summaryProfile;
  const summary: AssetSummary = {
    kind: "stock",
    id: sym,
    symbol: sym,
    name: s?.price?.longName || s?.price?.shortName || r.meta.longName || r.meta.shortName || sym,
    currency: normalizeCurrency(r.meta.currency || s?.price?.currency),
    price,
    change24h,
    change7d: change(7),
    change30d: change(30),
    change1y: change(252),
    marketCap: s?.price?.marketCap?.raw ?? s?.summaryDetail?.marketCap?.raw ?? null,
    volume24h: r.meta.regularMarketVolume ?? null,
    high24h: r.meta.regularMarketDayHigh ?? null,
    low24h: r.meta.regularMarketDayLow ?? null,
    ath: null,
    atl: null,
    exchange: r.meta.exchangeName ?? null,
    longName: s?.price?.longName ?? null,
    sector: profile?.sector ?? null,
    industry: profile?.industry ?? null,
    peRatio: s?.summaryDetail?.trailingPE?.raw ?? null,
    dividendYield: s?.summaryDetail?.dividendYield?.raw ? s.summaryDetail.dividendYield.raw * 100 : null,
    beta: s?.summaryDetail?.beta?.raw ?? null,
    bookValue: s?.defaultKeyStatistics?.bookValue?.raw ?? null,
    sharesOutstanding: s?.defaultKeyStatistics?.sharesOutstanding?.raw ?? null,
    fiftyTwoWeekHigh: r.meta.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: r.meta.fiftyTwoWeekLow ?? null,
    homepage: profile?.website ?? null,
    description: profile?.longBusinessSummary ?? null,
  };

  return { summary, history, analysis: analyze(prices) };
}
