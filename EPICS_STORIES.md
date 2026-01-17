# LeadSwap - Epics & User Stories (MVP Sprint)

> **Aligné avec le PRD v1.0 - 2026-01-17**
>
> Ce document définit les epics et user stories pour le MVP LeadSwap, mappés sur les Functional Requirements (FR) du PRD.

---

## Vision MVP

LeadSwap est une plateforme de validation de leads B2B alimentée par l'IA qui qualifie les leads **avant achat** en temps réel. L'agent autonome combine :
- **Exa.ai** : Recherche sémantique + signaux d'intention temporels
- **Lightpanda MCP** : Validation web ultra-rapide (10x Chrome)
- **Dust AI** : Orchestration et mémoire
- **ChatGPT Apps SDK** : Interface conversationnelle

**Objectif MVP** : €10k MRR, 50-100 utilisateurs payants, 500k leads validés (Mois 3)

---

## Epic 1 : Onboarding & ICP Definition

**Objectif** : Permettre aux utilisateurs de s'authentifier et définir leur profil client idéal.

**PRD Mapping** : FR1-FR4

| Story ID | User Story | Acceptance Criteria | Priority |
|----------|------------|---------------------|----------|
| **US-1.1** | *En tant qu'* utilisateur, je veux m'authentifier via ChatGPT *afin de* accéder à LeadSwap sans créer de compte. | - OAuth ChatGPT Apps SDK fonctionnel<br>- User ID persisté côté Dust | P0 |
| **US-1.2** | *En tant qu'* utilisateur, je veux définir mon ICP en langage naturel *afin de* ne pas remplir de formulaires complexes. | - Chat accepte : "SaaS, 200-500 employés, France/UK, VP Sales"<br>- Extraction des critères (industry, size, geo, titles) | P0 |
| **US-1.3** | *En tant qu'* utilisateur, je veux que mon ICP soit mémorisé *afin de* ne pas le redéfinir à chaque session. | - ICP stocké dans Dust Memory<br>- Rechargé automatiquement à la reconnexion | P0 |
| **US-1.4** | *En tant qu'* utilisateur, je veux modifier mon ICP via le chat *afin de* affiner mes critères. | - "Change mon ICP pour cibler Series B+" fonctionne<br>- Confirmation de la mise à jour | P1 |

---

## Epic 2 : Lead Upload & Ingestion

**Objectif** : Permettre l'import de listes de leads via CSV dans l'interface ChatGPT.

**PRD Mapping** : FR5-FR8

| Story ID | User Story | Acceptance Criteria | Priority |
|----------|------------|---------------------|----------|
| **US-2.1** | *En tant qu'* utilisateur, je veux uploader un fichier CSV *afin de* soumettre ma liste de leads. | - Upload via ChatGPT file attachment<br>- Formats acceptés : .csv, .xlsx | P0 |
| **US-2.2** | *En tant que* système, je veux mapper automatiquement les colonnes CSV *afin de* ne pas demander de configuration manuelle. | - Détection auto : email, name, company, title<br>- Variations acceptées (Email/EMAIL/e-mail) | P0 |
| **US-2.3** | *En tant qu'* utilisateur, je veux uploader entre 50 et 10,000 leads *afin de* traiter des listes de taille variable. | - Validation du nombre de leads<br>- Message d'erreur si < 50 ou > 10,000 | P0 |
| **US-2.4** | *En tant qu'* utilisateur, je veux recevoir une confirmation d'upload *afin de* savoir que ma liste est prête. | - Message : "✅ 847 leads détectés. Lancer la validation ?" | P0 |

---

## Epic 3 : Lead Validation & Scoring

**Objectif** : Valider chaque lead contre l'ICP et attribuer un score de pertinence.

**PRD Mapping** : FR9-FR14

