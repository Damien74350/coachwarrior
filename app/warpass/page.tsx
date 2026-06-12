"use client";

import { useState } from "react";
import { Card, Pill } from "../../components/Card";
import { MY_BATTLE_PASS, BATTLE_PASS_TIERS, BATTLE_PASS_MISSIONS, MY_WAR_COINS } from "../../lib/mock";
import { compact } from "../../lib/format";
import { Sparkles, Lock, Check, Zap, Crown, Target, Coins, Flame, Clock, Star } from "lucide-react";

export default function WarPassPage() {
  const [hasPremium, setHasPremium] = useState(MY_BATTLE_PASS.hasPremium);
  const currentLevel = MY_BATTLE_PASS.currentLevel;
  const progress = (MY_BATTLE_PASS.currentXp / MY_BATTLE_PASS.xpToNextLevel) * 100;

  const dailyMissions = BATTLE_PASS_MISSIONS.filter(m => m.type === "daily");
  const weeklyMissions = BATTLE_PASS_MISSIONS.filter(m => m.type === "weekly");
  const seasonMissions = BATTLE_PASS_MISSIONS.filter(m => m.type === "season");

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden ring-1 ring-flame/30 p-6 sm:p-8">
        <div className="absolute inset-0 flame-gradient opacity-[0.10]" />
        <div className="absolute inset-0 grain opacity-20" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            <div className="flex-1">
              <Pill color="flame">War Pass · Saison Hiver 2026</Pill>
              <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">
                Niveau <span className="flame-text">{currentLevel}</span>
                <span className="text-muted text-2xl sm:text-3xl"> / {MY_BATTLE_PASS.totalLevels}</span>
              </h1>
              <p className="mt-2 text-sm text-foreground/70 flex items-center gap-2">
                <Clock size={14} className="text-flame" /> Plus que {MY_BATTLE_PASS.daysRemaining} jours pour débloquer tout
              </p>

              <div className="mt-4 w-full max-w-md">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold">Lvl {currentLevel}</span>
                  <span className="text-muted">{MY_BATTLE_PASS.currentXp.toLocaleString("fr-FR")} / {MY_BATTLE_PASS.xpToNextLevel.toLocaleString("fr-FR")} XP</span>
                  <span className="font-bold text-flame">Lvl {currentLevel + 1}</span>
                </div>
                <div className="h-3 rounded-full bg-overlay/10 overflow-hidden ring-1 ring-overlay/10">
                  <div className="h-full flame-gradient" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl bg-overlay/10 ring-1 ring-overlay/10 px-3 py-2 text-sm">
                  <Coins size={14} className="text-gold" />
                  <span className="font-bold">{MY_WAR_COINS.toLocaleString("fr-FR")}</span>
                  <span className="text-muted text-xs">war coins</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-flame/10 ring-1 ring-flame/30 px-3 py-2 text-sm">
                  <Flame size={14} className="text-flame" />
                  <span className="font-bold">47</span>
                  <span className="text-muted text-xs">j de streak</span>
                </div>
              </div>
            </div>

            {/* Premium upsell */}
            <div className="lg:w-80 w-full">
              <div className={`rounded-2xl p-5 ring-1 ${hasPremium ? "bg-gold/10 ring-gold/40" : "bg-overlay/10 ring-overlay/20"}`}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-flame">War Pass PREMIUM</p>
                  {hasPremium && <Pill color="success"><Check size={9} className="mr-1" />Actif</Pill>}
                </div>
                <p className="mt-2 font-black text-xl">
                  {hasPremium ? "Tu as tout débloqué" : <>Débloque <span className="flame-text">50 récompenses exclusives</span></>}
                </p>
                <ul className="mt-3 text-xs space-y-1.5 text-foreground/70">
                  <li className="flex items-center gap-2"><Check size={11} className="text-flame" /> Skins drapeaux uniques</li>
                  <li className="flex items-center gap-2"><Check size={11} className="text-flame" /> +50% war coins</li>
                  <li className="flex items-center gap-2"><Check size={11} className="text-flame" /> Bonus ×2 perso quotidien</li>
                  <li className="flex items-center gap-2"><Check size={11} className="text-flame" /> Trophée de saison à vie</li>
                </ul>
                {!hasPremium && (
                  <button onClick={() => setHasPremium(true)} className="mt-4 w-full px-4 py-2.5 rounded-xl flame-gradient text-black font-black text-sm">
                    Débloquer · 9,99€
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIERS — battle pass track */}
      <Card title={`Récompenses · ${MY_BATTLE_PASS.totalLevels} niveaux`} subtitle="Free + Premium · scrolle pour explorer">
        <div className="overflow-x-auto scrollbar-thin -mx-5 px-5">
          <div className="flex gap-2 pb-2" style={{ minWidth: "min-content" }}>
            {BATTLE_PASS_TIERS.map(tier => {
              const unlocked = tier.level <= currentLevel;
              const isCurrent = tier.level === currentLevel + 1;
              return (
                <div key={tier.level} className="shrink-0 w-24 flex flex-col gap-1.5">
                  {/* Level header */}
                  <div className={`text-center rounded-lg py-1.5 ring-1 ${unlocked ? "bg-flame/15 ring-flame/40 text-flame" : isCurrent ? "bg-overlay/10 ring-flame/30 text-foreground" : "bg-overlay/5 ring-overlay/10 text-muted"}`}>
                    <p className="text-[9px] uppercase tracking-wider">Niveau</p>
                    <p className="font-black text-base leading-none">{tier.level}</p>
                  </div>
                  {/* Free reward */}
                  <RewardSlot reward={tier.freeReward} unlocked={unlocked} family="free" />
                  {/* Premium reward */}
                  <RewardSlot reward={tier.premiumReward!} unlocked={unlocked && hasPremium} family="premium" hasPremium={hasPremium} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-[11px]">
          <Pill color="flame">Free track</Pill>
          <Pill color="gold">Premium track</Pill>
          <span className="text-muted">Glisse →</span>
        </div>
      </Card>

      {/* MISSIONS */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card title={<span className="flex items-center gap-2"><Zap size={14} className="text-flame" />Missions du jour</span>} subtitle="Reset à minuit">
          <Missions missions={dailyMissions} />
        </Card>
        <Card title={<span className="flex items-center gap-2"><Target size={14} className="text-flame" />Missions de la semaine</span>} subtitle="Reset dimanche">
          <Missions missions={weeklyMissions} />
        </Card>
        <Card title={<span className="flex items-center gap-2"><Crown size={14} className="text-flame" />Missions de saison</span>} subtitle={`${MY_BATTLE_PASS.daysRemaining}j restants`}>
          <Missions missions={seasonMissions} />
        </Card>
      </div>

      {/* WHY IT WORKS */}
      <Card title="Comment monter de niveau" subtitle="Tu peux gagner des XP de mille façons">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          {[
            { icon: Flame, title: "Minutes d'effort", text: "1 minute = 10 XP. La régularité paye." },
            { icon: Star, title: "Missions quotidiennes", text: "200-400 XP par mission, reset chaque jour" },
            { icon: Sparkles, title: "Cours bonus de ton club", text: "×2 XP sur les cours marqués bonus" },
            { icon: Crown, title: "Victoires en défi", text: "Jusqu'à 5000 XP pour un défi national gagné" },
          ].map(o => (
            <div key={o.title} className="rounded-xl bg-overlay/5 p-4">
              <o.icon size={18} className="text-flame mb-2" />
              <p className="font-bold">{o.title}</p>
              <p className="text-xs text-muted mt-1">{o.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RewardSlot({ reward, unlocked, family, hasPremium = true }: { reward: any; unlocked: boolean; family: "free" | "premium"; hasPremium?: boolean }) {
  const isPremium = family === "premium";
  const accessible = isPremium ? hasPremium : true;

  return (
    <div className={`relative rounded-xl aspect-square grid place-items-center ring-1 transition ${
      unlocked
        ? "bg-flame/10 ring-flame/40"
        : isPremium
        ? "bg-gold/5 ring-gold/20"
        : "bg-overlay/5 ring-overlay/10"
    }`}>
      <div className="text-center px-1">
        <p className="text-2xl leading-none">{reward.emoji}</p>
        <p className="text-[8px] font-bold mt-1 line-clamp-2 leading-tight">{reward.label}</p>
      </div>
      {!accessible && (
        <div className="absolute inset-0 grid place-items-center bg-overlay/40 rounded-xl backdrop-blur-[1px]">
          <Lock size={14} className="text-foreground" />
        </div>
      )}
      {unlocked && accessible && (
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-success grid place-items-center">
          <Check size={10} className="text-foreground" />
        </div>
      )}
      <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${
        isPremium ? "bg-gold text-foreground" : "bg-flame text-foreground"
      }`} style={{ color: "#0a0a0f" }}>
        {isPremium ? "PRO" : "FREE"}
      </span>
    </div>
  );
}

function Missions({ missions }: { missions: any[] }) {
  return (
    <div className="space-y-2">
      {missions.map(m => {
        const done = m.done >= m.target;
        const progress = Math.min(100, (m.done / m.target) * 100);
        return (
          <div key={m.id} className={`rounded-xl p-3 ring-1 ${done ? "bg-success/10 ring-success/30" : "bg-overlay/5 ring-overlay/10"}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold flex items-center gap-2">
                  {done && <Check size={12} className="text-success shrink-0" />}
                  <span className="truncate">{m.label}</span>
                </p>
                <p className="text-[11px] text-muted">{m.done.toLocaleString("fr-FR")} / {m.target.toLocaleString("fr-FR")}</p>
              </div>
              <span className="text-[11px] font-black text-flame shrink-0">+{m.xp} XP</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-overlay/10 overflow-hidden">
              <div className={`h-full ${done ? "bg-success" : "flame-gradient"}`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
