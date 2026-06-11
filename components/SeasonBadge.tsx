import { CURRENT_SEASON } from "../lib/mock";
import { Snowflake, Trophy } from "lucide-react";

export function SeasonBadge({ compact: short = false }: { compact?: boolean }) {
  const end = new Date(CURRENT_SEASON.endsAt);
  const days = Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));

  if (short) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan/15 text-cyan ring-1 ring-cyan/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
        <Snowflake size={11} /> {CURRENT_SEASON.name} · J-{days}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-xl bg-cyan/10 ring-1 ring-cyan/30 px-3 py-2">
      <div className="grid place-items-center w-8 h-8 rounded-lg bg-cyan/20 text-cyan">
        <Snowflake size={16} />
      </div>
      <div>
        <p className="text-xs font-black">{CURRENT_SEASON.name}</p>
        <p className="text-[10px] text-muted flex items-center gap-1">
          <Trophy size={10} className="text-cyan" /> Fin dans {days} jours — classements actifs remis à zéro
        </p>
      </div>
    </div>
  );
}
