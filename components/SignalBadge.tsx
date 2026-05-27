import type { Signal } from "@/lib/indicators";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const labels: Record<Signal, string> = {
  STRONG_BUY: "ACHAT FORT",
  BUY: "ACHAT",
  HOLD: "ATTENDRE",
  SELL: "VENTE",
  STRONG_SELL: "VENTE FORTE",
};

export default function SignalBadge({ signal, score, confidence }: { signal: Signal; score: number; confidence: number }) {
  const palette: Record<Signal, { bg: string; text: string; ring: string; icon: React.ReactNode }> = {
    STRONG_BUY: { bg: "from-success/30 to-success/5", text: "text-success", ring: "ring-success/40", icon: <TrendingUp className="h-5 w-5" /> },
    BUY: { bg: "from-success/20 to-success/0", text: "text-success", ring: "ring-success/30", icon: <TrendingUp className="h-5 w-5" /> },
    HOLD: { bg: "from-warning/20 to-warning/0", text: "text-warning", ring: "ring-warning/30", icon: <Minus className="h-5 w-5" /> },
    SELL: { bg: "from-danger/20 to-danger/0", text: "text-danger", ring: "ring-danger/30", icon: <TrendingDown className="h-5 w-5" /> },
    STRONG_SELL: { bg: "from-danger/30 to-danger/5", text: "text-danger", ring: "ring-danger/40", icon: <TrendingDown className="h-5 w-5" /> },
  };
  const p = palette[signal];

  return (
    <div className={`glass relative overflow-hidden rounded-2xl p-5 ring-1 ${p.ring}`}>
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${p.bg}`} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted">Signal de positionnement</div>
          <div className={`mt-1 flex items-center gap-2 text-3xl font-bold ${p.text}`}>
            {p.icon}
            {labels[signal]}
          </div>
          <div className="mt-2 text-sm text-muted">
            Score : <span className="font-mono font-semibold text-white">{score > 0 ? "+" : ""}{score}</span>
            <span className="mx-2">·</span>
            Confiance : <span className="font-mono font-semibold text-white">{confidence}%</span>
          </div>
        </div>
        <div className="w-32">
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full ${
                score >= 20 ? "bg-success" : score <= -20 ? "bg-danger" : "bg-warning"
              }`}
              style={{ width: `${Math.min(100, Math.abs(score))}%`, marginLeft: score < 0 ? "auto" : 0 }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted">
            <span>−100</span>
            <span>0</span>
            <span>+100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
