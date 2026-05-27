import type { AnalysisResult } from "./indicators";

export type AssetKind = "crypto" | "stock";

export interface SearchHit {
  kind: AssetKind;
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

export interface AssetResponse {
  summary: AssetSummary;
  history: PricePoint[];
  analysis: AnalysisResult;
}
