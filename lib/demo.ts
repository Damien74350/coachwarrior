import type { AssetResponse } from "./types";
import { analyze } from "./indicators";

// Generates a realistic 2-year history (daily) with a deterministic random walk,
// then computes the full analysis so the demo looks production-ready.
function generateHistory(start: number, days: number, seed: number) {
  let s = seed;
  function rand() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  }
  const prices: { t: number; c: number; date: string }[] = [];
  let price = start;
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const drift = 0.0008; // slight upward bias
    const shock = (rand() - 0.5) * 0.05;
    price = Math.max(0.0001, price * (1 + drift + shock));
    const t = now - i * 86400000;
    prices.push({ t, c: price, date: new Date(t).toISOString().slice(0, 10) });
  }
  return prices;
}

export function getDemoBTC(): AssetResponse {
  const history = generateHistory(45000, 400, 1337);
  const prices = history.map((p) => p.c);
  const price = prices[prices.length - 1];
  return {
    summary: {
      kind: "crypto",
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin (démo)",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      currency: "USD",
      price,
      change24h: ((price - prices[prices.length - 2]) / prices[prices.length - 2]) * 100,
      change7d: ((price - prices[prices.length - 8]) / prices[prices.length - 8]) * 100,
      change30d: ((price - prices[prices.length - 31]) / prices[prices.length - 31]) * 100,
      change1y: ((price - prices[prices.length - 366]) / prices[prices.length - 366]) * 100,
      marketCap: price * 19_700_000,
      volume24h: 28_400_000_000,
      high24h: price * 1.025,
      low24h: price * 0.975,
      ath: 73_750,
      athDate: "2024-03-14T00:00:00.000Z",
      atl: 67.81,
      atlDate: "2013-07-06T00:00:00.000Z",
      circulatingSupply: 19_700_000,
      totalSupply: 19_700_000,
      maxSupply: 21_000_000,
      marketCapRank: 1,
      homepage: "https://bitcoin.org",
      description:
        "Bitcoin est la première et la plus grande crypto-monnaie au monde. Créée en 2009 par un développeur anonyme sous le pseudonyme de Satoshi Nakamoto, elle fonctionne sans autorité centrale grâce à un registre distribué (blockchain).",
      categories: ["Cryptocurrency", "Layer 1", "Proof of Work", "Store of Value"],
      dataSource: "Démo (données simulées)",
      priceLive: false,
      asOf: new Date().toISOString(),
    },
    history,
    analysis: analyze(prices),
    sentiment: {
      cryptoIndex: 62,
      cryptoLabel: "Avidité",
      cryptoChange1d: 4,
      cryptoChange7d: -3,
      cryptoHistory: [],
      stockIndex: 58,
      stockLabel: "Avidité",
    },
  };
}
