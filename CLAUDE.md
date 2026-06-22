# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DATN_KIMCHUNG is a pharmacy e-commerce web app (Kim Chung drugstore). It has a **Vue 3 frontend** deployed to GitHub Pages and a **Node.js/Express backend** running locally or on a server.

## Commands

### Frontend
```bash
npm run dev        # Start Vite dev server
npm run build      # Build + copy 404.html for GitHub Pages SPA routing
npm run deploy     # Build and deploy to GitHub Pages (gh-pages)
```

### Backend
```bash
cd backend
npm run dev        # Start with nodemon (auto-reload)
npm start          # Start with node (production)
```

## Architecture

### Data Flow: Two Sources of Truth

The frontend uses **static JSON files** (`src/data/products.json`, `src/data/blogPosts.json`, `src/data/services.json`) as the primary product catalog. The backend holds a **separate in-memory product list** (3 hardcoded items in `backend/src/index.js`) used only for order validation and stock tracking. These two lists are **not in sync** — the frontend reads products from the JSON file, but submits orders to the backend using `productId` from the JSON data.

### State Management

There is **no Vuex/Pinia store**. Cart state is passed between components via `localStorage` — components read/write `localStorage` directly. The `Cart.vue` component submits orders via `POST /api/orders`.

### Backend: Single-file Architecture

All backend logic lives in `backend/src/index.js` — routes, business logic, and file handling are all in one file. Data is stored:
- **In-memory arrays**: `blogs`, `products`, `orders`, `prescriptions`, `chatHistory` (reset on restart)
- **`backend/orders.json`**: Orders are also persisted to this file, keyed by buyer phone number

### AI Chat Feature

The floating chat UI lets users choose the AI provider at the provider level: Gemini, Mistral, Cerebras, Groq, or OpenRouter. The selected provider is saved in `localStorage` and sent to the backend as an optional `provider` field.

Chat endpoints:
- `GET /api/chat/providers` returns provider labels, availability, the default provider, and fallback order.
- `POST /api/chat/stream` accepts `{ userId, message, provider }` and streams a provider metadata SSE frame before text chunks.
- `POST /api/chat/pharmacist` accepts `{ userId, message, provider }` and returns `requestedProvider`, `providerUsed`, and `fallbackUsed`.

The backend default provider is `gemini`. If the selected provider fails or is not configured, fallback order is: `gemini -> mistral -> cerebras -> groq -> openrouter`, with the selected provider tried first and skipped from the later fallback list. OpenRouter uses the `@openrouter/sdk` and multiple comma-separated `KEYS`; Mistral and Cerebras use OpenAI-compatible chat completion APIs via `fetch`.

### Frontend API Base URL

Components call the backend with a hardcoded base URL:
```js
const base = 'http://localhost:3000/api';
```
This must be updated for production deployments.

### GitHub Pages SPA Routing

`vite.config.js` sets `base: '/'`. The build script copies `404.html` (via `scripts/copy404.js`) to handle SPA deep-link refreshes on GitHub Pages.

## Backend Environment Variables

`backend/.env` requires:
```
PORT=3000
MODEL=<openrouter-model-id>
KEYS=<key1>,<key2>,...   # Multiple OpenRouter API keys, comma-separated
GEMINI_API_KEY=<gemini-api-key>
GROQ_API_KEY=<groq-api-key>
MISTRAL_API_KEY=<mistral-api-key>
MISTRAL_MODEL=mistral-small-latest
CEREBRAS_API_KEY=<cerebras-api-key>
CEREBRAS_MODEL=gpt-oss-120b
```

## Key Constraints

- The backend has **no database** for products — the in-memory product list does not persist across restarts and is independent of `src/data/products.json`.
- Prescription uploads are stored in `backend/uploads/` as files; metadata is in-memory only.
- Blog posts are in-memory only (no persistence).
