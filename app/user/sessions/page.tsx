import { Card, Pill, Stat } from "../../../components/Card";
import { MY_SESSIONS, ME } from "../../../lib/mock";
import { compact, minutesToHm, relativeDate } from "../../../lib/format";
import { Flame, Timer, Zap, Calendar } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  CARDIO: "Cardio",
  STRENGTH: "Force",
  YOGA: "Yoga",
  BOXING: "Boxe",
  GROUP: "Cours collectif",
  SOLO: "Solo",
  PT: "Personal training",
};

const TYPE_COLOR: Record<string, "war" | "flame" | "gold" | "cyan" | "plasma" | "success" | "muted"> = {
  CARDIO: "war",
  STRENGTH: "flame",
  YOGA: "cyan",
  BOXING: "gold",
  GROUP: "plasma",
  SOLO: "muted",
  PT: "success",
};

export default function SessionsPage() {
  const totalMinutes = MY_SESSIONS.reduce((s, x) => s + x.durationMin, 0);
  const totalPoints = MY_SESSIONS.reduce((s, x) => s + x.pointsBase + x.pointsBonus, 0);
  const totalBonus = MY_SESSIONS.reduce((s, x) => s + x.pointsBonus, 0);
  const avgPerSession = Math.round(totalPoints / Math.max(1, MY_SESSIONS.length));

  return (
    <div className="space-y-6">
      <header>
        <Pill color="flame">Mes séances</Pill>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
          Chaque minute, <span className="flame-text">comptée</span>.
        </h1>
        <p className="mt-2 text-muted">L'historique brut de ce qui te fait monter au classement.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Calendar size={16} />} label="Séances (30j)" value={MY_SESSIONS.length} hint="rythme régulier" />
        <Stat icon={<Timer size={16} />} label="Total minutes" value={minutesToHm(totalMinutes)} hint={`${minutesToHm(ME.totalMinutes)} à vie`} />
        <Stat icon={<Zap size={16} />} label="Points cumulés" value={compact(totalPoints)} hint={`+${totalBonus} bonus`} />
        <Stat icon={<Flame size={16} />} label="Moy. / séance" value={avgPerSession} hint="pts" />
      </div>

      <Card title="Historique" subtitle="Plus récent en haut">
        <ul className="divide-y divide-border">
          {MY_SESSIONS.map(s => {
            const total = s.pointsBase + s.pointsBonus;
            return (
              <li key={s.id} className="py-3 flex items-center gap-4">
                <div className="grid place-items-center w-10 h-10 rounded-xl flame-gradient text-black shrink-0">
                  <Flame size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold truncate">{s.courseName}</p>
                    <Pill color={TYPE_COLOR[s.type]}>{TYPE_LABEL[s.type] ?? s.type}</Pill>
                  </div>
                  <p className="text-[11px] text-muted truncate">
                    {relativeDate(s.date)} · Coach {s.coachName} · {s.durationMin} min
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-flame">+{total} <span className="text-muted text-[10px]">pts</span></p>
                  {s.pointsBonus > 0 && (
                    <p className="text-[10px] text-gold">incl. +{s.pointsBonus} bonus</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
