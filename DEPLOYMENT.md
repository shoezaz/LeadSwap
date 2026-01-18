# Guide de Déploiement - LeadSwap Marketing

## Options de déploiement

### Option 1: Vercel (Recommandé) ⭐

**Avantages** :
- Déploiement automatique depuis Git
- CDN global
- Preview deployments
- Gratuit pour projets personnels
- Optimisé pour Vite/React

**Étapes** :

1. **Connecter le repo GitHub**
   ```bash
   cd marketing
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configuration**
   - Root Directory: `marketing`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Variables d'environnement** (dans Vercel dashboard)
   ```
   VITE_API_URL=https://api.leadswap.com
   VITE_APP_URL=https://app.leadswap.com
   ```

4. **Domaine personnalisé**
   - Ajoutez `leadswap.com` dans Vercel
   - Configurez les DNS selon les instructions

**URL résultat** : `https://leadswap.vercel.app` ou `https://leadswap.com`

---

### Option 2: Netlify

**Avantages** :
- Interface simple
- Form handling gratuit
- Functions serverless
- Gratuit jusqu'à 100GB/mois

**Étapes** :

1. **Netlify CLI**
   ```bash
   npm install -g netlify-cli
   cd marketing
   netlify login
   netlify init
   ```

2. **Configuration (`netlify.toml`)** :
   ```toml
   [build]
     base = "marketing/"
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

**URL résultat** : `https://leadswap.netlify.app`

---

### Option 3: GitHub Pages

**Avantages** :
- Gratuit
- Intégré à GitHub
- Simple pour sites statiques

**Étapes** :

1. **Installer gh-pages**
   ```bash
   cd marketing
   npm install -D gh-pages
   ```

2. **Ajouter scripts dans `package.json`** :
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Configurer base dans `vite.config.ts`** :
   ```ts
   export default defineConfig({
     base: '/LeadSwap/',
     plugins: [react()],
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Activer GitHub Pages**
   - Repo → Settings → Pages
   - Source: `gh-pages` branch

**URL résultat** : `https://yourusername.github.io/LeadSwap/`

---

### Option 4: Cloudflare Pages

**Avantages** :
- CDN ultra-rapide
- Gratuit illimité
- Web Analytics gratuit
- Protection DDoS

**Étapes** :

1. **Dashboard Cloudflare**
   - Pages → Create a project
   - Connect to Git

2. **Configuration**
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `marketing`

3. **Variables d'environnement**
   ```
   NODE_VERSION=18
   VITE_API_URL=...
   ```

**URL résultat** : `https://leadswap.pages.dev`

---

### Option 5: AWS Amplify

**Avantages** :
- Infrastructure AWS
- CI/CD intégré
- Scalable
- Gratuit tier

**Étapes** :

1. **Amplify Console**
   - New app → Host web app
   - Connect GitHub

2. **Build settings (`amplify.yml`)** :
   ```yaml
   version: 1
   applications:
     - frontend:
         phases:
           preBuild:
             commands:
               - cd marketing
               - npm ci
           build:
             commands:
               - npm run build
         artifacts:
           baseDirectory: marketing/dist
           files:
             - '**/*'
         cache:
           paths:
             - node_modules/**/*
   ```

**URL résultat** : `https://main.xxxxx.amplifyapp.com`

---

## Configuration DNS

Pour domaine personnalisé `leadswap.com` :

### Vercel
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

### Netlify
```
Type: CNAME
Name: www
Value: apex-loadbalancer.netlify.com

Type: A
Name: @
Value: 75.2.60.5
```

### Cloudflare Pages
```
Type: CNAME
Name: www
Value: leadswap.pages.dev

Type: CNAME (flattened)
Name: @
Value: leadswap.pages.dev
```

---

## SSL/HTTPS

Tous les services ci-dessus fournissent **SSL gratuit** :
- Vercel : Let's Encrypt automatique
- Netlify : Let's Encrypt automatique
- Cloudflare : SSL universel
- GitHub Pages : HTTPS automatique
- AWS Amplify : Certificate Manager

---

## CI/CD Setup

### GitHub Actions (pour n'importe quel hébergeur)

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy Marketing Site

on:
  push:
    branches: [main]
    paths:
      - 'marketing/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        working-directory: ./marketing
        run: npm ci
        
      - name: Build
        working-directory: ./marketing
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_APP_URL: ${{ secrets.VITE_APP_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./marketing
```

---

## Performance Optimization

### 1. Build optimisé

Dans `vite.config.ts` :

```ts
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
```

### 2. Compression d'images

Installer plugin :
```bash
npm install -D vite-plugin-imagemin
```

### 3. Analytics

Ajouter dans `index.html` :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Ou Plausible (plus privacy-friendly) -->
<script defer data-domain="leadswap.com" src="https://plausible.io/js/script.js"></script>
```

---

## Monitoring

### Services recommandés

1. **Vercel Analytics** (si déployé sur Vercel)
   - Gratuit avec Vercel
   - Real user monitoring
   - Web Vitals

2. **Sentry** (Error tracking)
   ```bash
   npm install @sentry/react
   ```

3. **Plausible / Fathom** (Analytics privacy-friendly)
   - Alternative à Google Analytics
   - GDPR compliant

---

## Checklist pré-déploiement

- [ ] Build sans erreurs (`npm run build`)
- [ ] TypeScript sans erreurs (`npx tsc --noEmit`)
- [ ] Tests passent (si vous en avez)
- [ ] Meta tags SEO configurés
- [ ] Favicon ajouté
- [ ] Variables d'environnement configurées
- [ ] Analytics ajouté
- [ ] Sitemap.xml généré
- [ ] robots.txt configuré
- [ ] 404 page créée
- [ ] Logo LeadSwap ajouté (remplacer Chatbase)

---

## Post-déploiement

1. **Vérifier** :
   - [ ] Site accessible
   - [ ] Toutes les pages se chargent
   - [ ] Routing fonctionne
   - [ ] Images s'affichent
   - [ ] Links fonctionnent
   - [ ] Mobile responsive
   - [ ] SSL actif

2. **SEO** :
   - [ ] Soumettre sitemap à Google Search Console
   - [ ] Vérifier indexation
   - [ ] Tester vitesse (PageSpeed Insights)

3. **Monitoring** :
   - [ ] Analytics fonctionne
   - [ ] Error tracking actif
   - [ ] Uptime monitoring

---

## Rollback

Si problème après déploiement :

### Vercel
```bash
vercel rollback
```

### Netlify
Dashboard → Deploys → Publish previous deploy

### GitHub Pages
```bash
git revert HEAD
git push
npm run deploy
```

---

## Support

Pour questions :
- Vercel : https://vercel.com/docs
- Netlify : https://docs.netlify.com
- Cloudflare : https://developers.cloudflare.com/pages
