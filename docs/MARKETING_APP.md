# LeadSwap - Application Marketing Complète

## Ce qui a été créé

J'ai créé une **application marketing complète** pour LeadSwap avec routing et deux pages principales basées exactement sur les designs des maquettes Chatbase.

### Structure du projet

```
LeadSwap/
└── marketing/                    # 🆕 Application marketing
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx        # Navigation avec routing
    │   │   ├── Header.css
    │   │   ├── Footer.tsx        # Footer avec liens
    │   │   └── Footer.css
    │   ├── pages/
    │   │   ├── LandingPage.tsx   # Page d'accueil complète
    │   │   ├── LandingPage.css
    │   │   ├── PricingPage.tsx   # Page de tarification
    │   │   └── PricingPage.css
    │   ├── styles/
    │   │   └── globals.css       # Styles globaux + font Inter
    │   ├── App.tsx               # Router React
    │   └── main.tsx              # Point d'entrée
    ├── index.html
    ├── package.json              # Vite + React + React Router
    ├── vite.config.ts
    └── README.md
```

## Fonctionnalités

### ✅ Page Landing (/)

Basée sur le contenu de `LANDING_CONTENT.md` et le design de `maquette/landingchatbase/`:

1. **Hero Section**
   - Titre principal : "Don't buy leads. Build them."
   - Sous-titre avec proposition de valeur
   - CTA principal avec gradient orange→pink
   - Vidéo/démo
   - Trust bar avec logos clients

2. **Highlights Section** (fond gris)
   - Badge avec point gradient
   - 3 cartes : Neural Search, Live Verification, Instant Enrichment
   - Images et descriptions

3. **How it Works Section**
   - 4 étapes avec système de tabs
   - Vidéo démo
   - Step actif avec style différent

4. **Features Section**
   - Grid avec 2 grandes features
   - 3 petites features
   - Carte intégrations avec logos
   - 3 features additionnelles (API, Webhook, Learning)

5. **Final CTA Section** (fond noir)
   - Badge "Get Started"
   - Titre et sous-titre
   - CTA avec gradient

### ✅ Page Pricing (/pricing)

Basée exactement sur le design de `maquette/priciing/`:

1. **Header avec background grid**
   - Lignes verticales en gradient (effet de fond)
   - Titre : "Predictable pricing scalable plans"

2. **Toggle Monthly/Yearly**
   - Switcher fonctionnel
   - Animation smooth avec background

3. **5 Plans de pricing**
   - **Free** : $0/mois
   - **Hobby** : $40/mois
   - **Standard** : $150/mois (Popular badge)
   - **Pro** : $500/mois
   - **Enterprise** : "Let's Talk"

4. **Features par plan**
   - Icônes checkmark
   - Tooltips avec underline dotted
   - "Everything in X +" pour clarifier l'héritage
   - Notes spéciales (ex: "AI agents deleted after 14 days")

5. **Trust bar**
   - "Trusted by 10,000+ businesses worldwide"
   - Logos clients

### ✅ Navigation

- **Header fixe** en haut
  - Logo LeadSwap (cliquable → home)
  - Nav links : Resources (dropdown), Enterprise, Pricing
  - Actions : Sign in, Try for Free
  - Active state sur la page Pricing

- **Footer** complet
  - Logo et tagline
  - 4 colonnes : Product, Resources, Company
  - Crédits hackathon : "Powered by Dust · Exa.ai · Lightpanda"
  - Copyright

### ✅ Design System

**Exactement comme les maquettes Chatbase :**

- Font : Inter (chargée depuis Google Storage)
- Couleurs :
  - Primary : #18181b (zinc-950)
  - Secondary text : #71717a (zinc-500)
  - Borders : #e4e4e7 (zinc-200)
  - Background : white / #fafafa (neutral-50)
- Gradient signature : orange (#fb926c) → pink (#f472b6) → purple (#e879f9)
- Border radius : 8px (buttons), 16px-24px (cards)
- Spacing : système cohérent en multiples de 4px

## Comment utiliser

### 1. Installation

```bash
cd marketing
npm install
```

### 2. Développement

```bash
npm run dev
```

L'application démarre sur **http://localhost:3000**

### 3. Navigation

- **/** → Landing page complète
- **/pricing** → Page de tarification

### 4. Build pour production

```bash
npm run build
```

Les fichiers optimisés sont dans `dist/`

### 5. Preview du build

```bash
npm run preview
```

## Technologies utilisées

- ⚡ **Vite** - Build tool ultra-rapide
- ⚛️ **React 18** - UI library
- 🛣️ **React Router 6** - Routing client-side
- 📘 **TypeScript** - Type safety
- 🎨 **CSS3** - Grid, Flexbox, animations

## Personnalisation pour LeadSwap

Le contenu de `LANDING_CONTENT.md` a été intégré dans la landing page. Pour modifier le texte :

1. **Landing Page** : Éditez `/marketing/src/pages/LandingPage.tsx`
   - Changez les titres, sous-titres, descriptions
   - Ajoutez/retirez des sections

2. **Pricing** : Éditez `/marketing/src/pages/PricingPage.tsx`
   - Modifiez les prix
   - Ajoutez/retirez des features
   - Changez les plans

3. **Styles** : Éditez les fichiers `.css` correspondants

## Points importants

✅ **Design pixel-perfect** basé sur les maquettes
✅ **Routing fonctionnel** entre pages
✅ **TypeScript sans erreurs**
✅ **Responsive** (media queries incluses)
✅ **Performance** (Vite + React optimisé)
✅ **SEO-ready** (meta tags dans index.html)
✅ **Animations smooth** (transitions CSS)

## Prochaines étapes possibles

1. 🎬 **Ajouter de vraies vidéos** (remplacer les placeholders)
2. 🖼️ **Screenshots réels** de l'app LeadSwap
3. 📊 **Analytics** (Google Analytics, Plausible)
4. 🎨 **Animations** avancées (Framer Motion)
5. 📱 **Mobile optimization** poussée
6. 🌐 **i18n** (multi-langue)
7. 📝 **Blog** section
8. 💬 **Chat widget** (Intercom, Crisp)

## Support

Pour toute question ou modification :
- Consultez le code dans `/marketing/src/`
- Chaque composant a son fichier CSS dédié
- Le routing est dans `App.tsx`
- Les pages sont dans `/pages/`

---

**Créé pour le Hackathon IA Générative**
Powered by Dust · Exa.ai · Lightpanda
