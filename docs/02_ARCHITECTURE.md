# System Architecture — OrderMitra

**Design goal:** A foundation that can absorb Phase 2–5 features (loyalty, kitchen displays, POS integration, multi-outlet, enterprise) **without a rewrite** — by starting modular, not by starting "micro" (which small teams cannot operate) or "monolith-tangled" (which cannot evolve).

---

## 1. Architectural Style: Modular Monolith → Selective Extraction

**Decision:** Start as a **modular monolith** with strict internal module boundaries, deployed as one service. Extract a module into its own microservice **only when a specific, measured pain point demands it** (e.g., the AI module needs independent scaling, or order-processing needs different reliability guarantees than admin/reporting).

**Why not microservices from day one:** A 3-person team operating 10+ services is a well-documented way to burn all your time on infrastructure instead of product. Companies with 200+ engineers use microservices because their *organizational* boundaries need it — a 3-person startup's problem is speed and cost, not team coordination at scale.

**Why not a tangled monolith either:** The internal module boundaries below are enforced by folder structure and dependency rules from day one, so extraction later is a refactor, not a rewrite.

### Core modules (enforced boundaries inside the monolith)

```
apps/api/src/modules/
├── identity/         # owner + staff auth, restaurant onboarding, roles
├── menu/             # menu items, categories, pricing, availability
├── ordering/         # cart, order lifecycle, kitchen queue state machine
├── payments/         # Razorpay/Cashfree integration adapter — NEVER touches funds directly
├── ai-assist/        # all LLM calls: dish suggestions, menu copy, sales digest
├── notifications/    # WhatsApp/SMS/email dispatch (adapter pattern — swappable provider)
├── loyalty/          # phone-based repeat-customer recognition, rewards (Phase 2+)
├── analytics/        # event ingestion + reporting (read-optimized, can split out first)
└── platform/         # multi-tenancy, billing/subscription, feature flags
```

**Rule:** Modules communicate only through defined interfaces/service classes — never by reaching into another module's database tables directly. This single rule is what makes future extraction into microservices possible without rewriting business logic.

## 2. High-Level System Diagram

```
                         ┌──────────────────────────────────┐
   Diner's phone   ───▶  │ Customer PWA (Next.js on Amplify) │
   (scans QR)            └─────────────┬────────────────────┘
                                        │ HTTPS
                                        ▼
                          ┌───────────────────────────────┐
   Owner's phone/laptop   │   AWS API Gateway (REST)       │  (managed: auth,
   (Admin PWA on Amplify) │   (rate-limit, TLS, throttle)  │   rate-limit, TLS)
       ─────────────────▶ └─────────────┬──────────────────┘
                                        ▼
                     ┌──────────────────────────────────────────────┐
                     │    AWS Lambda (OrderMitra API — Modular       │
                     │    Monolith — NestJS, TypeScript, esbuild)    │
                     │  identity | menu | ordering | payments        │
                     │  ai-assist | notifications | loyalty          │
                     │  analytics | platform (multi-tenant)          │
                     └───┬───────────┬───────────┬─────────────────┘
                         │           │           │
             ┌───────────▼──┐  ┌─────▼────────┐  ┌──▼───────────────┐
             │  PostgreSQL   │  │ Upstash Redis │  │  Event Bus       │
             │  (AWS RDS,    │  │ (serverless,  │  │  (AWS SNS + SQS) │
             │   db.t3.micro,│  │  HTTP + TCP,  │  │  — order events, │
             │   multi-tenant│  │  free tier:   │  │  kitchen updates,│
             │   RLS)        │  │  500K cmd/mo) │  │  digests         │
             └───────────────┘  └──────────────┘  └───┬──────────────┘
                                                       │
                              ┌────────────────────────┼───────────────────┐
                              ▼                        ▼                   ▼
                     ┌────────────────┐   ┌────────────────────┐  ┌───────────────┐
                     │ AI Providers    │   │ WhatsApp/SMS        │  │ Payment        │
                     │ (Claude/Gemini  │   │ Business API        │  │ Aggregator     │
                     │  via MCP tools) │   │ (via BSP or Meta    │  │ (Razorpay/     │
                     └────────────────┘   │  Cloud API)         │  │  Cashfree)     │
                                          └────────────────────┘  └───────────────┘

   Kitchen order updates: polling (GET /orders?status=active every 5s) in Phase 1
   Upgrade to API Gateway WebSocket API in Phase 2–3 when measured need appears
```

## 3. Multi-Tenancy Strategy

**Decision:** Single database, **row-level tenant isolation** via a mandatory `restaurant_id` on every tenant-scoped table, enforced at the ORM layer (not just application logic) using PostgreSQL Row-Level Security (RLS) policies as a second line of defense.

**Why:** Separate databases per tenant is operationally expensive at small-restaurant price points (hundreds/thousands of tiny restaurants). Shared schema with RLS gives strong isolation guarantees without the operational cost, and is the standard pattern for this exact profile of SaaS (many small tenants, low revenue per tenant).

**Escape hatch:** If a future enterprise customer (Phase 5) requires dedicated infrastructure for compliance reasons, that one tenant can be migrated to an isolated deployment — the modular design and `restaurant_id` scoping make this a data-migration task, not an architecture rewrite.

## 4. Event-Driven Order Flow (why it won't fall over under load or bad connectivity)

