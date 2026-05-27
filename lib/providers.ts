import type {
  AssetResponse,
  AssetSummary,
  AssetSummaryWithMeta,
  PricePoint,
  SearchHit,
} from "./types";
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
        next: { revalidate: 30 },
      });
      if (res.status === 429 || res.status === 502 || res.status === 503) {
        await sleep(400 * (i + 1));
        continue;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }
      return (await res.json()) as T;
    } catch (e) {
      lastErr = e;
      await sleep(250 * (i + 1));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function fetchText(url: string, init?: RequestInit, attempts = 3): Promise<string> {
  let lastErr: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          "User-Agent": BROWSER_UA,
          Accept: "text/csv,text/plain,*/*",
          "Accept-Language": "en-US,en;q=0.9",
          ...(init?.headers || {}),
        },
        next: { revalidate: 30 },
      });
      if (res.status === 429 || res.status === 502 || res.status === 503) {
        await sleep(400 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      lastErr = e;
      await sleep(250 * (i + 1));
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

interface CGMarketsResp {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number | null;
  market_cap_rank: number | null;
  fully_diluted_valuation?: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
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
  last_updated: string | null;
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
}

interface CGMarketChartResp {
  prices: Array<[number, number]>;
}

// CoinGecko: use /coins/markets as the source of truth for LIVE data
// (single call gives price + market cap + ATH + change% over many periods).
// Fallback to /simple/price if /markets fails (very lenient endpoint).
export async function getCrypto(id: string): Promise<AssetResponse> {
  // 1) Get history first (cheap, reliable)
  const chart = await fetchJSON<CGMarketChartResp>(
    `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
      id
    )}/market_chart?vs_currency=usd&days=365&interval=daily`
  );
  const rawHistory = (chart.prices || []).filter(
    (p) => Array.isArray(p) && isFiniteNum(p[0]) && isFiniteNum(p[1])
  );
  if (rawHistory.length < 10) {
    throw new Error(`Historique insuffisant pour ${id}`);
  }
  const history: PricePoint[] = rawHistory.map((p) => ({
    t: p[0],
    c: p[1],
    date: new Date(p[0]).toISOString().slice(0, 10),
  }));

  // 2) Get live market data via /coins/markets (most reliable for live price)
  let market: CGMarketsResp | null = null;
  try {
    const arr = await fetchJSON<CGMarketsResp[]>(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
        id
      )}&price_change_percentage=1h,24h,7d,30d,1y`,
      undefined,
      3
    );
    market = arr?.[0] ?? null;
  } catch {
    // fall through
  }

  // 3) Optionally get description / image / categories from /coins/{id}
  let info: CGCoinResp | null = null;
  try {
    info = await fetchJSON<CGCoinResp>(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
        id
      )}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
      undefined,
      2
    );
  } catch {
    // info is optional
  }

  // 4) Last-resort simple price (live USD only)
  let simplePrice: number | null = null;
  if (!market) {
    try {
      const sp = await fetchJSON<Record<string, { usd: number }>>(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`,
        undefined,
        2
      );
      simplePrice = sp[id]?.usd ?? null;
    } catch {
      // fall through
    }
  }

  const prices = history.map((p) => p.c);
  const lastClose = prices[prices.length - 1];
  const livePrice =
    isFiniteNum(market?.current_price) ? (market!.current_price as number) :
    isFiniteNum(simplePrice) ? (simplePrice as number) :
    lastClose;

  // Use the live price as the latest history point so chart & analysis are consistent
  if (Math.abs(livePrice - lastClose) > 0 && history.length > 0) {
    const lastT = history[history.length - 1].t;
    if (Date.now() - lastT > 3 * 3600 * 1000) {
      history.push({
        t: Date.now(),
        c: livePrice,
        date: new Date().toISOString().slice(0, 10),
      });
    } else {
      history[history.length - 1] = { ...history[history.length - 1], c: livePrice };
    }
  }
  const finalPrices = history.map((p) => p.c);

  const change = (n: number) => {
    const last = finalPrices[finalPrices.length - 1];
    const ref = finalPrices[finalPrices.length - 1 - n];
    return ref ? ((last - ref) / ref) * 100 : null;
  };

  const summary: AssetSummaryWithMeta = {
    kind: "crypto",
    id,
    symbol: (info?.symbol || market?.symbol || id).toUpperCase(),
    name: info?.name || market?.name || id,
    image: info?.image?.large || info?.image?.small || market?.image,
    currency: "USD",
    price: livePrice,
    change24h:
      market?.price_change_percentage_24h_in_currency ??
      market?.price_change_percentage_24h ??
      change(1),
    change7d: market?.price_change_percentage_7d_in_currency ?? change(7),
    change30d: market?.price_change_percentage_30d_in_currency ?? change(30),
    change1y: market?.price_change_percentage_1y_in_currency ?? change(365),
    marketCap: market?.market_cap ?? null,
    volume24h: market?.total_volume ?? null,
    high24h: market?.high_24h ?? null,
    low24h: market?.low_24h ?? null,
    ath: market?.ath ?? null,
    athDate: market?.ath_date ?? null,
    atl: market?.atl ?? null,
    atlDate: market?.atl_date ?? null,
    circulatingSupply: market?.circulating_supply ?? null,
    totalSupply: market?.total_supply ?? null,
    maxSupply: market?.max_supply ?? null,
    marketCapRank: info?.market_cap_rank ?? market?.market_cap_rank ?? null,
    homepage: info?.links?.homepage?.find((u) => !!u) || null,
    description: info?.description?.en?.split("\n")[0] || null,
    categories: info?.categories?.filter(Boolean) || [],
    dataSource: market ? "CoinGecko (live)" : "CoinGecko (chart)",
    priceLive: !!market || isFiniteNum(simplePrice),
    asOf: market?.last_updated || new Date().toISOString(),
  };

  return { summary, history, analysis: analyze(finalPrices) };
}

