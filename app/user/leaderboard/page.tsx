"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Pill } from "../../../components/Card";
import { Leaderboard } from "../../../components/Leaderboard";
import { SeasonBadge } from "../../../components/SeasonBadge";
import {
  ME, MY_CLUB, USERS,
  getClubLeaderboard, getWorldLeaderboard, getWeeklyLeaderboard,
  getFriendsLeaderboard, getNeighborhoodLeaderboard,
  CURRENT_SEASON,
} from "../../../lib/mock";
import { Trophy, Globe2, Building2, MapPin, Heart, Snowflake, Archive } from "lucide-react";

type Scope = "friends" | "neighborhood" | "club" | "country" | "world";
type Period = "season" | "alltime";

export default function LeaderboardPage() {
  const [scope, setScope] = useState<Scope>("friends");
  const [period, setPeriod] = useState<Period>("season");

  let list = [] as any[];
  let title = "";
  let subtitle = "";

  if (scope === "friends") {
    list = getFriendsLeaderboard();
    title = "Mes amis";
    subtitle = `${list.length} athlètes — c'est ton vrai cercle`;
  } else if (scope === "neighborhood") {
    list = getNeighborhoodLeaderboard(100);
    title = `Mon quartier — ${ME.city}`;
    subtitle = `Tous les athlètes WARfit de ${ME.city}`;
  } else if (scope === "club") {
    list = period === "season" ? getClubLeaderboard(MY_CLUB.id, 200)
      : [...USERS, ME].filter(u => u.clubId === ME.clubId).sort((a, b) => b.totalPoints - a.totalPoints);
    title = MY_CLUB.name;
    subtitle = "Tes voisins de tatami";
  } else if (scope === "country") {
    list = (period === "season" ? getWeeklyLeaderboard(500) : getWorldLeaderboard(500))
      .filter(u => u.country === ME.country);
    title = `${ME.countryCode} ${ME.country}`;
    subtitle = "À l'échelle nationale";
  } else {
    list = period === "season" ? getWeeklyLeaderboard(500) : getWorldLeaderboard(500);
    title = "Classement Mondial";
    subtitle = "L'easter egg pour les plus durs — utile uniquement si tu vises la légende";
  }

  const myRank = list.findIndex(u => u.id === "me") + 1;
  const pointKey = period === "season" ? "weekPoints" : "totalPoints";

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <Pill color="war">Classements</Pill>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            On bat <span className="flame-text">ses voisins</span> avant le monde.
          </h1>
          <p className="mt-2 text-muted text-sm">
            La motivation se joue à petite échelle. Commence par tes amis, ton quartier, ton club.
          </p>
        </div>
        <SeasonBadge />
      </header>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-overlay/5 p-1 ring-1 ring-overlay/10 overflow-x-auto scrollbar-thin">
          {([
            { v: "friends",      label: "Mes amis",    icon: Heart      },
            { v: "neighborhood", label: "Mon quartier",icon: MapPin     },
            { v: "club",         label: "Mon club",    icon: Building2  },
            { v: "country",      label: "Mon pays",    icon: MapPin     },
            { v: "world",        label: "Monde",       icon: Globe2     },
          ] as { v: Scope; label: string; icon: any }[]).map(o => (
            <button
              key={o.v}
              onClick={() => setScope(o.v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                scope === o.v ? "bg-war text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              <o.icon size={13} /> {o.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-overlay/5 p-1 ring-1 ring-overlay/10">
          {([
            { v: "season", label: <><Snowflake size={12} className="inline -mt-0.5 mr-1" />Saison en cours</> },
            { v: "alltime", label: <><Archive size={12} className="inline -mt-0.5 mr-1" />Tout-temps (archive)</> },
          ] as { v: Period; label: any }[]).map(o => (
            <button
              key={o.v}
              onClick={() => setPeriod(o.v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                period === o.v ? "bg-flame text-black" : "text-muted hover:text-foreground"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {scope === "world" && (
        <div className="rounded-2xl bg-cyan/5 ring-1 ring-cyan/20 p-4 text-sm">
          <p className="font-bold text-cyan flex items-center gap-2"><Globe2 size={14} /> Tu es sûr ?</p>
          <p className="text-muted mt-1 text-xs">
            Le classement mondial est démotivant pour 99% des gens — y être #14 832 sur 50 000 n'aide personne.
            Reste sur tes amis ou ton quartier. Sauf si tu vises la <strong className="text-flame">Légende</strong>.
          </p>
        </div>
      )}

      <Card
        title={
          <span className="flex items-center gap-2">
            <Trophy size={16} className="text-flame" /> {title}
          </span>
        }
        subtitle={subtitle}
        right={
          <Pill color={period === "season" ? "cyan" : "muted"}>
            {period === "season" ? CURRENT_SEASON.name : "Tout-temps"}
          </Pill>
        }
      >
        <Leaderboard users={list.slice(0, 50)} pointKey={pointKey} />
        {myRank > 0 && (
          <p className="mt-4 text-center text-xs text-muted">
            Tu es {myRank <= 3 ? "sur le podium 🔥" : `#${myRank} sur ${list.length}`}
          </p>
        )}
        {list.length > 50 && (
          <p className="mt-1 text-center text-[11px] text-muted">Top 50 affiché — {list.length} athlètes au total</p>
        )}
      </Card>

      <Card title="Pourquoi ces 3 ligues d'abord ?" subtitle="Notre philosophie">
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          {[
            { title: "Amis", icon: Heart, text: "Le plus motivant. Tu connais les gens. Tu ne veux pas être dernier devant Sofia." },
            { title: "Quartier", icon: MapPin, text: "Fierté locale + scale humaine. Tu croises ces gens à la boulangerie." },
            { title: "Club", icon: Building2, text: "Ta tribu d'entraînement. Le tableau qui s'affiche à l'écran de l'accueil." },
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
