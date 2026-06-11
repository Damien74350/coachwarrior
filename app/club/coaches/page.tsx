import { Card, Pill, Stat } from "../../../components/Card";
import { COACHES } from "../../../lib/mock";
import { Star, Users, Award, TrendingUp, Plus, Sparkles } from "lucide-react";

export default function CoachesPage() {
  const totalSessions = COACHES.reduce((s, c) => s + c.sessions, 0);
  const totalFollowers = COACHES.reduce((s, c) => s + c.followers, 0);
  const avgRating = COACHES.reduce((s, c) => s + c.rating, 0) / COACHES.length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <Pill color="cyan">Coachs</Pill>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            Mets tes coachs en <span className="flame-text">vitrine</span>
          </h1>
          <p className="mt-2 text-muted">Profils riches, spécialités, ratings. Tes coachs deviennent ta marque.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl flame-gradient text-black font-bold">
          <Plus size={16} /> Ajouter un coach
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Award size={16} />} label="Coachs actifs" value={COACHES.length} />
        <Stat icon={<TrendingUp size={16} />} label="Séances cumulées" value={totalSessions.toLocaleString("fr-FR")} hint="historique" />
        <Stat icon={<Users size={16} />} label="Followers totaux" value={totalFollowers.toLocaleString("fr-FR")} hint="visibilité" />
        <Stat icon={<Star size={16} />} label="Rating moyen" value={avgRating.toFixed(2)} hint="sur 5" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COACHES.map(c => (
          <Card key={c.id} className="hover:ring-1 hover:ring-flame/40 transition">
            <div className="flex items-start gap-4">
              <div className="grid place-items-center w-16 h-16 rounded-2xl flame-gradient text-black font-black text-xl shrink-0">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black truncate">{c.name}</h3>
                <p className="text-xs text-flame font-bold">{c.specialty}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-gold">
                    <Star size={12} fill="currentColor" /> {c.rating.toFixed(2)}
                  </span>
                  <span className="text-muted">·</span>
                  <span className="text-muted">{c.sessions} séances</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted leading-relaxed">{c.bio}</p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white/5 p-2">
                <p className="text-[10px] uppercase text-muted">Followers</p>
                <p className="font-bold mt-0.5">{c.followers}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-2">
                <p className="text-[10px] uppercase text-muted">Séances</p>
                <p className="font-bold mt-0.5">{c.sessions}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-2">
                <p className="text-[10px] uppercase text-muted">Rating</p>
                <p className="font-bold mt-0.5">{c.rating.toFixed(1)}</p>
              </div>
            </div>

            {c.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.badges.map(b => (
                  <span key={b} className="text-[10px] rounded-full bg-flame/10 text-flame ring-1 ring-flame/30 px-2 py-0.5 font-semibold">
                    {b}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold">
                Profil public
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-war/15 text-war ring-1 ring-war/30 text-xs font-bold">
                <Sparkles size={12} /> Mettre en avant
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
