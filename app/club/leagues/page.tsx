import { Card, Pill } from "../../../components/Card";
import { LEAGUES } from "../../../lib/mock";
import { compact, relativeDate } from "../../../lib/format";
import { Trophy, Globe2, Building2, MapPin, Crown, Gift, Plus } from "lucide-react";
import Link from "next/link";

const SCOPE_LABEL: Record<string, string> = {
  CLUB: "Club",
  GROUP: "Groupe",
  REGIONAL: "Régional",
  NATIONAL: "National",
  INTERNATIONAL: "International",
};

const SCOPE_ICON: Record<string, any> = {
  CLUB: Building2,
  GROUP: Trophy,
  REGIONAL: MapPin,
  NATIONAL: MapPin,
  INTERNATIONAL: Globe2,
};

export default function LeaguesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <Pill color="cyan">Ligues</Pill>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            <span className="flame-text">Compétitions</span> internes & inter-clubs
          </h1>
          <p className="mt-2 text-muted">
            Crée des ligues entre membres, entre clubs de ton groupe, régionales ou internationales.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl flame-gradient text-black font-bold">
          <Plus size={16} /> Nouvelle ligue
        </button>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        {LEAGUES.map(l => {
          const Icon = SCOPE_ICON[l.scope] || Trophy;
          return (
            <Card
              key={l.id}
              title={
                <span className="flex items-center gap-2">
                  <Icon size={16} className="text-flame" />
                  {l.name}
                </span>
              }
              subtitle={`${l.participants} ${l.participantType === "CLUB" ? "clubs" : "athlètes"} · Fin ${relativeDate(l.endsAt)}`}
              right={<Pill color="cyan">{SCOPE_LABEL[l.scope]}</Pill>}
            >
              {l.prizePool && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-gold/10 ring-1 ring-gold/30 px-3 py-2 text-xs">
                  <Gift size={14} className="text-gold" />
                  <span><strong className="text-gold">Prize pool : </strong>{l.prizePool}</span>
                </div>
              )}

              <ul className="space-y-1.5">
                {l.standings.slice(0, 6).map(s => {
                  const podium = s.rank <= 3;
                  return (
                    <li key={s.rank} className="flex items-center gap-3 rounded-lg bg-overlay/5 px-3 py-2">
                      <div className={`w-8 text-center font-black ${podium ? "text-flame" : "text-muted"}`}>
                        {podium ? <Crown size={14} className="inline -mt-1" /> : null} #{s.rank}
                      </div>
                      <div className="grid place-items-center w-9 h-9 rounded-lg bg-overlay/10 font-bold text-xs">
                        {s.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{s.name}</p>
                        <p className="text-[11px] text-muted truncate">{s.meta}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-flame text-sm">{compact(s.points)}</p>
                        <p className="text-[10px] text-muted">
                          {s.trend > 0 && <span className="text-success">▲ {s.trend}</span>}
                          {s.trend < 0 && <span className="text-danger">▼ {Math.abs(s.trend)}</span>}
                          {s.trend === 0 && <span>—</span>}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex items-center justify-between text-xs">
                <Link href="#" className="text-flame font-bold hover:underline">Voir le classement complet</Link>
                <span className="text-muted">{l.standings.length}+ participants</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card title="Idées de ligues à lancer" subtitle="Templates prêts à l'emploi">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Battle des coachs", desc: "Les coachs avec le plus de minutes générées par leurs cours s'affrontent.", color: "war" as const },
            { title: "Streak Survivor", desc: "Le membre qui tient la plus longue streak du mois gagne le pass premium.", color: "flame" as const },
            { title: "Femmes vs Hommes", desc: "Total minutes club par genre — fun, fédérateur.", color: "plasma" as const },
            { title: "Quartier vs Quartier", desc: "Membres regroupés par code postal — fierté locale.", color: "cyan" as const },
            { title: "Newcomers League", desc: "Réservée aux membres < 90j. Engagement précoce ×2.", color: "gold" as const },
            { title: "Marathon des cours", desc: "Plus tu testes de cours différents, plus tu marques.", color: "success" as const },
          ].map(t => (
            <div key={t.title} className="rounded-xl bg-overlay/5 p-4 hover:bg-overlay/10 transition">
              <Pill color={t.color}>Template</Pill>
              <h4 className="mt-2 font-bold">{t.title}</h4>
              <p className="mt-1 text-xs text-muted">{t.desc}</p>
              <button className="mt-3 text-xs font-bold text-flame hover:underline">Utiliser ce template →</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