| Story ID | User Story | Acceptance Criteria | Priority |
|----------|------------|---------------------|----------|
| **US-3.1** | *En tant que* système, je veux valider chaque lead contre l'ICP via Exa.ai *afin de* calculer un score de matching sémantique. | - Requête Exa.ai avec query ICP<br>- Score ICP : 0-60 points | P0 |
| **US-3.2** | *En tant que* système, je veux vérifier l'existence du contact via mentions web *afin de* confirmer que le lead est réel. | - Recherche Exa.ai : LinkedIn, site company, articles<br>- Boost validation : +0-20 points | P0 |
| **US-3.3** | *En tant que* système, je veux valider le site web de l'entreprise via Lightpanda MCP *afin de* confirmer l'activité. | - `goto()` → company website<br>- `markdown()` → extraction contenu<br>- Vérifie si lead présent sur /team | P0 |
| **US-3.4** | *En tant que* système, je veux attribuer un score final 0-100 *afin de* catégoriser les leads en tiers. | - Score = ICP + validation + intent<br>- Tier 1 : 80-100 / Tier 2 : 50-79 / Rejected : 0-49 | P0 |
| **US-3.5** | *En tant qu'* utilisateur, je veux que la validation de 500 leads prenne < 10 minutes *afin de* obtenir des résultats rapidement. | - Batch processing parallèle<br>- < 10 sec/lead avec Lightpanda | P0 |

---

## Epic 4 : Intent Signals Detection (Killer Feature)

**Objectif** : Détecter les signaux d'intention d'achat récents pour prioriser les leads "chauds".

**PRD Mapping** : FR15-FR21

| Story ID | User Story | Acceptance Criteria | Priority |
|----------|------------|---------------------|----------|
| **US-4.1** | *En tant que* système, je veux détecter les posts récents sur des pain points *afin de* identifier les leads avec intention. | - Exa.ai temporal search (30 jours)<br>- Query : "{lead.name} lead quality OR data quality"<br>- Boost : +20 points | P0 |
| **US-4.2** | *En tant que* système, je veux détecter les annonces de funding récentes *afin de* identifier les entreprises en croissance. | - Exa.ai search (90 jours)<br>- Query : "{company} raised funding OR Series"<br>- Boost : +15 points | P1 |
| **US-4.3** | *En tant que* système, je veux détecter les changements de poste *afin de* cibler les nouveaux décideurs. | - Exa.ai search (6 mois)<br>- Query : "{lead.name} joined OR new role"<br>- Boost : +10 points | P1 |
| **US-4.4** | *En tant que* système, je veux détecter les pics de recrutement *afin de* identifier les entreprises en expansion. | - Lightpanda : parse /careers<br>- > 10 postes ouverts = signal | P2 |
| **US-4.5** | *En tant qu'* utilisateur, je veux voir les signaux d'intention avec emoji *afin de* comprendre pourquoi un lead est "chaud". | - Affichage : "🔥 High Intent: Posted about data quality 12 days ago"<br>- Lien vers la source | P0 |
| **US-4.6** | *En tant que* système, je veux ignorer les signaux > 90 jours *afin de* ne pas afficher des infos périmées. | - Filtre temporel sur tous les intent signals | P1 |

---

## Epic 5 : Validation Results & Insights

**Objectif** : Présenter les résultats avec des insights actionnables sur les rejets.

**PRD Mapping** : FR22-FR29

| Story ID | User Story | Acceptance Criteria | Priority |
|----------|------------|---------------------|----------|
| **US-5.1** | *En tant qu'* utilisateur, je veux voir le breakdown par tier *afin de* comprendre la qualité globale de ma liste. | - Affichage : "✅ Tier 1: 127 (25%) / ⚠️ Tier 2: 89 (18%) / ❌ Rejected: 284 (57%)" | P0 |
| **US-5.2** | *En tant qu'* utilisateur, je veux interroger les résultats en langage naturel *afin de* explorer les données. | - "Show me Tier 1 leads" → liste<br>- "Why were these rejected?" → explications | P0 |
| **US-5.3** | *En tant qu'* utilisateur, je veux voir le détail de chaque lead *afin de* comprendre son score. | - Affichage : score ICP, validation bonus, intent boost<br>- Raisons de rejet si applicable | P1 |
| **US-5.4** | *En tant que* système, je veux analyser les patterns de rejection *afin de* générer des recommandations. | - Détection : "73 leads (40%) : Companies < 50 employees"<br>- Pattern sur : size, title, industry, staleness | P0 |
| **US-5.5** | *En tant qu'* utilisateur, je veux recevoir des recommandations Apollo/ZoomInfo *afin de* améliorer mes futurs achats. | - Output : "Adjust Apollo filters to 200+ employees"<br>- Actionable et spécifique | P0 |
| **US-5.6** | *En tant qu'* utilisateur, je veux voir les crédits économisés *afin de* quantifier la valeur de LeadSwap. | - Calcul : rejected_count × €5/lead<br>- Affichage : "💰 Credit Savings: €920" | P0 |
| **US-5.7** | *En tant qu'* utilisateur, je veux voir l'impact ROI estimé *afin de* justifier l'investissement. | - Output : "Applying these insights will save €2,340 on next purchase" | P1 |