Order placement is treated as an **event**, not a single synchronous transaction, so that:
- The diner's client can queue an order locally and retry if the network drops (client-side outbox pattern).
- The kitchen screen updates via **polling** (Phase 1) or WebSocket/SSE subscription (Phase 2–3) to order events — if the owner's phone reconnects after being offline, it re-fetches current order state from the DB rather than losing state.
- Downstream consumers (AI sales digest, analytics, loyalty point accrual) subscribe to the same `order.placed` / `order.completed` events without ever blocking the core ordering path. If the AI module is slow or down, orders still succeed — a **hard architectural rule**: nothing non-essential to "diner ordered, kitchen sees it" is allowed to block that path synchronously.

```
Diner submits order
   → API validates + writes to Postgres (source of truth) [synchronous, must succeed]
   → API publishes `order.placed` event to bus [async]
        ├─▶ Kitchen screen (visible on next poll, or WebSocket push in Phase 2–3)
        ├─▶ Notification subscriber (WhatsApp confirmation)
        ├─▶ Analytics subscriber (event log)
        └─▶ Loyalty subscriber (Phase 2+, accrue points)
```

## 5. AI Layer Design (MCP-based, model-agnostic)

**Decision:** All AI functionality routes through an internal `ai-assist` module that talks to models via the **Model Context Protocol (MCP)** pattern — i.e., AI capabilities (menu-copy generation, dish suggestion, sales digest, image captioning) are defined as **tools/functions with typed schemas**, not hard-coded prompts scattered through the codebase.

**Why this matters for "never fails" foundation:**
- Model swap-ability: if you start on Claude and later want Gemini (or a cheaper model for high-volume, low-stakes calls like "suggest a side dish"), you change the provider adapter, not every call site.
- Cost control: route cheap/high-frequency tasks (dish suggestion) to a smaller/cheaper model, and reserve larger models for owner-facing insight generation (sales digest, menu copywriting) — this is a **routing decision in one place**, not scattered logic.
- Testability: each AI "tool" (e.g., `suggestUpsell(cartContents, menu)`, `generateItemDescription(photo, itemName)`, `generateDailyDigest(orderData)`) has a defined input/output contract that can be unit-tested independently of the LLM call itself (mock the provider in tests).

```
ai-assist module
├── providers/
│   ├── anthropic-adapter.ts     # Claude models via API
│   ├── gemini-adapter.ts        # Gemini models via API (optional, cost fallback)
│   └── provider-router.ts       # picks provider/model per task type + cost policy
├── tools/
│   ├── suggest-upsell.ts
│   ├── generate-item-description.ts
│   ├── generate-daily-digest.ts
│   └── review-prompt-copy.ts
└── prompts/                     # versioned prompt templates, NOT inline strings in tools/
```

## 6. Offline-First / Bad-Connectivity Design (core differentiator, treated as architecture, not an afterthought)

- Customer PWA and Admin PWA both use a **service worker** with local IndexedDB queueing for orders and menu edits made while offline.
- Sync protocol: each queued action has a client-generated idempotency key, so replaying it after reconnect never double-creates an order or duplicate menu edit.
- Conflict resolution: menu edits are last-write-wins by default (single-owner-editor assumption at MVP); order placement conflicts (e.g., item went out of stock while diner was offline) are resolved by the server rejecting with a clear, specific reason the client surfaces to the diner.

## 7. Environments

Three fully separate environments — **dev, staging/test, prod** — each with its own database, isolated cloud resources, and separate API keys for all third-party integrations (payments in test mode, WhatsApp sandbox, etc.). Full detail, including CI/CD gating rules, is in `07_REPO_AND_ENV_STRATEGY.md`. No exceptions: **no AI agent or human ever tests against production data.** Lambda functions are deployed per-environment with separate API Gateway stages.

## 8. Legal/Compliance Boundary (architectural, not just policy)

Payments module is explicitly an **adapter only** — it creates orders/payment intents with the licensed payment aggregator (Razorpay/Cashfree) and stores only references (payment IDs, status), never card data or the ability to move funds independently. This is enforced by never introducing a "wallet" or "balance" table for merchant funds in the schema. If a future feature seems to require holding funds, it must be flagged in the decision log and routed through proper licensing review before any schema work begins.

## 9. Observability (build in from day one, not bolted on later)

- Structured logging (JSON) from day one, correlation ID per request threaded through async event processing.
- Centralized error tracking (e.g., Sentry) wired in during Phase 1, not deferred.
- Basic metrics dashboard: order success rate, API latency p50/p95, AI cost per restaurant per day — these three numbers are the early-warning system for the biggest risks in §10 of the PRD.

## 10. Why this architecture "won't fail" as features are added

| Future need | How this architecture absorbs it |
|---|---|
| Kitchen display screens (Phase 3) | Already consuming `order.placed` events via polling; upgrade to WebSocket is a client-side change + API Gateway WebSocket API, no backend rewrite |
| POS integration (Phase 3/4) | New adapter in a `pos-integration` module, subscribes to order events, doesn't touch core ordering logic |
| Multi-outlet (Phase 4) | `restaurant_id` already the tenancy key; add `outlet_id` as a child scope, no core rewrite |
| Higher AI volume needing independent scaling | `ai-assist` module extracted to its own Lambda function or service — clean boundary already exists |
| Lambda → Fargate migration (Phase 3+) | NestJS runs identically in both — swap the deployment target, not the code |
| New payment provider | Swap the adapter inside `payments` module; rest of system unaffected |
| New language/market | `notifications` and `ai-assist` prompt templates are already localized/versioned, not hard-coded |
