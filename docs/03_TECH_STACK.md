# Technology Stack — OrderMitra

This is the **binding** tech stack for the project. AI agents should not introduce a different framework/library/service without a decision-log entry per `06_DECISION_LOG.md`.

---

## 1. Guiding selection criteria (why these choices, not others)

1. **One primary language across the whole stack** where possible (TypeScript) — a 3-person team, some AI-assisted, benefits enormously from not context-switching between Python/Go/Java for different services.
2. **Managed/serverless-leaning services** over self-managed infrastructure — a 3-person team should not be operating Kubernetes clusters or patching servers.
3. **Cheap at low scale, doesn't require a rewrite at higher scale** — every choice below is chosen because it has a clear, well-trodden upgrade path.
4. **Boring technology for the core; interesting technology only for the AI layer**, where genuine differentiation lives. Payments, auth, and databases are not the place to experiment.

## 2. Languages

| Layer | Language | Why |
|---|---|---|
| Frontend (customer + admin PWA) | **TypeScript** | Type safety, single language with backend, huge ecosystem |
| Backend/API | **TypeScript (Node.js)** | Same reason — one language, one team, AI agents context-switch less |
| Infrastructure-as-Code | **HCL (Terraform)** | Cloud-agnostic enough to avoid total lock-in even though we pick one primary cloud |
| AI prompt/tooling scripts | **TypeScript**, with **Python** allowed only inside `ai-assist`/data-analysis scripts if a specific library (e.g., pandas-based analytics) makes it clearly better | Keep exceptions rare and justified in the decision log |

## 3. Frontend Stack

- **Framework:** Next.js (React), App Router, TypeScript.
- **Why Next.js specifically:** Built-in PWA-friendly patterns, server-side rendering for fast first-load menu pages (critical on 3G), one framework serves both the customer ordering PWA and the owner admin PWA as two apps in a monorepo.
- **Deployment:** **AWS Amplify Hosting** — supports Next.js SSR natively, free tier (1,000 build mins/month, 15GB serving), stays within the AWS ecosystem (one account, one billing). If Amplify's Next.js SSR support proves unreliable, fallback to **OpenNext** (open-source Next.js-on-AWS adapter deploying to Lambda@Edge + S3/CloudFront). Vercel was explicitly rejected — its free tier prohibits commercial use, and Pro is $20/seat/month × 3 = $60/month (see decision log).
- **Styling:** Tailwind CSS — fast to build with, easy for AI agents to generate consistent utility-based markup, pairs with the design tokens in `08_DESIGN_SYSTEM.md`.
- **Component library:** **shadcn/ui** (built on Radix UI primitives) — provides accessible, unstyled component patterns (dialogs, dropdowns, toasts, menus) that we style with our own Tailwind tokens from `08_DESIGN_SYSTEM.md`. Avoids building every interaction from scratch while keeping full visual control. Install components individually via CLI (`npx shadcn@latest add button`), not as a monolithic dependency.
- **State/data-fetching:** TanStack Query (React Query) for server state; minimal client state via React context/hooks — avoid heavy state libraries the team doesn't need yet.
- **Offline/PWA:** Workbox (service worker tooling) + IndexedDB (via `idb` library) for the offline order/menu-edit queue described in the Architecture doc.
- **Realtime (MVP):** Simple polling (every 5 seconds) for kitchen order updates — cheapest, simplest, works on Lambda. Full WebSocket (via API Gateway WebSocket API) deferred to Phase 2–3 when kitchen display screens become a dedicated feature and polling latency becomes a measured problem.

## 4. Backend Stack

- **Framework:** **NestJS** (Node.js, TypeScript) — chosen over a bare Express app specifically because NestJS enforces modular structure (modules/providers/controllers) out of the box, which directly supports the "modular monolith with strict boundaries" architecture decision.
- **API style:** REST for standard CRUD (menu, orders, admin). Kitchen/order status updates use **polling** in Phase 1 (simple, Lambda-compatible, no persistent connection needed); WebSocket via API Gateway WebSocket API is the Phase 2–3 upgrade path when dedicated kitchen displays justify it. GraphQL explicitly **not** chosen for MVP — adds complexity the team doesn't need yet; revisit only if a real multi-client aggregation need appears.
- **ORM:** **Prisma** — type-safe queries matching TypeScript end-to-end, straightforward migrations, works well with PostgreSQL Row-Level Security patterns.
- **Validation:** `zod` or `class-validator` (NestJS-native) for request schema validation — this matters a lot when AI agents are generating endpoint code, since it catches malformed inputs early and consistently.
- **API documentation:** `@nestjs/swagger` — auto-generates OpenAPI spec from controller decorators. Exposed at `/v1/docs` in dev/staging only. See `13_API_CONTRACTS.md` for the design-level endpoint shapes.
- **Background jobs/queues:** SQS (via `@ssut/nestjs-sqs` or direct AWS SDK) for async jobs (notification dispatch, AI digest generation) — SQS is always-free (1M requests/month) and eliminates the need for a separate Redis-backed queue (BullMQ). If a use case requires in-process job scheduling (e.g., cron-like daily digest trigger), use NestJS's built-in `@Cron()` decorator with `@nestjs/schedule`.

