# LeadSwap Marketing Website

Application marketing pour LeadSwap avec landing page et page pricing.

## Structure

```
marketing/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Header.css
│   │   ├── Footer.tsx          # Footer avec liens
│   │   └── Footer.css
│   ├── pages/
│   │   ├── LandingPage.tsx     # Page d'accueil
│   │   ├── LandingPage.css
│   │   ├── PricingPage.tsx     # Page de tarification
│   │   └── PricingPage.css
│   ├── styles/
│   │   └── globals.css         # Styles globaux
│   ├── App.tsx                 # Router principal
│   └── main.tsx                # Point d'entrée
├── index.html
├── package.json
└── vite.config.ts
```

## Installation

```bash
cd marketing
npm install
```

## Développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Build

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## Pages

### Landing Page (/)
- Hero section avec CTA principal
- Highlights (3 features principales)
- How it Works (4 étapes)
- Features (grid avec intégrations)
- Final CTA

### Pricing Page (/pricing)
- 5 plans : Free, Hobby, Standard (Popular), Pro, Enterprise
- Toggle Monthly/Yearly (fonctionnel)
- Trust bar avec logos

## Design

Le design est basé exactement sur les maquettes Chatbase dans `/maquette/`:
- Typographie : Inter
- Gradient principal : orange → pink → purple
- Couleurs : zinc pour texte secondaire, white/neutral-50 pour backgrounds
- Border radius : 8px-24px selon les éléments

## Technologies

- React 18
- TypeScript
- React Router 6
- Vite
- CSS3 (Grid, Flexbox)
