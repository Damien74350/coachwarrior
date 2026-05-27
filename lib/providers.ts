import type { AssetResponse, AssetSummary, PricePoint, SearchHit } from "./types";
import { analyze } from "./indicators";

const UA =
  "Mozilla/5.0 (compatible; CoachWarrior/1.0; +https://coachwarrior.app)";

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": UA,
      Accept: "application/json,text/plain,*/*",
      ...(init?.headers || {}),
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} on ${url}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
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

export async function getCrypto(id: string): Promise<AssetResponse> {
  const [info, chart] = await Promise.all([
    fetchJSON<CGCoinResp>(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
        id
      )}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`
    ),
    fetchJSON<CGMarketChartResp>(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
        id
      )}/market_chart?vs_currency=usd&days=365&interval=daily`
    ),
  ]);

  const md = info.market_data || {};
  const history: PricePoint[] = (chart.prices || []).map((p) => ({
    t: p[0],
    c: p[1],
    date: new Date(p[0]).toISOString().slice(0, 10),
  }));

  const prices = history.map((p) => p.c);
  const summary: AssetSummary = {
    kind: "crypto",
    id: info.id,
    symbol: info.symbol.toUpperCase(),
    name: info.name,
    image: info.image?.large || info.image?.small,
    currency: "USD",
    price: md.current_price?.usd ?? (prices[prices.length - 1] || 0),
    change24h: md.price_change_percentage_24h ?? null,
    change7d: md.price_change_percentage_7d ?? null,
    change30d: md.price_change_percentage_30d ?? null,
    change1y: md.price_change_percentage_1y ?? null,
    marketCap: md.market_cap?.usd ?? null,
    volume24h: md.total_volume?.usd ?? null,
    high24h: md.high_24h?.usd ?? null,
    low24h: md.low_24h?.usd ?? null,
    ath: md.ath?.usd ?? null,
    athDate: md.ath_date?.usd ?? null,
    atl: md.atl?.usd ?? null,
    atlDate: md.atl_date?.usd ?? null,
    circulatingSupply: md.circulating_supply ?? null,
    totalSupply: md.total_supply ?? null,
    maxSupply: md.max_supply ?? null,
    marketCapRank: info.market_cap_rank ?? null,
    homepage: info.links?.homepage?.[0] || null,
    description: info.description?.en?.split("\n")[0] || null,
    categories: info.categories || [],
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
      financialData?: { ebitda?: { raw?: number }; totalRevenue?: { raw?: number } };
      summaryProfile?: { sector?: string; industry?: string; website?: string; longBusinessSummary?: string };
    }>;
    error?: { code: string; description: string } | null;
  };
}

export async function getStock(symbol: string): Promise<AssetResponse> {
  const sym = symbol.toUpperCase();
  const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    sym
  )}?range=2y&interval=1d`;
  const summaryUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(
    sym
  )}?modules=assetProfile,summaryDetail,defaultKeyStatistics,price,financialData,summaryProfile`;

  const [chart, sum] = await Promise.all([
    fetchJSON<YahooChartResp>(chartUrl),
    fetchJSON<YahooQuoteSummaryResp>(summaryUrl).catch(() => null),
  ]);

  if (!chart.chart.result?.length) {
    throw new Error(`Aucune donnée pour ${sym}`);
  }

  const r = chart.chart.result[0];
  const closes = r.indicators.quote[0]?.close || [];
  const timestamps = r.timestamp || [];

  const history: PricePoint[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const c = closes[i];
    if (c === null || c === undefined || !isFinite(c)) continue;
    history.push({ t: timestamps[i] * 1000, c, date: new Date(timestamps[i] * 1000).toISOString().slice(0, 10) });
  }

  if (history.length < 30) throw new Error(`Historique insuffisant pour ${sym}`);

  const prices = history.map((p) => p.c);
  const price = r.meta.regularMarketPrice ?? prices[prices.length - 1];
  const prevClose = r.meta.chartPreviousClose ?? prices[prices.length - 2] ?? price;
  const change24h = ((price - prevClose) / prevClose) * 100;

  const change7d =
    prices.length > 7 ? ((price - prices[prices.length - 8]) / prices[prices.length - 8]) * 100 : null;
  const change30d =
    prices.length > 30 ? ((price - prices[prices.length - 31]) / prices[prices.length - 31]) * 100 : null;
  const change1y =
    prices.length > 250 ? ((price - prices[prices.length - 251]) / prices[prices.length - 251]) * 100 : null;

  const s = sum?.quoteSummary.result?.[0];
  const profile = s?.assetProfile || s?.summaryProfile;
  const summary: AssetSummary = {
    kind: "stock",
    id: sym,
    symbol: sym,
    name: s?.price?.longName || s?.price?.shortName || r.meta.longName || r.meta.shortName || sym,
    currency: r.meta.currency || s?.price?.currency || "USD",
    price,
    change24h,
    change7d,
    change30d,
    change1y,
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
