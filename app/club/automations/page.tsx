"use client";

import { useState } from "react";
import { Card, Pill, Stat } from "../../../components/Card";
import { AUTO_RULES } from "../../../lib/mock";
import type { AutoRule } from "../../../lib/types";
import { Bot, Zap, Trophy, Bell, Heart, Power, CheckCircle2, Activity } from "lucide-react";

const CAT_LABEL: Record<string, string> = {
  BONUS: "Bonus auto",
  LEAGUE: "Ligues auto",
  NUDGE: "Notifs perso",
  RECOVERY: "Récupération",
};
const CAT_ICON: Record<string, any> = {
  BONUS: Zap, LEAGUE: Trophy, NUDGE: Bell, RECOVERY: Heart,
};
const CAT_COLOR: Record<string, "war" | "flame" | "cyan" | "plasma"> = {
  BONUS: "flame", LEAGUE: "war", NUDGE: "cyan", RECOVERY: "plasma",
};

export default function AutomationsPage() {
  const [rules, setRules] = useState<AutoRule[]>(AUTO_RULES);

  const enabled = rules.filter(r => r.enabled).length;
  const fired = rules.reduce((s, r) => s + (r.enabled ? r.firedThisMonth : 0), 0);
  const categories = Array.from(new Set(rules.map(r => r.category)));

  function toggle(id: string) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }

  return (
    <div className="space-y-6">
      <header>
        <Pill color="cyan">Autopilot</Pill>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
          <span className="flame-text">Zéro effort</span> pour le gérant.
        </h1>
        <p className="mt-2 text-muted max-w-2xl">
          Le bot remplit tes créneaux creux, lance tes ligues mensuelles, rattrape tes membres à risque
          et fête les anniversaires. Tu n'as rien à faire — tu peux tout ajuster.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Power size={16} />} label="Règles actives" value={`${enabled}/${rules.length}`} hint="prêtes à l'emploi" />
        <Stat icon={<Activity size={16} />} label="Actions / mois" value={fired} hint="déclenchées auto" />
        <Stat icon={<Zap size={16} />} label="Bonus auto activés" value={rules.filter(r => r.enabled && r.category === "BONUS").reduce((s, r) => s + r.firedThisMonth, 0)} hint="ce mois" />
        <Stat icon={<Heart size={16} />} label="Sauvetages réussis" value="27" hint="membres réactivés" trend={31.0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {categories.map(cat => {
          const list = rules.filter(r => r.category === cat);
          const Icon = CAT_ICON[cat];
          return (
            <Card
              key={cat}
              title={<span className="flex items-center gap-2"><Icon size={14} className="text-flame" />{CAT_LABEL[cat]}</span>}
              subtitle={`${list.filter(r => r.enabled).length}/${list.length} actives`}
            >
              <div className="space-y-3">
                {list.map(r => (
                  <div key={r.id} className={`rounded-xl p-4 ring-1 transition ${r.enabled ? "bg-flame/5 ring-flame/30" : "bg-overlay/5 ring-overlay/10"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{r.name}</p>
                          {r.enabled && <CheckCircle2 size={12} className="text-success shrink-0" />}
                        </div>
                        <p className="text-xs text-muted mt-1">{r.description}</p>
                      </div>
                      <Toggle on={r.enabled} onClick={() => toggle(r.id)} />
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg bg-overlay/5 p-2">
                        <p className="text-muted uppercase tracking-wider text-[9px]">Déclencheur</p>
                        <p className="mt-0.5">{r.trigger}</p>
                      </div>
                      <div className="rounded-lg bg-overlay/5 p-2">
                        <p className="text-muted uppercase tracking-wider text-[9px]">Action</p>
                        <p className="mt-0.5">{r.action}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-muted">Déclenché <strong className="text-foreground">{r.firedThisMonth}×</strong> ce mois</span>
                      {r.impact && (
                        <span className="text-flame font-bold">↗ {r.impact}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <Card title="Pourquoi l'autopilot" subtitle="La leçon des dashboards SaaS">
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          {[
            { title: "Un gérant n'a pas 1h par semaine", text: "Tout dashboard non automatique meurt. WARfit fait tourner ton outil de fidélisation pendant que tu gères la salle." },
            { title: "Les bonnes décisions sont prévisibles", text: "Boost les créneaux creux, sauve les inactifs, fête les seuils. On les a codifiées une fois pour toutes." },
            { title: "Tout est ajustable", text: "Chaque règle a un on/off. Tu peux désactiver, créer la tienne, ou laisser le bot tout gérer." },
          ].map(o => (
            <div key={o.title} className="rounded-xl bg-overlay/5 p-4">
              <p className="font-bold">{o.title}</p>
              <p className="text-xs text-muted mt-1">{o.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-6 rounded-full transition shrink-0 ${on ? "bg-flame" : "bg-overlay/10"}`}
      aria-label="toggle"
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-5" : "left-1"}`}
      />
    </button>
  );
}