// =================== Yahoo Finance with crumb cookie ===================

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
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
        q
      )}&quotesCount=10&newsCount=0`
    );
    return (data.quotes || [])
      .filter(
        (q) =>
          q.symbol &&
          (q.quoteType === "EQUITY" || q.quoteType === "ETF" || q.quoteType === "INDEX")
      )
      .slice(0, 10)
      .map((q) => ({
        kind: "stock" as const,
        subKind:
          q.quoteType === "ETF"
            ? ("etf" as const)
            : q.quoteType === "INDEX"
            ? ("index" as const)
            : ("equity" as const),
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
        previousClose?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        regularMarketVolume?: number;
        longName?: string;
        shortName?: string;
        regularMarketTime?: number;
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
      assetProfile?: {
        sector?: string;
        industry?: string;
        longBusinessSummary?: string;
        website?: string;
      };
      summaryDetail?: {
        marketCap?: { raw?: number };
        trailingPE?: { raw?: number };
        dividendYield?: { raw?: number };
        beta?: { raw?: number };
        fiftyTwoWeekHigh?: { raw?: number };
        fiftyTwoWeekLow?: { raw?: number };
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
      summaryProfile?: {
        sector?: string;
        industry?: string;
        website?: string;
        longBusinessSummary?: string;
      };
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

// Yahoo Finance crumb cookie — required for quoteSummary, optional for chart.
// We cache per-process for ~10 min to avoid hammering fc.yahoo.com.
let yahooAuthCache: { cookie: string; crumb: string; ts: number } | null = null;

async function getYahooAuth(): Promise<{ cookie: string; crumb: string } | null> {
  if (yahooAuthCache && Date.now() - yahooAuthCache.ts < 10 * 60 * 1000) {
    return { cookie: yahooAuthCache.cookie, crumb: yahooAuthCache.crumb };
  }
  try {
    const cookieRes = await fetch("https://fc.yahoo.com/", {
      headers: { "User-Agent": BROWSER_UA, Accept: "*/*" },
      redirect: "manual",
    });
    const rawSetCookies =
      (cookieRes.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ||
      [cookieRes.headers.get("set-cookie") || ""];
    const cookies = rawSetCookies
      .flatMap((s) => (s ? s.split(/,(?=\s*\w+=)/g) : []))
      .map((c) => c.split(";")[0].trim())
      .filter(Boolean)
      .join("; ");
    if (!cookies) return null;
    const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
      headers: {
        "User-Agent": BROWSER_UA,
        Cookie: cookies,
        Accept: "text/plain,*/*",
      },
    });
    if (!crumbRes.ok) return null;
    const crumb = (await crumbRes.text()).trim();
    if (!crumb || crumb.length > 50) return null;
    yahooAuthCache = { cookie: cookies, crumb, ts: Date.now() };
    return { cookie: cookies, crumb };
  } catch {
    return null;
  }
}

async function fetchYahooChart(sym: string): Promise<YahooChartResp | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    sym
  )}?range=2y&interval=1d&includePrePost=false`;
  // First attempt: no cookie
  try {
    return await fetchJSON<YahooChartResp>(url, undefined, 2);
  } catch {
    // Second attempt: with cookie+crumb
    const auth = await getYahooAuth();
    if (!auth) return null;
    try {
      return await fetchJSON<YahooChartResp>(
        `${url}&crumb=${encodeURIComponent(auth.crumb)}`,
        { headers: { Cookie: auth.cookie } },
        2
      );
    } catch {
      return null;
    }
  }
}

