# LeadSwap - Repo Hackathon

Bienvenue sur le repository de LeadSwap. Ce projet a été restructuré pour offrir une séparation claire entre les différents composants de l'architecture.

## Structure du Projet

Le code source est organisé dans le dossier `apps/` :

### 🚀 Applications

- **`apps/chatgpt`** (`skybridge-app`) :
  - Intégration ChatGPT (MCP Server + Frontend).
  - Permet d'interagir avec l'agent via l'interface ChatGPT.

- **`apps/platform`** :
  - La plateforme SaaS principale (Next.js, Monorepo via Turbo).
  - Contient le dashboard utilisateur et la logique métier principale.

- **`apps/marketing`** :
  - Site vitrine et landing pages.
  - Présente le produit aux visiteurs.

- **`apps/agent`** :
  - Scripts et logique autonome de l'agent (Lead Generation, Enrichment).
  - Contient les scripts d'exécution (ex: `test-exa.ts`).

## 📚 Documentation

Toute la documentation technique et produit est centralisée dans le dossier `docs/`.

- **`docs/`** : Fichiers Markdown (Deployment, Setup, Stories, etc.).
- **`docs/assets`** : Images et ressources graphiques.
- **`design/`** : Éléments de design (Screenshots, Bento Grids).

## 🛠 Installation et Démarrage

Chaque application possède ses propres instructions de démarrage. Veuillez vous référer au `README.md` dans chaque sous-dossier ou utiliser les commandes ci-dessous :

### Pré-requis
- Node.js (v20+)
- pnpm / npm
- Clés API configurées dans les fichiers `.env` respectifs.

### Agent
```bash
cd apps/agent
npm install
npm run dev
```

### Platform
```bash
cd apps/platform
pnpm install
pnpm build
pnpm dev
```

### Marketing
```bash
cd apps/marketing
npm install
npm run dev
```

### ChatGPT App (Skybridge)
```bash
cd apps/chatgpt
npm install
npm run dev
```

## 🎨 Design

Les assets de design et les captures d'écran sont disponibles dans le dossier `design/`.
