"use client";

import { useEffect, useState } from "react";
import { Palette, Check, Sun, Moon } from "lucide-react";

export type Theme = "apple" | "nike" | "studio" | "aurora" | "pastel" | "crimson" | "midnight" | "swissgold" | "spartan";

export const THEMES: { id: Theme; name: string; tagline: string; family: "light" | "dark"; swatches: string[] }[] = [
  // LIGHT — défaut, plaît aux non-gamers
  { id: "apple",     name: "Apple Soft",     tagline: "Crème + coral — Apple Fitness+", family: "light", swatches: ["#faf7f2", "#f43f5e", "#f97316", "#eab308"] },
  { id: "nike",      name: "Nike Court",     tagline: "Blanc + noir + volt — Nike Run",  family: "light", swatches: ["#fafaf9", "#0a0a0a", "#ff0050", "#ccff00"] },
  { id: "studio",    name: "Studio",         tagline: "Sable + sauge — boutique wellness", family: "light", swatches: ["#f5f1ec", "#b2775c", "#84997c", "#d4a574"] },
  // DARK — pour ceux qui veulent l'énergie gaming
  { id: "aurora",    name: "Aurora",         tagline: "Sombre chaleureux — Apple Fitness+ dark", family: "dark", swatches: ["#0d0c12", "#fb7185", "#fb923c", "#fcd34d"] },
  { id: "pastel",    name: "Pastel Doux",    tagline: "Sombre apaisant",                family: "dark", swatches: ["#14111a", "#f4b6e6", "#fdba74", "#86efac"] },
  { id: "crimson",   name: "Crimson Combat", tagline: "Sombre brûlant — gamer",         family: "dark", swatches: ["#0a0a0f", "#ff3b30", "#ff7a18", "#ffc83d"] },
  { id: "midnight",  name: "Nuit Tactique",  tagline: "Sombre premium urbain",          family: "dark", swatches: ["#070b14", "#22d3ee", "#7c5cff", "#3b82f6"] },
  { id: "swissgold", name: "Or Suisse",      tagline: "Sombre luxe — sponsor-ready",    family: "dark", swatches: ["#0b0a08", "#d4a437", "#b88534", "#f3d27a"] },
  { id: "spartan",   name: "Vert Spartan",   tagline: "Sombre santé",                   family: "dark", swatches: ["#070d0a", "#10b981", "#84cc16", "#22d3ee"] },
];

export function ThemeProvider() {
  const [theme, setTheme] = useState<Theme>("apple");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("warfit-theme")) as Theme | null;
    if (stored && THEMES.some(t => t.id === stored)) setTheme(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("warfit-theme", theme);
  }, [theme]);

  const lights = THEMES.filter(t => t.family === "light");
  const darks = THEMES.filter(t => t.family === "dark");

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 glass-strong rounded-2xl p-3 w-80 shadow-glow max-h-[80vh] overflow-y-auto scrollbar-thin">
          <p className="text-[10px] uppercase tracking-wider text-muted mb-2 font-bold flex items-center gap-1">
            <Sun size={11} /> Light — Nike / Apple
          </p>
          <div className="space-y-1.5">
            {lights.map(t => <ThemeOption key={t.id} t={t} active={theme === t.id} onClick={() => { setTheme(t.id); setOpen(false); }} />)}
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-wider text-muted mb-2 font-bold flex items-center gap-1">
            <Moon size={11} /> Dark — Énergie gaming
          </p>
          <div className="space-y-1.5">
            {darks.map(t => <ThemeOption key={t.id} t={t} active={theme === t.id} onClick={() => { setTheme(t.id); setOpen(false); }} />)}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className="grid place-items-center w-11 h-11 rounded-full flame-gradient text-foreground shadow-glow hover:scale-105 transition"
        aria-label="Changer le thème"
        style={{ color: "#fff" }}
      >
        <Palette size={18} />
      </button>
    </div>
  );
}

function ThemeOption({ t, active, onClick }: { t: any; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${
        active ? "bg-overlay/10 ring-1 ring-overlay/20" : "hover:bg-overlay/5"
      }`}
    >
      <div className="flex gap-0.5">
        {t.swatches.map((s: string, i: number) => (
          <span key={i} className="w-3.5 h-7 rounded-sm ring-1 ring-overlay/10" style={{ background: s }} />
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">{t.name}</p>
        <p className="text-[10px] text-muted">{t.tagline}</p>
      </div>
      {active && <Check size={14} className="text-flame shrink-0" />}
    </button>
  );
}
