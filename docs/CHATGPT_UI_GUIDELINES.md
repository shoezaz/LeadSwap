# ChatGPT UI Guidelines - LeadSwap

> **⚠️ IMPORTANT**: Ce document définit les standards UI pour tous les widgets ChatGPT du projet. **N'utilisez PAS de solutions homemade** - utilisez exclusivement le SDK officiel OpenAI.

## 📦 Package Officiel

```bash
npm install @openai/apps-sdk-ui
```

| Ressource | URL |
|-----------|-----|
| **Documentation** | https://developers.openai.com/apps-sdk/build/chatgpt-ui |
| **Storybook / Composants** | https://openai.github.io/apps-sdk-ui/ |
| **GitHub** | https://github.com/openai/apps-sdk-ui |
| **Figma Library** | https://www.figma.com/community/file/1560064615791108827 |
| **UX Principles** | https://developers.openai.com/apps-sdk/concepts/ux-principles |
| **UI Guidelines** | https://developers.openai.com/apps-sdk/concepts/ui-guidelines |

---

## 🛠️ Setup Requis

### Prérequis
- **React 18 ou 19**
- **Tailwind CSS 4**

### Installation CSS

Dans votre fichier CSS principal (ex: `main.css`) :

```css
@import "tailwindcss";
@import "@openai/apps-sdk-ui/css";

/* Required for Tailwind to find class references in Apps SDK UI components */
@source "../node_modules/@openai/apps-sdk-ui";

/* Le reste de votre CSS */
```

### Provider (optionnel)

```tsx
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

<AppsSDKUIProvider linkComponent={Link}>
  <App />
</AppsSDKUIProvider>
```

---

## 🧩 Composants Disponibles

### Imports corrects

```tsx
// Composants de base
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { ButtonLink } from "@openai/apps-sdk-ui/components/ButtonLink";
import { TextLink } from "@openai/apps-sdk-ui/components/TextLink";

// Icônes
import { 
  Calendar, 
  Invoice, 
  Maps, 
  Members, 
  Phone 
} from "@openai/apps-sdk-ui/components/Icon";
```

### Exemple de composant conforme

```tsx
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Calendar, Members } from "@openai/apps-sdk-ui/components/Icon";

export function ReservationCard() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-default bg-surface shadow-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-secondary text-sm">Reservation</p>
          <h2 className="mt-1 heading-lg">La Luna Bistro</h2>
        </div>
        <Badge color="success">Confirmed</Badge>
      </div>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
        <dt className="flex items-center gap-1.5 font-medium text-secondary">
          <Calendar className="size-4" /> Date
        </dt>
        <dd className="text-right">Apr 12 · 7:30 PM</dd>

        <dt className="flex items-center gap-1.5 font-medium text-secondary">
          <Members className="size-4" /> Guests
        </dt>
        <dd className="text-right">Party of 2</dd>
      </dl>

      <div className="mt-4 grid gap-3 border-t border-subtle pt-4 sm:grid-cols-2">
        <Button variant="soft" color="secondary" block>
          Call
        </Button>
        <Button color="primary" block>
          Directions
        </Button>
      </div>
    </div>
  );
}
```

---

## 📐 Display Modes

| Mode | Usage |
|------|-------|
| **Inline Card** | Widgets légers, confirmations, actions simples, résumés |
| **Inline Carousel** | Liste de 3-8 items similaires (restaurants, playlists) |
| **Fullscreen** | Workflows multi-étapes, cartes interactives, éditeurs |
| **Picture-in-Picture** | Sessions live, jeux, collaboration en temps réel |

### Changer de mode

```tsx
await window.openai?.requestDisplayMode({ mode: "fullscreen" });
```

---

## 🎨 Design Tokens

Utilisez les classes Tailwind fournies par le SDK :

### Couleurs

```css
/* Backgrounds */
bg-surface          /* Surface principale */
bg-default          /* Fond par défaut */

/* Borders */
border-default      /* Bordure standard */
border-subtle       /* Bordure subtile */

/* Text */
text-primary        /* Texte principal */
text-secondary      /* Texte secondaire */
```

### Typography

```css
heading-lg          /* Titres grands */
heading-md          /* Titres moyens */
text-sm             /* Texte petit */
```

---

## ⛔ Ce qu'il NE FAUT PAS faire

### ❌ Interdit

```tsx
// ❌ CSS custom pour les composants de base
.badge { ... }
.loader { ... }
.widget-container { ... }

// ❌ Couleurs hardcodées
--color-primary: #6366f1;
--color-success: #10b981;

// ❌ Badges/Buttons faits maison
<span className="badge success">Active</span>
<div className="loader"></div>

// ❌ Polices custom (système uniquement)
font-family: "Inter", sans-serif;
```

### ✅ Correct

```tsx
// ✅ Composants du SDK
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
<Badge color="success">Active</Badge>

// ✅ Classes Tailwind du SDK
<div className="bg-surface border border-default rounded-2xl p-4">

// ✅ Polices système (héritées automatiquement)
// SF Pro sur iOS, Roboto sur Android
```

---

## 🔧 API window.openai

### Hooks utiles

```tsx
import { useToolInfo } from "../helpers";

// Récupérer input/output du tool
const { input, output } = useToolInfo<"my-tool">();

// Widget state persisté
window.openai.setWidgetState(payload);
const state = window.openai.widgetState;

// Appeler un tool depuis le widget
await window.openai?.callTool("refresh_data", { param: "value" });

// Envoyer un follow-up message
await window.openai?.sendFollowUpMessage({
  prompt: "Do something else",
});

// Fermer le widget
window.openai.requestClose();
```

---

## 📋 Checklist avant publication

- [ ] Utilise uniquement `@openai/apps-sdk-ui` pour les composants
- [ ] CSS basé sur Tailwind + design tokens du SDK
- [ ] Pas de polices custom
- [ ] Pas de couleurs hardcodées
- [ ] Pas de composants faits maison (badges, buttons, loaders)
- [ ] Accessibilité respectée (contraste WCAG AA, alt text)
- [ ] Responsive et adapté aux mobiles

---

## 🚨 État Actuel du Projet (Audit)

> **Statut: ⚠️ NON CONFORME**

| Widget | Problème |
|--------|----------|
| `define-icp.tsx` | CSS homemade, badges maison |
| `search-leads.tsx` | CSS homemade, loaders maison |
| `score-leads.tsx` | CSS homemade, tables maison |
| `upload-leads.tsx` | CSS homemade, tables maison |
| `get-results.tsx` | CSS homemade, tables/badges maison |
| `status.tsx` | CSS homemade, badges/progress maison |
| `index.css` | 696 lignes de CSS custom à supprimer |

### Migration requise

1. **Installer Tailwind 4** dans `skybridge-app/web`
2. **Remplacer `index.css`** par les imports SDK
3. **Refactorer chaque widget** pour utiliser les composants SDK
4. **Supprimer tout le CSS homemade**

---

## 📚 Références

- [Build your ChatGPT UI](https://developers.openai.com/apps-sdk/build/chatgpt-ui)
- [UX Principles](https://developers.openai.com/apps-sdk/concepts/ux-principles)
- [UI Guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines)
- [Apps SDK Examples](https://github.com/openai/openai-apps-sdk-examples)
- [Apps SDK UI Storybook](https://openai.github.io/apps-sdk-ui/)
