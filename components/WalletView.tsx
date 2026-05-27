"use client";

import { useEffect, useState } from "react";
import { fmtMoney, fmtNum } from "@/lib/format";
import type { WalletSummary } from "@/lib/wallet";
import {
  Loader2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Wallet,
} from "lucide-react";

const CHAIN_LABEL: Record<string, string> = {
  evm: "Ethereum",
  bitcoin: "Bitcoin",
  solana: "Solana",
};

export default function WalletView({ address }: { address: string }) {
  const [data, setData] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"holdings" | "tx">("holdings");

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);
    const ctrl = new AbortController();
    fetch(`/api/wallet?address=${encodeURIComponent(address)}`, { signal: ctrl.signal })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
        return j as WalletSummary;
      })
      .then((j) => setData(j))
      .catch((e) => {
        if ((e as Error).name === "AbortError") return;
        setError((e as Error).message);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [address]);

  if (loading) {
    return (
      <div className="glass flex items-center gap-3 rounded-2xl p-8 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Analyse du wallet {address.slice(0, 8)}…{address.slice(-4)}
      </div>
    );
  }
  if (error) {
    return (
      <div className="glass flex items-start gap-3 rounded-2xl p-6 ring-1 ring-danger/30">
        <AlertTriangle className="h-5 w-5 text-danger" />
        <div>
          <div className="font-semibold text-danger">Wallet introuvable</div>
          <div className="text-sm text-muted">{error}</div>
        </div>
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface">
            <Wallet className="h-7 w-7 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  data.chain === "evm"
                    ? "bg-accent/10 text-accent"
                    : data.chain === "bitcoin"
                    ? "bg-warning/10 text-warning"
                    : "bg-accent2/10 text-accent2"
                }`}
              >
                {CHAIN_LABEL[data.chain]}
              </span>
              <span className="text-muted">·</span>
              <code className="font-mono text-sm">{data.shortAddress}</code>
              <button
                onClick={() => navigator.clipboard.writeText(data.address)}
                title="Copier l'adresse"
                className="rounded-md p-1 text-muted hover:bg-surface hover:text-white"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <a
                href={data.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
              >
                Explorer <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <div className="text-4xl font-bold">
                {data.totalValueUsd !== null ? fmtMoney(data.totalValueUsd) : "—"}
              </div>
              <div className="text-sm text-muted">
                Valeur totale du portefeuille
              </div>
            </div>
            <div className="mt-1 text-xs text-muted">
              {fmtNum(data.nativeBalance, 6)} {data.nativeSymbol}
              {data.txCount !== null && data.txCount !== undefined && (
                <span> · {data.txCount.toLocaleString("fr-FR")} transactions</span>
              )}
              <span> · Source : {data.dataSource}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="mb-4 flex gap-1 rounded-xl bg-surface p-1">
          <button
            onClick={() => setTab("holdings")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              tab === "holdings" ? "bg-surfaceAlt text-white" : "text-muted hover:text-white"
            }`}
          >
            Avoirs ({data.holdings.length})
          </button>
          <button
            onClick={() => setTab("tx")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              tab === "tx" ? "bg-surfaceAlt text-white" : "text-muted hover:text-white"
            }`}
          >
            Transactions ({data.txs.length})
          </button>
        </div>

        {tab === "holdings" && (
          <div className="space-y-2">
            {data.holdings.length === 0 && (
              <div className="rounded-xl bg-surface p-4 text-sm text-muted">
                Aucun avoir détecté pour cette adresse.
              </div>
            )}
            {data.holdings.map((h, i) => (
              <div key={`${h.contract || h.symbol}-${i}`} className="flex items-center gap-3 rounded-xl bg-surface p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surfaceAlt text-xs font-semibold">
                  {h.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={h.icon} alt={h.symbol} className="h-9 w-9 rounded-lg" />
                  ) : (
                    <span>{h.symbol.slice(0, 3)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{h.symbol}</span>
                    <span className="truncate text-xs text-muted">{h.name}</span>
                  </div>
                  <div className="text-xs text-muted">
                    {fmtNum(h.balance, h.balance < 1 ? 6 : 4)} {h.symbol}
                    {h.priceUsd ? ` · ${fmtMoney(h.priceUsd, "USD", 6)}` : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{h.valueUsd !== null ? fmtMoney(h.valueUsd) : "—"}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "tx" && (
          <div className="space-y-2">
            {data.txs.length === 0 && (
              <div className="rounded-xl bg-surface p-4 text-sm text-muted">
                Aucune transaction récente.
              </div>
            )}
            {data.txs.map((tx) => (
              <a
                key={tx.hash}
                href={tx.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl bg-surface p-3 hover:bg-surfaceAlt"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    tx.direction === "in"
                      ? "bg-success/15 text-success"
                      : tx.direction === "out"
                      ? "bg-danger/15 text-danger"
                      : "bg-warning/15 text-warning"
                  }`}
                >
                  {tx.direction === "in" ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : tx.direction === "out" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowRightLeft className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {tx.direction === "in" ? "Achat / Réception" : tx.direction === "out" ? "Envoi" : "Interne"}
                    </span>
                    {tx.amount > 0 && (
                      <span className="text-xs text-muted">
                        {tx.direction === "in" ? "+" : tx.direction === "out" ? "−" : ""}
                        {fmtNum(tx.amount, tx.amount < 1 ? 6 : 4)} {tx.symbol}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted">
                    {tx.date}
                    {tx.counterparty && (
                      <span>
                        {" "}
                        · {tx.direction === "in" ? "de" : "vers"}{" "}
                        <code>{tx.counterparty.slice(0, 6)}…{tx.counterparty.slice(-4)}</code>
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm">
                  {tx.valueUsd !== null && tx.valueUsd !== undefined && (
                    <div className={tx.direction === "in" ? "text-success" : tx.direction === "out" ? "text-danger" : ""}>
                      {tx.direction === "out" ? "−" : "+"}
                      {fmtMoney(Math.abs(tx.valueUsd))}
                    </div>
                  )}
                  <ExternalLink className="ml-auto h-3 w-3 text-muted" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
