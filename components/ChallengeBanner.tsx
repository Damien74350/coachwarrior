import Link from "next/link";
import { Heart, Clock, ArrowRight, Users } from "lucide-react";
import { MY_CHALLENGE, findSponsor, findCause } from "../lib/mock";
import { compact, relativeDate } from "../lib/format";

export function ChallengeBanner() {
  const c = MY_CHALLENGE;
  const sponsor = findSponsor(c.sponsorId)!;
  const cause = findCause(c.causeId)!;
  const progress = Math.min(100, (c.currentMinutes / c.targetMinutes) * 100);
  const remaining = Math.max(0, c.targetMinutes - c.currentMinutes);
  const daysLeft = Math.max(0, Math.ceil((new Date(c.endsAt).getTime() - Date.now()) / 86400000));

  return (
    <Link href="/challenges" className="block group">
      <section className="relative rounded-3xl overflow-hidden ring-1 ring-flame/40 hover:ring-flame/60 transition">
        <div className="absolute inset-0 flame-gradient opacity-15" />
        <div className="absolute inset-0 grain opacity-20" />

        <div className="relative p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Identity: sponsor × cause */}
            <div className="flex items-center gap-4 lg:w-80 lg:shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-14 h-14 rounded-2xl grid place-items-center text-white font-black text-lg ring-2 ring-white/20" style={{ background: sponsor.color }}>
                  {sponsor.logo}
                </div>
                <span className="text-2xl font-black text-muted">×</span>
                <div className="w-14 h-14 rounded-2xl grid place-items-center text-2xl ring-2 ring-white/20 bg-white/10">
                  {cause.emoji}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-flame font-bold flex items-center gap-1">
                  <Heart size={10} /> Défi sponsorisé · {c.city}
                </p>
                <p className="mt-1 font-black text-lg leading-tight">
                  {sponsor.name} <span className="text-muted font-normal">pour</span> {cause.short}
                </p>
              </div>
            </div>

            {/* Goal + gauge */}
            <div className="flex-1">
              <p className="text-sm text-muted">
                Si {c.city} atteint <strong className="text-white">{compact(c.targetMinutes)} minutes</strong> ce mois,{" "}
                <span className="font-black flame-text">{c.donationAmount.toLocaleString("fr-FR")} {c.donationCurrency}</span>{" "}
                seront reversés à <strong className="text-white">{cause.name}</strong>.
              </p>

              <div className="mt-4">
                <div className="flex items-end justify-between text-xs mb-1.5">
                  <span className="font-black text-2xl flame-text">{compact(c.currentMinutes)}<span className="text-muted text-base font-normal"> / {compact(c.targetMinutes)} min</span></span>
                  <span className="font-bold text-flame">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 rounded-full bg-black/40 overflow-hidden ring-1 ring-white/10">
                  <div className="h-full flame-gradient transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                  <span>Encore <strong className="text-white">{compact(remaining)} min</strong> à débloquer</span>
                  <span className="inline-flex items-center gap-1"><Clock size={11} /> {daysLeft}j restants</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted">
                <span className="inline-flex items-center gap-1"><Users size={11} /> {c.participatingMembers.toLocaleString("fr-FR")} membres mobilisés</span>
                <span>·</span>
                <span>{c.participatingClubs} clubs de {c.region} en lice</span>
                <span className="ml-auto inline-flex items-center gap-1 text-flame font-bold group-hover:underline">
                  Voir le défi <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Link>
  );
}
