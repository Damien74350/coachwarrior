"use client";

import { useState } from "react";
import Link from "next/link";
import { MY_TERRITORY, MY_CLUB } from "../lib/mock";
import { compact } from "../lib/format";
import { Swords, MapPin, Crown, X, Users, Clock, Zap, ArrowRight } from "lucide-react";
import type { TerritoryRival } from "../lib/types";

export function TerritoryMap({ compact: isCompact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<TerritoryRival | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const myClubMatch = MY_TERRITORY.rivals.find(r => r.brand === MY_CLUB.brand)
    ?? MY_TERRITORY.rivals.find(r => r.brand === "Iron Republic")
    ?? MY_TERRITORY.rivals[1];
  const myBrand = myClubMatch.brand;
  const sortedByPoints = [...MY_TERRITORY.rivals].sort((a, b) => b.weekPoints - a.weekPoints);
  const myClub = myClubMatch;

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden ring-1 ring-overlay/10 glass">
        <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-5 flex items-start justify-between gap-3 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-overlay/40 backdrop-blur ring-1 ring-overlay/20 text-[10px] uppercase tracking-[0.18em] font-bold">
              <MapPin size={11} className="text-flame" /> {MY_TERRITORY.zone}, {MY_TERRITORY.city}
            </div>
            {!isCompact && (
              <p className="mt-2 font-black text-lg sm:text-xl drop-shadow">
                {MY_TERRITORY.totalClubsInZone} clubs · ton clan : <span className="flame-text">{MY_CLUB.name}</span>
              </p>
            )}
          </div>
          {isCompact && (
            <Link
              href="/map"
              className="pointer-events-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-overlay/30 backdrop-blur ring-1 ring-overlay/20 text-xs font-bold hover:bg-overlay/40"
            >
              Vue détaillée <ArrowRight size={11} />
            </Link>
          )}
        </div>

        <svg
          viewBox="0 0 800 500"
          className="w-full block"
          style={{ height: isCompact ? 360 : 520 }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-overlay" strokeOpacity="0.08" strokeWidth="1" />
            </pattern>
            <radialGradient id="my-pulse" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(var(--c-flame))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(var(--c-flame))" stopOpacity="0" />
            </radialGradient>
            <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.4" />
            </filter>
          </defs>

          <rect width="800" height="500" fill="url(#map-grid)" />

          {/* Canal / Seine */}
          <path d="M -20 320 Q 200 280 400 330 T 820 290" fill="none" stroke="rgb(var(--c-cyan))" strokeOpacity="0.35" strokeWidth="22" strokeLinecap="round" />
          <path d="M -20 320 Q 200 280 400 330 T 820 290" fill="none" stroke="rgb(var(--c-cyan))" strokeOpacity="0.6" strokeWidth="2" />

          {/* Streets */}
          <g stroke="currentColor" className="text-overlay" strokeOpacity="0.18" strokeWidth="1.5">
            <line x1="0" y1="120" x2="800" y2="100" />
            <line x1="0" y1="240" x2="800" y2="260" />
            <line x1="0" y1="420" x2="800" y2="400" />
            <line x1="180" y1="0" x2="200" y2="500" />
            <line x1="420" y1="0" x2="440" y2="500" />
            <line x1="640" y1="0" x2="660" y2="500" />
          </g>

          {/* Territory zones */}
          {MY_TERRITORY.rivals.filter(r => r.zone).map(r => {
            const isMine = r.brand === myBrand;
            const isHover = hover === r.brand;
            return (
              <path
                key={r.brand + "-zone"}
                d={r.zone}
                fill={r.color}
                fillOpacity={isMine ? 0.22 : isHover ? 0.18 : 0.10}
                stroke={r.color}
                strokeOpacity={isMine || isHover ? 0.7 : 0.3}
                strokeWidth={isMine ? 2.5 : 1.5}
                strokeDasharray={isMine ? "0" : "6 4"}
                className="transition-all"
              />
            );
          })}

          {/* Pulse under my club */}
          <circle cx={myClub.x} cy={myClub.y} r="60" fill="url(#my-pulse)">
            <animate attributeName="r" values="40;75;40" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
          </circle>

          {/* Club pins */}
          {sortedByPoints.map((r, i) => {
            const isMine = r.brand === myBrand;
            const isHover = hover === r.brand;
            const rank = i + 1;
            return (
              <g
                key={r.brand}
                transform={`translate(${r.x}, ${r.y})`}
                style={{ cursor: isMine ? "default" : "pointer" }}
                onMouseEnter={() => setHover(r.brand)}
                onMouseLeave={() => setHover(null)}
                onClick={() => { if (!isMine) setSelected(r); }}
                filter="url(#pin-shadow)"
              >
                <line x1="0" y1="0" x2="0" y2="30" stroke="rgb(var(--c-fg))" strokeOpacity="0.7" strokeWidth="2" />
                <g transform={`translate(0, -22) scale(${isMine || isHover ? 1.15 : 1})`} className="transition-transform">
                  <rect x="0" y="0" width="44" height="30" rx="3" fill={r.color} />
                  <text x="22" y="20" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{r.logo}</text>
                  {rank === 1 && (
                    <g transform="translate(34, -8)">
                      <circle r="9" fill="rgb(var(--c-gold))" />
                      <text textAnchor="middle" y="3" fontSize="9" fontWeight="900" fill="#000">1</text>
                    </g>
                  )}
                  {isMine && (
                    <g transform="translate(-2, -8)">
                      <circle r="9" fill="rgb(var(--c-flame))" />
                      <text textAnchor="middle" y="3" fontSize="9" fontWeight="900" fill="#fff">★</text>
                    </g>
                  )}
                </g>
                <circle cx="0" cy="30" r="5" fill={r.color} stroke="rgb(var(--c-fg))" strokeOpacity="0.8" strokeWidth="1.5" />
                <g transform="translate(0, 50)">
                  <rect x="-52" y="-10" width="104" height="34" rx="6" fill="rgb(var(--c-surface))" fillOpacity="0.95" stroke={r.color} strokeOpacity="0.5" />
                  <text x="0" y="2" textAnchor="middle" fontSize="9" fontWeight="700" fill="rgb(var(--c-fg))">{r.brand}</text>
                  <text x="0" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill={r.color}>{compact(r.weekPoints)} pts</text>
                </g>
              </g>
            );
          })}

          <g transform="translate(740, 60)" opacity="0.6">
            <circle r="18" fill="rgb(var(--c-surface))" fillOpacity="0.9" />
            <text textAnchor="middle" y="-6" fontSize="8" fontWeight="900" fill="rgb(var(--c-fg))">N</text>
            <text textAnchor="middle" y="14" fontSize="8" fill="rgb(var(--c-muted))">S</text>
          </g>
        </svg>

        <div className="absolute bottom-3 left-3 right-3 sm:left-5 sm:right-5 flex flex-wrap items-center gap-2 text-[10px]">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-overlay/30 backdrop-blur ring-1 ring-overlay/15">
            <span className="w-2 h-2 rounded-full bg-flame ring-1 ring-flame" /> Toi
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-overlay/30 backdrop-blur ring-1 ring-overlay/15">
            <Crown size={10} className="text-gold" /> Leader
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-overlay/30 backdrop-blur ring-1 ring-overlay/15">
            <Swords size={10} /> Clique un club pour le défier
          </span>
        </div>
      </div>

      {selected && <DefyModal rival={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function DefyModal({ rival, onClose }: { rival: TerritoryRival; onClose: () => void }) {
  const me = MY_TERRITORY.rivals.find(r => r.brand === MY_CLUB.brand)
    ?? MY_TERRITORY.rivals.find(r => r.brand === "Iron Republic")
    ?? MY_TERRITORY.rivals[1];
  const [duration, setDuration] = useState<3 | 7 | 14 | 30>(7);
  const [stake, setStake] = useState<"bragging" | "trophy" | "bonus" | "donation">("trophy");
  const [step, setStep] = useState<"setup" | "sent">("setup");

  const stakes = {
    bragging: { label: "Bragging rights", desc: "Le perdant affiche \"battu par X\" pendant 7j sur sa page club." },
    trophy:   { label: "Trophée hebdo + ×2 bonus", desc: "Le gagnant garde le trophée et ses membres reçoivent ×2 sur tous les cours pendant 7j." },
    bonus:    { label: "Pass premium", desc: "Le perdant offre 10 pass premium aux meilleurs membres du gagnant." },
    donation: { label: "Don à une cause", desc: "Le perdant verse 500€ à l'asso choisie par le gagnant." },
  };

  if (step === "sent") {
    return (
      <Overlay onClose={onClose}>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flame-gradient grid place-items-center text-black mb-3">
            <Swords size={28} />
          </div>
          <p className="text-2xl font-black">Défi envoyé ⚔️</p>
          <p className="text-sm text-muted mt-1">
            {rival.clubName} a 48h pour accepter. On te notifie dès qu'ils répondent.
          </p>
          <div className="mt-5 rounded-xl bg-flame/10 ring-1 ring-flame/30 p-3 text-left text-sm">
            <p className="font-bold">📣 Annonce automatique</p>
            <p className="text-xs text-muted mt-1">
              Tes {me.members.toLocaleString("fr-FR")} membres et les {rival.members.toLocaleString("fr-FR")} de {rival.brand} reçoivent un push notification.
            </p>
          </div>
          <button onClick={onClose} className="mt-5 w-full px-4 py-2.5 rounded-xl flame-gradient text-black font-bold">
            OK, c'est parti
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-flame font-bold flex items-center gap-1">
            <Swords size={10} /> Lancer un défi
          </p>
          <p className="font-black text-lg mt-1">vs {rival.clubName}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-overlay/10"><X size={18} /></button>
      </div>

      <div className="mt-3 grid grid-cols-3 items-center gap-2">
        <FaceCard name={MY_CLUB.name} brand={MY_CLUB.brand} color={me.color || "#fb923c"} logo={me.logo} points={me.weekPoints} members={me.members} isMine />
        <div className="text-center">
          <p className="text-2xl font-black flame-text">VS</p>
          <p className="text-[10px] text-muted mt-1">{Math.abs(me.weekPoints - rival.weekPoints).toLocaleString("fr-FR")} pts d'écart</p>
        </div>
        <FaceCard name={rival.clubName} brand={rival.brand} color={rival.color || "#999"} logo={rival.logo} points={rival.weekPoints} members={rival.members} />
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold mb-2 flex items-center gap-1.5"><Clock size={12} className="text-flame" /> Durée du défi</p>
        <div className="grid grid-cols-4 gap-1.5">
          {([3, 7, 14, 30] as const).map(d => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`py-2 rounded-lg text-xs font-bold transition ${
                duration === d ? "flame-gradient text-black shadow-glow" : "bg-overlay/5 text-muted hover:bg-overlay/10"
              }`}
            >
              {d} jours
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold mb-2 flex items-center gap-1.5"><Zap size={12} className="text-flame" /> Enjeu</p>
        <div className="space-y-1.5">
          {(Object.keys(stakes) as Array<keyof typeof stakes>).map(k => (
            <button
              key={k}
              onClick={() => setStake(k)}
              className={`w-full text-left rounded-xl p-3 transition ring-1 ${
                stake === k ? "bg-flame/10 ring-flame/40" : "bg-overlay/5 ring-overlay/10 hover:ring-overlay/20"
              }`}
            >
              <p className="text-sm font-bold">{stakes[k].label}</p>
              <p className="text-[11px] text-muted mt-0.5">{stakes[k].desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-overlay/5 p-3 text-[11px] text-muted">
        <p className="font-bold text-foreground mb-1">📜 Règle</p>
        Le club avec le plus de minutes cumulées (toutes activités, tous membres) sur les {duration} jours gagne. Le défi est public — visible par les deux communautés.
      </div>

      <button
        onClick={() => setStep("sent")}
        className="mt-5 w-full px-4 py-3 rounded-xl flame-gradient text-black font-black flex items-center justify-center gap-2 shadow-glow"
      >
        <Swords size={16} /> Envoyer le défi à {rival.brand}
      </button>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-strong rounded-3xl p-5 sm:p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto scrollbar-thin" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function FaceCard({ name, brand, color, logo, points, members, isMine = false }: {
  name: string; brand: string; color: string; logo: string; points: number; members: number; isMine?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-3 ring-1 ${isMine ? "ring-flame/40 bg-flame/10" : "ring-overlay/15 bg-overlay/5"}`}>
      <div className="w-10 h-10 rounded-xl grid place-items-center font-black text-white text-sm mx-auto" style={{ background: color }}>
        {logo}
      </div>
      <p className="mt-2 text-xs font-bold text-center truncate">{brand}</p>
      <p className="text-[10px] text-muted text-center truncate">{name.replace(brand, "").trim() || "—"}</p>
      <div className="mt-2 text-center">
        <p className="text-base font-black flame-text">{compact(points)}</p>
        <p className="text-[10px] text-muted flex items-center justify-center gap-1"><Users size={9} /> {members.toLocaleString("fr-FR")}</p>
      </div>
    </div>
  );
}
