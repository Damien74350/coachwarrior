import Link from "next/link";
import { Card, Stat, Pill } from "../../components/Card";
import { MinutesChart } from "../../components/MinutesChart";
import { LineGrowthChart } from "../../components/LineGrowthChart";
import {
  MY_CLUB,
  CLUB_KPIS,
  weeklyMinutesSeries,
  membersGrowthSeries,
  COURSES,
  LEAGUES,
  getClubLeaderboard,
} from "../../lib/mock";
import { Leaderboard } from "../../components/Leaderboard";
import { compact, minutesToHm } from "../../lib/format";
import { Users, Timer, Crown, BarChart3, ArrowRight, Trophy, Sparkles, Target } from "lucide-react";

export default function ClubDashboard() {
  const week = weeklyMinutesSeries();
  const growth = membersGrowthSeries();
  const bonusCourses = COURSES.filter(c => c.bonusMultiplier > 1);
  const topMembers = getClubLeaderboard(MY_CLUB.id, 5);
  const clubLeague = LEAGUES.find(l => l.scope === "CLUB");

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <Pill color="cyan">Espace club</Pill>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            {MY_CLUB.name}
          </h1>
          <p className="mt-1 text-muted text-sm">
            {MY_CLUB.brand} · {MY_CLUB.city}, {MY_CLUB.country} · {MY_CLUB.members.toLocaleString("fr-FR")} membres
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/club/courses" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-war/15 text-war ring-1 ring-war/30 text-sm font-semibold hover:bg-war/20">
            <Sparkles size={14} /> Activer un bonus
          </Link>
          <Link href="/club/leagues" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold">
            <Trophy size={14} /> Lancer une ligue
          </Link>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Users size={16} />} label="Membres actifs" value={compact(CLUB_KPIS.activeMembers)} hint="≥ 1 séance / sem" trend={CLUB_KPIS.membersChange} />
        <Stat icon={<Timer size={16} />} label="Minutes (sem.)" value={minutesToHm(CLUB_KPIS.totalMinutesWeek)} hint="tous membres" trend={CLUB_KPIS.minutesChange} />
        <Stat icon={<Crown size={16} />} label="Rétention 90j" value={`${Math.round(CLUB_KPIS.retentionRate * 100)}%`} hint="vs 60% marché" trend={CLUB_KPIS.retentionChange} />
        <Stat icon={<BarChart3 size={16} />} label="NPS" value={CLUB_KPIS.netPromoterScore} hint="excellent ≥ 50" trend={6.1} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          title="Activité hebdomadaire"
          subtitle="Total minutes par jour, tous membres confondus"
          right={<Pill color="success">+{CLUB_KPIS.minutesChange.toFixed(1)}% sem.</Pill>}
        >
          <MinutesChart data={week} />
        </Card>

        <Card
          title="Croissance membres actifs"
          subtitle="6 derniers mois"
          right={<Pill color="cyan">+{CLUB_KPIS.membersChange.toFixed(1)}%</Pill>}
        >
          <LineGrowthChart data={growth} xKey="month" dataKey="members" color="#22d3ee" />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          title="Bonus points actifs"
          subtitle="Tes leviers de remplissage"
          right={<Link href="/club/courses" className="text-xs text-flame font-bold hover:underline inline-flex items-center gap-1">Gérer <ArrowRight size={12} /></Link>}
        >
          <div className="grid sm:grid-cols-2 gap-3">
            {bonusCourses.map(c => (
              <div key={c.id} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10 hover:ring-flame/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-[11px] text-muted">{c.schedule} · {c.coachName}</p>
                  </div>
                  <Pill color="flame">×{c.bonusMultiplier}</Pill>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted">{c.bookings}/{c.capacity} inscrits</span>
                  <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full flame-gradient" style={{ width: `${(c.bookings / c.capacity) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Ligue interne du club"
          subtitle={clubLeague?.name}
          right={<Link href="/club/leagues" className="text-xs text-flame font-bold hover:underline">Détails</Link>}
        >
          <Leaderboard users={topMembers} pointKey="weekPoints" showClub={false} showCountry={false} />
        </Card>
      </div>

      <Card title="Objectifs du mois" subtitle="Pilote ta fidélisation" right={<Pill color="war"><Target size={11} className="mr-1" />en cours</Pill>}>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Rétention 90j", current: CLUB_KPIS.retentionRate * 100, target: 80, suffix: "%" },
            { label: "Minutes / membre / sem.", current: MY_CLUB.avgWeeklyMinutesPerMember, target: 260, suffix: "min" },
            { label: "Active members", current: CLUB_KPIS.activeMembers, target: Math.round(CLUB_KPIS.activeMembers * 1.15), suffix: "" },
          ].map(o => {
            const pct = Math.min(100, (o.current / o.target) * 100);
            return (
              <div key={o.label} className="rounded-xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">{o.label}</p>
                <p className="mt-1 text-2xl font-black">{Math.round(o.current)}<span className="text-muted text-sm">{o.suffix} / {o.target}{o.suffix}</span></p>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full flame-gradient" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-[11px] text-muted">{pct.toFixed(0)}% atteint</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