## 5. Database & Storage

- **Primary database:** **PostgreSQL** (managed: AWS RDS) — relational integrity for orders/payments/menu data, native Row-Level Security for multi-tenancy, mature ecosystem. Start with `db.t3.micro` (covered by AWS credits), upgrade to `db.t3.small` when load justifies it (see `11_COST_MODEL.md`).
- **Cache/session/rate-limit:** **Upstash Redis** (serverless, pay-per-request) — free tier: 500K commands/month, 256MB storage. Chosen over AWS ElastiCache because ElastiCache has no free tier (~$15/month minimum) and doesn't scale to zero. Upstash provides both TCP and HTTP/REST access, making it compatible with Lambda's ephemeral nature. Upgrade to ElastiCache only when Upstash commands exceed 500K/month consistently (see `11_COST_MODEL.md` §5).
- **Object storage:** **S3** for menu item photos, QR code PDFs — 5GB always free.
- **Event bus:** **AWS SNS + SQS** — 1M requests/month always free each. Used for the async order-event fan-out described in the Architecture doc.

## 6. AI Layer — Models, MCP, and Integration Tools

- **Primary model provider:** **Anthropic Claude** (via API) for owner-facing generation tasks that need quality and reliability: menu item descriptions, daily sales digest copy, review-prompt copy. Recommended model tier: a mid-tier Claude model (e.g., Sonnet-class) for these tasks — balances quality and cost; do not default to the largest/most expensive model for high-frequency, low-stakes calls.
- **Secondary/cost-fallback provider:** **Google Gemini** (via API) as an optional cheaper/faster route for very high-frequency, low-stakes calls (e.g., real-time "goes well with" upsell suggestions shown to every diner) — this is a cost-routing decision, not a quality compromise, and should be revisited with real usage data.
- **Integration pattern: Model Context Protocol (MCP).** Structure every AI capability as a typed "tool" the model can call or that calls the model with a strict schema (see Architecture doc §5). Practically:
  - Use the **Anthropic TypeScript SDK** for direct API calls from the `ai-assist` module.
  - If/when connecting AI agents to external systems during **development** (not the live product) — e.g., Antigravity or Claude Code agents needing to query your own database schema, read docs, or check deployment status — expose those as **MCP servers** so any AI coding agent in the toolchain can use them consistently instead of ad hoc scripts. Candidates for internal MCP servers as the project matures: a "docs MCP" serving this document set, a "schema MCP" exposing the current Prisma schema read-only, a "decision-log MCP" that agents query before making architectural choices.
  - Do not build a public-facing MCP server for OrderMitra itself at MVP stage — this is a development-tooling pattern, not a product feature, unless a future integration (e.g., letting a restaurant's own AI tools query their menu data) makes it a real product decision — log that separately if it comes up.
- **Prompt versioning:** All prompt templates live in `ai-assist/prompts/`, version-controlled, never inline strings — required so quality regressions are traceable to a specific commit.

## 7. Cloud Platform

**Decision: AWS as primary cloud**, for Phase 1 onward.

**Reasoning:**
- Team already has an AWS account with free tier credits available.
- Mature managed-service ecosystem for exactly the services this stack needs (RDS, S3, SQS/SNS, API Gateway, Lambda).
- Strong presence and documentation for Indian payment/compliance integrations (Razorpay, Cashfree provide first-class AWS-friendly SDKs).
- Lambda + SQS + SNS + CloudFront all have **always-free tiers** that don't expire — critical for keeping Phase 1 infrastructure cost at ~$0/month.
- Terraform-based IaC keeps the door open to GCP for specific workloads later — **this is why Terraform, not console click-ops, is mandatory from day one.**

### Phase 1–2 (0–50 restaurants): Serverless-first

| Need | AWS service | Free tier | Upgrade trigger |
|---|---|---|---|
| Compute (API) | **Lambda + API Gateway** | 1M requests/month (always free) | Cold starts >3s at p95 on ordering endpoints |
| Frontend hosting | **Amplify Hosting** (Next.js SSR) | 1,000 build mins, 15GB serving | Exceeds build minutes |
| Database | **RDS PostgreSQL** (db.t3.micro) | Covered by credits | CPU >70% sustained at meal peaks |
| Cache | **Upstash Redis** (external, serverless) | 500K commands/month | Commands >500K/month |
| Object storage | **S3** | 5GB | N/A |
| Event bus | **SNS + SQS** | 1M requests/month each (always free) | N/A |
| CDN | **CloudFront** | 1TB/month (always free) | N/A |
| Secrets | **AWS Secrets Manager** | ~$0.40/secret/month | N/A |
| CI/CD compute | **GitHub Actions** | 2,000 mins/month (free for public repos) | N/A |
| Monitoring | **CloudWatch** + **Sentry** (free tier) | CloudWatch basic free; Sentry 5K errors/month | N/A |

### Phase 3+ (50+ restaurants): Upgrade path

| Need | Upgrade to | When |
|---|---|---|
| Compute | **ECS Fargate** (always-on containers) | Lambda cold starts become a measured problem, not theoretical |
| Cache | **ElastiCache for Redis** | Upstash free tier exceeded consistently |
| Database | **RDS db.t3.small → db.t3.medium** | CPU/memory limits hit |

**AWS Activate:** Apply for the Founders program ($1,000–$5,000 credits) via the AWS Activate portal. If the team joins any accelerator/incubator or gets DPIIT Startup India recognition, apply for the Portfolio track (up to $200,000 credits). This extends the free/credit-covered runway significantly.

**Region:** `ap-south-1` (Mumbai) — lowest latency to Indian users, required for DPDP Act data localization compliance.

## 8. Third-Party Integrations

| Purpose | Provider | Notes |
|---|---|---|
| Payments | **Razorpay** (primary) or **Cashfree** (alternative) | RBI-licensed Payment Aggregators — see Architecture §8 legal boundary |
| WhatsApp notifications | **WhatsApp Business API** (via a BSP like Gupshup, Interakt, or directly via Meta's Cloud API) | Order confirmations, daily digest, review nudges |
| SMS fallback | Any Indian SMS gateway (e.g., MSG91) | For diners without WhatsApp |
| Error tracking | **Sentry** | Wired in from Phase 1, not deferred |
| Analytics (product usage) | **PostHog** (self-hostable, cheap) or a lightweight custom event pipeline into Postgres | Avoid expensive enterprise analytics tools at this stage |
| Email (owner receipts/invoices, Phase 2+) | **Resend** or **AWS SES** | Low-volume, low-cost is fine here |

## 9. Development Tooling

- **AI coding agent environment:** **Google Antigravity** (per your setup) — agent-first IDE built on VS Code, supports Gemini 3 Pro and Claude models. All three team members should point their Antigravity agents at this document set (`05_SKILL.md` specifically) at the start of every session.
- **Version control:** Git, hosted on **GitHub** (see `07_REPO_AND_ENV_STRATEGY.md` for branching model).
- **Package manager:** `pnpm` (faster, disk-efficient, good monorepo support).
- **Monorepo tooling:** `Turborepo` — keeps the customer PWA, admin PWA, and backend API in one repo with shared types, which matters a lot for a small team keeping frontend/backend contracts in sync.
- **Linting/formatting:** ESLint + Prettier, enforced via pre-commit hook (Husky) and CI — non-negotiable for AI-generated code consistency across 3 people's agents.
- **Testing:** Vitest (unit), Playwright (end-to-end critical flows: order placement, payment, menu edit) — the offline/sync logic and payment flow are the two areas that must have real E2E coverage before every release, given how costly those bugs are (see PRD §7 reliability requirement).

## 10. Explicit "not yet" list (avoid speculative complexity)

- No Kubernetes.
- No GraphQL.
- No ECS Fargate until Lambda cold starts are a measured problem (see §7 upgrade triggers).
- No ElastiCache until Upstash free tier is exceeded (see §5).
- No Vercel (commercial use requires $20/seat/month Pro plan).
- No microservices beyond the modular monolith until a measured need appears.
- No native mobile apps.
- No self-hosted LLMs — API-based models only until volume/cost data justifies otherwise.
- No multi-cloud active-active setup — single primary cloud (AWS) until there's a concrete reason.

## 11. Cost model summary

Full cost model is in `11_COST_MODEL.md`. Key numbers:

- **Phase 1 infra cost:** ~$0/month (Lambda + Upstash + Amplify free tiers).
- **AI cost per restaurant:** ~₹13–40/month (with caching).
- **Break-even at ₹299/month:** ~2 restaurants.
- **Alert threshold:** AI cost >₹100/restaurant/month or AWS bill >₹5,000/month before 50 restaurants.
