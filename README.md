# CoachWarrior

Application web qui vous donne **tout** sur une crypto ou une action : prix, fondamentaux, indicateurs techniques, et un **signal clair** sur le bon moment pour vous positionner.

## Fonctionnalités

- **Recherche universelle** : tapez un ticker ou un nom, l'app détecte automatiquement s'il s'agit d'une crypto ou d'une action.
- **Fiche complète** :
  - Prix temps réel, variations 24h / 7j / 30j / 1 an, capitalisation, volume, ATH/ATL ou 52-semaines.
  - Pour les cryptos : offre circulante, max supply, rang, catégories, description.
  - Pour les actions : secteur, industrie, P/E, dividende, bêta, actions en circulation, plus-haut/plus-bas 52 semaines.
- **Indicateurs techniques** calculés côté serveur :
  - RSI(14), MACD(12,26,9), EMA(12/26), SMA(20/50/200), Bandes de Bollinger(20, 2σ), volatilité annualisée 30j.
- **Signal de positionnement** : `STRONG_BUY` / `BUY` / `HOLD` / `SELL` / `STRONG_SELL`, avec score chiffré (−100 à +100), niveau de confiance, et liste détaillée des raisons (chaque facteur contribuant au signal).
- **Graphique** prix + SMA20/SMA50 sur 1M / 3M / 6M / 1A / Tout.
- **Historique de consultation** local (localStorage) + suggestions rapides.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Recharts pour les graphiques
- Lucide pour les icônes
- APIs publiques **sans clé** :
  - [CoinGecko](https://www.coingecko.com/en/api/documentation) pour les cryptos
  - [Yahoo Finance](https://finance.yahoo.com/) (endpoints publics) pour les actions

## Démarrage

```bash
npm install
npm run dev
# ouvre http://localhost:3000
```

Build production :

```bash
npm run build
npm start
```

## Déploiement

Le projet est prêt pour Vercel : push sur GitHub, importer le repo dans Vercel, déployer.

## Architecture

```
app/
  layout.tsx                  # Layout racine
  page.tsx                    # Page d'accueil (recherche + résultats)
  globals.css                 # Styles + dégradés
  api/
    search/route.ts           # GET /api/search?q=...
    asset/route.ts            # GET /api/asset?kind=crypto|stock&id=...

components/
  SearchBar.tsx               # Recherche avec autocomplete (debounce, clavier)
  AssetView.tsx               # Vue principale (fetch + composition)
  AssetHeader.tsx             # Nom, prix, badge, description
  SignalBadge.tsx             # Le signal d'achat/vente
  ReasonsList.tsx             # Liste des raisons du signal
  PriceChart.tsx              # Graphique Recharts
  MetricsGrid.tsx             # Grille des métriques de marché
  IndicatorsPanel.tsx         # Panneau des indicateurs techniques

lib/
  indicators.ts               # SMA/EMA/RSI/MACD/Bollinger + moteur de scoring
  providers.ts                # Wrappers CoinGecko & Yahoo Finance
  format.ts                   # Helpers de formatage (money, %, compact, date)
  types.ts                    # Types partagés
```

## Comment le signal est calculé

Le moteur (`lib/indicators.ts → analyze()`) combine plusieurs facteurs avec des poids :

| Facteur                         | Poids | Bullish quand…                            | Bearish quand…                            |
|---------------------------------|-------|-------------------------------------------|-------------------------------------------|
| RSI(14)                         | 25    | RSI < 30 (survente)                       | RSI > 70 (surachat)                       |
| MACD vs signal                  | 20    | MACD > signal et histogramme > 0          | MACD < signal et histogramme < 0          |
| Tendance SMA50/SMA200           | 25    | Prix > SMA50 > SMA200 (golden cross zone) | Prix < SMA50 < SMA200 (death cross zone)  |
| Bandes de Bollinger             | 10    | Prix sous la bande basse                  | Prix au-dessus de la bande haute          |
| Variation 7j                    | 10    | Forte baisse (−10% → rebond probable)     | Forte hausse (+10% → prise de bénéfice)   |
| Volatilité 30j                  | 10    | (info contextuelle, neutre)               | (info contextuelle, neutre)               |

Le score est normalisé entre −100 et +100, puis catégorisé :

- score ≥ +50 → `STRONG_BUY`
- score ≥ +20 → `BUY`
- −20 < score < +20 → `HOLD`
- score ≤ −20 → `SELL`
- score ≤ −50 → `STRONG_SELL`

## ⚠️ Avertissement

Cet outil est fourni à titre informatif et **ne constitue pas un conseil en investissement**. Les marchés financiers comportent des risques de perte en capital. Faites vos propres recherches.
