import Link from "next/link";
import { Flame, Trophy, BarChart3, Heart, Building2, ArrowRight, Sparkles, Target, Crown, Award, Users } from "lucide-react";
import { Pill } from "../components/Card";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="relative pt-8 sm:pt-16 pb-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-flame/10 ring-1 ring-flame/30 text-flame text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={12} /> Le fitness, ensemble
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              Ton effort,<br />
              <span className="flame-text">notre histoire.</span>
            </h1>
            <p className="mt-6 text-lg text-foreground/70 max-w-2xl">
              WARfit récompense la <strong className="text-foreground">régularité</strong>, pas la performance.
              Tes minutes nourrissent ton club, ta ville, et des causes qui comptent.
              Que tu fasses du yoga, de la marche, du HIIT — tout compte.
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-overlay/5 ring-1 ring-overlay/10 hover:bg-overlay/10 font-bold transition"
              >
                <Building2 size={18} /> Côté club
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/challenges"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-overlay/5 ring-1 ring-overlay/10 hover:bg-overlay/10 font-bold transition"
              >
                <Heart size={18} /> Défis sponsorisés
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="text-2xl font-black">36</p>
                <p className="text-xs text-foreground/60">clubs partenaires</p>
              </div>
              <div>
                <p className="text-2xl font-black">240+</p>
                <p className="text-xs text-foreground/60">membres actifs</p>
              </div>
              <div>
                <p className="text-2xl font-black flame-text">85k€</p>
                <p className="text-xs text-foreground/60">reversés en mai</p>
              </div>
            </div>
          </div>

          {/* Hero card preview */}
          <div className="lg:col-span-5 relative">
            <div className="glass-strong rounded-3xl p-6 shadow-glow">
              <div className="flex items-center justify-between">
                <Pill color="flame">Quartier · cette semaine</Pill>
                <span className="text-xs text-foreground/50">en direct</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { rank: 1, name: "Sofia M.", flag: "🇪🇸", pts: 587, you: false, tier: "DIAMOND" },
                  { rank: 2, name: "Karim B.", flag: "🇲🇦", pts: 540, you: false, tier: "LEGEND" },
                  { rank: 3, name: "Damien R. (toi)", flag: "🇫🇷", pts: 412, you: true, tier: "PLATINUM" },
                  { rank: 4, name: "Liam S.", flag: "🇬🇧", pts: 398, you: false, tier: "PLATINUM" },
                  { rank: 5, name: "Yuki T.", flag: "🇯🇵", pts: 376, you: false, tier: "GOLD" },
                ].map(r => (
                  <div key={r.rank} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${r.you ? "bg-flame/15 ring-1 ring-flame/30" : "bg-overlay/5"}`}>
                    <div className={`w-7 text-center font-black ${r.rank <= 3 ? "text-flame" : "text-foreground/50"}`}>#{r.rank}</div>
                    <div className="grid place-items-center w-8 h-8 rounded-lg bg-overlay/10 text-xs font-bold">
                      {r.flag}
                    </div>
                    <div className="flex-1 text-sm font-semibold">{r.name}</div>
                    <div className="text-right">
                      <p className="font-black text-flame">{r.pts}<span className="text-foreground/40 text-xs"> pts</span></p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-overlay/10 pt-4">
                <div className="text-xs text-foreground/60">Ta semaine</div>
                <div className="flex items-center gap-1 text-sm">
                  <Flame size={14} className="text-flame" />
                  <span className="font-black">386 min</span>
                  <span className="text-foreground/40">·</span>
                  <span className="font-black flame-text">412 pts</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-3 glass rounded-2xl px-3 py-2 text-xs hidden sm:flex items-center gap-2 shadow-glow floaty">
              <Flame size={14} className="text-flame" />
              <span className="font-bold">47 jours d'affilée</span>
            </div>
            <div className="absolute -bottom-4 -left-3 glass rounded-2xl px-3 py-2 text-xs hidden sm:flex items-center gap-2 floaty" style={{ animationDelay: "2s" }}>
              <Heart size={14} className="text-flame" />
              <span className="font-bold">Genève → MSF — 312k/430k min</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE — MEMBERS */}
      <section>
        <header className="mb-8">
          <Pill color="flame">Pour les membres</Pill>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            La régularité, ça change tout.
          </h2>
          <p className="mt-2 text-foreground/70 max-w-2xl">
            Pas besoin d'être un athlète. Chaque minute d'activité compte —
            qu'elle soit en cours de yoga, en marche, à la salle ou en piscine.
            Tu accumules des points, tu montes en tiers, tu gagnes des badges,
            tu participes aux classements de tes amis, ton quartier, ton club.
          </p>
        </header>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Flame, title: "1 minute = 1 point", desc: "Aucun jugement, aucune compétition cachée. Marche, yoga, force, danse — tout compte." },
            { icon: Users, title: "Classements à ton échelle", desc: "D'abord tes amis et ton quartier. Le mondial est là si tu veux, mais pas imposé." },
            { icon: Crown, title: "Tiers & badges à vie", desc: "Tes acquis ne se perdent jamais. Les classements actifs se renouvellent chaque saison." },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:ring-1 hover:ring-flame/30 transition">
              <div className="w-10 h-10 rounded-xl flame-gradient grid place-items-center text-black mb-3">
                <f.icon size={20} />
              </div>
              <h3 className="font-black text-lg">{f.title}</h3>
              <p className="mt-1 text-sm text-foreground/65">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE — CLUBS */}
      <section>
        <header className="mb-8">
          <Pill color="cyan">Pour les clubs</Pill>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            La fidélisation, sans effort.
          </h2>
          <p className="mt-2 text-foreground/70 max-w-2xl">
            Dashboard temps réel, autopilot qui gère bonus et ligues à ta place,
            défis sponsorisés qui ramènent de la visibilité et des dons.
            Tes membres deviennent une communauté qui revient.
          </p>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: BarChart3, title: "Dashboard temps réel", desc: "Membres actifs, rétention, NPS. Tout au même endroit, en clair." },
            { icon: Trophy, title: "Ligues internes & inter-clubs", desc: "Compétitions amicales entre membres, ou entre clubs de ta région." },
            { icon: Target, title: "Bonus dynamiques", desc: "Remplis tes créneaux creux avec des multiplicateurs de points." },
            { icon: Heart, title: "Défis sponsorisés", desc: "Marques et causes choisissent ta ville. Pub gratuite + impact réel." },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="w-9 h-9 rounded-lg bg-cyan/20 text-cyan grid place-items-center mb-3">
                <f.icon size={18} />
              </div>
              <h3 className="font-bold">{f.title}</h3>
              <p className="mt-1 text-xs text-foreground/65">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="glass-strong rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 grain pointer-events-none" />
        <div className="absolute inset-0 flame-gradient opacity-[0.08]" />
        <div className="relative">
          <Heart className="mx-auto text-flame" size={32} />
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
            L'effort qui compte vraiment, <span className="flame-text">ensemble</span>.
          </h2>
          <p className="mt-3 text-foreground/70 max-w-xl mx-auto">
            Choisis ton côté. La démo est interactive — change le thème en bas à droite, à ton goût.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link href="/user" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl flame-gradient text-black font-bold shadow-glow">
              <Flame size={18} /> Côté membre
            </Link>
            <Link href="/club" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-overlay/5 ring-1 ring-overlay/10 hover:bg-overlay/10 font-bold">
              <Building2 size={18} /> Côté club
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
