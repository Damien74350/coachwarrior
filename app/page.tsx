import Link from "next/link";
import { Flame, Trophy, Users, BarChart3, Shield, Building2, ArrowRight, Sparkles, Target, Crown, Award } from "lucide-react";
import { Pill } from "../components/Card";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="relative pt-8 sm:pt-16 pb-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-war/10 ring-1 ring-war/30 text-war text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={12} /> Le fitness, mais en jeu
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              Gamifie ta forme.<br />
              <span className="flame-text">Fidélise ton club.</span>
            </h1>
            <p className="mt-6 text-lg text-muted max-w-2xl">
              WARfit récompense la <strong className="text-white">régularité</strong>, pas la performance.
              Plus tu accumules de minutes, plus tu montes au classement mondial.
              Et pour les clubs, c'est l'outil de fidélisation le plus complet du marché.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/user"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl flame-gradient text-black font-bold shadow-glow hover:shadow-glowFlame transition"
              >
                <Flame size={18} /> Côté membre
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/club"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 font-bold transition"
              >
                <Building2 size={18} /> Côté club
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-2xl font-black">36</p>
                <p className="text-xs text-muted">clubs connectés</p>
              </div>
              <div>
                <p className="text-2xl font-black">240+</p>
                <p className="text-xs text-muted">athlètes en lice</p>
              </div>
              <div>
                <p className="text-2xl font-black flame-text">15</p>
                <p className="text-xs text-muted">pays · 4 continents</p>
              </div>
            </div>
          </div>

          {/* Hero card preview */}
          <div className="lg:col-span-5 relative">
            <div className="glass-strong rounded-3xl p-6 shadow-glow">
              <div className="flex items-center justify-between">
                <Pill color="war">Top mondial · sem.</Pill>
                <span className="text-xs text-muted">en direct</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { rank: 1, name: "Karim B.", flag: "🇲🇦", pts: 624, you: false, tier: "LEGEND" },
                  { rank: 2, name: "Sofia M.", flag: "🇪🇸", pts: 587, you: false, tier: "DIAMOND" },
                  { rank: 3, name: "Damien R. (toi)", flag: "🇫🇷", pts: 412, you: true, tier: "PLATINUM" },
                  { rank: 4, name: "Liam S.", flag: "🇬🇧", pts: 398, you: false, tier: "PLATINUM" },
                  { rank: 5, name: "Yuki T.", flag: "🇯🇵", pts: 376, you: false, tier: "GOLD" },
                ].map(r => (
                  <div key={r.rank} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${r.you ? "bg-war/10 ring-1 ring-war/30" : "bg-white/5"}`}>
                    <div className={`w-7 text-center font-black ${r.rank <= 3 ? "text-flame" : "text-muted"}`}>#{r.rank}</div>
                    <div className="grid place-items-center w-8 h-8 rounded-lg bg-white/10 text-xs font-bold">
                      {r.flag}
                    </div>
                    <div className="flex-1 text-sm font-semibold">{r.name}</div>
                    <div className="text-right">
                      <p className="font-black text-flame">{r.pts}<span className="text-muted text-xs"> pts</span></p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div className="text-xs text-muted">Ta semaine</div>
                <div className="flex items-center gap-1 text-sm">
                  <Flame size={14} className="text-flame" />
                  <span className="font-black">386 min</span>
                  <span className="text-muted">·</span>
                  <span className="font-black flame-text">412 pts</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-3 glass rounded-2xl px-3 py-2 text-xs hidden sm:flex items-center gap-2 shadow-glow">
              <Flame size={14} className="text-flame" />
              <span className="font-bold">Streak 47 jours</span>
            </div>
            <div className="absolute -bottom-4 -left-3 glass rounded-2xl px-3 py-2 text-xs hidden sm:flex items-center gap-2">
              <Crown size={14} className="text-gold" />
              <span className="font-bold">Tier Platine atteint</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE — MEMBERS */}
      <section>
        <header className="mb-8">
          <Pill color="flame">Côté membre</Pill>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            La régularité, c'est la victoire.
          </h2>
          <p className="mt-2 text-muted max-w-2xl">
            Pas besoin d'être un athlète. Chaque minute d'activité compte. Tu accumules des points,
            tu montes en tiers, tu gagnes des badges, tu te bats dans les classements de ton club, ta région, le monde.
          </p>
        </header>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Flame, title: "1 minute = 1 point", desc: "Le système le plus simple du fitness. Multipliers bonus dispos sur les cours marqués par ton club." },
            { icon: Trophy, title: "Classements multi-niveaux", desc: "Ton club, ta ville, ton groupe, ta région, ton pays, le monde. Tu choisis ta ligue." },
            { icon: Crown, title: "Tiers & badges à vie", desc: "Bronze → Légende. Streaks, milestones, MVP du mois. Ton parcours raconte ton histoire." },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:ring-1 hover:ring-war/30 transition">
              <div className="w-10 h-10 rounded-xl flame-gradient grid place-items-center text-black mb-3">
                <f.icon size={20} />
              </div>
              <h3 className="font-black text-lg">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE — CLUBS */}
      <section>
        <header className="mb-8">
          <Pill color="cyan">Côté club</Pill>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            L'outil de fidélisation le plus complet.
          </h2>
          <p className="mt-2 text-muted max-w-2xl">
            Dashboard temps réel, ligues internes et inter-clubs, bonus points dynamiques sur les cours,
            vitrine de tes coachs. Transforme tes membres en communauté qui revient.
          </p>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: BarChart3, title: "Dashboard temps réel", desc: "Membres actifs, minutes hebdo, rétention, NPS. Tout au même endroit." },
            { icon: Trophy, title: "Ligues internes & multi-clubs", desc: "Crée des compétitions entre membres, entre clubs de ton groupe, régionales." },
            { icon: Target, title: "Bonus points dynamiques", desc: "Remplis tes créneaux creux : ×2, ×2.5 points sur les cours que tu choisis." },
            { icon: Award, title: "Vitrine coachs", desc: "Profils, spécialités, ratings, followers. Tes coachs deviennent des stars." },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="w-9 h-9 rounded-lg bg-cyan/15 text-cyan grid place-items-center mb-3">
                <f.icon size={18} />
              </div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="mt-1 text-xs text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="glass-strong rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 grain pointer-events-none" />
        <div className="relative">
          <Shield className="mx-auto text-flame" size={32} />
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
            Le combat quotidien, <span className="flame-text">récompensé</span>.
          </h2>
          <p className="mt-3 text-muted max-w-xl mx-auto">
            Choisis ton côté. La démo est interactive, alimentée par des données réalistes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link href="/user" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl flame-gradient text-black font-bold shadow-glow">
              <Flame size={18} /> Entrer côté membre
            </Link>
            <Link href="/club" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 font-bold">
              <Building2 size={18} /> Entrer côté club
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
