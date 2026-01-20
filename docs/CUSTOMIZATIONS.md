# Customizations LeadSwap - Différences avec Chatbase

## Textes modifiés (basés sur LANDING_CONTENT.md)

### Landing Page

| Section | Chatbase | LeadSwap |
|---------|----------|----------|
| **Hero Title** | "AI agents for magical customer experiences" | "Don't buy leads. Build them." |
| **Hero Subtitle** | "Chatbase is the complete platform for building & deploying AI support agents" | "LeadSwap is the AI agent that sources, verifies, and enriches B2B prospects in real-time. No more stale databases." |
| **CTA Button** | "Build your agent" | "Start Building Leads" |
| **Trust Bar** | "Trusted by 10,000+ businesses worldwide" | "Used by 500+ sales teams" |

### Highlights Section

| Chatbase | LeadSwap |
|----------|----------|
| **Title**: "The complete platform for AI support agents" | "The complete platform for AI-powered lead generation" |
| **Card 1**: "Purpose-built for LLMs" | "Neural-powered search" |
| **Card 2**: "Designed for simplicity" | "Live web verification" |
| **Card 3**: "Engineered for security" | "Instant enrichment" |

### How it Works Section

| Chatbase | LeadSwap |
|----------|----------|
| **Title**: "An end-to-end solution for conversational AI" | "An end-to-end solution for lead generation" |
| **Step 1**: "Build & deploy your agent" | "Describe your ICP" |
| **Step 2**: "Agent solves your customers' problems" | "Agent hunts the web" |
| **Step 3**: "Refine & optimize" | "Review & refine" |
| **Step 4**: "Route complex issues to a human" | "Export qualified leads" |

### Features Section

| Chatbase | LeadSwap |
|----------|----------|
| **Title**: "Build the perfect customer-facing AI agent" | "Build the perfect B2B prospecting agent" |
| **Feature 1**: "Sync with real-time data" | "Search by meaning, not keywords" |
| **Feature 2**: "Take actions on your systems" | "Know their tools before you reach out" |
| **Small 1**: "Compare AI models" | "Find lookalikes" |
| **Small 2**: "Smart escalation" | "Get contact info" |
| **Small 3**: "Advanced reporting" | "Relevance scoring" |

### Integrations

| Chatbase | LeadSwap |
|----------|----------|
| Zendesk, Slack, Stripe, Salesforce, WhatsApp, Messenger | Salesforce, Notion, Zapier, HubSpot, Airtable, CSV, JSON |

### Final CTA

| Chatbase | LeadSwap |
|----------|----------|
| No CTA section | "Ready to stop buying stale leads?" |
| - | "Join 500+ sales teams already using LeadSwap" |

### Footer

| Chatbase | LeadSwap |
|----------|----------|
| **Product**: Features, Pricing, API Docs | Features, Pricing, API Docs, Changelog |
| **Resources**: Blog, Docs | Blog, Guide: ICP Definition, Guide: B2B Prospecting |
| **Bottom**: "© 2025 Chatbase" | "Built for the Generative AI Hackathon<br>Powered by Dust · Exa.ai · Lightpanda<br>© 2025 LeadSwap" |

## Pricing Page

La structure reste identique à Chatbase, mais adaptée pour LeadSwap :

- Même système de 5 plans (Free, Hobby, Standard, Pro, Enterprise)
- Même design avec Popular badge sur Standard
- Mêmes prix que dans la maquette Chatbase
- Features adaptées au contexte B2B lead generation

## Design conservé

### ✅ Éléments gardés à l'identique

- Font family : Inter
- Gradient orange→pink→purple
- Système de couleurs zinc
- Border radius : 8px-24px
- Spacing system
- Layout grid
- Card designs
- Button styles
- Badge avec dot gradient
- Trust bar avec logos
- Header fixe
- Footer structure

### ✅ Animations conservées

- Hover states sur buttons
- Transitions smooth
- Video controls
- Tab switching (How it Works)
- Toggle Monthly/Yearly

## Images et Assets

### Conservés depuis Chatbase

- Tous les logos entreprises (trust bar)
- Icônes de features (checkmarks, etc.)
- Icônes de plans pricing
- Structure des screenshots

### À remplacer par LeadSwap

- [ ] Vidéo hero (démo de l'agent LeadSwap)
- [ ] Screenshots des features
- [ ] Vidéo "How it Works"
- [ ] Logo LeadSwap (actuellement logo Chatbase)
- [ ] Logos d'intégrations spécifiques à LeadSwap

## URLs à mettre à jour

### Header
- `/dashboard` → URL de votre app LeadSwap
- `/signin` → Votre page de connexion
- `/signup` → Votre page d'inscription

### Footer
- `/docs` → Documentation API
- `/blog` → Blog LeadSwap
- `/guide/icp` → Guide ICP
- `/guide/b2b` → Guide B2B Prospecting
- `/about` → À propos
- `/contact` → Contact
- Twitter URL → Compte Twitter LeadSwap

## Contenu à personnaliser

### Priorité 1 (critique)

1. **Logo** : Remplacer le logo Chatbase par LeadSwap
2. **Vidéos** : Ajouter des démos réelles de LeadSwap
3. **Screenshots** : Features avec vraies captures d'écran
4. **Logos clients** : Ajouter vrais logos de clients LeadSwap

### Priorité 2 (important)

5. **Integrations** : Logos des vraies intégrations
6. **Testimonials** : Ajouter des témoignages clients
7. **Metrics** : Mettre à jour "500+ sales teams" avec vraies stats
8. **Case studies** : Ajouter section avec success stories

### Priorité 3 (nice to have)

9. **Blog** : Créer section blog
10. **Documentation** : API docs
11. **Guides** : ICP definition, B2B prospecting
12. **FAQ** : Section FAQ pricing

## Variables d'environnement à configurer

```bash
# .env.local (à créer dans /marketing/)
VITE_API_URL=https://api.leadswap.com
VITE_APP_URL=https://app.leadswap.com
VITE_ANALYTICS_ID=your-analytics-id
```

## SEO à optimiser

Dans `/marketing/index.html` :

```html
<title>LeadSwap - Don't buy leads. Build them.</title>
<meta name="description" content="LeadSwap is the AI agent that sources, verifies, and enriches B2B prospects in real-time. No more stale databases." />
<meta property="og:title" content="LeadSwap - AI-powered B2B Lead Generation" />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
```

## Performance

- ✅ Vite build optimisé
- ✅ Code splitting React Router
- ✅ Images lazy loading
- ✅ CSS optimisé

À ajouter :
- [ ] Compression d'images
- [ ] CDN pour assets
- [ ] Service Worker / PWA
- [ ] Analytics performance
