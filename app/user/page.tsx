import Link from "next/link";
import { Flame, Trophy, Timer, Zap, ArrowRight, Crown, Award, Target } from "lucide-react";
import { Card, Stat, Pill } from "../../components/Card";
import { MinutesChart } from "../../components/MinutesChart";
import { Leaderboard } from "../../components/Leaderboard";
import { ME, MY_SESSIONS, getClubLeaderboard, getWorldLeaderboard, COURSES } from "../../lib/mock";
import { compact, minutesToHm, tierLabel, tierBg, relativeDate } from "../../lib/format";

export default function UserDashboard() {
  const weekData = (() => {
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const totals = [54, 60, 0, 75, 45, 90, 62];
    return days.map((day, i) => ({ day, minutes: totals[i] }));
  })();

  const myWorldRank =
    getWorldLeaderboard(500).findIndex(u => u.id === "me") + 1;
  const myClubRank =
    getClubLeaderboard(ME.clubId, 500).findIndex(u => u.id === "me") + 1;

  const bonusCourses = COURSES.filter(c => c.bonusMultiplier > 1).slice(0, 3);
  const recentSessions = MY_SESSIONS.slice(0, 5);

  // tier progression
  const tierThresholds = [
    { tier: "BRONZE", min: 0 },
    { tier: "SILVER", min: 1500 },
    { tier: "GOLD", min: 5000 },
    { tier: "PLATINUM", min: 12000 },
    { tier: "DIAMOND", min: 25000 },
    { tier: "LEGEND", min: 50000 },
  ];
  const currentIdx = tierThresholds.findIndex(t => t.tier === ME.tier);
  const next = tierThresholds[currentIdx + 1];
  const tierProgress = next
    ? ((ME.totalPoints - tierThresholds[currentIdx].min) / (next.min - tierThresholds[currentIdx].min)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full flame-gradient opacity-20 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Pill color="flame">Salut, {ME.name.split(" ")[0]} ⚔️</Pill>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${tierBg(ME.tier)}`}>
                Tier {tierLabel(ME.tier)}
              </span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">
              <span className="flame-text">{ME.streak} jours</span> de streak.
            </h1>
            <p className="mt-2 text-muted">
              Tu es <strong className="text-white">#{myClubRank}</strong> dans ton club et
              <strong className="text-white"> #{myWorldRank}</strong> mondial cette semaine.
              Continue, la {next ? `prochaine palier` : `légende`} est à portée.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/user/leaderboard" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-war/15 text-war ring-1 ring-war/30 text-sm font-semibold hover:bg-war/20">
                <Trophy size={14} /> Classements
              </Link>
              <Link href="/user/sessions" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold">
                <Flame size={14} /> Mes séances
              </Link>
            </div>
          </div>

          {/* tier progress */}
          <div className="lg:w-80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">{tierLabel(ME.tier)}</span>
              <span className="text-muted">→ {next ? tierLabel(next.tier) : "Maxed"}</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-white/5 overflow-hidden ring-1 ring-white/10">
              <div className="h-full flame-gradient" style={{ width: `${Math.min(100, tierProgress)}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-muted">
              <span>{compact(ME.totalPoints)} pts</span>
              {next && <span>{compact(next.min)} pts</span>}
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Timer size={16} />} label="Minutes (cette sem.)" value={minutesToHm(ME.weekMinutes)} hint="objectif 300 min" trend={18.2} />
        <Stat icon={<Zap size={16} />} label="Points (cette sem.)" value={compact(ME.weekPoints)} hint="bonus inclus" trend={12.6} />
        <Stat icon={<Flame size={16} />} label="Streak" value={`${ME.streak}j`} hint="record perso 51j" />
        <Stat icon={<Crown size={16} />} label="Rang mondial" value={`#${myWorldRank}`} hint={`#${myClubRank} dans ton club`} trend={4.0} />
      </div>

      {/* Chart + bonus courses */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          title="Tes minutes de la semaine"
          subtitle="Chaque minute compte. Pas la performance — la régularité."
          right={<Pill color="war">+{compact(ME.weekPoints)} pts</Pill>}
        >
          <MinutesChart data={weekData} />
        </Card>

        <Card
          title="Cours bonus de ton club"
          subtitle="Tape dans le multiplicateur quand il est chaud."
          right={<Link href="/user/sessions" className="text-xs text-flame font-bold hover:underline inline-flex items-center gap-1">Tout voir <ArrowRight size={12} /></Link>}
        >
          <div className="space-y-3">
            {bonusCourses.map(c => (
              <div key={c.id} className="rounded-xl bg-white/5 p-3 hover:bg-white/10 transition">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-[11px] text-muted">{c.schedule} · {c.coachName}</p>
                  </div>
                  <Pill color="flame">×{c.bonusMultiplier}</Pill>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
                  <Timer size={12} /> {c.durationMin} min
                  <span>·</span>
                  <span>{c.bookings}/{c.capacity} inscrits</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Leaderboards preview + recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          title="Classement ton club — cette semaine"
          subtitle={`${ME.clubName}`}
          right={<Link href="/user/leaderboard" className="text-xs text-flame font-bold hover:underline inline-flex items-center gap-1">Mondial & ligues <ArrowRight size={12} /></Link>}
        >
          <Leaderboard
            users={getClubLeaderboard(ME.clubId, 6)}
            pointKey="weekPoints"
            showClub={false}
          />
        </Card>

        <Card
          title="Dernières séances"
          subtitle="Tes 5 dernières"
        >
          <div className="space-y-2">
            {recentSessions.map(s => (
              <div key={s.id} className="rounded-xl bg-white/5 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{s.courseName}</p>
                    <p className="text-[11px] text-muted">{relativeDate(s.date)} · {s.coachName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-flame text-sm">+{s.pointsBase + s.pointsBonus}</p>
                    <p className="text-[10px] text-muted">{s.durationMin} min</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Badges */}
      <Card title="Tes badges" subtitle="Récompenses débloquées" right={<Pill color="gold"><Award size={11} className="mr-1" />{ME.badges.length} badges</Pill>}>
        <div className="flex flex-wrap gap-2">
          {ME.badges.map(b => (
            <span key={b} className="inline-flex items-center gap-1 rounded-full bg-flame/10 ring-1 ring-flame/30 px-3 py-1 text-sm font-semibold text-flame">
              {b}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1 text-sm font-medium text-muted">
            <Target size={12} /> 6 prochains à débloquer
          </span>
        </div>
      </Card>
    </div>
  );
}
