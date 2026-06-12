"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CURRENT_BOSS_RAID } from "../lib/mock";
import { compact } from "../lib/format";
import { Skull, Users, Trophy, Clock } from "lucide-react";

export function BossRaidBanner() {
  const r = CURRENT_BOSS_RAID;
  const progress = Math.min(100, (r.currentMinutes / r.targetMinutes) * 100);

  const [hms, setHms] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const end = new Date(r.endsAt).getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setHms({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [r.endsAt]);

  return (
    <Link href="/" className="block group">
      <section className="relative rounded-3xl overflow-hidden ring-1 ring-war/40 hover:ring-war/70 transition">
        {/* Pulsing dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-war/20 via-flame/15 to-gold/20" />
        <div className="absolute inset-0 grain opacity-30" />

        <div className="relative p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
            {/* Boss icon */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl flame-gradient grid place-items-center text-3xl shadow-glow pulse-glow">
                {r.emoji}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-[0.18em] font-black text-war">
                  ⚔️ Boss Raid Mondial · LIVE
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-foreground bg-overlay/20 px-2 py-0.5 rounded-full backdrop-blur">
                  <Clock size={9} /> {String(hms.h).padStart(2, "0")}:{String(hms.m).padStart(2, "0")}:{String(hms.s).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1 font-black text-xl">{r.name}</p>
              <p className="text-xs text-foreground/70 mt-0.5 line-clamp-2">{r.description}</p>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-black flame-text text-base">{compact(r.currentMinutes)}<span className="text-muted text-xs"> / {compact(r.targetMinutes)} min</span></span>
                  <span className="font-bold text-flame">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 rounded-full bg-overlay/15 overflow-hidden ring-1 ring-overlay/10">
                  <div className="h-full flame-gradient transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-foreground/70">
                <span className="inline-flex items-center gap-1"><Users size={11} /> {compact(r.participatingMembers)} guerriers</span>
                <span>·</span>
                <span>{compact(r.participatingClubs)} clubs unis</span>
                <span className="ml-auto inline-flex items-center gap-1 text-gold font-bold">
                  <Trophy size={11} /> {r.rewardIfBeaten}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Link>
  );
}
