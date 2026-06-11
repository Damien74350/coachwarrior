import Link from "next/link";
import { Card, Stat, Pill } from "../../components/Card";
import { MinutesChart } from "../../components/MinutesChart";
import { LineGrowthChart } from "../../components/LineGrowthChart";
import { SeasonBadge } from "../../components/SeasonBadge";
import { TerritoryBanner } from "../../components/TerritoryBanner";
import { ChallengeBanner } from "../../components/ChallengeBanner";
import {
  MY_CLUB, CLUB_KPIS, weeklyMinutesSeries, membersGrowthSeries,
  COURSES, LEAGUES, getClubLeaderboard,
  AUTO_RULES, AUTO_SUGGESTIONS, autopilotStats,
} from "../../lib/mock";
import { Leaderboard } from "../../components/Leaderboard";
import { compact, minutesToHm } from "../../lib/format";
import {
  Users, Timer, Crown, BarChart3, ArrowRight, Trophy, Sparkles, Target,
  Bot, Zap, AlertTriangle, CheckCircle2, Power,
} from "lucide-react";

const SEV_COLOR: Record<string, "war" | "flame" | "success" | "cyan"> = {
  warn: "war", info: "cyan", win: "success",
};

export default function ClubDashboard() {
  const week = weeklyMinutesSeries();
  const growth = membersGrowthSeries();
  const bonusCourses = COURSES.filter(c => c.bonusMultiplier > 1);
  const topMembers = getClubLeaderboard(MY_CLUB.id, 5);
  const clubLeague = LEAGUES.find(l => l.scope === "CLUB");
  const auto = autopilotStats();

  return (
    <div className="space-y-6">
      {/* #1 — TERRITOIRE : la guerre du quartier */}
      <TerritoryBanner scope="club" />

      {/* #2 — DÉFI SPONSORISÉ : ta ville est dans un défi */}
      <ChallengeBanner />

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pill color="cyan">Pilotage interne</Pill>
            <SeasonBadge compact />
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">{MY_CLUB.name}</h1>
          <p className="mt-1 text-muted text-sm">
            {MY_CLUB.brand} · {MY_CLUB.city}, {MY_CLUB.country} · {MY_CLUB.members.toLocaleString("fr-FR")} membres
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/club/automations" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg flame-gradient text-black text-sm font-bold shadow-glow">
            <Bot size={14} /> Autopilot
          </Link>
          <Link href="/club/courses" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-war/15 text-war ring-1 ring-war/30 text-sm font-semibold hover:bg-war/20">
            <Sparkles size={14} /> Bonus manuel
          </Link>
        </div>
      </header>

      {/* AUTOPILOT BANNER — la promesse #1 : 0 effort pour le gérant */}
      <section className="rounded-3xl bg-gradient-to-r from-flame/10 via-war/10 to-cyan/10 ring-1 ring-flame/30 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flame-gradient grid place-items-center text-black shrink-0">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-black text-lg">Autopilot — actif</p>
                <Pill color="success"><CheckCircle2 size={10} className="mr-1" />En route</Pill>
              </div>
              <p className="text-sm text-muted mt-0.5">
                <strong className="text-foreground">{auto.enabled} règles</strong> sur {auto.total} actives ·{" "}
                <strong className="text-flame">{auto.monthly} actions automatiques</strong> ce mois-ci.
              </p>
              <p className="text-xs text-muted mt-1">Tu n'as <strong className="text-foreground">rien à activer manuellement</strong>. Le bot gère bonus, ligues, sauvetage à risque.</p>
            </div>
          </div>
          <Link href="/club/automations" className="text-xs font-bold text-flame hover:underline whitespace-nowrap inline-flex items-center gap-1">
            Voir & ajuster <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* SUGGESTIONS DE L'AUTOPILOT — 1 clic */}
      <Card title="Actions suggérées par l'autopilot" subtitle="1 clic. Le bot fait le reste." right={<Pill color="flame">{AUTO_SUGGESTIONS.length} idées</Pill>}>
        <div className="grid sm:grid-cols-2 gap-3">
          {AUTO_SUGGESTIONS.map(s => (
            <div key={s.id} className="rounded-xl bg-overlay/5 ring-1 ring-overlay/10 p-4 hover:ring-flame/40 transition">
              <div className="flex items-start justify-between gap-2">
                <Pill color={SEV_COLOR[s.severity]}>
                  {s.severity === "warn" && <AlertTriangle size={10} className="mr-1" />}
                  {s.severity === "win" && <Crown size={10} className="mr-1" />}
                  {s.severity === "info" && <Zap size={10} className="mr-1" />}
                  {s.severity}
                </Pill>
              </div>
              <p className="mt-2 font-bold text-sm">{s.title}</p>
              <p className="mt-1 text-xs text-muted">{s.reason}</p>
              <button className="mt-3 text-xs font-bold text-flame hover:underline inline-flex items-center gap-1">
                {s.cta} <ArrowRight size={11} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Users size={16} />} label="Membres actifs" value={compact(CLUB_KPIS.activeMembers)} hint="≥ 1 séance / sem" trend={CLUB_KPIS.membersChange} />
        <Stat icon={<Timer size={16} />} label="Minutes (sem.)" value={minutesToHm(CLUB_KPIS.totalMinutesWeek)} hint="tous membres" trend={CLUB_KPIS.minutesChange} />
        <Stat icon={<Crown size={16} />} label="Rétention 90j" value={`${Math.round(CLUB_KPIS.retentionRate * 100)}%`} hint="vs 60% marché" trend={CLUB_KPIS.retentionChange} />
        <Stat icon={<BarChart3 size={16} />} label="NPS" value={CLUB_KPIS.netPromoterScore} hint="excellent ≥ 50" trend={6.1} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Activité hebdomadaire" subtitle="Total minutes par jour, tous membres" right={<Pill color="success">+{CLUB_KPIS.minutesChange.toFixed(1)}% sem.</Pill>}>
          <MinutesChart data={week} />
        </Card>
        <Card title="Croissance membres actifs" subtitle="6 derniers mois" right={<Pill color="cyan">+{CLUB_KPIS.membersChange.toFixed(1)}%</Pill>}>
          <LineGrowthChart data={growth} xKey="month" dataKey="members" color="#22d3ee" />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          title="Bonus actifs"
          subtitle="Mix entre activation auto et manuelle"
          right={<Link href="/club/courses" className="text-xs text-flame font-bold hover:underline inline-flex items-center gap-1">Gérer <ArrowRight size={12} /></Link>}
        >
          <div className="grid sm:grid-cols-2 gap-3">
            {bonusCourses.map((c, i) => (
              <div key={c.id} className="rounded-xl bg-overlay/5 p-3 ring-1 ring-overlay/10 hover:ring-flame/40 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-[11px] text-muted">{c.schedule} · {c.coachName}</p>
                  </div>
                  <Pill color="flame">×{c.bonusMultiplier}</Pill>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-muted">{c.bookings}/{c.capacity}</span>
                  {i % 2 === 0 ? (
                    <span className="text-cyan inline-flex items-center gap-1"><Bot size={10} /> activé auto</span>
                  ) : (
                    <span className="text-muted">activé manuellement</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Ligue interne du club" subtitle={clubLeague?.name} right={<Link href="/club/leagues" className="text-xs text-flame font-bold hover:underline">Détails</Link>}>
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
              <div key={o.label} className="rounded-xl bg-overlay/5 p-4">
                <p className="text-xs uppercase tracking-wider text-muted">{o.label}</p>
                <p className="mt-1 text-2xl font-black">{Math.round(o.current)}<span className="text-muted text-sm">{o.suffix} / {o.target}{o.suffix}</span></p>
                <div className="mt-3 h-2 rounded-full bg-overlay/10 overflow-hidden">
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
