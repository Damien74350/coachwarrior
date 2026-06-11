import { Card, Pill, Stat } from "../../../components/Card";
import { MinutesChart } from "../../../components/MinutesChart";
import { LineGrowthChart } from "../../../components/LineGrowthChart";
import {
  CLUB_KPIS,
  weeklyMinutesSeries,
  membersGrowthSeries,
  courseAttendanceSeries,
} from "../../../lib/mock";
import { minutesToHm } from "../../../lib/format";
import { TrendingUp, Heart, Repeat, AlertTriangle } from "lucide-react";

export default function AnalyticsPage() {
  const week = weeklyMinutesSeries();
  const growth = membersGrowthSeries();
  const courses = courseAttendanceSeries();

  return (
    <div className="space-y-6">
      <header>
        <Pill color="cyan">Analytics</Pill>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
          La <span className="flame-text">fidélisation</span>, pilotée par la data
        </h1>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Heart size={16} />} label="NPS" value={CLUB_KPIS.netPromoterScore} hint="≥ 50 = excellent" trend={6.1} />
        <Stat icon={<Repeat size={16} />} label="Rétention 90j" value={`${Math.round(CLUB_KPIS.retentionRate * 100)}%`} hint="vs 60% marché" trend={CLUB_KPIS.retentionChange} />
        <Stat icon={<TrendingUp size={16} />} label="Pts moy / membre" value={CLUB_KPIS.avgPointsPerMember} hint="par semaine" trend={CLUB_KPIS.pointsChange} />
        <Stat icon={<AlertTriangle size={16} />} label="Membres dormants" value="38" hint="0 séance 21j" trend={-12.4} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Activité hebdomadaire" subtitle="Minutes générées chaque jour">
          <MinutesChart data={week} />
        </Card>
        <Card title="Croissance membres" subtitle="6 derniers mois">
          <LineGrowthChart data={growth} xKey="month" dataKey="members" color="#22d3ee" />
        </Card>
      </div>

      <Card title="Performance par cours" subtitle="Inscriptions vs capacité">
        <div className="space-y-2">
          {courses.map(c => {
            const pct = (c.bookings / c.capacity) * 100;
            return (
              <div key={c.name} className="rounded-xl bg-overlay/5 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-muted text-xs">{c.bookings}/{c.capacity} <span className="font-bold text-flame">{pct.toFixed(0)}%</span></span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-overlay/10 overflow-hidden">
                  <div className={`h-full ${pct >= 90 ? "bg-success" : pct >= 60 ? "flame-gradient" : "bg-muted"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Cohortes — rétention par mois d'arrivée">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted text-left">
                <th className="py-1 px-2">Cohorte</th>
                <th className="px-2 text-right">M+1</th>
                <th className="px-2 text-right">M+2</th>
                <th className="px-2 text-right">M+3</th>
                <th className="px-2 text-right">M+6</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Janvier", 92, 81, 74, 68],
                ["Février", 89, 78, 71, 65],
                ["Mars", 94, 84, 77, 70],
                ["Avril", 91, 80, 73, 0],
                ["Mai", 88, 76, 0, 0],
                ["Juin", 95, 0, 0, 0],
              ].map(([m, ...vals]) => (
                <tr key={m} className="border-t border-border/50">
                  <td className="py-2 px-2 font-semibold">{m}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="px-2 py-2 text-right">
                      {v === 0 ? <span className="text-muted">—</span> : (
                        <span className={(v as number) >= 80 ? "text-success font-bold" : (v as number) >= 70 ? "text-flame font-bold" : "text-muted"}>{v}%</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Impact des bonus points" subtitle="Cours bonus vs cours standards">
          <div className="space-y-4">
            <Compare label="Taux remplissage" std={62} bonus={94} />
            <Compare label="Inscriptions / cours" std={14.2} bonus={21.4} suffix="" />
            <Compare label="Rétention 30j post-cours" std={71} bonus={86} />
            <Compare label="Avis ≥ 4★" std={78} bonus={91} />
          </div>
          <p className="mt-4 text-xs text-muted">Les cours marqués bonus performent en moyenne <strong className="text-flame">+34%</strong> sur l'engagement.</p>
        </Card>
      </div>
    </div>
  );
}

function Compare({ label, std, bonus, suffix = "%" }: { label: string; std: number; bonus: number; suffix?: string }) {
  return (
    <div>
      <p className="text-xs text-muted mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] uppercase text-muted">Standard</p>
          <div className="h-2 rounded-full bg-overlay/10 overflow-hidden mt-1">
            <div className="h-full bg-muted" style={{ width: `${(std / Math.max(std, bonus)) * 100}%` }} />
          </div>
          <p className="text-xs font-bold mt-1">{std}{suffix}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-flame font-bold">Bonus</p>
          <div className="h-2 rounded-full bg-overlay/10 overflow-hidden mt-1">
            <div className="h-full flame-gradient" style={{ width: `${(bonus / Math.max(std, bonus)) * 100}%` }} />
          </div>
          <p className="text-xs font-bold mt-1 text-flame">{bonus}{suffix}</p>
        </div>
      </div>
    </div>
  );
}
