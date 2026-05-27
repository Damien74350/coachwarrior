"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import AssetView from "@/components/AssetView";
import MarketSentimentCard from "@/components/MarketSentiment";
import type { MarketSentiment, SearchHit } from "@/lib/types";
import { Sparkles, PlayCircle } from "lucide-react";

const QUICK_PICKS: SearchHit[] = [
  { kind: "crypto", id: "bitcoin", symbol: "BTC", name: "Bitcoin", thumb: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { kind: "crypto", id: "ethereum", symbol: "ETH", name: "Ethereum", thumb: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { kind: "crypto", id: "solana", symbol: "SOL", name: "Solana" },
  { kind: "stock", id: "AAPL", symbol: "AAPL", name: "Apple Inc." },
  { kind: "stock", id: "NVDA", symbol: "NVDA", name: "NVIDIA" },
  { kind: "stock", id: "TSLA", symbol: "TSLA", name: "Tesla" },
  { kind: "stock", id: "MSFT", symbol: "MSFT", name: "Microsoft" },
];

export default function Home() {
  const [hit, setHit] = useState<SearchHit | null>(null);
  const [history, setHistory] = useState<SearchHit[]>([]);
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

  function pick(h: SearchHit) {
    setHit(h);
    setHistory((prev) => {
      const next = [h, ...prev.filter((x) => !(x.kind === h.kind && x.id === h.id))].slice(0, 8);
      try {
        localStorage.setItem("cw:history", JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> CoachWarrior · Intelligence financière
        </div>
        <h1 className="mt-4 bg-gradient-to-br from-white via-white to-muted bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Tout savoir sur une crypto ou une action
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-sm text-muted sm:text-base">
          Prix temps réel, fondamentaux, indicateurs techniques, et un signal clair sur le bon moment pour se positionner.
        </p>
      </header>

      <div className="mb-4">
        <SearchBar onSelect={pick} />
      </div>

      <div className="mb-6 flex justify-center">
        <button
          onClick={() => pick({ kind: "crypto", id: "__demo__", symbol: "DEMO", name: "Mode démo" })}
          className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
        >
          <PlayCircle className="h-4 w-4" />
          Lancer la démo (sans API)
        </button>
      </div>

      {!hit && (
        <div className="space-y-6">
          {sentiment && (sentiment.cryptoIndex !== null || sentiment.stockIndex !== null) && (
            <MarketSentimentCard sentiment={sentiment} focus="both" />
          )}
          {history.length > 0 && (
            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-muted">Récemment consultés</div>
              <div className="flex flex-wrap gap-2">
                {history.map((h) => (
                  <button
                    key={`h-${h.kind}-${h.id}`}
                    onClick={() => pick(h)}
                    className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surfaceAlt"
                  >
                    <span className="font-semibold">{h.symbol}</span>
                    <span className="text-muted">{h.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-muted">Suggestions</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PICKS.map((h) => (
                <button
                  key={`q-${h.kind}-${h.id}`}
                  onClick={() => pick(h)}
                  className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surfaceAlt"
                >
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                      h.kind === "crypto" ? "bg-accent2/10 text-accent2" : "bg-accent/10 text-accent"
                    }`}
                  >
                    {h.kind}
                  </span>
                  <span className="font-semibold">{h.symbol}</span>
                  <span className="text-muted">{h.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {hit && <AssetView key={`${hit.kind}-${hit.id}`} hit={hit} />}

      <footer className="mt-12 text-center text-xs text-muted">
        Sources : CoinGecko (crypto) · Yahoo Finance (actions). Cet outil ne constitue pas un conseil en investissement.
      </footer>
    </main>
  );
}
