import { MY_TERRITORY, MY_CLUB } from "../lib/mock";
import { compact } from "../lib/format";
import { MapPin, TrendingUp, TrendingDown, Minus, Users } from "lucide-react";

export function TerritoryBanner({ scope = "user" }: { scope?: "user" | "club" }) {
  const t = MY_TERRITORY;
  const me = t.rivals.find(r => r.brand === MY_CLUB.brand) ?? t.rivals[1];
  const leader = t.rivals[0];
  const gap = leader.weekPoints - me.weekPoints;
  const isLeader = me.clubName === leader.clubName;

  return (
    <section className="relative rounded-3xl overflow-hidden ring-1 ring-white/10">
      {/* Background — formes organiques douces, plus une carte tactique */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 flame-gradient opacity-[0.08]" />
        <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 800 320" preserveAspectRatio="none">
          {/* Bulles colorées flottantes — pas de grille militaire */}
          <circle cx="120" cy="80" r="60" fill="currentColor" className="text-flame" opacity="0.18">
            <animate attributeName="cy" values="80;110;80" dur="9s" repeatCount="indefinite" />
          </circle>
          <circle cx="680" cy="60" r="90" fill="currentColor" className="text-war" opacity="0.14">
            <animate attributeName="cy" values="60;95;60" dur="11s" repeatCount="indefinite" />
          </circle>
          <circle cx="500" cy="250" r="70" fill="currentColor" className="text-gold" opacity="0.16">
            <animate attributeName="cx" values="500;540;500" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="220" r="50" fill="currentColor" className="text-cyan" opacity="0.14">
            <animate attributeName="cy" values="220;200;220" dur="8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-flame font-bold">
          <MapPin size={12} /> Notre quartier · {t.zone}, {t.city}
        </div>

        <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          {scope === "user" ? "Nous, c'est " : ""}<span className="flame-text">{MY_CLUB.name}</span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl">
          {isLeader
            ? <>On porte le {t.zone} en tête. {t.rivals[1]?.clubName} suit à <strong className="text-white">{compact(me.weekPoints - t.rivals[1].weekPoints)} pts</strong>. Continuons ensemble.</>
            : <>#{t.myClubRank} sur {t.totalClubsInZone} clubs du {t.zone}. <strong className="text-white">{leader.clubName}</strong> est devant de <strong className="flame-text">{compact(gap)} pts</strong>. {scope === "user" ? "Chaque minute compte." : "L'équipe est mobilisable."}</>
          }
        </p>

        {/* Scoreboard du quartier — convivial */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {t.rivals.slice(0, 4).map((r, i) => {
            const isMine = r.brand === MY_CLUB.brand;
            return (
              <div
                key={r.clubName}
                className={`rounded-2xl p-3 ring-1 transition ${
                  isMine
                    ? "bg-flame/15 ring-flame/40 shadow-glowFlame"
                    : i === 0
                    ? "bg-white/10 ring-white/15"
                    : "bg-white/5 ring-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl grid place-items-center font-black text-xs ${isMine ? "flame-gradient text-black" : "bg-white/10 text-white"}`}>
                    {r.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold truncate flex items-center gap-1">
                      #{i + 1} {r.brand}
                      {isMine && <span className="text-[9px] text-flame font-bold">· nous</span>}
                    </p>
                    <p className="text-[10px] text-white/50 truncate">{r.members.toLocaleString("fr-FR")} membres</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-black flame-text text-base">{compact(r.weekPoints)}</span>
                  {r.trend > 0 && <span className="text-success inline-flex items-center gap-0.5"><TrendingUp size={10} />+{r.trend}</span>}
                  {r.trend < 0 && <span className="text-danger inline-flex items-center gap-0.5"><TrendingDown size={10} />{r.trend}</span>}
                  {r.trend === 0 && <span className="text-white/40 inline-flex items-center"><Minus size={10} /></span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-2 text-[12px] text-white/60">
          <Users size={13} className="text-flame" />
          {scope === "user"
            ? "Tes minutes nourrissent le score du club. On joue ensemble, à notre rythme."
            : "Active des bonus pour mobiliser ta communauté. Pas un combat — une dynamique de quartier."}
        </div>
      </div>
    </section>
  );
}
