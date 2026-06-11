"use client";

import { useEffect, useState } from "react";
import { Palette, Check } from "lucide-react";

export type Theme = "crimson" | "midnight" | "swissgold" | "spartan";

export const THEMES: { id: Theme; name: string; tagline: string; swatches: string[] }[] = [
  { id: "crimson",   name: "Crimson Combat",  tagline: "Guerrier, brûlant",        swatches: ["#0a0a0f", "#ff3b30", "#ff7a18", "#ffc83d"] },
  { id: "midnight",  name: "Nuit Tactique",   tagline: "Premium, militaire",       swatches: ["#070b14", "#22d3ee", "#7c5cff", "#3b82f6"] },
  { id: "swissgold", name: "Or Suisse",       tagline: "Luxe, sponsor-ready",      swatches: ["#0b0a08", "#d4a437", "#b88534", "#f3d27a"] },
  { id: "spartan",   name: "Vert Spartan",    tagline: "Santé, naturel, urbain",   swatches: ["#070d0a", "#10b981", "#84cc16", "#22d3ee"] },
];

export function ThemeProvider() {
  const [theme, setTheme] = useState<Theme>("crimson");
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 glass-strong rounded-2xl p-3 w-72 shadow-glow">
          <p className="text-[10px] uppercase tracking-wider text-muted mb-2 font-bold">Thème visuel</p>
          <div className="space-y-1.5">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${
                  theme === t.id ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/5"
                }`}
              >
                <div className="flex gap-0.5">
                  {t.swatches.map((s, i) => (
                    <span key={i} className="w-3.5 h-7 rounded-sm ring-1 ring-white/10" style={{ background: s }} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-[10px] text-muted">{t.tagline}</p>
                </div>
                {theme === t.id && <Check size={14} className="text-flame shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className="grid place-items-center w-11 h-11 rounded-full flame-gradient text-black shadow-glow hover:scale-105 transition"
        aria-label="Changer le thème"
      >
        <Palette size={18} />
      </button>
    </div>
  );
}
