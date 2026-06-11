"use client";

import { useMemo, useState } from "react";
import { Card, Pill, Stat } from "../../../components/Card";
import { getClubLeaderboard, MY_CLUB, USERS, ME } from "../../../lib/mock";
import { compact, minutesToHm, tierBg, tierLabel } from "../../../lib/format";
import { Search, Users, Filter, AlertTriangle, Sparkles } from "lucide-react";

export default function MembersPage() {
  const allMembers = useMemo(() => {
    const list = USERS.filter(u => u.clubId === MY_CLUB.id);
    return [ME, ...list];
  }, []);

  const [q, setQ] = useState("");
  const [tier, setTier] = useState<string>("ALL");

  const filtered = allMembers.filter(u => {
    if (q && !u.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (tier !== "ALL" && u.tier !== tier) return false;
    return true;
  }).sort((a, b) => b.weekPoints - a.weekPoints);

  const atRisk = allMembers.filter(u => u.weekMinutes < 30).length;
  const champions = allMembers.filter(u => u.weekMinutes > 240).length;

  return (
    <div className="space-y-6">
      <header>
        <Pill color="cyan">Membres</Pill>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
          {allMembers.length} <span className="flame-text">membres</span> dans la communauté
        </h1>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Users size={16} />} label="Total membres" value={allMembers.length} />
        <Stat icon={<Sparkles size={16} />} label="Champions sem." value={champions} hint="≥ 4h cette sem" />
        <Stat icon={<AlertTriangle size={16} />} label="À risque" value={atRisk} hint="< 30 min cette sem" />
        <Stat label="Rétention" value={`${Math.round(MY_CLUB.retentionRate * 100)}%`} hint="90j glissants" trend={2.7} />
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2">
            <Search size={16} className="text-muted" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Rechercher un membre…"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-white/10 overflow-x-auto scrollbar-thin">
            <Filter size={14} className="text-muted ml-2" />
            {["ALL", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "LEGEND"].map(t => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  tier === t ? "bg-war text-white" : "text-muted hover:text-white"
                }`}
              >
                {t === "ALL" ? "Tous" : tierLabel(t)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted border-b border-border">
                <th className="py-2 px-2">Membre</th>
                <th className="py-2 px-2">Tier</th>
                <th className="py-2 px-2 text-right">Min. sem.</th>
                <th className="py-2 px-2 text-right">Pts sem.</th>
                <th className="py-2 px-2 text-right">Streak</th>
                <th className="py-2 px-2 text-right">Total pts</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-white/5">
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="grid place-items-center w-8 h-8 rounded-lg bg-white/10 font-bold text-xs">{u.avatar}</div>
                      <div>
                        <p className="font-semibold">{u.name}{u.id === "me" && <span className="ml-1 text-[10px] text-war font-bold">TOI</span>}</p>
                        <p className="text-[10px] text-muted">{u.countryCode} {u.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${tierBg(u.tier)}`}>
                      {tierLabel(u.tier)}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right font-medium">{minutesToHm(u.weekMinutes)}</td>
                  <td className="py-2 px-2 text-right font-bold text-flame">{u.weekPoints}</td>
                  <td className="py-2 px-2 text-right">{u.streak}j</td>
                  <td className="py-2 px-2 text-right font-bold">{compact(u.totalPoints)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 100 && <p className="mt-3 text-xs text-muted text-center">100 premiers résultats affichés sur {filtered.length}</p>}
      </Card>
    </div>
  );
}
