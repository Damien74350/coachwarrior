# WARfit

**Gamifie ta forme. Fidélise ton club.**

WARfit transforme le fitness en jeu : la **régularité** est récompensée — pas la performance. Plus tu accumules de minutes, plus tu gagnes des points et tu montes au classement (club, ville, pays, monde). Pour les clubs, c'est un outil de fidélisation complet : dashboard temps réel, ligues internes & inter-clubs, bonus points dynamiques sur les cours, vitrine des coachs.

## Deux espaces

### Côté membre (`/user`)
- **Dashboard** : streak, tier (Bronze → Légende), minutes & points hebdo, rang club + mondial, cours bonus à attraper.
- **Classements** : portée (mon club / ma ville / mon pays / monde) × période (semaine / tout-temps).
- **Mes séances** : historique avec points base + bonus, type d'effort, durée.
- **Profil** : identité de combat, badges, stats à vie, coachs du club, préférences.

### Côté club (`/club`)
- **Dashboard** : KPIs fidélisation (membres actifs, rétention 90j, minutes hebdo, NPS), bonus actifs, top membres, objectifs du mois.
- **Ligues** : interne (membres du club), groupe (clubs du même brand), régionale, internationale + 6 templates prêts à lancer.
- **Membres** : table complète avec filtre par tier, recherche, identification des membres à risque vs champions.
- **Cours & bonus** : multiplicateurs ×1 → ×3 activables par cours, taux de remplissage, bonnes pratiques.
- **Coachs** : vitrine avec ratings, spécialités, followers, badges, mise en avant.
- **Analytics** : cohortes de rétention, performance par cours, impact mesuré des bonus, croissance membres.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** avec palette WARfit (war / flame / gold / cyan / plasma)
- **Recharts** pour les visualisations
- **Lucide** pour les icônes
- Couche données : `lib/mock.ts` — 36 clubs, 240 athlètes, 15 pays, ligues multi-niveaux (extensible vers une vraie DB).

## Lancer

```bash
npm install
npm run dev
# http://localhost:3000
```

Build prod :
```bash
npm run build
npm start
```

## Architecture

```
app/
  layout.tsx              # nav globale + footer
  page.tsx                # landing hero + valeurs
  loading.tsx, error.tsx
  user/
    page.tsx              # dashboard membre
    leaderboard/page.tsx  # classements multi-portée
    sessions/page.tsx     # historique
    profile/page.tsx      # profil + badges
  club/
    page.tsx              # dashboard club
    leagues/page.tsx      # ligues + templates
    members/page.tsx      # base membres
    courses/page.tsx      # cours & bonus
    coaches/page.tsx      # vitrine coachs
    analytics/page.tsx    # cohortes & impact bonus
  api/
    me/route.ts
    club/route.ts
    leaderboard/route.ts

components/
  TopNav, Logo, Card/Stat/Pill,
  MinutesChart, LineGrowthChart, Leaderboard

lib/
  mock.ts                 # données démo réalistes (déterministe)
  types.ts                # User, Club, League, Course, Coach, KPIs
  format.ts               # minutesToHm, tier helpers, compact, %
```

## Prochaines briques (post-MVP)

- Auth (Clerk / NextAuth) + DB (Postgres + Prisma)
- Capteurs : Apple Health / Google Fit / Strava → calcul minutes automatique
- Ingestion check-in club (badge / QR) → minutes vérifiées
- Push notifications (bonus, streak en danger, fin de ligue)
- App mobile React Native partageant `lib/`
- Marketplace coachs
- White-label par chaîne de clubs