---

## Epic 6 : Deduplication & Memory

**Objectif** : Éviter la re-validation des leads déjà traités et mémoriser l'historique.

**PRD Mapping** : FR23-FR27 (note: overlap dans le PRD)

| Story ID | User Story | Acceptance Criteria | Priority |
|----------|------------|---------------------|----------|
| **US-6.1** | *En tant que* système, je veux hasher chaque lead validé *afin de* détecter les doublons futurs. | - Hash = SHA256(email + linkedin + domain)<br>- Stockage dans dedup_hashes | P1 |
| **US-6.2** | *En tant que* système, je veux détecter les doublons à l'upload *afin de* ne pas re-facturer la validation. | - Check hash avant validation<br>- Si trouvé : skip + use cached result | P1 |
| **US-6.3** | *En tant qu'* utilisateur, je veux voir le statut précédent des doublons *afin de* ne pas perdre d'info. | - Affichage : "ℹ️ 23 leads already validated (Tier 1: 15, Tier 2: 8)" | P1 |
| **US-6.4** | *En tant qu'* utilisateur, je veux voir les économies liées au skip des doublons *afin de* quantifier le bénéfice. | - Calcul : duplicates_skipped × €0.50<br>- Affichage dans le résumé | P2 |
| **US-6.5** | *En tant que* système, je veux conserver l'historique 12 mois *afin de* maximiser les économies de dédup. | - TTL sur dedup_hashes = 12 mois<br>- Auto-expiry | P1 |

---

## Epic 7 : Data Export

**Objectif** : Permettre le téléchargement des leads validés pour import CRM.

**PRD Mapping** : FR28-FR30

| Story ID | User Story | Acceptance Criteria | Priority |
|----------|------------|---------------------|----------|
| **US-7.1** | *En tant qu'* utilisateur, je veux télécharger les leads validés en CSV *afin de* les importer dans mon CRM. | - Bouton/commande : "Download CSV"<br>- Fichier généré et retourné | P0 |
| **US-7.2** | *En tant qu'* utilisateur, je veux que le CSV inclue les scores et intent signals *afin de* prioriser mes outreach. | - Colonnes ajoutées : tier, score, intent_signals, validated_at | P0 |
| **US-7.3** | *En tant qu'* utilisateur, je veux filtrer l'export par tier *afin de* ne télécharger que les meilleurs leads. | - "Download only Tier 1" → filtre appliqué<br>- "Download Tier 1 + 2" → option | P1 |
| **US-7.4** | *En tant qu'* utilisateur, je veux que le CSV préserve mes données originales *afin de* ne rien perdre. | - Toutes les colonnes originales conservées<br>- Nouvelles colonnes ajoutées à la fin | P0 |

---

## Epic 8 : Multi-Tenant Security

**Objectif** : Assurer l'isolation complète des données entre utilisateurs.

**PRD Mapping** : FR31-FR33

| Story ID | User Story | Acceptance Criteria | Priority |
|----------|------------|---------------------|----------|
| **US-8.1** | *En tant que* système, je veux isoler les données par user_id *afin de* garantir la confidentialité. | - Toutes les queries Dust scoped par user_id<br>- Zero cross-user access | P0 |
| **US-8.2** | *En tant qu'* utilisateur, je veux que seul moi puisse accéder à mes leads *afin de* protéger mes données business. | - Test : User A ne peut pas query User B<br>- Audit log si tentative | P0 |
| **US-8.3** | *En tant que* système, je veux prévenir toute fuite de données *afin de* maintenir la confiance. | - Security review avant launch<br>- Pas de logging de données sensibles | P0 |

