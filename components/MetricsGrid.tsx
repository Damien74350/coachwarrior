import type { AssetSummary } from "@/lib/types";
import { fmtCompact, fmtMoney, fmtNum, fmtPct } from "@/lib/format";

function Cell({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 text-base font-semibold">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function ChangePill({ v }: { v: number | null | undefined }) {
  if (v === null || v === undefined) return <span className="text-muted">—</span>;
  const cls = v >= 0 ? "text-success" : "text-danger";
  return <span className={`font-mono font-semibold ${cls}`}>{fmtPct(v)}</span>;
}

export default function MetricsGrid({ s }: { s: AssetSummary }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 text-sm font-semibold">Métriques de marché</div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Cell label="Prix" value={fmtMoney(s.price, s.currency, 4)} />
        <Cell label="24h" value={<ChangePill v={s.change24h} />} />
        <Cell label="7j" value={<ChangePill v={s.change7d} />} />
        <Cell label="30j" value={<ChangePill v={s.change30d} />} />
        <Cell label="1 an" value={<ChangePill v={s.change1y} />} />
        <Cell label="Capitalisation" value={fmtMoney(s.marketCap)} />
        <Cell label="Volume 24h" value={fmtMoney(s.volume24h)} />
        <Cell label="Plus haut 24h" value={fmtMoney(s.high24h, s.currency, 4)} />
        <Cell label="Plus bas 24h" value={fmtMoney(s.low24h, s.currency, 4)} />
        {s.kind === "crypto" ? (
          <>
            <Cell label="ATH" value={fmtMoney(s.ath, s.currency)} sub={s.athDate ? new Date(s.athDate).toLocaleDateString("fr-FR") : null} />
            <Cell label="ATL" value={fmtMoney(s.atl, s.currency)} sub={s.atlDate ? new Date(s.atlDate).toLocaleDateString("fr-FR") : null} />
            <Cell label="Rang" value={s.marketCapRank ? `#${s.marketCapRank}` : "—"} />
            <Cell label="Offre circulante" value={fmtCompact(s.circulatingSupply)} />
            <Cell label="Offre totale" value={fmtCompact(s.totalSupply)} />
            <Cell label="Offre max" value={s.maxSupply ? fmtCompact(s.maxSupply) : "∞"} />
          </>
        ) : (
          <>
            <Cell label="52 sem. haut" value={fmtMoney(s.fiftyTwoWeekHigh, s.currency)} />
            <Cell label="52 sem. bas" value={fmtMoney(s.fiftyTwoWeekLow, s.currency)} />
            <Cell label="P/E" value={s.peRatio ? fmtNum(s.peRatio) : "—"} />
            <Cell label="Dividende" value={s.dividendYield ? `${fmtNum(s.dividendYield)} %` : "—"} />
            <Cell label="Bêta" value={s.beta ? fmtNum(s.beta) : "—"} />
            <Cell label="Actions en circulation" value={fmtCompact(s.sharesOutstanding)} />
          </>
        )}
      </div>
    </div>
  );
}
