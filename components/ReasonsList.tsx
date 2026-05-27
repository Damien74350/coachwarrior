import type { AnalysisResult } from "@/lib/indicators";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

export default function ReasonsList({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 text-sm font-semibold">Pourquoi ce signal ?</div>
      <div className="space-y-2">
        {analysis.reasons.map((r, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-surface p-3">
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                r.impact === "bullish"
                  ? "bg-success/15 text-success"
                  : r.impact === "bearish"
                  ? "bg-danger/15 text-danger"
                  : "bg-warning/15 text-warning"
              }`}
            >
              {r.impact === "bullish" ? (
                <ArrowUp className="h-3.5 w-3.5" />
              ) : r.impact === "bearish" ? (
                <ArrowDown className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{r.label}</div>
              <div className="text-xs text-muted">{r.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