async function fetchYahooSummary(sym: string): Promise<YahooQuoteSummaryResp | null> {
  const modules = "assetProfile,summaryDetail,defaultKeyStatistics,price,summaryProfile";
  const auth = await getYahooAuth();
  const params = new URLSearchParams({ modules });
  if (auth) params.set("crumb", auth.crumb);
  const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(
    sym
  )}?${params.toString()}`;
  try {
    return await fetchJSON<YahooQuoteSummaryResp>(
      url,
      auth ? { headers: { Cookie: auth.cookie } } : undefined,
      2
    );
  } catch {
    return null;
  }
}

// Stooq fallback — CSV daily data, very lenient, no auth. EOD only.
async function getStockFromStooq(sym: string): Promise<AssetResponse> {
  const stooqSym = sym.includes(".") ? sym.toLowerCase() : `${sym.toLowerCase()}.us`;
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSym)}&i=d`;
  const text = await fetchText(url, undefined, 2);
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
  const summary: AssetSummaryWithMeta = {
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
    description: null,
    dataSource: "Stooq (EOD)",
    priceLive: false,
    asOf: history[history.length - 1].date,
  };
  return { summary, history, analysis: analyze(prices) };
}

export async function getStock(symbol: string): Promise<AssetResponse> {
  const sym = symbol.toUpperCase();

  const [chart, sumYahoo] = await Promise.all([fetchYahooChart(sym), fetchYahooSummary(sym)]);
  const results = chart?.chart.result;

  // If Yahoo gave us NOTHING usable, fall back to Stooq (EOD).
  if (!results || results.length === 0) {
    return await getStockFromStooq(sym);
  }

  const r = results[0];
  const closes = r.indicators.quote[0]?.close || [];
  const timestamps = r.timestamp || [];

  const history: PricePoint[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const c = closes[i];
    if (!isFiniteNum(c)) continue;
    history.push({
      t: timestamps[i] * 1000,
      c,
      date: new Date(timestamps[i] * 1000).toISOString().slice(0, 10),
    });
  }
  if (history.length < 30) {
    try {
      return await getStockFromStooq(sym);
    } catch {
      throw new Error(`Historique insuffisant pour ${sym}`);
    }
  }

  const prices = history.map((p) => p.c);
  const livePrice = isFiniteNum(r.meta.regularMarketPrice)
    ? r.meta.regularMarketPrice
    : prices[prices.length - 1];

  // Always use the LIVE price as the latest data point
  if (history.length > 0 && livePrice !== prices[prices.length - 1]) {
    const lastT = history[history.length - 1].t;
    if (Date.now() - lastT > 20 * 3600 * 1000) {
      history.push({
        t: Date.now(),
        c: livePrice,
        date: new Date().toISOString().slice(0, 10),
      });
    } else {
      history[history.length - 1] = {
        ...history[history.length - 1],
        c: livePrice,
      };
    }
  }
  const finalPrices = history.map((p) => p.c);

  const prevClose = isFiniteNum(r.meta.chartPreviousClose)
    ? r.meta.chartPreviousClose
    : isFiniteNum(r.meta.previousClose)
    ? r.meta.previousClose
    : finalPrices[finalPrices.length - 2] ?? livePrice;
  const change24h = prevClose ? ((livePrice - prevClose) / prevClose) * 100 : null;

  const change = (n: number) =>
    finalPrices.length > n
      ? ((livePrice - finalPrices[finalPrices.length - 1 - n]) /
          finalPrices[finalPrices.length - 1 - n]) *
        100
      : null;

  const s = sumYahoo?.quoteSummary.result?.[0];
  const profile = s?.assetProfile || s?.summaryProfile;
  const summary: AssetSummaryWithMeta = {
    kind: "stock",
    id: sym,
    symbol: sym,
    name: s?.price?.longName || s?.price?.shortName || r.meta.longName || r.meta.shortName || sym,
    currency: normalizeCurrency(r.meta.currency || s?.price?.currency),
    price: livePrice,
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
    dividendYield: s?.summaryDetail?.dividendYield?.raw
      ? s.summaryDetail.dividendYield.raw * 100
      : null,
    beta: s?.summaryDetail?.beta?.raw ?? null,
    bookValue: s?.defaultKeyStatistics?.bookValue?.raw ?? null,
    sharesOutstanding: s?.defaultKeyStatistics?.sharesOutstanding?.raw ?? null,
    fiftyTwoWeekHigh:
      r.meta.fiftyTwoWeekHigh ?? s?.summaryDetail?.fiftyTwoWeekHigh?.raw ?? null,
    fiftyTwoWeekLow:
      r.meta.fiftyTwoWeekLow ?? s?.summaryDetail?.fiftyTwoWeekLow?.raw ?? null,
    homepage: profile?.website ?? null,
    description: profile?.longBusinessSummary ?? null,
    dataSource: "Yahoo Finance",
    priceLive: true,
    asOf: r.meta.regularMarketTime
      ? new Date(r.meta.regularMarketTime * 1000).toISOString()
      : new Date().toISOString(),
  };

  return { summary, history, analysis: analyze(finalPrices) };
}
