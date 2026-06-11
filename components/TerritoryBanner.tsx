import { MY_TERRITORY, MY_CLUB } from "../lib/mock";
import { compact } from "../lib/format";
import { Shield, Swords, MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function TerritoryBanner({ scope = "user" }: { scope?: "user" | "club" }) {
  const t = MY_TERRITORY;
  const me = t.rivals.find(r => r.brand === MY_CLUB.brand) ?? t.rivals[1];
  const leader = t.rivals[0];
  const gap = leader.weekPoints - me.weekPoints;
  const isLeader = me.clubName === leader.clubName;

  return (
    <section className="relative rounded-3xl overflow-hidden ring-1 ring-white/10">
      {/* Background tactical map */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 flame-gradient opacity-10" />
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 320" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-flame" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Territory pulse */}
          <circle cx="640" cy="120" r="120" fill="currentColor" className="text-war" opacity="0.12">
            <animate attributeName="r" values="100;130;100" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="220" r="80" fill="currentColor" className="text-flame" opacity="0.08">
            <animate attributeName="r" values="70;95;70" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-flame font-bold">
          <MapPin size={11} /> Territoire · {t.zone}, {t.city}
        </div>

        <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          {scope === "user" ? "On est " : ""}<span className="flame-text">{MY_CLUB.name}</span>
        </h2>

        <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl">
          {isLeader
            ? <>On <strong className="text-white">domine</strong> le {t.zone}. {t.rivals[1]?.clubName} nous talonne à <strong className="text-war">{compact(me.weekPoints - t.rivals[1].weekPoints)} pts</strong>. On ne lâche rien.</>
            : <>#{t.myClubRank} sur {t.totalClubsInZone} clubs du {t.zone}. <strong className="text-war">{leader.clubName}</strong> nous devance de <strong className="text-flame">{compact(gap)} pts</strong>. {scope === "user" ? "Chaque minute compte." : "Mobilisez les membres."}</>
          }
        </p>

        {/* Battle scoreboard — top 4 du territoire */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {t.rivals.slice(0, 4).map((r, i) => {
            const isMine = r.brand === MY_CLUB.brand;
            return (
              <div
                key={r.clubName}
                className={`rounded-xl p-3 ring-1 ${
                  isMine
                    ? "bg-war/15 ring-war/40 shadow-glow"
                    : i === 0
                    ? "bg-flame/10 ring-flame/30"
                    : "bg-black/40 ring-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-lg grid place-items-center font-black text-xs ${isMine ? "flame-gradient text-black" : "bg-white/10"}`}>
                    {r.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate flex items-center gap-1">
                      #{i + 1} {r.brand}
                      {isMine && <Shield size={10} className="text-war shrink-0" />}
                    </p>
                    <p className="text-[10px] text-muted truncate">{r.members.toLocaleString("fr-FR")} membres</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-black flame-text text-base">{compact(r.weekPoints)}</span>
                  {r.trend > 0 && <span className="text-success inline-flex items-center gap-0.5"><TrendingUp size={10} />+{r.trend}</span>}
                  {r.trend < 0 && <span className="text-danger inline-flex items-center gap-0.5"><TrendingDown size={10} />{r.trend}</span>}
                  {r.trend === 0 && <span className="text-muted inline-flex items-center"><Minus size={10} /></span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-2 text-[11px] text-muted">
          <Swords size={12} className="text-war" />
          {scope === "user"
            ? "Tes minutes nourrissent le score du club. Tu joues pour ta tribu."
            : "Active des bonus pour mobiliser tes membres. C'est la guerre du quartier."}
        </div>
      </div>
    </section>
  );
}
