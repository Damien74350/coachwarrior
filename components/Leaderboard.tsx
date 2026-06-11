import { User } from "../lib/types";
import { compact, tierBg, tierLabel } from "../lib/format";
import { Crown } from "lucide-react";

export function Leaderboard({
  users,
  meId = "me",
  pointKey = "totalPoints",
  showCountry = true,
  showClub = true,
}: {
  users: User[];
  meId?: string;
  pointKey?: "totalPoints" | "weekPoints";
  showCountry?: boolean;
  showClub?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {users.map((u, i) => {
        const rank = i + 1;
        const me = u.id === meId;
        const podium = rank <= 3;
        return (
          <div
            key={u.id}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
              me ? "bg-war/10 ring-1 ring-war/30" : "bg-overlay/5 hover:bg-overlay/10"
            }`}
          >
            <div className={`w-8 text-center font-black ${podium ? "text-flame" : "text-muted"}`}>
              {podium ? <Crown size={16} className="inline -mt-1" /> : null} #{rank}
            </div>
            <div className="grid place-items-center w-9 h-9 rounded-lg bg-overlay/10 font-bold text-xs">
              {u.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold truncate">{u.name}</span>
                {me && <span className="text-[10px] uppercase font-bold text-war">toi</span>}
              </div>
              <div className="text-[11px] text-muted flex items-center gap-2 truncate">
                {showCountry && <span>{u.countryCode} {u.city}</span>}
                {showClub && <span className="truncate">· {u.clubName}</span>}
              </div>
            </div>
            <span className={`hidden sm:inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${tierBg(u.tier)}`}>
              {tierLabel(u.tier)}
            </span>
            <div className="text-right min-w-[72px]">
              <p className="font-black text-flame">{compact(u[pointKey])}</p>
              <p className="text-[10px] text-muted">{pointKey === "weekPoints" ? "pts sem." : "pts total"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
