import Link from "next/link";
import { Flame, Trophy, Timer, Zap, ArrowRight, Crown, Award, Target, Heart, Activity, Plug, CheckCircle2, Shield } from "lucide-react";
import { Card, Stat, Pill } from "../../components/Card";
import { MinutesChart } from "../../components/MinutesChart";
import { Leaderboard } from "../../components/Leaderboard";
import { CheckinButton } from "../../components/CheckinButton";
import { SeasonBadge } from "../../components/SeasonBadge";
import { TerritoryBanner } from "../../components/TerritoryBanner";
import { ChallengeBanner } from "../../components/ChallengeBanner";
import {
  ME, MY_SESSIONS, COURSES, HEALTH_SOURCES,
  getClubLeaderboard, getFriendsLeaderboard, getNeighborhoodLeaderboard,
} from "../../lib/mock";
import { compact, minutesToHm, tierLabel, tierBg, relativeDate } from "../../lib/format";

export default function UserDashboard() {
  const weekData = (() => {
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const totals = [54, 60, 0, 75, 45, 90, 62];
    return days.map((day, i) => ({ day, minutes: totals[i] }));
  })();

  const friendsLb = getFriendsLeaderboard();
  const neighLb = getNeighborhoodLeaderboard(50);
  const clubLb = getClubLeaderboard(ME.clubId, 50);
  const friendsRank = friendsLb.findIndex(u => u.id === "me") + 1;
  const neighRank = neighLb.findIndex(u => u.id === "me") + 1;
  const clubRank = clubLb.findIndex(u => u.id === "me") + 1;

  const bonusCourses = COURSES.filter(c => c.bonusMultiplier > 1).slice(0, 3);
  const recentSessions = MY_SESSIONS.slice(0, 4);
  const connectedSources = HEALTH_SOURCES.filter(s => s.connected);
  const autoMinutesShare = connectedSources.reduce((s, x) => s + (x.minutesContribWeek ?? 0), 0);

  const tierThresholds = [
    { tier: "BRONZE", min: 0 }, { tier: "SILVER", min: 1500 },
    { tier: "GOLD", min: 5000 }, { tier: "PLATINUM", min: 12000 },
    { tier: "DIAMOND", min: 25000 }, { tier: "LEGEND", min: 50000 },
  ];
  const currentIdx = tierThresholds.findIndex(t => t.tier === ME.tier);
  const next = tierThresholds[currentIdx + 1];
  const tierProgress = next
    ? ((ME.totalPoints - tierThresholds[currentIdx].min) / (next.min - tierThresholds[currentIdx].min)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* #1 — IDENTITÉ DE TERRITOIRE (on, avant moi) */}
      <TerritoryBanner scope="user" />

      {/* #2 — DÉFI SPONSORISÉ EN COURS */}
      <ChallengeBanner />

      {/* #3 — Action rapide : check-in */}
      <section className="glass-strong rounded-3xl p-5 sm:p-6 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flame-gradient grid place-items-center text-black shrink-0">
            <Flame size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill color="flame">Salut, {ME.name.split(" ")[0]} ⚔️</Pill>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${tierBg(ME.tier)}`}>
                Tier {tierLabel(ME.tier)}
              </span>
              <SeasonBadge compact />
            </div>
            <p className="mt-2 font-black text-xl">
              <span className="flame-text">{ME.streak} jours</span> de streak. Continue.
            </p>
            <p className="text-xs text-muted">
              Tu contribues <strong className="text-white">{compact(ME.weekPoints)} pts</strong> au score du club cette semaine.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckinButton />
        </div>
      </section>

      {/* #4 — KPIs perso */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Timer size={16} />} label="Minutes (cette sem.)" value={minutesToHm(ME.weekMinutes)} hint="objectif 300 min" trend={18.2} />
        <Stat icon={<Zap size={16} />} label="Points (cette sem.)" value={compact(ME.weekPoints)} hint="saison en cours" trend={12.6} />
        <Stat icon={<Flame size={16} />} label="Streak" value={`${ME.streak}j`} hint="record perso 51j" />
        <Stat icon={<Shield size={16} />} label="Apport au club" value={`#${clubRank}`} hint={`sur ${clubLb.length} membres`} trend={4.0} />
      </div>

      {/* #5 — Chart + Sources */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          title="Tes minutes de la semaine"
          subtitle="Saisie zéro — capteurs + check-in QR"
          right={<Pill color="war">+{compact(ME.weekPoints)} pts</Pill>}
        >
          <MinutesChart data={weekData} />
        </Card>

        <Card
          title="Sources connectées"
          subtitle="Tout est compté, rien à saisir"
          right={<Link href="/user/profile" className="text-xs text-flame font-bold hover:underline">Gérer</Link>}
        >
          <div className="space-y-2">
            {HEALTH_SOURCES.map(s => (
              <div key={s.id} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${s.connected ? "bg-success/5 ring-1 ring-success/20" : "bg-white/5"}`}>
                <div className={`w-8 h-8 rounded-lg grid place-items-center ${s.connected ? "bg-success/20 text-success" : "bg-white/10 text-muted"}`}>
                  {s.connected ? <CheckCircle2 size={16} /> : <Plug size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{s.label}</p>
                  <p className="text-[10px] text-muted">
                    {s.connected ? `Sync il y a ${s.lastSyncMin}min · ${s.minutesContribWeek} min cette sem.` : "Non connecté"}
                  </p>
                </div>
                {!s.connected && <button className="text-[10px] font-bold text-flame hover:underline">Connecter</button>}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted">
            <span className="text-flame font-bold">{autoMinutesShare} min</span> détectées auto cette semaine.
          </p>
        </Card>
      </div>

      {/* #6 — Classements LOCAUX */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card title={<span className="flex items-center gap-2"><Heart size={14} className="text-flame" />Mes amis</span>} subtitle={`#${friendsRank} sur ${friendsLb.length}`}>
          <Leaderboard users={friendsLb} pointKey="weekPoints" showClub={false} showCountry={false} />
        </Card>
        <Card title={<span className="flex items-center gap-2"><Activity size={14} className="text-flame" />Mon quartier</span>} subtitle={`${ME.city} · #${neighRank}`}>
          <Leaderboard users={neighLb.slice(0, 6)} pointKey="weekPoints" showClub={false} showCountry={false} />
        </Card>
        <Card
          title={<span className="flex items-center gap-2"><Trophy size={14} className="text-flame" />Mon club</span>}
          subtitle={`${ME.clubName} · #${clubRank}`}
          right={<Link href="/user/leaderboard" className="text-xs text-flame font-bold hover:underline inline-flex items-center gap-1">Plus <ArrowRight size={12} /></Link>}
        >
          <Leaderboard users={clubLb.slice(0, 6)} pointKey="weekPoints" showClub={false} showCountry={false} />
        </Card>
      </div>

      {/* #7 — Bonus + dernières séances */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          title="Cours bonus de ton club"
          subtitle="Tape dans le multiplicateur quand il est chaud"
          right={<Link href="/user/sessions" className="text-xs text-flame font-bold hover:underline inline-flex items-center gap-1">Mes séances <ArrowRight size={12} /></Link>}
        >
          <div className="grid sm:grid-cols-3 gap-3">
            {bonusCourses.map(c => (
              <div key={c.id} className="rounded-xl bg-white/5 p-3 hover:bg-white/10 transition ring-1 ring-flame/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-[11px] text-muted">{c.schedule} · {c.coachName}</p>
                  </div>
                  <Pill color="flame">×{c.bonusMultiplier}</Pill>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
                  <Timer size={12} /> {c.durationMin} min · {c.bookings}/{c.capacity}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Dernières séances">
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

      {/* #8 — Tier + badges (le perso, en bas) */}
      <Card title="Ton parcours perso" subtitle="Tier à vie · badges débloqués" right={<Pill color="gold"><Award size={11} className="mr-1" />{ME.badges.length} badges</Pill>}>
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="lg:w-80 w-full">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">{tierLabel(ME.tier)}</span>
              <span className="text-muted">→ {next ? tierLabel(next.tier) : "Maxed"}</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-white/5 overflow-hidden ring-1 ring-white/10">
              <div className="h-full flame-gradient" style={{ width: `${Math.min(100, tierProgress)}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-muted">
              <span>{compact(ME.totalPoints)} pts à vie</span>
              {next && <span>{compact(next.min)} pts</span>}
            </div>
          </div>
          <div className="flex-1 flex flex-wrap gap-2">
            {ME.badges.map(b => (
              <span key={b} className="inline-flex items-center gap-1 rounded-full bg-flame/10 ring-1 ring-flame/30 px-3 py-1 text-sm font-semibold text-flame">{b}</span>
            ))}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1 text-sm font-medium text-muted">
              <Target size={12} /> 6 prochains à débloquer
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
