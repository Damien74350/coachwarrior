import { Card, Pill, Stat } from "../../../components/Card";
import { ME, MY_CLUB, COACHES } from "../../../lib/mock";
import { compact, minutesToHm, tierLabel, tierBg } from "../../../lib/format";
import { Crown, Flame, MapPin, Building2, Calendar, Award, Star } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const joinedDays = Math.floor((Date.now() - new Date(ME.joinedAt).getTime()) / 86400000);
  return (
    <div className="space-y-6">
      <header>
        <Pill color="war">Profil</Pill>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
          {ME.name}
        </h1>
        <p className="mt-1 text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="inline-flex items-center gap-1">{ME.countryCode} {ME.city}</span>
          <span className="inline-flex items-center gap-1"><Building2 size={13} /> {ME.clubName}</span>
          <span className="inline-flex items-center gap-1"><Calendar size={13} /> Membre depuis {joinedDays}j</span>
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Identité de combat">
          <div className="flex items-start gap-5">
            <div className="grid place-items-center w-20 h-20 rounded-2xl flame-gradient text-black text-2xl font-black shrink-0">
              {ME.avatar}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${tierBg(ME.tier)}`}>
                  <Crown size={11} className="mr-1 -mt-px" /> Tier {tierLabel(ME.tier)}
                </span>
                <Pill color="flame"><Flame size={11} className="mr-1" />Streak {ME.streak}j</Pill>
              </div>
              <p className="mt-3 text-sm text-muted">
                Athlète déterminé. La régularité est ton arme. Tu cumules <strong className="text-foreground">{compact(ME.totalPoints)} pts</strong> à vie,
                soit <strong className="text-foreground">{minutesToHm(ME.totalMinutes)}</strong> d'effort réel.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ME.badges.map(b => (
                  <span key={b} className="inline-flex items-center gap-1 rounded-full bg-flame/10 ring-1 ring-flame/30 px-3 py-1 text-xs font-semibold text-flame">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Stats à vie" subtitle="Le bilan total">
          <div className="space-y-3">
            <Row label="Minutes totales" value={minutesToHm(ME.totalMinutes)} />
            <Row label="Points totaux" value={compact(ME.totalPoints)} />
            <Row label="Streak actuel" value={`${ME.streak} j`} />
            <Row label="Badges" value={ME.badges.length.toString()} />
            <Row label="Pays / ville" value={`${ME.countryCode} ${ME.city}`} />
          </div>
        </Card>
      </div>

      <Card title={`Coachs de ${MY_CLUB.name}`} subtitle="Ta team de combat" right={<Link href="/club/coaches" className="text-xs text-flame font-bold hover:underline">Voir tous</Link>}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COACHES.slice(0, 3).map(c => (
            <div key={c.id} className="rounded-xl bg-overlay/5 p-4 hover:bg-overlay/10 transition">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center w-12 h-12 rounded-xl bg-flame/20 text-flame font-black">
                  {c.avatar}
                </div>
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-[11px] text-muted">{c.specialty}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-gold"><Star size={12} fill="currentColor" /> {c.rating.toFixed(1)}</span>
                <span className="text-muted">·</span>
                <span className="text-muted">{c.sessions} séances</span>
              </div>
              {c.badges.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.badges.map(b => (
                    <span key={b} className="text-[10px] rounded-full bg-overlay/5 ring-1 ring-overlay/10 px-2 py-0.5">{b}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Préférences" subtitle="Personnalise ton expérience">
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            "Recevoir notifs des cours bonus de mon club",
            "Activer rappel streak quotidien",
            "Afficher mon nom dans les classements publics",
            "Recevoir le récap hebdo par email",
          ].map(t => (
            <label key={t} className="flex items-center gap-3 rounded-xl bg-overlay/5 p-3 ring-1 ring-overlay/10 cursor-pointer hover:bg-overlay/10">
              <input type="checkbox" defaultChecked className="accent-war w-4 h-4" />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
