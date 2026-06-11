import { findSponsor, findCause } from "../lib/mock";
import { compact } from "../lib/format";
import { Pill } from "./Card";
import { Heart, Clock, Users, Trophy, CheckCircle2, XCircle } from "lucide-react";
import type { SponsoredChallenge } from "../lib/types";

export function ChallengeCard({ challenge, compactMode = false }: { challenge: SponsoredChallenge; compactMode?: boolean }) {
  const sponsor = findSponsor(challenge.sponsorId)!;
  const cause = findCause(challenge.causeId)!;
  const progress = Math.min(100, (challenge.currentMinutes / challenge.targetMinutes) * 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(challenge.endsAt).getTime() - Date.now()) / 86400000));
  const overshoot = challenge.currentMinutes > challenge.targetMinutes;

  const statusPill = (() => {
    if (challenge.status === "won") return <Pill color="success"><CheckCircle2 size={10} className="mr-1" />Remporté</Pill>;
    if (challenge.status === "ongoing-won") return <Pill color="success"><Trophy size={10} className="mr-1" />Objectif débloqué</Pill>;
    if (challenge.status === "missed") return <Pill color="muted"><XCircle size={10} className="mr-1" />Manqué</Pill>;
    return <Pill color="flame">En cours · {daysLeft}j</Pill>;
  })();

  return (
    <div className="glass rounded-2xl p-5 ring-1 ring-white/10 hover:ring-flame/40 transition">
      {/* Sponsor × Cause header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-xl grid place-items-center text-white font-black ring-1 ring-white/20" style={{ background: sponsor.color }}>
            {sponsor.logo}
          </div>
          <span className="text-lg font-black text-muted">×</span>
          <div className="w-11 h-11 rounded-xl grid place-items-center text-xl ring-1 ring-white/20 bg-white/10">
            {cause.emoji}
          </div>
        </div>
        {statusPill}
      </div>

      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-flame font-bold flex items-center gap-1">
        <Heart size={10} /> {challenge.city} · {challenge.region}
      </p>
      <h4 className="mt-1 font-black text-base leading-tight">
        {sponsor.name} <span className="text-muted font-normal">pour</span> {cause.short}
      </h4>

      {!compactMode && challenge.narrative !== "—" && (
        <p className="mt-2 text-xs text-muted italic">"{challenge.narrative}"</p>
      )}

      {/* Donation */}
      <div className="mt-3 rounded-xl bg-flame/10 ring-1 ring-flame/30 px-3 py-2">
        <p className="text-[10px] uppercase tracking-wider text-flame font-bold">Don débloqué si objectif atteint</p>
        <p className="text-2xl font-black flame-text mt-0.5">
          {challenge.donationAmount.toLocaleString("fr-FR")} {challenge.donationCurrency}
        </p>
        <p className="text-[10px] text-muted">→ {cause.name}</p>
      </div>

      {/* Gauge */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold">{compact(challenge.currentMinutes)} <span className="text-muted">/ {compact(challenge.targetMinutes)} min</span></span>
          <span className={`font-bold ${overshoot ? "text-success" : "text-flame"}`}>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-black/40 overflow-hidden ring-1 ring-white/10">
          <div className={`h-full ${challenge.status === "missed" ? "bg-muted/60" : overshoot ? "bg-success" : "flame-gradient"}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
        <span className="inline-flex items-center gap-1"><Users size={11} /> {challenge.participatingMembers.toLocaleString("fr-FR")} membres</span>
        <span className="inline-flex items-center gap-1"><Clock size={11} /> {challenge.participatingClubs} clubs</span>
      </div>
    </div>
  );
}
