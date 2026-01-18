# LeadSwap

**Don't buy leads. Build them.**

LeadSwap is an AI agent that sources, verifies, and enriches B2B prospects in real-time. No more stale databases.

---

## 🚀 Quick Start

### Marketing Website

```bash
# Démarrer le site marketing
./start-marketing.sh

# Ou manuellement
cd marketing
npm install
npm run dev
```

Accédez à http://localhost:3000

**Pages disponibles** :
- `/` - Landing page complète
- `/pricing` - Page de tarification

### Agent Backend

```bash
npm install
npm run dev
```

---

## 📁 Structure du Projet

```
LeadSwap/
├── marketing/              # 🌐 Site marketing (Vite + React + React Router)
│   ├── src/
│   │   ├── components/    # Header, Footer
│   │   ├── pages/         # LandingPage, PricingPage
│   │   └── styles/        # CSS globaux
│   └── package.json
│
├── src/                   # 🤖 Agent LeadSwap (Node.js)
│   ├── lib/
│   │   ├── exa.ts        # Intégration Exa.ai
│   │   └── lightpanda.ts # Intégration Lightpanda
│   └── index.ts
│
├── BMAD-METHOD/           # 🎨 Générateur de maquettes
│
├── LANDING_CONTENT.md     # ✍️ Contenu de la landing
├── MARKETING_APP.md       # 📖 Documentation app marketing
├── CUSTOMIZATIONS.md      # 🎨 Différences Chatbase vs LeadSwap
├── DEPLOYMENT.md          # 🚀 Guide de déploiement
└── README.md              # 📄 Ce fichier
```

---

## 🎯 Features

### Marketing Website

✅ **Landing Page complète**
- Hero section avec CTA gradient
- Highlights (Neural Search, Live Verification, Enrichment)
- How it Works (4 étapes)
- Features grid avec intégrations
- Final CTA

✅ **Page Pricing**
- 5 plans : Free, Hobby, Standard (Popular), Pro, Enterprise
- Toggle Monthly/Yearly fonctionnel
- Design pixel-perfect basé sur Chatbase

✅ **Navigation**
- Header fixe avec routing
- Footer complet
- Active states

✅ **Design System**
- Font : Inter
- Gradient : orange→pink→purple
- Responsive
- Animations smooth

### Agent Backend

🔧 **En développement**
- Intégration Exa.ai (semantic search)
- Intégration Lightpanda (web scraping)
- Enrichissement de données
- Export CSV/JSON

---

## 🛠️ Technologies

### Marketing
- ⚡ **Vite** - Build tool
- ⚛️ **React 18** - UI library
- 🛣️ **React Router 6** - Routing
- 📘 **TypeScript** - Type safety
- 🎨 **CSS3** - Styling

### Agent
- 🟢 **Node.js** - Runtime
- 🔍 **Exa.ai** - Semantic search
- 🐼 **Lightpanda** - Web scraping
- 🌪️ **Dust** - AI orchestration

---

## 📚 Documentation

- **[MARKETING_APP.md](./MARKETING_APP.md)** - Documentation complète de l'app marketing
- **[CUSTOMIZATIONS.md](./CUSTOMIZATIONS.md)** - Différences Chatbase vs LeadSwap
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide de déploiement complet
- **[LANDING_CONTENT.md](./LANDING_CONTENT.md)** - Contenu de la landing page

---

## 🎨 Design

Le design est basé exactement sur les maquettes Chatbase avec customisation LeadSwap :

**Conservé** :
- Structure layout
- Système de couleurs
- Typographie Inter
- Gradient signature
- Card designs

**Personnalisé** :
- Textes (B2B lead generation)
- Features (Neural Search, Tech Detection)
- Intégrations (Salesforce, HubSpot, etc.)
- Branding LeadSwap

---

## 🚀 Déploiement

### Option 1: Vercel (Recommandé)

```bash
cd marketing
vercel
```

### Option 2: Netlify

```bash
cd marketing
netlify deploy --prod
```

### Option 3: Build manuel

```bash
cd marketing
npm run build
# Les fichiers sont dans dist/
```

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour plus d'options.

---

## 📝 TODO

### Marketing Site
- [ ] Remplacer logo Chatbase par LeadSwap
- [ ] Ajouter vraies vidéos démo
- [ ] Screenshots réels des features
- [ ] Vrais logos clients
- [ ] Analytics (Google Analytics / Plausible)
- [ ] SEO optimization
- [ ] Blog section

### Agent
- [ ] Finaliser intégration Exa.ai
- [ ] Implémenter Lightpanda scraping
- [ ] Enrichissement email
- [ ] Export système
- [ ] API endpoints
- [ ] Dashboard admin

---

## 🏆 Hackathon

**Built for Generative AI Hackathon**

Powered by:
- **Dust** - AI orchestration
- **Exa.ai** - Semantic search
- **Lightpanda** - Web scraping

---

## 📄 License

MIT

---

## 🤝 Contributing

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📧 Contact

Pour questions ou feedback :
- Twitter: [@leadswap](https://twitter.com/leadswap)
- Email: contact@leadswap.com

---

**© 2025 LeadSwap** - Don't buy leads. Build them.
