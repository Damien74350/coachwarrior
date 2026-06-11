"use client";

import { useState } from "react";
import { Card, Pill, Stat } from "../../../components/Card";
import { COURSES } from "../../../lib/mock";
import { Sparkles, Timer, Users, Zap, Plus, Calendar } from "lucide-react";
import type { Course } from "../../../lib/types";

const TYPE_LABEL: Record<string, string> = {
  CARDIO: "Cardio",
  STRENGTH: "Force",
  YOGA: "Yoga",
  BOXING: "Boxe",
  GROUP: "Collectif",
  SOLO: "Solo",
  PT: "Personal",
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(COURSES);

  const totalSlots = courses.reduce((s, c) => s + c.capacity, 0);
  const totalBookings = courses.reduce((s, c) => s + c.bookings, 0);
  const fillRate = (totalBookings / totalSlots) * 100;
  const bonusActive = courses.filter(c => c.bonusMultiplier > 1).length;

  function setBonus(id: string, mult: number) {
    setCourses(prev => prev.map(c => c.id === id ? {
      ...c,
      bonusMultiplier: mult,
      bonusEndsAt: mult > 1 ? new Date(Date.now() + 7 * 86400000).toISOString() : undefined,
    } : c));
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <Pill color="cyan">Cours & bonus</Pill>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            Gère tes <span className="flame-text">bonus points</span>
          </h1>
          <p className="mt-2 text-muted">Active des multiplicateurs sur tes cours creux. Tes membres se ruent dessus.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl flame-gradient text-black font-bold">
          <Plus size={16} /> Ajouter un cours
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Calendar size={16} />} label="Cours actifs" value={courses.length} />
        <Stat icon={<Users size={16} />} label="Taux de remplissage" value={`${Math.round(fillRate)}%`} hint={`${totalBookings}/${totalSlots} places`} trend={6.4} />
        <Stat icon={<Sparkles size={16} />} label="Bonus actifs" value={bonusActive} hint={`/ ${courses.length} cours`} />
        <Stat icon={<Zap size={16} />} label="Pts bonus distrib." value="4 820" hint="cette semaine" trend={28.0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {courses.map(c => (
          <Card
            key={c.id}
            title={c.name}
            subtitle={`${c.schedule} · ${c.coachName}`}
            right={
              <Pill color={c.bonusMultiplier > 1 ? "flame" : "muted"}>
                {c.bonusMultiplier > 1 ? `Bonus ×${c.bonusMultiplier}` : "Standard"}
              </Pill>
            }
          >
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Mini label="Type" value={TYPE_LABEL[c.type] ?? c.type} />
              <Mini label="Durée" value={`${c.durationMin} min`} />
              <Mini label="Inscrits" value={`${c.bookings}/${c.capacity}`} />
            </div>

            <div className="mb-4">
              <p className="text-[11px] text-muted mb-1">Taux de remplissage</p>
              <div className="h-2 rounded-full bg-overlay/10 overflow-hidden">
                <div className="h-full flame-gradient" style={{ width: `${(c.bookings / c.capacity) * 100}%` }} />
              </div>
            </div>

            <div>
              <p className="text-xs font-bold mb-2 flex items-center gap-1">
                <Sparkles size={12} className="text-flame" /> Multiplicateur de points
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[1.0, 1.25, 1.5, 2.0, 2.5, 3.0].map(m => (
                  <button
                    key={m}
                    onClick={() => setBonus(c.id, m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      c.bonusMultiplier === m
                        ? "flame-gradient text-black shadow-glow"
                        : "bg-overlay/5 text-muted hover:bg-overlay/10 hover:text-foreground"
                    }`}
                  >
                    ×{m}
                  </button>
                ))}
              </div>
              {c.bonusMultiplier > 1 && (
                <p className="mt-2 text-[11px] text-flame">
                  ⚡ Bonus actif — affichage prioritaire pour les membres
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card title="L'Autopilot peut tout faire à ta place" subtitle="Active une fois, oublie pour de bon">
        <div className="rounded-xl bg-flame/5 ring-1 ring-flame/30 p-4 text-sm">
          <p className="font-bold flex items-center gap-2"><Sparkles size={14} className="text-flame" /> Auto-bonus créneaux creux</p>
          <p className="text-muted text-xs mt-1">
            À J-2, tout cours sous 50% de remplissage reçoit un ×2 + un push aux 200 membres les plus actifs.
            Impact mesuré : <strong className="text-flame">+38% de remplissage</strong>.
          </p>
          <a href="/club/automations" className="mt-2 inline-block text-xs font-bold text-flame hover:underline">
            Ajuster les règles →
          </a>
        </div>
      </Card>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-overlay/5 p-2">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="font-bold text-sm mt-0.5">{value}</p>
    </div>
  );
}
