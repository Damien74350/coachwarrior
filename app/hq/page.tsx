"use client";

import { useState } from "react";
import { Card, Pill, Stat } from "../../components/Card";
import { GROUPS_HQ, MY_GROUP, FRANCE_CITY_PINS, GROUP_CHALLENGES } from "../../lib/mock";
import { compact } from "../../lib/format";
import { Building2, Crown, Swords, Trophy, TrendingUp, TrendingDown, Minus, Coins, Zap, Users, MapPin, ArrowRight, Sparkles } from "lucide-react";
import type { CityPin } from "../../lib/types";

export default function HQPage() {
  const [hoveredCity, setHoveredCity] = useState<CityPin | null>(null);
  const sortedGroups = [...GROUPS_HQ].sort((a, b) => b.monthMinutes - a.monthMinutes);
  const liveDuels = GROUP_CHALLENGES.filter(c => c.status === "live");
  const myDuel = liveDuels.find(d => d.challenger === MY_GROUP.brand || d.challenged === MY_GROUP.brand);

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <Pill color="war">Siège — Headquarters</Pill>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            La guerre des <span className="flame-text">chaînes</span>
          </h1>
          <p className="mt-2 text-muted max-w-2xl">
            Bienvenue {MY_GROUP.ceoName}. {MY_GROUP.clubsCount} clubs {MY_GROUP.brand} en France. C'est le moment de prouver qui domine.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl flame-gradient text-black font-bold shadow-glow">
          <Swords size={16} /> Défier une chaîne
        </button>
      </header>

      {/* KPIs siège */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Crown size={16} />} label="Rang National" value={`#${MY_GROUP.rankNational}`} hint={`sur ${GROUPS_HQ.length} chaînes`} trend={MY_GROUP.trend} />
        <Stat icon={<Users size={16} />} label="Membres totaux" value={compact(MY_GROUP.membersCount)} hint={`${MY_GROUP.clubsCount} clubs`} />
        <Stat icon={<Zap size={16} />} label="Minutes mois" value={compact(MY_GROUP.monthMinutes)} hint="effort collectif" trend={8.2} />
        <Stat icon={<Coins size={16} />} label="War Coins" value={compact(MY_GROUP.warCoinsBudget - MY_GROUP.warCoinsSpent)} hint={`/${compact(MY_GROUP.warCoinsBudget)} budget`} />
      </div>

      {/* DÉFI NATIONAL EN COURS */}
      {myDuel && (
        <Card title={<span className="flex items-center gap-2"><Swords size={16} className="text-flame" />Défi NATIONAL en cours</span>} subtitle="Tout le pays regarde" right={<Pill color="war">LIVE</Pill>}>
          <NationalDuelView duel={myDuel} />
        </Card>
      )}

      {/* CARTE DE FRANCE */}
      <Card title="Carte de France · ta domination en temps réel" subtitle="Chaque ville colore selon la chaîne dominante en minutes ce mois">
        <div className="relative">
          <FranceMap pins={FRANCE_CITY_PINS} onHover={setHoveredCity} hovered={hoveredCity} />
          {hoveredCity && <CityTooltip city={hoveredCity} />}
        </div>
        <Legend />
      </Card>

      {/* CLASSEMENT INTER-CHAÎNES */}
      <Card title="Classement national · ce mois" subtitle="Qui mobilise le plus de minutes en France" right={<Pill color="flame">Top {GROUPS_HQ.length}</Pill>}>
        <div className="space-y-2">
          {sortedGroups.map((g, i) => {
            const isMine = g.id === MY_GROUP.id;
            return (
              <div key={g.id} className={`rounded-2xl p-4 ring-1 transition ${isMine ? "bg-flame/10 ring-flame/40" : "bg-overlay/5 ring-overlay/10 hover:ring-overlay/20"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 text-center font-black ${i === 0 ? "text-gold" : "text-muted"}`}>
                    {i === 0 ? <Crown size={18} className="inline -mt-1" /> : null} #{i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl grid place-items-center font-black text-white text-sm" style={{ background: g.color }}>
                    {g.brand.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black truncate flex items-center gap-2">
                      {g.brand}
                      {isMine && <span className="text-[10px] text-flame font-bold">· toi</span>}
                    </p>
                    <p className="text-[11px] text-muted">{g.ceoName} · {g.ceoTitle} · {g.clubsCount} clubs · {compact(g.membersCount)} membres</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black flame-text text-lg">{compact(g.monthMinutes)}</p>
                    <p className="text-[10px] text-muted">min ce mois</p>
                  </div>
                </div>
                {g.trophies.length > 0 && (
                  <div className="mt-2 ml-12 flex flex-wrap gap-1.5">
                    {g.trophies.map(t => (
                      <span key={t.name} className="text-[10px] rounded-full bg-gold/10 ring-1 ring-gold/30 px-2 py-0.5 text-gold font-semibold">
                        {t.emoji} {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* AUTRES DÉFIS NATIONAUX */}
      {liveDuels.length > 1 && (
        <Card title="Autres défis nationaux en cours" subtitle="Tout le pays s'affronte">
          <div className="grid sm:grid-cols-2 gap-4">
            {liveDuels.filter(d => !myDuel || d.id !== myDuel.id).map(d => (
              <MiniDuel key={d.id} duel={d} />
            ))}
          </div>
        </Card>
      )}

      {/* ACTIONS STRATÉGIQUES POUR LE PDG */}
      <Card title="Tes leviers stratégiques" subtitle="En tant que siège, tu peux orchestrer la guerre">
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: Zap, title: "Booster une ville", desc: "Mets 10k war coins pour ×2 sur tous tes clubs de Marseille pendant 7j", color: "flame" as const },
            { icon: Swords, title: "Défier une chaîne", desc: "Lance un défi national 30j contre un concurrent. Mobilise toute ta base.", color: "war" as const },
            { icon: Sparkles, title: "Sponsoriser un défi local", desc: "Soutiens un de tes clubs en duel — visibilité presse + récompense", color: "gold" as const },
            { icon: Trophy, title: "Lancer une compétition interne", desc: "Tes clubs s'affrontent entre eux — révèle tes étoiles", color: "plasma" as const },
            { icon: Users, title: "Récompenser les MVP", desc: "Distribue des badges premium aux top membres de la chaîne", color: "cyan" as const },
            { icon: Coins, title: "Partenariat sponsor", desc: "Connecte ta chaîne à un sponsor pour le prochain défi national", color: "flame" as const },
          ].map(a => (
            <button key={a.title} className="text-left rounded-2xl bg-overlay/5 ring-1 ring-overlay/10 p-4 hover:ring-flame/30 transition">
              <div className={`w-9 h-9 rounded-lg bg-${a.color}/15 text-${a.color} grid place-items-center mb-3`}>
                <a.icon size={18} />
              </div>
              <p className="font-bold text-sm">{a.title}</p>
              <p className="text-[11px] text-muted mt-1">{a.desc}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FranceMap({ pins, onHover, hovered }: { pins: CityPin[]; onHover: (p: CityPin | null) => void; hovered: CityPin | null }) {
  return (
    <svg viewBox="0 0 600 700" className="w-full" style={{ maxHeight: 700 }}>
      <defs>
        <linearGradient id="france-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--c-cyan))" stopOpacity="0.04" />
          <stop offset="100%" stopColor="rgb(var(--c-flame))" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id="city-pulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(var(--c-flame))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgb(var(--c-flame))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outline France simplifiée (forme approximée) */}
      <path
        d="M 280 40 Q 350 60 380 90 Q 440 80 470 130 Q 510 180 510 230 Q 530 280 520 340
           Q 530 400 510 440 Q 510 500 480 540 Q 470 590 440 620 Q 400 650 360 660
           Q 320 680 280 670 Q 240 660 200 650 Q 170 620 160 580 Q 140 540 130 490
           Q 110 440 110 380 Q 100 320 130 270 Q 150 220 180 180 Q 200 130 230 90 Q 250 60 280 40 Z"
        fill="url(#france-grad)"
        stroke="currentColor"
        className="text-overlay"
        strokeOpacity="0.25"
        strokeWidth="2"
      />

      {/* Borders subtle regions */}
      <g stroke="currentColor" className="text-overlay" strokeOpacity="0.10" strokeWidth="1" fill="none" strokeDasharray="3 3">
        <path d="M 130 270 Q 300 250 510 230" />
        <path d="M 140 540 Q 300 480 510 440" />
        <path d="M 280 40 Q 280 350 280 660" />
      </g>

      {/* City pins */}
      {pins.map(p => {
        const isHovered = hovered?.city === p.city;
        const totalMinutes = p.brands.reduce((s, b) => s + b.minutes, 0);
        const size = Math.max(18, Math.min(48, Math.sqrt(totalMinutes / 10_000)));
        const dominantBrand = p.brands.find(b => b.brand === p.dominant)!;

        return (
          <g
            key={p.city}
            transform={`translate(${p.x}, ${p.y})`}
            onMouseEnter={() => onHover(p)}
            onMouseLeave={() => onHover(null)}
            style={{ cursor: "pointer" }}
          >
            {isHovered && <circle r={size + 12} fill="url(#city-pulse)" />}

            {/* Pie chart of brands */}
            <PieChart brands={p.brands} radius={size / 2} />

            {/* Dominant color outline */}
            <circle r={size / 2} fill="none" stroke={dominantBrand.color} strokeWidth={isHovered ? 3 : 2} />

            {/* City label */}
            <g transform={`translate(0, ${size / 2 + 14})`}>
              <text textAnchor="middle" fontSize="11" fontWeight="900" fill="rgb(var(--c-fg))">{p.city}</text>
              <text textAnchor="middle" y="12" fontSize="9" fill="rgb(var(--c-muted))">{compact(totalMinutes)} min</text>
            </g>
          </g>
        );
      })}

      {/* Title bar in corner */}
      <g transform="translate(20, 30)">
        <text fontSize="11" fontWeight="900" fill="rgb(var(--c-fg))" letterSpacing="2">FRANCE · DOMINATION CHAÎNES</text>
        <text y="18" fontSize="9" fill="rgb(var(--c-muted))">Pie chart = répartition des minutes par chaîne dans la ville</text>
      </g>
    </svg>
  );
}

function PieChart({ brands, radius }: { brands: CityPin["brands"]; radius: number }) {
  const total = brands.reduce((s, b) => s + b.minutes, 0);
  let cumAngle = -Math.PI / 2;
  return (
    <g>
      {brands.map((b, i) => {
        const slice = (b.minutes / total) * 2 * Math.PI;
        const x1 = Math.cos(cumAngle) * radius;
        const y1 = Math.sin(cumAngle) * radius;
        const x2 = Math.cos(cumAngle + slice) * radius;
        const y2 = Math.sin(cumAngle + slice) * radius;
        const large = slice > Math.PI ? 1 : 0;
        const d = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
        cumAngle += slice;
        return <path key={i} d={d} fill={b.color} opacity="0.85" />;
      })}
    </g>
  );
}

function CityTooltip({ city }: { city: CityPin }) {
  return (
    <div className="absolute top-4 right-4 glass-strong rounded-2xl p-4 w-64 shadow-glow ring-1 ring-flame/30">
      <p className="text-[10px] uppercase tracking-wider text-flame font-bold flex items-center gap-1">
        <MapPin size={11} /> {city.city}
      </p>
      <p className="font-black text-base mt-1">Domine : <span style={{ color: city.brands.find(b => b.brand === city.dominant)?.color }}>{city.dominant}</span></p>
      <div className="mt-3 space-y-1.5">
        {city.brands.sort((a, b) => b.minutes - a.minutes).map(b => (
          <div key={b.brand} className="flex items-center gap-2 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
            <span className="flex-1 font-semibold">{b.brand}</span>
            <span className="text-muted">{b.clubs} clubs</span>
            <span className="font-bold flame-text">{compact(b.minutes)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px]">
      {GROUPS_HQ.map(g => (
        <span key={g.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-overlay/5 ring-1 ring-overlay/10">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
          <span className="font-bold">{g.brand}</span>
        </span>
      ))}
    </div>
  );
}

function NationalDuelView({ duel }: { duel: any }) {
  const total = duel.challengerMinutes + duel.challengedMinutes;
  const myShare = duel.challenger === MY_GROUP.brand
    ? (duel.challengerMinutes / total) * 100
    : (duel.challengedMinutes / total) * 100;
  const myMinutes = duel.challenger === MY_GROUP.brand ? duel.challengerMinutes : duel.challengedMinutes;
  const rivalMinutes = duel.challenger === MY_GROUP.brand ? duel.challengedMinutes : duel.challengerMinutes;
  const rivalName = duel.challenger === MY_GROUP.brand ? duel.challenged : duel.challenger;
  const daysLeft = Math.max(0, Math.ceil((new Date(duel.endsAt).getTime() - Date.now()) / 86400000));
  const rivalGroup = GROUPS_HQ.find(g => g.brand === rivalName)!;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl grid place-items-center font-black text-white text-base" style={{ background: MY_GROUP.color }}>
            {MY_GROUP.brand.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="text-xs text-muted">Toi</p>
            <p className="font-black">{MY_GROUP.brand}</p>
            <p className="text-[11px] text-flame font-bold">{compact(myMinutes)} min</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black flame-text">VS</p>
          <p className="text-[10px] text-muted">{daysLeft}j restants</p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-muted text-right">Adversaire</p>
            <p className="font-black text-right">{rivalName}</p>
            <p className="text-[11px] font-bold text-right">{compact(rivalMinutes)} min</p>
          </div>
          <div className="w-14 h-14 rounded-2xl grid place-items-center font-black text-white text-base" style={{ background: rivalGroup.color }}>
            {rivalName.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
          </div>
        </div>
      </div>

      <div className="h-4 rounded-full bg-overlay/10 overflow-hidden flex ring-1 ring-overlay/10">
        <div className="h-full transition-all" style={{ width: `${myShare}%`, background: MY_GROUP.color }} />
        <div className="h-full transition-all" style={{ width: `${100 - myShare}%`, background: rivalGroup.color }} />
      </div>

      <div className="mt-3 grid sm:grid-cols-3 gap-3 text-[11px]">
        <div className="rounded-xl bg-overlay/5 p-2.5">
          <p className="text-muted">Pot war coins</p>
          <p className="font-black text-flame text-base mt-0.5">{compact(duel.warCoinPot)} 🪙</p>
        </div>
        <div className="rounded-xl bg-overlay/5 p-2.5">
          <p className="text-muted">Membres mobilisés</p>
          <p className="font-black text-foreground text-base mt-0.5">{compact(duel.participatingMembers)}</p>
        </div>
        <div className="rounded-xl bg-overlay/5 p-2.5">
          <p className="text-muted">Clubs en lice</p>
          <p className="font-black text-foreground text-base mt-0.5">{duel.participatingClubs}</p>
        </div>
      </div>

      {duel.sponsor && (
        <div className="mt-3 rounded-xl bg-gold/10 ring-1 ring-gold/30 p-3 text-xs flex items-center gap-2">
          <Sparkles size={14} className="text-gold" />
          <span>Sponsor <strong className="text-gold">{duel.sponsor.name}</strong> ajoute <strong>{duel.sponsor.amount.toLocaleString("fr-FR")} {duel.sponsor.currency}</strong> au pot.</span>
        </div>
      )}

      <div className="mt-3 text-[11px] text-muted">
        <strong className="text-foreground">Enjeu :</strong> {duel.stake}
      </div>
    </div>
  );
}

function MiniDuel({ duel }: { duel: any }) {
  const challengerGroup = GROUPS_HQ.find(g => g.brand === duel.challenger)!;
  const challengedGroup = GROUPS_HQ.find(g => g.brand === duel.challenged)!;
  const total = duel.challengerMinutes + duel.challengedMinutes;
  const challengerShare = (duel.challengerMinutes / total) * 100;
  const daysLeft = Math.max(0, Math.ceil((new Date(duel.endsAt).getTime() - Date.now()) / 86400000));

  return (
    <div className="rounded-2xl bg-overlay/5 ring-1 ring-overlay/10 p-4 hover:ring-flame/30 transition">
      <div className="flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md grid place-items-center text-white text-[10px] font-black" style={{ background: challengerGroup.color }}>{challengerGroup.brand.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>
          <span className="font-bold">{duel.challenger}</span>
          <span className="text-muted">vs</span>
          <span className="font-bold">{duel.challenged}</span>
          <span className="w-6 h-6 rounded-md grid place-items-center text-white text-[10px] font-black" style={{ background: challengedGroup.color }}>{challengedGroup.brand.split(" ").map(w => w[0]).join("").slice(0, 2)}</span>
        </div>
        <span className="text-muted">{daysLeft}j</span>
      </div>
      <div className="h-2.5 rounded-full bg-overlay/10 overflow-hidden flex">
        <div className="h-full" style={{ width: `${challengerShare}%`, background: challengerGroup.color }} />
        <div className="h-full" style={{ width: `${100 - challengerShare}%`, background: challengedGroup.color }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-muted">{compact(duel.participatingMembers)} membres</span>
        <span className="font-bold text-flame">{compact(duel.warCoinPot)} 🪙 pot</span>
      </div>
    </div>
  );
}
