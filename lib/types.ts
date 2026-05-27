import type { AnalysisResult } from "./indicators";

export type AssetKind = "crypto" | "stock";

export interface SearchHit {
  kind: AssetKind;
  subKind?: "equity" | "etf" | "index" | "crypto"; // for finer UI tagging
  id: string; // coingecko id OR stock symbol
  symbol: string;
  name: string;
  thumb?: string;
  exchange?: string;
  marketCapRank?: number | null;
}

export interface PricePoint {
  t: number; // timestamp ms
  c: number; // close
  date: string; // formatted
}

export interface AssetSummary {
  kind: AssetKind;
  id: string;
  symbol: string;
  name: string;
  image?: string;
  currency: string;

  price: number;
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
  change1y: number | null;

  marketCap: number | null;
  volume24h: number | null;
  high24h: number | null;
  low24h: number | null;
  ath: number | null;
  athDate?: string | null;
  atl: number | null;
  atlDate?: string | null;

  // Crypto-specific
  circulatingSupply?: number | null;
  totalSupply?: number | null;
  maxSupply?: number | null;
  marketCapRank?: number | null;
  homepage?: string | null;
  description?: string | null;
  categories?: string[];

  // Stock-specific
  exchange?: string | null;
  currencyName?: string | null;
  longName?: string | null;
  sector?: string | null;
  industry?: string | null;
  peRatio?: number | null;
  eps?: number | null;
  dividendYield?: number | null;
  beta?: number | null;
  bookValue?: number | null;
  sharesOutstanding?: number | null;
  fiftyTwoWeekHigh?: number | null;
  fiftyTwoWeekLow?: number | null;
}

export interface AssetSummaryWithMeta extends AssetSummary {
  dataSource: string; // "Yahoo Finance", "Stooq", "CoinGecko"
  priceLive: boolean; // true if we got a real-time price, false if EOD-only
  asOf?: string | null; // ISO timestamp of the price quote when known
}

export interface MarketSentiment {
  cryptoIndex: number | null; // 0-100 (Fear & Greed - crypto)
  cryptoLabel: string | null; // "Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed"
  cryptoChange1d: number | null;
  cryptoChange7d: number | null;
  cryptoHistory: { d: string; v: number }[]; // last 30 days
  stockIndex: number | null; // 0-100 (CNN F&G - stocks)
  stockLabel: string | null;
}

export interface AssetResponse {
  summary: AssetSummaryWithMeta;
  history: PricePoint[];
  analysis: AnalysisResult;
  sentiment?: MarketSentiment;
}