---

## Epic 9 : Conversational Interface

**Objectif** : Permettre une interaction 100% en langage naturel via ChatGPT.

**PRD Mapping** : FR34-FR37

| Story ID | User Story | Acceptance Criteria | Priority |
|----------|------------|---------------------|----------|
| **US-9.1** | *En tant qu'* utilisateur, je veux interagir uniquement via chat *afin de* ne pas apprendre une nouvelle interface. | - Zéro UI traditionnelle<br>- Toutes les actions via commandes naturelles | P0 |
| **US-9.2** | *En tant qu'* utilisateur, je veux que les résultats soient présentés de façon conversationnelle *afin de* comprendre facilement. | - Pas de JSON brut<br>- Résultats formatés avec emojis et structure claire | P0 |
| **US-9.3** | *En tant qu'* utilisateur, je veux poser des questions de suivi *afin de* explorer les résultats. | - "Tell me more about the rejected leads"<br>- Context maintenu dans la conversation | P0 |
| **US-9.4** | *En tant qu'* utilisateur, je veux demander de l'aide *afin de* comprendre comment utiliser LeadSwap. | - "How does this work?" → explication<br>- "What can I ask?" → liste des commandes | P1 |

---

## Prioritization Summary

### P0 - Must Have (MVP Launch)
- Epic 1 : Onboarding & ICP (US-1.1 à 1.3)
- Epic 2 : Lead Upload (US-2.1 à 2.4)
- Epic 3 : Validation & Scoring (US-3.1 à 3.5)
- Epic 4 : Intent Signals - Pain Points (US-4.1, 4.5)
- Epic 5 : Results & Insights (US-5.1, 5.2, 5.4, 5.5, 5.6)
- Epic 7 : Export CSV (US-7.1, 7.2, 7.4)
- Epic 8 : Security (US-8.1 à 8.3)
- Epic 9 : Chat Interface (US-9.1 à 9.3)

### P1 - Should Have (Week 2-3)
- US-1.4 : Modifier ICP
- US-4.2, 4.3, 4.6 : Intent signals avancés
- US-5.3, 5.7 : Détails et ROI
- US-6.1 à 6.3, 6.5 : Deduplication
- US-7.3 : Filtre export
- US-9.4 : Aide contextuelle

### P2 - Nice to Have (Post-MVP)
- US-4.4 : Hiring spike detection
- US-6.4 : Savings display pour dedup

---

## Sprint Mapping (Hackathon)

### Sprint 1 (Day 1 - 8h) : Core Infrastructure
- US-1.1, 1.2, 1.3 → Auth + ICP
- US-2.1, 2.2, 2.3, 2.4 → CSV Upload
- US-3.1, 3.4 → Exa.ai scoring de base

### Sprint 2 (Day 1 - 4h) : ChatGPT Integration
- US-9.1, 9.2 → Interface conversationnelle
- US-5.1 → Affichage tier breakdown

### Sprint 3 (Day 2 - 6h) : Intent & Lightpanda
- US-4.1, 4.5 → Pain point detection
- US-3.2, 3.3 → Lightpanda web validation

### Sprint 4 (Day 2 - 4h) : Insights & Export
- US-5.4, 5.5, 5.6 → Patterns + recommendations
- US-7.1, 7.2, 7.4 → Export CSV

### Sprint 5 (Day 2 - 4h) : Polish
- US-8.1, 8.2 → Security validation
- US-9.3 → Follow-up questions
- Bug fixes + Demo prep

---

## Technical Notes

**Stack par Epic :**
- Epic 1-2 : ChatGPT Apps SDK + Dust Memory
- Epic 3 : Exa.ai API + Lightpanda MCP + Dust Workflow
- Epic 4 : Exa.ai Temporal Search
- Epic 5-6 : Dust AI (analysis + memory)
- Epic 7 : Dust → CSV generation
- Epic 8 : Dust multi-tenant isolation
- Epic 9 : ChatGPT Apps SDK response formatting
