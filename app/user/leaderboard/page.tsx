"use client";

import { useState } from "react";
import { Card, Pill } from "../../../components/Card";
import { Leaderboard } from "../../../components/Leaderboard";
import { ME, MY_CLUB, getClubLeaderboard, getWorldLeaderboard, getWeeklyLeaderboard, USERS } from "../../../lib/mock";
import { Trophy, Globe2, Building2, MapPin } from "lucide-react";

type Scope = "club" | "city" | "country" | "world";
type Period = "week" | "all";

export default function LeaderboardPage() {
  const [scope, setScope] = useState<Scope>("club");
  const [period, setPeriod] = useState<Period>("week");

  const all = period === "week" ? getWeeklyLeaderboard(500) : getWorldLeaderboard(500);
  let list = all;
  if (scope === "club") list = (period === "week" ? getClubLeaderboard(ME.clubId, 200) : [...USERS, ME].filter(u => u.clubId === ME.clubId).sort((a, b) => b.totalPoints - a.totalPoints));
  if (scope === "city") list = all.filter(u => u.city === ME.city);
  if (scope === "country") list = all.filter(u => u.country === ME.country);

  const myRank = list.findIndex(u => u.id === "me") + 1;
  const pointKey = period === "week" ? "weekPoints" : "totalPoints";

  return (
    <div className="space-y-6">
      <header>
        <Pill color="war">Classements</Pill>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
          Ton rang. <span className="flame-text">Ta zone de combat.</span>
        </h1>
        <p className="mt-2 text-muted">
          Choisis la portée et la période. Le classement se met à jour en direct.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
          {([
            { v: "club", label: "Mon club", icon: Building2 },
            { v: "city", label: "Ma ville", icon: MapPin },
            { v: "country", label: "Mon pays", icon: MapPin },
            { v: "world", label: "Monde", icon: Globe2 },
          ] as { v: Scope; label: string; icon: any }[]).map(o => (
            <button
              key={o.v}
              onClick={() => setScope(o.v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                scope === o.v ? "bg-war text-white" : "text-muted hover:text-white"
              }`}
            >
              <o.icon size={13} /> {o.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
          {([
            { v: "week", label: "Cette semaine" },
            { v: "all", label: "Tout-temps" },
          ] as { v: Period; label: string }[]).map(o => (
            <button
              key={o.v}
              onClick={() => setPeriod(o.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                period === o.v ? "bg-flame text-black" : "text-muted hover:text-white"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <Card
        title={
          <span className="flex items-center gap-2">
            <Trophy size={16} className="text-flame" />
            {scope === "club" && `Classement — ${MY_CLUB.name}`}
            {scope === "city" && `Classement — ${ME.city}`}
            {scope === "country" && `Classement — ${ME.country}`}
            {scope === "world" && `Classement Mondial`}
          </span>
        }
        subtitle={
          myRank > 0 ? `Tu es ${myRank <= 3 ? "sur le podium 🔥" : `#${myRank} sur ${list.length}`}` : "Tu n'apparais pas dans ce classement"
        }
        right={<Pill color="flame">{period === "week" ? "Hebdo" : "Tout-temps"}</Pill>}
      >
        <Leaderboard
          users={list.slice(0, 50)}
          pointKey={pointKey}
        />
        {list.length > 50 && (
          <p className="mt-4 text-center text-xs text-muted">Top 50 affiché — {list.length} athlètes au total</p>
        )}
      </Card>
    </div>
  );
}
