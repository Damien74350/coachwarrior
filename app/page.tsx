import Link from "next/link";
import {
  Flame, Trophy, BarChart3, Heart, Building2, ArrowRight, Sparkles, Crown,
  Users, MapPin, Swords, Bot, Coins, Globe2, Shield, Zap, TrendingDown,
} from "lucide-react";
import { Pill } from "../components/Card";
import { ChallengeBanner } from "../components/ChallengeBanner";
import { BossRaidBanner } from "../components/BossRaidBanner";

export default function Home() {
  return (
    <div className="space-y-24 pb-8">
      {/* ────── HERO cinématographique ────── */}
      <section className="relative pt-8 sm:pt-12 -mt-6">
        {/* Floating SVG background */}
        <svg className="absolute inset-0 -z-10 w-full h-full opacity-50" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="bg1" cx="20%" cy="30%" r="40%">
              <stop offset="0%" stopColor="rgb(var(--c-flame))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(var(--c-flame))" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bg2" cx="80%" cy="70%" r="50%">
              <stop offset="0%" stopColor="rgb(var(--c-war))" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(var(--c-war))" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="600" fill="url(#bg1)" />
          <rect width="800" height="600" fill="url(#bg2)" />
        </svg>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-flame/10 ring-1 ring-flame/30 text-flame text-xs font-black uppercase tracking-[0.18em] mb-6">
              <Sparkles size={12} /> Le seul abo fitness qui baisse quand tu y vas
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
              Le fitness,<br />
              <span className="flame-text">pour 20 ans.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/70 max-w-2xl leading-relaxed">
              WARfit récompense la régularité, pas la performance. Tes minutes nourrissent ton club, ton quartier, ta ville,
              ta cause. Plus tu es régulier, moins tu paies — jusqu'à <strong className="text-foreground">gratuit</strong>.
              C'est l'app fitness que personne n'a osé construire.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/user" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl flame-gradient text-black font-black shadow-glow hover:shadow-glowFlame transition">
                <Flame size={18} /> Côté membre
                <ArrowRight size={16} />
              </Link>
              <Link href="/club" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-overlay/5 ring-1 ring-overlay/10 hover:bg-overlay/10 font-bold transition">
                <Building2 size={18} /> Côté club
              </Link>
              <Link href="/hq" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-overlay/5 ring-1 ring-overlay/10 hover:bg-overlay/10 font-bold transition">
                <Crown size={18} /> Siège HQ
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              <div>
                <p className="text-3xl sm:text-4xl font-black flame-text">5</p>
                <p className="text-xs text-foreground/60 mt-1">ligues internes par club</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black">26 M€</p>
                <p className="text-xs text-foreground/60 mt-1">ARR projeté 1 000 clubs FR</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black">0 €</p>
                <p className="text-xs text-foreground/60 mt-1">au-delà de 180j de streak</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black flame-text">3</p>
                <p className="text-xs text-foreground/60 mt-1">côtés monétisés</p>
              </div>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="lg:col-span-5 relative">
            <div className="glass-strong rounded-3xl p-6 shadow-glow">
              <div className="flex items-center justify-between mb-3">
                <Pill color="flame">Quartier · cette semaine</Pill>
                <span className="text-xs text-foreground/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> live
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { rank: 1, name: "Karim B.", flag: "🇲🇦", pts: 624, league: "Élite" },
                  { rank: 2, name: "Sofia M.", flag: "🇪🇸", pts: 587, league: "Compétiteur" },
                  { rank: 3, name: "Damien R. (toi)", flag: "🇫🇷", pts: 412, league: "Engagé", you: true },
                  { rank: 4, name: "Liam S.", flag: "🇬🇧", pts: 398, league: "Engagé" },
                ].map(r => (
                  <div key={r.rank} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${r.you ? "bg-flame/15 ring-1 ring-flame/30" : "bg-overlay/5"}`}>
                    <div className={`w-7 text-center font-black ${r.rank <= 3 ? "text-flame" : "text-foreground/50"}`}>#{r.rank}</div>
                    <div className="grid place-items-center w-8 h-8 rounded-lg bg-overlay/10 text-xs font-bold">{r.flag}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{r.name}</p>
                      <p className="text-[10px] text-muted">Ligue {r.league}</p>
                    </div>
                    <p className="font-black text-flame">{r.pts}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-overlay/10 flex items-center justify-between">
                <div className="text-xs text-foreground/60">Tu paies</div>
                <div className="text-right">
                  <span className="font-black text-2xl flame-text">5,90 €</span>
                  <span className="text-xs text-muted line-through ml-2">9,90 €</span>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-3 -right-3 glass rounded-2xl px-3 py-2 text-xs hidden sm:flex items-center gap-2 shadow-glow floaty">
              <Flame size={14} className="text-flame" />
              <span className="font-bold">47 jours d'affilée</span>
            </div>
            <div className="absolute -bottom-3 -left-3 glass rounded-2xl px-3 py-2 text-xs hidden sm:flex items-center gap-2 floaty" style={{ animationDelay: "2s" }}>
              <Heart size={14} className="text-flame" />
              <span className="font-bold">Genève → MSF · 78%</span>
            </div>
            <div className="absolute top-1/2 -right-6 glass rounded-2xl px-3 py-2 text-xs hidden lg:flex items-center gap-2 floaty" style={{ animationDelay: "4s" }}>
              <Crown size={14} className="text-gold" />
              <span className="font-bold">Tier Platine</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────── Boss Raid + Défi sponso teaser ────── */}
      <section className="space-y-4">
        <BossRaidBanner />
        <ChallengeBanner />
      </section>

      {/* ────── 5 LIGUES — la philosophie ────── */}
      <section>
        <header className="mb-10 text-center">
          <Pill color="flame">Ligues internes par niveau</Pill>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
            Mamie, débutant ou athlète :<br />
            <span className="flame-text">chacun joue dans sa division.</span>
          </h2>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto text-lg">
            Aucune humiliation, aucune démotivation. La régularité ouvre les portes, la performance s'ajoute en haut.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {[
            { emoji: "🌱", name: "Découverte", color: "#86efac", who: "Mamie débutante" },
            { emoji: "💪", name: "Régulier", color: "#fdba74", who: "L'habitude est là" },
            { emoji: "🔥", name: "Engagé", color: "#fb7185", who: "Mode de vie", highlight: true },
            { emoji: "⚔️", name: "Compétiteur", color: "#a78bfa", who: "Vise l'excellence" },
            { emoji: "👑", name: "Élite", color: "#fcd34d", who: "Top 5% du club" },
          ].map((l, i) => (
            <div key={l.name} className={`rounded-2xl p-4 text-center ring-1 ${l.highlight ? "ring-flame/40 shadow-glow" : "ring-overlay/15"}`} style={{ background: `${l.color}15` }}>
              <div className="text-4xl">{l.emoji}</div>
              <p className="text-[9px] uppercase tracking-wider text-muted font-bold mt-2">Niveau {i + 1}</p>
              <p className="font-black mt-0.5" style={{ color: l.color }}>{l.name}</p>
              <p className="text-[10px] text-foreground/60 mt-1">{l.who}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/leagues" className="inline-flex items-center gap-2 text-flame font-bold hover:underline">
            Voir le système complet <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ────── PRICING ENDOGÈNE ────── */}
      <section className="rounded-3xl bg-gradient-to-br from-flame/10 via-overlay/5 to-cyan/10 ring-1 ring-overlay/15 p-8 sm:p-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Pill color="flame"><TrendingDown size={11} className="mr-1" />Pricing endogène</Pill>
            <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
              Ton prix <span className="flame-text">baisse</span><br />
              quand tu deviens fidèle.
            </h2>
            <p className="mt-4 text-foreground/70 text-lg">
              Au démarrage tu paies 9,90 €. Après 6 mois de régularité,
              tu paies <strong className="text-foreground">0 €</strong>. C'est le seul abonnement fitness
              où la mécanique de prix récompense la mécanique du produit.
            </p>
            <Link href="/pricing" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl flame-gradient text-black font-black shadow-glow">
              Voir les tarifs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-2">
            {[
              { streak: "0-6 jours", price: "9,90 €", label: "Démarrage", base: true },
              { streak: "7-29 jours", price: "7,90 €", label: "Habitude" },
              { streak: "30-89 jours", price: "5,90 €", label: "Mode de vie", highlight: true },
              { streak: "90-179 jours", price: "3,90 €", label: "Iron Discipline" },
              { streak: "180+ jours", price: "GRATUIT", label: "Ambassadeur", free: true },
            ].map(t => (
              <div key={t.streak} className={`flex items-center justify-between rounded-2xl p-4 ring-1 ${t.highlight ? "ring-flame/40 bg-flame/10" : t.free ? "ring-gold/40 bg-gold/10" : "ring-overlay/10 bg-overlay/5"}`}>
                <div>
                  <p className="text-sm font-bold">{t.streak}</p>
                  <p className="text-[11px] text-muted">{t.label}</p>
                </div>
                <p className={`text-2xl font-black ${t.free ? "text-gold" : "flame-text"}`}>{t.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── 3 CÔTÉS MONÉTISÉS ────── */}
      <section>
        <header className="mb-10 text-center">
          <Pill color="cyan">Triple-sided marketplace</Pill>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
            Trois côtés. <span className="flame-text">Trois revenus.</span>
          </h2>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto text-lg">
            Membres + clubs + sponsors. Une économie auto-alimentée que personne d'autre n'a construite.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Flame, title: "Côté membre", price: "9,90 → 0 €", desc: "Streak protégé, ligue, classements amis/quartier/club/monde, défis sponso, War Pass, badges à vie.",
              cta: "Voir l'app membre", href: "/user", color: "flame" as const,
            },
            {
              icon: Building2, title: "Côté club", price: "99 → 269 €/mois", desc: "Dashboard, autopilot, 5 ligues, défis 1v1, vitrine coachs, analytics. Tarif baisse selon rétention.",
              cta: "Voir le dashboard club", href: "/club", color: "cyan" as const,
            },
            {
              icon: Crown, title: "Siège HQ", price: "2 490 → 24 900 €/mois", desc: "Carte de France, défis inter-chaînes, war coins budget, sponsoring orchestré, account manager.",
              cta: "Voir le HQ groupe", href: "/hq", color: "gold" as const,
            },
          ].map(o => (
            <div key={o.title} className="rounded-3xl glass-strong p-6 hover:ring-1 hover:ring-flame/30 transition">
              <div className={`w-12 h-12 rounded-2xl bg-${o.color}/15 text-${o.color} grid place-items-center mb-4`}>
                <o.icon size={22} />
              </div>
              <Pill color={o.color}>{o.price}</Pill>
              <h3 className="mt-3 font-black text-2xl">{o.title}</h3>
              <p className="mt-2 text-sm text-foreground/65">{o.desc}</p>
              <Link href={o.href} className="mt-4 inline-flex items-center gap-1.5 text-flame font-bold text-sm hover:underline">
                {o.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ────── FEATURES — la profondeur ────── */}
      <section>
        <header className="mb-10 text-center">
          <Pill color="war">La machine complète</Pill>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
            10 mécaniques de jeu.<br />
            <span className="flame-text">Une seule philosophie.</span>
          </h2>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: MapPin, title: "Carte de quartier", desc: "Visualise les clubs rivaux à proximité. Clic = défi 1v1 lancé en 4 clics." },
            { icon: Swords, title: "Défi 1v1 entre clubs", desc: "Trophée + ×2 bonus à la clé. Le perdant garde ses minutes — c'est la règle." },
            { icon: Trophy, title: "5 ligues internes", desc: "Mamie joue contre mamie. Athlète contre athlète. Personne n'est exclu." },
            { icon: Globe2, title: "Défis sponsorisés ville × cause", desc: "Rolex × MSF Genève. Decathlon × Restos Paris. L'effort devient impact réel." },
            { icon: Sparkles, title: "War Pass mensuel", desc: "Battle pass façon Fortnite. 50 niveaux. Free + Premium 9,99 €." },
            { icon: Crown, title: "Boss Raid hebdomadaire", desc: "Le monde entier s'unit le dimanche. 10M minutes à atteindre en 24h." },
            { icon: Bot, title: "Autopilot pour le club", desc: "8 règles auto: bonus créneaux creux, sauvetage membres, anniversaires." },
            { icon: Building2, title: "Dashboard HQ chaîne", desc: "Carte de France. Défis inter-chaînes. Le PDG entre dans la guerre." },
            { icon: Coins, title: "War Coins", desc: "Monnaie inter-niveaux. Le siège distribue à ses clubs. Membres en gagnent." },
          ].map(o => (
            <div key={o.title} className="rounded-2xl bg-overlay/5 ring-1 ring-overlay/10 p-5 hover:ring-flame/30 transition">
              <o.icon size={20} className="text-flame mb-3" />
              <p className="font-bold">{o.title}</p>
              <p className="text-xs text-muted mt-1.5">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ────── CTA FINAL ────── */}
      <section className="text-center rounded-3xl p-10 sm:p-16 ring-1 ring-flame/30 relative overflow-hidden">
        <div className="absolute inset-0 flame-gradient opacity-[0.12]" />
        <div className="absolute inset-0 grain opacity-25" />
        <div className="relative max-w-3xl mx-auto">
          <Shield className="mx-auto text-flame" size={36} />
          <h2 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight">
            L'app qu'on attend depuis<br />
            <span className="flame-text">20 ans</span>.
          </h2>
          <p className="mt-5 text-foreground/70 text-lg max-w-xl mx-auto">
            Démo cliquable, données réalistes, 9 thèmes commutables, et un système qui scale du membre solo au siège de chaîne nationale.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/user" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl flame-gradient text-black font-black shadow-glow">
              <Flame size={18} /> Entrer dans WARfit
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-overlay/10 ring-1 ring-overlay/20 font-bold">
              <Zap size={18} /> Voir les tarifs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
