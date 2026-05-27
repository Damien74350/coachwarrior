import type { AssetSummaryWithMeta } from "@/lib/types";
import { fmtMoney, fmtPct } from "@/lib/format";
import { ExternalLink, Coins, TrendingUp, Radio, Clock } from "lucide-react";

function formatAsOf(asOf?: string | null): string | null {
  if (!asOf) return null;
  const d = new Date(asOf);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AssetHeader({ s }: { s: AssetSummaryWithMeta }) {
  const up = (s.change24h ?? 0) >= 0;
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface">
          {s.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.image} alt={s.symbol} className="h-14 w-14 rounded-xl" />
          ) : s.kind === "crypto" ? (
            <Coins className="h-7 w-7 text-accent2" />
          ) : (
            <TrendingUp className="h-7 w-7 text-accent" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{s.name}</h1>
            <span className="rounded-md bg-surfaceAlt px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
              {s.symbol}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                s.kind === "crypto" ? "bg-accent2/10 text-accent2" : "bg-accent/10 text-accent"
              }`}
            >
              {s.kind === "crypto" ? "Crypto" : "Action"}
            </span>
            {s.exchange && <span className="text-xs text-muted">· {s.exchange}</span>}
            {s.sector && <span className="text-xs text-muted">· {s.sector}</span>}
            {s.marketCapRank && <span className="text-xs text-muted">· Rang #{s.marketCapRank}</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <div className="text-4xl font-bold">{fmtMoney(s.price, s.currency, 6)}</div>
            <div className={`text-lg font-semibold ${up ? "text-success" : "text-danger"}`}>
              {fmtPct(s.change24h)} <span className="text-xs text-muted">24h</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 ${
                s.priceLive ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}
              title={s.priceLive ? "Prix temps réel" : "Cours de clôture (EOD)"}
            >
              <Radio className="h-3 w-3" />
              {s.priceLive ? "Live" : "Différé"}
            </span>
            <span>Source : {s.dataSource}</span>
            {formatAsOf(s.asOf) && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatAsOf(s.asOf)}
              </span>
            )}
          </div>
          {s.homepage && (
            <a
              href={s.homepage}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline"
            >
              Site officiel <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
      {s.description && (
        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted">{s.description}</p>
      )}
      {s.categories && s.categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {s.categories.slice(0, 8).map((c) => (
            <span key={c} className="rounded-md bg-surface px-2 py-0.5 text-[11px] text-muted">
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
