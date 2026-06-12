"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Pill, Stat } from "../../components/Card";
import {
  INTERNAL_LEAGUES, MY_INTERNAL_LEAGUE, findInternalLeague,
  getInternalLeagueStandings, COACHES, COURSES,
} from "../../lib/mock";
import { compact, tierBg } from "../../lib/format";
import {
  Crown, Trophy, ArrowRight, Sparkles, Lock, CheckCircle2,
  TrendingUp, Users, Zap, ShieldCheck, ChevronRight, Star,
} from "lucide-react";

export default function LeaguesPage() {
  const [selectedLeagueId, setSelectedLeagueId] = useState(MY_INTERNAL_LEAGUE.currentLeagueId);
  const myLeague = findInternalLeague(MY_INTERNAL_LEAGUE.currentLeagueId)!;
  const nextLeague = MY_INTERNAL_LEAGUE.nextLeagueId ? findInternalLeague(MY_INTERNAL_LEAGUE.nextLeagueId) : undefined;
  const selected = findInternalLeague(selectedLeagueId)!;
  const standings = getInternalLeagueStandings(selectedLeagueId, 12);
  const promotedCoach = COACHES.find(c => c.id === selected.promoteCoachId);
  const promotedCourse = COURSES.find(c => c.id === selected.promoteCourseId);

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden ring-1 ring-flame/30 p-6 sm:p-10">
        <div className="absolute inset-0 flame-gradient opacity-[0.10]" />
        <div className="absolute inset-0 grain opacity-20" />
        <div className="relative">
          <Pill color="flame">Ligues internes — Par niveau</Pill>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-[1.05]">
            <span className="flame-text">5 ligues</span> dans ton club.<br />
            Chacun joue dans sa division.
          </h1>
          <p className="mt-4 text-foreground/70 max-w-2xl text-base sm:text-lg">
            La mamie de 68 ans concourt avec ses pairs. L'athlète de 25 ans aussi. Personne n'est ridiculisé,
            personne n'est démotivé. <strong className="text-foreground">La régularité ouvre les portes — la performance s'ajoute en haut.</strong>
          </p>
        </div>
      </section>

      {/* MA LIGUE — bandeau personnel proéminent */}
      <section className="rounded-3xl ring-2 ring-flame/40 p-5 sm:p-6" style={{ background: `linear-gradient(135deg, ${myLeague.color}15, transparent)` }}>
        <div className="flex flex-col lg:flex-row gap-5 items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl grid place-items-center text-5xl ring-2 ring-flame/40 shadow-glow" style={{ background: myLeague.color + "30" }}>
              {myLeague.emoji}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-flame font-bold">Ta ligue actuelle</p>
              <p className="font-black text-3xl sm:text-4xl mt-1">
                Ligue <span style={{ color: myLeague.color }}>{myLeague.name}</span>
              </p>
              <p className="text-sm italic text-foreground/70 mt-1">« {myLeague.motto} »</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <Pill color="flame"><Crown size={10} className="mr-1" />#{MY_INTERNAL_LEAGUE.rank}/{MY_INTERNAL_LEAGUE.totalInLeague}</Pill>
                <Pill color="muted">{MY_INTERNAL_LEAGUE.daysInLeague}j dans cette ligue</Pill>
                {MY_INTERNAL_LEAGUE.pastLeagueIds.length > 0 && (
                  <Pill color="gold">{MY_INTERNAL_LEAGUE.pastLeagueIds.length} ligues atteintes</Pill>
                )}
              </div>
            </div>
          </div>

          {/* Promotion vers la suivante */}
          {nextLeague && (
            <div className="w-full lg:w-96 rounded-2xl bg-overlay/5 ring-1 ring-overlay/10 p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold">Promotion vers</span>
                <span className="inline-flex items-center gap-1 font-black" style={{ color: nextLeague.color }}>
                  {nextLeague.emoji} {nextLeague.name} <ArrowRight size={12} />
                </span>
              </div>
              <div className="h-3 rounded-full bg-overlay/10 overflow-hidden ring-1 ring-overlay/10">
                <div className="h-full transition-all" style={{ width: `${MY_INTERNAL_LEAGUE.progressToNextPct}%`, background: nextLeague.color }} />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted">
                <span>{MY_INTERNAL_LEAGUE.progressToNextPct}% atteint</span>
                <span>{nextLeague.weeklyMinutesMin} min/sem requises</span>
              </div>
              <p className="mt-3 text-[11px] text-foreground/70">
                Tiens encore <strong className="text-flame">2 semaines à {nextLeague.weeklyMinutesMin}+ min/sem</strong> et tu montes automatiquement.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LADDER — vue d'ensemble des 5 ligues */}
      <Card title="L'échelle des 5 ligues" subtitle="Clique pour explorer chaque division">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {INTERNAL_LEAGUES.map(l => {
            const isMine = l.id === myLeague.id;
            const isPast = MY_INTERNAL_LEAGUE.pastLeagueIds.includes(l.id);
            const isLocked = l.level > myLeague.level && !isPast;
            const isSelected = l.id === selectedLeagueId;

            return (
              <button
                key={l.id}
                onClick={() => setSelectedLeagueId(l.id)}
                className={`relative rounded-2xl p-4 text-left transition ring-1 ${
                  isSelected ? "ring-flame/60 shadow-glow" : "ring-overlay/15 hover:ring-overlay/30"
                }`}
                style={{ background: isSelected ? `${l.color}25` : `${l.color}10` }}
              >
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{l.emoji}</div>
                  {isMine && <Pill color="flame">Toi</Pill>}
                  {isPast && !isMine && <Pill color="success"><CheckCircle2 size={9} className="mr-1" />Passé</Pill>}
                  {isLocked && <Lock size={14} className="text-muted" />}
                </div>
                <p className="mt-3 text-[9px] uppercase tracking-wider text-muted font-bold">Niveau {l.level}</p>
                <p className="font-black text-lg" style={{ color: l.color }}>{l.name}</p>
                <p className="text-[10px] text-foreground/60 mt-1 line-clamp-1">{l.motto}</p>

                <div className="mt-3 pt-3 border-t border-overlay/10 flex items-center justify-between text-[10px] text-muted">
                  <span>{l.weeklyMinutesMin}{l.weeklyMinutesMax ? `–${l.weeklyMinutesMax}` : "+"} min/sem</span>
                  <span className="inline-flex items-center gap-0.5"><Users size={9} />{l.membersInClub}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* DÉTAIL ligue sélectionnée */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2"
          title={
            <span className="flex items-center gap-2">
              <span className="text-2xl">{selected.emoji}</span>
              <span>Ligue {selected.name}</span>
              <span style={{ color: selected.color }}>·</span>
              <span className="text-sm font-normal italic text-muted">{selected.motto}</span>
            </span>
          }
          subtitle={selected.description}
          right={<Pill color="flame">{selected.membersInClub} membres</Pill>}
        >
          {/* Composition des points */}
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Composition du score dans cette ligue</p>
            <div className="h-4 rounded-full bg-overlay/10 overflow-hidden flex ring-1 ring-overlay/10">
              <div className="h-full bg-flame transition-all flex items-center justify-center text-[10px] font-black text-white" style={{ width: `${selected.weights.regularity}%` }}>
                {selected.weights.regularity > 15 && `${selected.weights.regularity}%`}
              </div>
              {selected.weights.diversity > 0 && (
                <div className="h-full bg-cyan transition-all flex items-center justify-center text-[10px] font-black text-white" style={{ width: `${selected.weights.diversity}%` }}>
                  {selected.weights.diversity > 10 && `${selected.weights.diversity}%`}
                </div>
              )}
              {selected.weights.performance > 0 && (
                <div className="h-full bg-plasma transition-all flex items-center justify-center text-[10px] font-black text-white" style={{ width: `${selected.weights.performance}%` }}>
                  {selected.weights.performance > 10 && `${selected.weights.performance}%`}
                </div>
              )}
              {selected.weights.impact > 0 && (
                <div className="h-full bg-gold transition-all flex items-center justify-center text-[10px] font-black text-foreground" style={{ width: `${selected.weights.impact}%` }}>
                  {selected.weights.impact > 5 && `${selected.weights.impact}%`}
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-[10px]">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-flame" />Régularité</span>
              {selected.weights.diversity > 0 && <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan" />Diversité</span>}
              {selected.weights.performance > 0 && <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-plasma" />Performance</span>}
              {selected.weights.impact > 0 && <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold" />Impact</span>}
            </div>
          </div>

          {/* Classement de la ligue */}
          <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-2">Top de la ligue cette semaine</p>
          <div className="space-y-1.5">
            {standings.map(s => (
              <div key={s.rank} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${s.isMe ? "bg-flame/10 ring-1 ring-flame/30" : "bg-overlay/5"}`}>
                <div className={`w-7 text-center font-black ${s.rank <= 3 ? "text-flame" : "text-muted"}`}>
                  {s.rank <= 3 && <Crown size={12} className="inline -mt-0.5" />} #{s.rank}
                </div>
                <div className="grid place-items-center w-8 h-8 rounded-lg bg-overlay/10 text-xs font-bold">{s.avatar}</div>
                <div className="flex-1 flex items-center gap-2 text-sm">
                  <span>{s.flag}</span>
                  <span className="font-semibold truncate">{s.name}</span>
                </div>
                <p className="font-black text-flame">{s.weekPoints}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* SIDEBAR: coach + cours recommandés par le club */}
        <div className="space-y-6">
          {promotedCoach && (
            <Card title={<span className="flex items-center gap-2"><Star size={14} className="text-flame" />Coach de cette ligue</span>} subtitle="Promu par ton club">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl flame-gradient grid place-items-center text-black font-black shrink-0">{promotedCoach.avatar}</div>
                <div className="min-w-0">
                  <p className="font-black truncate">{promotedCoach.name}</p>
                  <p className="text-xs text-flame font-bold">{promotedCoach.specialty}</p>
                  <p className="text-[11px] text-muted mt-1">{promotedCoach.sessions} séances · ⭐ {promotedCoach.rating.toFixed(2)}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-foreground/70">{promotedCoach.bio}</p>
              <button className="mt-3 w-full px-3 py-2 rounded-lg bg-flame/15 text-flame ring-1 ring-flame/30 text-xs font-bold">
                Réserver une séance
              </button>
            </Card>
          )}

          {promotedCourse && (
            <Card title={<span className="flex items-center gap-2"><Sparkles size={14} className="text-flame" />Cours adapté</span>} subtitle="Pensé pour ta ligue">
              <p className="font-black">{promotedCourse.name}</p>
              <p className="text-[11px] text-muted mt-1">{promotedCourse.schedule} · {promotedCourse.coachName}</p>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-muted">{promotedCourse.bookings}/{promotedCourse.capacity} inscrits</span>
                {promotedCourse.bonusMultiplier > 1 && <Pill color="flame">×{promotedCourse.bonusMultiplier}</Pill>}
              </div>
              <button className="mt-3 w-full px-3 py-2 rounded-lg flame-gradient text-black text-xs font-bold">
                M'inscrire
              </button>
            </Card>
          )}
        </div>
      </div>

      {/* PHILOSOPHIE */}
      <Card title="Pourquoi 5 ligues" subtitle="Notre philosophie">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {[
            { icon: ShieldCheck, title: "Tu n'es jamais rétrogradé de force", text: "Même si tu lèves le pied, tu gardes ta ligue. Tu ne peux QUE descendre volontairement." },
            { icon: TrendingUp, title: "Promotion automatique", text: "2 semaines au-dessus du seuil → tu montes. Notification de fête, badges, public reveal." },
            { icon: Trophy, title: "Ton historique reste à vie", text: "« J'ai été Élite en 2026 » reste sur ton profil pour toujours, même si tu redescends." },
            { icon: Zap, title: "Mission adaptée par ligue", text: "Tes missions War Pass s'adaptent à ta ligue. Aucune frustration." },
            { icon: Star, title: "Coach dédié par ligue", text: "Le club te recommande LE coach qui te correspond. Plus pertinent que tout Apple Fitness." },
            { icon: Crown, title: "Tournoi tous niveaux mensuel", text: "Une fois par mois, toutes les ligues s'affrontent — mais sur critères différents. Cohésion." },
          ].map(o => (
            <div key={o.title} className="rounded-xl bg-overlay/5 p-4">
              <o.icon size={18} className="text-flame mb-2" />
              <p className="font-bold">{o.title}</p>
              <p className="text-xs text-muted mt-1">{o.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Lien vers ligues inter-clubs */}
      <Link href="/club/leagues" className="block">
        <div className="rounded-2xl bg-overlay/5 ring-1 ring-overlay/10 p-5 hover:ring-flame/30 transition flex items-center justify-between">
          <div>
            <Pill color="cyan">Tu cherches autre chose ?</Pill>
            <p className="mt-2 font-bold">Voir les ligues inter-clubs et internationales</p>
            <p className="text-xs text-muted">Ton club vs autres clubs · ligues régionales · WARfit Cup mondiale</p>
          </div>
          <ChevronRight size={20} />
        </div>
      </Link>
    </div>
  );
}
