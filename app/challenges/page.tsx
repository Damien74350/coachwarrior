import { Card, Pill, Stat } from "../../components/Card";
import { ChallengeCard } from "../../components/ChallengeCard";
import { CHALLENGES, PAST_CHALLENGES, totalDonationsThisMonth, findSponsor, findCause } from "../../lib/mock";
import { compact } from "../../lib/format";
import { Heart, Trophy, Globe2, Users, Coins, Sparkles } from "lucide-react";

export default function ChallengesPage() {
  const live = CHALLENGES.filter(c => c.status === "live" || c.status === "ongoing-won");
  const past = PAST_CHALLENGES;
  const totals = totalDonationsThisMonth();
  const totalMembers = CHALLENGES.reduce((s, c) => s + c.participatingMembers, 0);
  const totalMinutes = CHALLENGES.reduce((s, c) => s + c.currentMinutes, 0);

  return (
    <div className="space-y-8">
      <header className="relative rounded-3xl overflow-hidden ring-1 ring-flame/30 p-6 sm:p-10">
        <div className="absolute inset-0 flame-gradient opacity-10" />
        <div className="absolute inset-0 grain opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-flame font-bold">
            <Heart size={11} /> Défis sponsorisés WARfit
          </div>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Ta sueur, <span className="flame-text">leur cause</span>.
          </h1>
          <p className="mt-4 text-muted max-w-2xl text-lg">
            Chaque mois, des marques s'engagent à verser une somme à une association
            si la ville atteint un objectif collectif de minutes d'effort.
            Tes 30 minutes deviennent des repas, des soins, des hectares de forêt.
          </p>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <HeroStat label="Défis en cours" value={live.length} sub={`${live[0]?.city} · ${live[0]?.region}`} icon={<Sparkles size={14} />} />
            <HeroStat label="Membres mobilisés" value={compact(totalMembers)} sub="ce mois-ci" icon={<Users size={14} />} />
            <HeroStat label="Minutes accumulées" value={compact(totalMinutes)} sub="effort total" icon={<Trophy size={14} />} />
            <HeroStat
              label="Déjà reversé / Engagé"
              value={`${(totals.eur / 1000).toFixed(0)}k €`}
              sub={`+ ${totals.chf.toLocaleString("fr-FR")} CHF + ${(totals.jpy / 1_000_000).toFixed(1)}M ¥`}
              icon={<Coins size={14} />}
            />
          </div>
        </div>
      </header>

      <section>
        <header className="flex items-end justify-between mb-5 gap-4">
          <div>
            <Pill color="flame">En cours · ce mois</Pill>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black">5 villes, 5 causes, 5 sponsors</h2>
          </div>
          <p className="text-xs text-muted max-w-sm hidden sm:block text-right">
            Chaque ville se bat séparément. Compteurs en direct.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {live.map(c => <ChallengeCard key={c.id} challenge={c} />)}
        </div>
      </section>

      <Card title="L'inter-villes — qui va le plus loin ?" subtitle="Le défi mondial caché : la ville qui dépasse le plus son objectif gagne un trophée WARfit Cup">
        <ol className="space-y-2">
          {[...CHALLENGES].map(c => ({
            c, ratio: c.currentMinutes / c.targetMinutes,
          })).sort((a, b) => b.ratio - a.ratio).map(({ c, ratio }, i) => {
            const sponsor = findSponsor(c.sponsorId)!;
            const cause = findCause(c.causeId)!;
            return (
              <li key={c.id} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                <div className={`w-8 text-center font-black ${i === 0 ? "text-flame" : "text-muted"}`}>#{i + 1}</div>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="w-7 h-7 rounded-md grid place-items-center text-[10px] text-white font-black" style={{ background: sponsor.color }}>{sponsor.logo}</div>
                  <span className="text-xs text-muted">×</span>
                  <div className="w-7 h-7 rounded-md grid place-items-center bg-white/10 text-sm">{cause.emoji}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{c.city}</p>
                  <p className="text-[10px] text-muted truncate">{sponsor.name} → {cause.short}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-flame text-sm">{(ratio * 100).toFixed(0)}%</p>
                  <p className="text-[10px] text-muted">{compact(c.currentMinutes)} min</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <section>
        <header className="mb-5">
          <Pill color="cyan">Historique · mois dernier</Pill>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black">Ce qui a été débloqué</h2>
          <p className="text-sm text-muted mt-1">85 000 € + 18 000 CHF reversés en mai. Sans WARfit, ces dons n'existeraient pas.</p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {past.map(c => <ChallengeCard key={c.id} challenge={c} compactMode />)}
        </div>
      </section>

      <section className="rounded-3xl ring-1 ring-flame/30 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 flame-gradient opacity-10" />
        <div className="relative grid lg:grid-cols-2 gap-6 items-center">
          <div>
            <Pill color="war">Pour les marques</Pill>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black">Vous voulez sponsoriser le prochain défi ?</h3>
            <p className="mt-2 text-sm text-muted">
              Visibilité dans les clubs de toute la ville · stories de milliers de membres ·
              communiqué fin de mois · data anonymisée des athlètes mobilisés.
              ROI imbattable, impact réel.
            </p>
            <button className="mt-4 px-5 py-2.5 rounded-xl flame-gradient text-black font-bold shadow-glow">
              Devenir sponsor
            </button>
          </div>
          <div className="glass-strong rounded-2xl p-5">
            <p className="text-xs text-muted">Exemple — défi standard</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between"><span>Engagement sponsor</span><strong>20 000 CHF</strong></li>
              <li className="flex justify-between"><span>Membres exposés</span><strong>4 800+</strong></li>
              <li className="flex justify-between"><span>Clubs partenaires</span><strong>14</strong></li>
              <li className="flex justify-between"><span>Durée</span><strong>1 mois</strong></li>
              <li className="flex justify-between text-flame"><span>Coût par membre touché</span><strong>4,16 CHF</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value, sub, icon }: { label: string; value: any; sub: string; icon: any }) {
  return (
    <div className="rounded-2xl bg-black/30 ring-1 ring-white/10 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
        <span className="text-flame">{icon}</span>
      </div>
      <p className="mt-1 text-2xl sm:text-3xl font-black flame-text">{value}</p>
      <p className="text-[11px] text-muted mt-0.5">{sub}</p>
    </div>
  );
}
