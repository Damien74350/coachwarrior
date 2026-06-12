"use client";

import Link from "next/link";
import { Card, Pill } from "../../components/Card";
import { MEMBER_PRICING_TIERS, CLUB_PRICING_TIERS, HQ_PRICING_TIERS, MY_PRICING } from "../../lib/mock";
import { Flame, Check, ArrowRight, Crown, Shield, Sparkles, TrendingDown, Heart, Building2 } from "lucide-react";

export default function PricingPage() {
  const savedThisYearGlobal = MY_PRICING.savedThisYear;

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative rounded-3xl overflow-hidden ring-1 ring-flame/30 p-6 sm:p-16 text-center">
        <div className="absolute inset-0 flame-gradient opacity-[0.12]" />
        <div className="absolute inset-0 grain opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <Pill color="flame">Prix endogènes à la valeur</Pill>
          <h1 className="mt-4 text-4xl sm:text-7xl font-black tracking-tight leading-[1.02]">
            Plus tu y vas,<br />
            <span className="flame-text">moins tu paies.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto">
            Le seul abonnement fitness où ta facture baisse quand notre produit marche.
            Aucun concurrent ne peut copier ça sans renier sa proposition de valeur.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/user" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl flame-gradient text-black font-black shadow-glow">
              <Flame size={18} /> Commencer
            </Link>
            <Link href="#clubs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-overlay/10 ring-1 ring-overlay/20 font-bold">
              <Building2 size={18} /> Prix clubs
            </Link>
          </div>
        </div>
      </section>

      {/* TON STATUT ACTUEL */}
      <section>
        <header className="mb-6">
          <Pill color="flame">Ta situation</Pill>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black">Tu paies <span className="flame-text">{MY_PRICING.effectivePrice.toFixed(2)} €/mois</span></h2>
          <p className="mt-2 text-foreground/70">Au lieu de {MY_PRICING.basePrice.toFixed(2)} €. Économie de <strong className="text-flame">{savedThisYearGlobal} €/an</strong> grâce à ta régularité.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flame-gradient grid place-items-center text-black">
                <Flame size={22} />
              </div>
              <div>
                <p className="text-xs text-muted">Ton streak actuel</p>
                <p className="font-black text-2xl"><span className="flame-text">{MY_PRICING.currentStreak}</span> jours</p>
              </div>
              <Pill color="flame">{MY_PRICING.currentTier.badge}</Pill>
            </div>

            {/* Progression vers le tier suivant */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold">{MY_PRICING.currentTier.effectiveEUR.toFixed(2)} €</span>
                <span className="text-muted">Encore {MY_PRICING.daysToNextTier} jours pour</span>
                <span className="font-bold flame-text">{MY_PRICING.nextTier.effectiveEUR.toFixed(2)} €</span>
              </div>
              <div className="h-3 rounded-full bg-overlay/10 overflow-hidden ring-1 ring-overlay/10">
                <div className="h-full flame-gradient" style={{ width: `${(MY_PRICING.currentStreak / 90) * 100}%` }} />
              </div>
              <p className="mt-3 text-sm text-foreground/70">
                À ce rythme, tu seras <strong className="text-flame">Iron Discipline</strong> dans {MY_PRICING.daysToNextTier} jours et tu paieras <strong>3,90 €/mois</strong>.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center py-3">
              <Crown size={28} className="text-gold mx-auto mb-2" />
              <p className="text-2xl font-black flame-text">Ambassadeur</p>
              <p className="text-xs text-muted">Streak 180+</p>
              <p className="mt-3 text-3xl font-black">0 € <span className="text-base text-muted font-normal">/ mois</span></p>
              <p className="text-[11px] text-muted mt-1">+ War Pass Premium offert</p>
              <p className="text-[10px] text-flame mt-3 font-bold">
                Plafonné à 5% des membres par club — places limitées
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* GRILLE MEMBRE */}
      <section>
        <header className="mb-8 text-center">
          <Pill color="flame">Côté membre</Pill>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">Récompense de régularité</h2>
          <p className="mt-3 text-foreground/70 max-w-2xl mx-auto">
            Ton prix mensuel baisse à chaque palier de streak. Tu peux atteindre le gratuit en 6 mois.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MEMBER_PRICING_TIERS.map(t => {
            const isHighlight = t.highlight;
            const isFree = t.effectiveEUR === 0;
            return (
              <div
                key={t.id}
                className={`relative rounded-3xl p-5 ring-1 transition ${
                  isHighlight ? "ring-flame/60 shadow-glow" : "ring-overlay/15"
                } ${isFree ? "bg-flame/10" : "bg-overlay/5"}`}
              >
                {isHighlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full flame-gradient text-black text-[10px] font-black uppercase tracking-wider">
                    Le sweet spot
                  </span>
                )}
                {isFree && (
                  <Crown size={16} className="absolute top-3 right-3 text-gold" />
                )}
                <p className="text-[10px] uppercase tracking-wider text-muted font-bold">{t.label}</p>
                <p className="text-4xl font-black mt-2">
                  {isFree ? "GRATUIT" : <>{t.effectiveEUR.toFixed(2)} <span className="text-base text-muted font-normal">€</span></>}
                </p>
                {!isFree && t.baseEUR > t.effectiveEUR && (
                  <p className="text-xs text-muted line-through">{t.baseEUR.toFixed(2)} €</p>
                )}
                <p className="mt-3 text-sm font-semibold">{t.trigger}</p>
                {t.badge && t.badge !== "—" && (
                  <span className={`inline-block mt-3 text-[10px] font-black px-2 py-0.5 rounded-full ${isFree ? "bg-gold text-foreground" : "bg-flame/20 text-flame"}`} style={{ color: isFree ? "#0a0a0f" : undefined }}>
                    {t.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <Shield size={11} className="inline -mt-0.5 mr-1" />
          Streak protégé : 1 semaine de pause gratuite par trimestre · descente progressive (-10%/mois) jamais brutale
        </p>
      </section>

      {/* GRILLE CLUB */}
      <section id="clubs">
        <header className="mb-8 text-center">
          <Pill color="cyan">Côté club</Pill>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">Récompense d'engagement</h2>
          <p className="mt-3 text-foreground/70 max-w-2xl mx-auto">
            Plus ton club performe sur la rétention et les défis, moins il paie.
            Les mauvais clubs paient le plein tarif.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-5">
          {CLUB_PRICING_TIERS.map(t => (
            <div
              key={t.id}
              className={`relative rounded-3xl p-6 ring-1 ${t.highlight ? "ring-flame/50 shadow-glow bg-flame/5" : "ring-overlay/15 bg-overlay/5"}`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full flame-gradient text-black text-[10px] font-black uppercase tracking-wider">
                  Le plus choisi
                </span>
              )}
              <p className="text-xs uppercase tracking-wider text-muted font-bold">{t.label}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-4xl font-black flame-text">{t.effectiveEUR} €</p>
                <p className="text-sm text-muted">/ mois</p>
              </div>
              <p className="text-xs text-muted line-through mt-0.5">{t.baseEUR} € sans bonus</p>

              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check size={14} className="text-flame" /> Dashboard fidélisation complet</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-flame" /> Autopilot 8 règles</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-flame" /> 5 ligues internes par niveau</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-flame" /> Défis 1v1 avec clubs du quartier</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-flame" /> Vitrine coachs & cours</li>
                <li className="flex items-center gap-2 font-bold"><Sparkles size={14} className="text-flame" /> {t.trigger}</li>
              </ul>

              <button className={`mt-6 w-full px-4 py-2.5 rounded-xl font-bold text-sm ${t.highlight ? "flame-gradient text-black shadow-glow" : "bg-overlay/10 ring-1 ring-overlay/20 hover:bg-overlay/20"}`}>
                Démo gratuite 30 jours
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* GRILLE HQ */}
      <section>
        <header className="mb-8 text-center">
          <Pill color="gold">Sièges de chaîne — HQ</Pill>
          <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">Pour les groupes nationaux</h2>
          <p className="mt-3 text-foreground/70 max-w-2xl mx-auto">
            Dashboard PDG, carte de France, défis inter-chaînes, war coins, sponsoring orchestré.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-5">
          {HQ_PRICING_TIERS.map(t => (
            <div key={t.id} className={`rounded-3xl p-6 ring-1 ${t.highlight ? "ring-gold/40 bg-gold/5" : "ring-overlay/15 bg-overlay/5"}`}>
              <p className="text-xs uppercase tracking-wider text-muted font-bold">{t.label}</p>
              <p className="text-4xl font-black mt-3" style={{ color: t.highlight ? "rgb(var(--c-gold))" : undefined }}>
                {t.effectiveEUR.toLocaleString("fr-FR")} €
                <span className="text-sm text-muted font-normal">/ mois</span>
              </p>
              <p className="text-xs text-muted mt-2">{t.trigger}</p>
              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> Tout du tier club +</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> Dashboard HQ national</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> Carte de France live</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> Défis inter-chaînes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> Budget war coins mensuel</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-gold" /> Account manager dédié</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SPONSORS */}
      <section className="rounded-3xl ring-1 ring-flame/30 p-8 relative overflow-hidden">
        <div className="absolute inset-0 flame-gradient opacity-[0.06]" />
        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <Pill color="war">Sponsors</Pill>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black">Pour les marques qui veulent du sens</h2>
            <p className="mt-3 text-foreground/70">
              Sponsorise un défi ville × cause. Ton don n'est versé que si la ville l'a mérité.
              Brand purpose mesurable, jamais vu avant.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Heart size={14} className="text-flame" /> Lien direct entre effort réel et impact réel</li>
              <li className="flex items-center gap-2"><Heart size={14} className="text-flame" /> Visibilité dans tous les clubs partenaires de la ville</li>
              <li className="flex items-center gap-2"><Heart size={14} className="text-flame" /> Communiqué fin de défi avec chiffres</li>
              <li className="flex items-center gap-2"><Heart size={14} className="text-flame" /> Data anonymisée des athlètes mobilisés</li>
            </ul>
          </div>

          <div className="rounded-2xl glass-strong p-6">
            <p className="text-xs text-muted">Exemple — Genève × MSF</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between"><span>Don sponsor</span><strong>20 000 CHF</strong></li>
              <li className="flex justify-between"><span>Frais plateforme WARfit</span><strong>+ 3 000 CHF</strong></li>
              <li className="flex justify-between"><span>Membres exposés</span><strong>4 800+</strong></li>
              <li className="flex justify-between"><span>Clubs partenaires</span><strong>14</strong></li>
              <li className="flex justify-between text-flame border-t border-overlay/10 pt-2"><span>Coût par membre touché</span><strong>4,80 CHF</strong></li>
            </ul>
            <p className="mt-4 text-[11px] text-muted">vs panneau Insta — ~12-25 € coût par 1000 vues sans engagement émotionnel</p>
          </div>
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section>
        <header className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black">Pourquoi cette structure est intouchable</h2>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: TrendingDown, title: "Prix = preuve produit", text: "Quand tu paies moins, c'est notre produit qui marche. Mécanique d'alignement parfaite." },
            { icon: Shield, title: "Anti-churn structurel", text: "Quitter coûte plus cher que rester. Tes économies disparaissent en partant." },
            { icon: Sparkles, title: "Storytelling de génie", text: "« L'abo qui baisse quand on y va » — un slogan à la Apple." },
            { icon: Crown, title: "Ambassadeurs gratuits", text: "Tes meilleurs membres deviennent ton armée de bouche-à-oreille naturelle." },
          ].map(o => (
            <div key={o.title} className="rounded-2xl bg-overlay/5 ring-1 ring-overlay/10 p-5">
              <o.icon size={20} className="text-flame mb-2" />
              <p className="font-bold">{o.title}</p>
              <p className="text-xs text-muted mt-1">{o.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
