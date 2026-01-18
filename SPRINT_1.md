# Sprint 1: Core Infrastructure (Day 1 - 8 hours)

**Status:** 🚀 In Progress  
**Started:** 2026-01-17  
**Goal:** Build the foundational infrastructure for lead validation

---

## Objectives

### 1. Auth + ICP Definition (US-1.1, 1.2, 1.3)
- [ ] **US-1.1:** ChatGPT OAuth authentication
- [ ] **US-1.2:** Natural language ICP definition
- [ ] **US-1.3:** ICP memory persistence

### 2. CSV Upload & Ingestion (US-2.1, 2.2, 2.3, 2.4)
- [ ] **US-2.1:** CSV file upload via ChatGPT
- [ ] **US-2.2:** Automatic column mapping
- [ ] **US-2.3:** Validation (50-10,000 leads)
- [ ] **US-2.4:** Upload confirmation

### 3. Exa.ai Scoring (US-3.1, 3.4)
- [ ] **US-3.1:** ICP matching via Exa.ai
- [ ] **US-3.4:** Final score calculation (0-100)

---

## Technical Implementation

### Architecture Overview
```
ChatGPT App → Dust.tt Agent → Exa.ai API
                ↓
         Dust Memory (ICP + Leads)
```

### New Files to Create

1. **`src/chatgpt/`** - ChatGPT Apps SDK integration
   - `app.ts` - Main app definition
   - `actions/` - Action handlers
   - `schemas/` - JSON schemas for actions

2. **`src/dust/`** - Dust.tt orchestration
   - `client.ts` - Dust API client
   - `memory.ts` - Memory operations
   - `workflows/` - Validation workflows

3. **`src/validation/`** - Core validation logic
   - `icp-matcher.ts` - ICP scoring
   - `csv-parser.ts` - CSV ingestion
   - `scorer.ts` - Score calculation

4. **`src/types/`** - Updated type definitions
   - `icp.ts` - ICP interfaces
   - `lead.ts` - Lead interfaces
   - `validation.ts` - Validation result types

---

## Implementation Checklist

### Phase 1: Project Setup (30min)
- [ ] Install ChatGPT Apps SDK dependencies
- [ ] Install Dust.tt SDK
- [ ] Update `.env` with API keys
- [ ] Create project structure

### Phase 2: ICP System (2h)
- [ ] Parse natural language ICP input
- [ ] Extract structured criteria (industry, size, geo, titles)
- [ ] Store ICP in Dust Memory
- [ ] Retrieve ICP on user reconnection

### Phase 3: CSV Upload (2h)
- [ ] Handle file upload from ChatGPT
- [ ] Parse CSV with column detection
- [ ] Map columns: email, name, company, title
- [ ] Validate lead count (50-10,000)
- [ ] Store leads in Dust

### Phase 4: Exa.ai Scoring (2.5h)
- [ ] Build ICP query from user profile
- [ ] Query Exa.ai for each lead
- [ ] Calculate ICP match score (0-60 points)
- [ ] Assign final score (0-100)
- [ ] Store validation results

### Phase 5: Integration Testing (1h)
- [ ] End-to-end flow test
- [ ] Error handling
- [ ] Performance validation

---

## API Keys Required

Add to `.env`:
```bash
# Existing
EXA_API_KEY=your_exa_key

# New for Sprint 1
DUST_API_KEY=your_dust_key
DUST_WORKSPACE_ID=your_workspace_id
CHATGPT_APP_ID=your_app_id
CHATGPT_APP_SECRET=your_app_secret
```

---

## Success Criteria

### Functional
✅ User can authenticate via ChatGPT  
✅ User can define ICP in natural language (e.g., "SaaS, 200-500 employees, France/UK, VP Sales")  
✅ ICP persists across sessions  
✅ User can upload CSV (50-10,000 leads)  
✅ System auto-maps CSV columns  
✅ Exa.ai validates each lead against ICP  
✅ Each lead receives a score (0-100)  

### Technical
✅ Average processing time: <10 sec/lead  
✅ ICP retrieval: <500ms  
✅ CSV parsing: <2s for 1,000 leads  
✅ Zero errors on valid inputs  

---

## Next Sprint Preview

**Sprint 2 (Day 1 - 4h):** ChatGPT Integration
- Conversational interface
- Tier breakdown display
- Natural language result queries

---

## Notes & Blockers

### Decisions Made
- Using Dust.tt for orchestration instead of custom backend
- ChatGPT Apps SDK for auth (no custom OAuth flow)
- In-memory processing for MVP (no database)

### Potential Blockers
- [ ] ChatGPT Apps SDK access
- [ ] Dust.tt workspace setup
- [ ] Exa.ai rate limits

### Resources
- [ChatGPT Apps SDK Docs](https://platform.openai.com/docs/chatgpt-apps)
- [Dust.tt API Docs](https://docs.dust.tt/)
- [Exa.ai API Reference](https://docs.exa.ai/)
