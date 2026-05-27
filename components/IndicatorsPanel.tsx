import type { AnalysisResult } from "@/lib/indicators";
import { fmtNum, fmtPct } from "@/lib/format";

function RSIBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-2">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-border">
        <div className="absolute inset-y-0 left-0 w-[30%] bg-success/30" />
        <div className="absolute inset-y-0 right-0 w-[30%] bg-danger/30" />
        <div
          className="absolute top-1/2 h-3 w-1 -translate-y-1/2 rounded-full bg-white shadow"
          style={{ left: `${clamped}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted">
        <span>Survente 30</span>
        <span>Neutre 50</span>
        <span>Surachat 70</span>
      </div>
    </div>
  );
}

function Row({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2 last:border-0">
      <div>
        <div className="text-sm">{label}</div>
        {hint && <div className="text-[11px] text-muted">{hint}</div>}
      </div>
      <div className="font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

export default function IndicatorsPanel({ analysis }: { analysis: AnalysisResult }) {
  const m = analysis.metrics;
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 text-sm font-semibold">Indicateurs techniques</div>

      {m.rsi !== null && (
        <div className="mb-4 rounded-xl bg-surface p-4">
          <div className="flex items-baseline justify-between">
            <div className="text-sm">RSI (14)</div>
            <div className="font-mono text-lg font-semibold">{fmtNum(m.rsi)}</div>
          </div>
          <RSIBar value={m.rsi} />
        </div>
      )}

      <Row
        label="MACD"
        value={
          m.macd !== null && m.macdSignal !== null && m.macdHist !== null ? (
            <span>
              {fmtNum(m.macd, 4)} / sig {fmtNum(m.macdSignal, 4)}{" "}
              <span className={m.macdHist >= 0 ? "text-success" : "text-danger"}>({m.macdHist >= 0 ? "+" : ""}{fmtNum(m.macdHist, 4)})</span>
            </span>
          ) : (
            "—"
          )
        }
        hint="Convergence/divergence des moyennes mobiles"
      />
      <Row label="EMA 12" value={m.ema12 !== null ? fmtNum(m.ema12, 4) : "—"} />
      <Row label="EMA 26" value={m.ema26 !== null ? fmtNum(m.ema26, 4) : "—"} />
      <Row label="SMA 20" value={m.sma20 !== null ? fmtNum(m.sma20, 4) : "—"} />
      <Row label="SMA 50" value={m.sma50 !== null ? fmtNum(m.sma50, 4) : "—"} />
      <Row label="SMA 200" value={m.sma200 !== null ? fmtNum(m.sma200, 4) : "—"} />
      <Row
        label="Bandes de Bollinger"
        value={
          m.bbUpper !== null && m.bbLower !== null
            ? `${fmtNum(m.bbLower, 4)} — ${fmtNum(m.bbUpper, 4)}`
            : "—"
        }
        hint="Plage statistique (±2σ)"
      />
      <Row
        label="Volatilité 30j"
        value={m.volatility30d !== null ? `${fmtNum(m.volatility30d, 1)} %` : "—"}
        hint="Annualisée"
      />
      <Row label="Variation 7j" value={fmtPct(m.change7d)} />
      <Row label="Variation 30j" value={fmtPct(m.change30d)} />
    </div>
  );
}
