"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchHit } from "@/lib/types";
import { detectChain } from "@/lib/wallet";
import { Search, Coins, TrendingUp, Loader2, Wallet } from "lucide-react";

interface Props {
  onSelect: (hit: SearchHit) => void;
  onWallet?: (address: string) => void;
}

export default function SearchBar({ onSelect, onWallet }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const walletChain = useMemo(() => detectChain(q.trim()), [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    if (walletChain) {
      // Wallet address detected → don't query the search API, just present the wallet option
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const id = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const j = await r.json();
        setResults(j.results || []);
        setActive(0);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      ctrl.abort();
      clearTimeout(id);
    };
  }, [q, walletChain]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function selectWallet() {
    if (!onWallet) return;
    onWallet(q.trim());
    setOpen(false);
    setQ("");
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (walletChain && e.key === "Enter") {
      e.preventDefault();
      selectWallet();
      return;
    }
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) {
        onSelect(hit);
        setOpen(false);
        setQ("");
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && (loading || results.length > 0 || !!walletChain);

  return (
    <div className="relative w-full" ref={wrapRef}>
      <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-lg shadow-black/20">
        <Search className="h-5 w-5 text-muted" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Ticker, nom, ou adresse de wallet (BTC, AAPL, SPY, 0x..., bc1...)"
          className="w-full bg-transparent text-base outline-none placeholder:text-muted"
          autoFocus
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
      </div>

      {showDropdown && (
        <div className="glass scrollbar-thin absolute z-50 mt-2 max-h-96 w-full overflow-auto rounded-2xl border border-border p-1 shadow-2xl shadow-black/40">
          {walletChain && (
            <button
              onClick={selectWallet}
              className="flex w-full items-center gap-3 rounded-xl bg-accent/10 px-3 py-3 text-left transition hover:bg-accent/20"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
                <Wallet className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Inspecter ce wallet</span>
                  <span className="rounded-md bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-accent">
                    {walletChain === "evm" ? "Ethereum" : walletChain === "bitcoin" ? "Bitcoin" : "Solana"}
                  </span>
                </div>
                <div className="mt-0.5 font-mono text-xs text-muted">
                  {q.trim().slice(0, 16)}…{q.trim().slice(-8)}
                </div>
              </div>
            </button>
          )}
          {!walletChain && loading && results.length === 0 && (
            <div className="p-3 text-sm text-muted">Recherche…</div>
          )}
          {!walletChain && results.length === 0 && !loading && (
            <div className="p-3 text-sm text-muted">Aucun résultat</div>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.kind}-${r.id}`}
              onClick={() => {
                onSelect(r);
                setOpen(false);
                setQ("");
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                i === active ? "bg-surfaceAlt" : "hover:bg-surfaceAlt"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-xs font-semibold">
                {r.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.thumb} alt={r.symbol} className="h-9 w-9 rounded-lg" />
                ) : r.kind === "crypto" ? (
                  <Coins className="h-4 w-4 text-accent2" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-accent" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{r.symbol}</span>
                  <span className="truncate text-sm text-muted">{r.name}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      r.kind === "crypto"
                        ? "bg-accent2/10 text-accent2"
                        : r.subKind === "etf"
                        ? "bg-warning/10 text-warning"
                        : r.subKind === "index"
                        ? "bg-muted/10 text-muted"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {r.kind === "crypto"
                      ? "Crypto"
                      : r.subKind === "etf"
                      ? "ETF"
                      : r.subKind === "index"
                      ? "Indice"
                      : "Action"}
                  </span>
                  {r.exchange && <span>{r.exchange}</span>}
                  {r.marketCapRank && <span>Rank #{r.marketCapRank}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
