import type { MarketSentiment } from "./types";

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

interface FnGEntry {
  value: string;
  value_classification: string;
  timestamp: string;
}

interface FnGResp {
  data: FnGEntry[];
}

function labelToFr(label: string | undefined): string {
  if (!label) return "—";
  const map: Record<string, string> = {
    "Extreme Fear": "Peur extrême",
    Fear: "Peur",
    Neutral: "Neutre",
    Greed: "Avidité",
    "Extreme Greed": "Avidité extrême",
  };
  return map[label] || label;
}

export async function getMarketSentiment(): Promise<MarketSentiment> {
  let cryptoIndex: number | null = null;
  let cryptoLabel: string | null = null;
  let cryptoChange1d: number | null = null;
  let cryptoChange7d: number | null = null;
  let cryptoHistory: { d: string; v: number }[] = [];
  let stockIndex: number | null = null;
  let stockLabel: string | null = null;

  // Crypto Fear & Greed (alternative.me)
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=30", {
      headers: { "User-Agent": BROWSER_UA, Accept: "application/json" },
      next: { revalidate: 600 },
    });
    if (res.ok) {
      const json = (await res.json()) as FnGResp;
      const entries = json.data || [];
      if (entries.length > 0) {
        cryptoIndex = parseInt(entries[0].value, 10);
        cryptoLabel = labelToFr(entries[0].value_classification);
        if (entries[1]) cryptoChange1d = cryptoIndex - parseInt(entries[1].value, 10);
        if (entries[7]) cryptoChange7d = cryptoIndex - parseInt(entries[7].value, 10);
        cryptoHistory = entries
          .slice()
          .reverse()
          .map((e) => ({
            d: new Date(parseInt(e.timestamp, 10) * 1000).toISOString().slice(0, 10),
            v: parseInt(e.value, 10),
          }));
      }
    }
  } catch {
    // sentiment is optional
  }

  // CNN Fear & Greed (stocks)
  try {
    const res = await fetch(
      "https://production.dataviz.cnn.io/index/fearandgreed/graphdata",
      {
        headers: {
          "User-Agent": BROWSER_UA,
          Accept: "application/json",
          Origin: "https://www.cnn.com",
          Referer: "https://www.cnn.com/",
        },
        next: { revalidate: 1800 },
      }
    );
    if (res.ok) {
      const j = (await res.json()) as {
        fear_and_greed?: { score?: number; rating?: string };
      };
      if (typeof j.fear_and_greed?.score === "number") {
        stockIndex = Math.round(j.fear_and_greed.score);
        const ratingMap: Record<string, string> = {
          "extreme fear": "Peur extrême",
          fear: "Peur",
          neutral: "Neutre",
          greed: "Avidité",
          "extreme greed": "Avidité extrême",
        };
        const r = j.fear_and_greed.rating?.toLowerCase() || "";
        stockLabel = ratingMap[r] || j.fear_and_greed.rating || null;
      }
    }
  } catch {
    // optional
  }

  return {
    cryptoIndex,
    cryptoLabel,
    cryptoChange1d,
    cryptoChange7d,
    cryptoHistory,
    stockIndex,
    stockLabel,
  };
}
