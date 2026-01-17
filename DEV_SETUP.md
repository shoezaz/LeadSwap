# LeadSwap Dev Setup

## Prerequisites
- Node.js (v18+)
- npm

## Installation

```bash
# Clone the repository
git clone https://github.com/shoezaz/LeadSwap.git
cd LeadSwap

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EXA_API_KEY` | Yes | Your Exa.ai API key ([Get one here](https://exa.ai/)) |
| `LIGHTPANDA_WS_ENDPOINT` | No | WebSocket endpoint for Lightpanda browser. Falls back to mock if not set. |
| `DUST_API_KEY` | No | Dust.tt API key (for future orchestration features) |

## Running the Agent

```bash
# Development mode (with ts-node)
npm run dev

# With custom query
npm run dev "AI startups in Berlin using Stripe"

# Build for production
npm run build

# Run production build
npm start
```

## Project Structure

```
src/
├── index.ts              # Main agent orchestration
├── types/
│   └── index.ts          # TypeScript interfaces
└── lib/
    ├── exa.ts            # Neural search via Exa.ai
    └── lightpanda.ts     # Web scraping & enrichment
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run agent in development mode |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production build |
| `npm run typecheck` | Check types without emitting |

## API Keys

### Exa.ai
1. Go to [exa.ai](https://exa.ai/)
2. Sign up and get your API key
3. Add to `.env`: `EXA_API_KEY=your_key_here`

### Lightpanda (Optional)
If you have access to a Lightpanda instance:
```
LIGHTPANDA_WS_ENDPOINT=wss://your-instance.lightpanda.io
```

Without Lightpanda, the agent will use mock responses for the enrichment phase.
