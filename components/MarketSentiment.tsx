import type { MarketSentiment } from "@/lib/types";
import { Activity, Brain, Flame, Snowflake, AlertTriangle } from "lucide-react";

function classify(v: number | null): { color: string; bg: string; ring: string; icon: React.ReactNode } {
  if (v === null) return { color: "text-muted", bg: "bg-surface", ring: "ring-border", icon: <Brain className="h-5 w-5" /> };
  if (v <= 24)
    return {
      color: "text-danger",
      bg: "bg-gradient-to-br from-danger/30 to-danger/5",
      ring: "ring-danger/40",
      icon: <Snowflake className="h-5 w-5" />,
    };
  if (v <= 44)
    return {
      color: "text-warning",
      bg: "bg-gradient-to-br from-warning/25 to-warning/5",
      ring: "ring-warning/40",
      icon: <AlertTriangle className="h-5 w-5" />,
    };
  if (v <= 55)
    return {
      color: "text-muted",
      bg: "bg-gradient-to-br from-border/30 to-transparent",
      ring: "ring-border",
      icon: <Activity className="h-5 w-5" />,
    };
  if (v <= 74)
    return {
      color: "text-success",
      bg: "bg-gradient-to-br from-success/20 to-success/0",
      ring: "ring-success/30",
      icon: <Flame className="h-5 w-5" />,
    };
  return {
    color: "text-success",
    bg: "bg-gradient-to-br from-success/35 to-success/5",
    ring: "ring-success/50",
    icon: <Flame className="h-5 w-5" />,
  };
}

function Gauge({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-2">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-border">
        <div className="absolute inset-0 bg-gradient-to-r from-danger via-warning via-50% to-success" />
        <div
          className="absolute top-1/2 h-3.5 w-1 -translate-y-1/2 rounded-full bg-white shadow-lg"
          style={{ left: `${v}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-muted">
        <span>Peur extrême</span>
        <span>Neutre</span>
        <span>Avidité extrême</span>
      </div>
    </div>
  );
}

export default function MarketSentimentCard({
  sentiment,
  focus = "both",
}: {
  sentiment: MarketSentiment;
  focus?: "crypto" | "stock" | "both";
}) {
  const showCrypto = focus !== "stock" && sentiment.cryptoIndex !== null;
  const showStock = focus !== "crypto" && sentiment.stockIndex !== null;

  if (!showCrypto && !showStock) return null;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <Brain className="h-4 w-4 text-accent" />
        <div className="text-sm font-semibold">Sentiment de marché</div>
      </div>
      <div className={`grid gap-3 ${showCrypto && showStock ? "md:grid-cols-2" : "grid-cols-1"}`}>
        {showCrypto && sentiment.cryptoIndex !== null && (
          <SentimentTile
            label="Crypto (Fear & Greed)"
            value={sentiment.cryptoIndex}
            text={sentiment.cryptoLabel}
            change1d={sentiment.cryptoChange1d}
            change7d={sentiment.cryptoChange7d}
            source="alternative.me"
          />
        )}
        {showStock && sentiment.stockIndex !== null && (
          <SentimentTile
            label="Actions (CNN F&G)"
            value={sentiment.stockIndex}
            text={sentiment.stockLabel}
            source="CNN Business"
          />
        )}
      </div>
    </div>
  );
}

function SentimentTile({
  label,
  value,
  text,
  change1d,
  change7d,
  source,
}: {
  label: string;
  value: number;
  text: string | null;
  change1d?: number | null;
  change7d?: number | null;
  source: string;
}) {
  const cls = classify(value);
  return (
    <div className={`relative overflow-hidden rounded-xl p-4 ring-1 ${cls.ring}`}>
      <div className={`absolute inset-0 -z-10 ${cls.bg}`} />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
          <div className={`mt-1 flex items-center gap-2 text-2xl font-bold ${cls.color}`}>
            {cls.icon}
            {value}
            <span className="text-sm font-semibold">/ 100</span>
          </div>
          {text && <div className={`mt-0.5 text-sm font-semibold ${cls.color}`}>{text}</div>}
        </div>
        {(change1d !== undefined || change7d !== undefined) && (
          <div className="text-right text-[11px] text-muted">
            {change1d !== null && change1d !== undefined && (
              <div>
                1j : <span className={change1d >= 0 ? "text-success" : "text-danger"}>{change1d >= 0 ? "+" : ""}{change1d}</span>
              </div>
            )}
            {change7d !== null && change7d !== undefined && (
              <div>
                7j : <span className={change7d >= 0 ? "text-success" : "text-danger"}>{change7d >= 0 ? "+" : ""}{change7d}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <Gauge value={value} />
      <div className="mt-2 text-[10px] text-muted">Source : {source}</div>
    </div>
  );
}
