# Repository & Environment Strategy — OrderMitra

## 1. Repository Layout (Monorepo)

**Decision:** Single monorepo, managed with `pnpm` workspaces + `Turborepo`. See `06_DECISION_LOG.md` if this is ever reconsidered.

```
ordermitra/
├── apps/
│   ├── customer-pwa/          # Next.js — diner-facing QR menu + ordering
│   ├── admin-pwa/             # Next.js — owner-facing admin/kitchen view
│   └── api/                   # NestJS backend (modular monolith)
│       └── src/modules/       # identity, menu, ordering, payments, ai-assist,
│                               # notifications, loyalty, analytics, platform
├── packages/
│   ├── shared-types/          # TypeScript types shared between frontend & backend
│   ├── ui/                    # Shared React component library (design system tokens)
│   └── config/                # Shared ESLint/TSConfig/Tailwind config
├── infra/
│   └── terraform/             # IaC — one folder per environment (dev/staging/prod)
├── docs/                      # THIS document set lives here — 00_README.md through 09_*.md
├── .github/workflows/         # CI/CD pipeline definitions
├── SKILL.md                   # Copy/symlink of docs/05_SKILL.md at repo root for agent discoverability
├── turbo.json
├── package.json
└── README.md                  # Points to docs/README.md
```

**Why monorepo, not separate repos per app:** With 3 people (some AI-assisted) working across frontend/backend simultaneously, a monorepo keeps API contracts (via `shared-types`) always in sync — an AI agent changing a backend DTO gets an immediate type error in the frontend if it forgets to update the client, instead of a silent runtime bug discovered later.

## 2. Branching Model

**Decision:** Trunk-based development with short-lived feature branches.

- `main` — always deployable, protected branch. Direct pushes disabled.
- `feature/<module>-<short-description>` — e.g., `feature/ordering-offline-queue`. Branch name should indicate the module (per Architecture §1) being touched, so team members/agents can see at a glance what's "claimed" (see `09_AI_MULTI_AGENT_WORKFLOW.md`).
- `fix/<short-description>` — for bug fixes.
- No long-lived `develop` branch — adds merge overhead a 3-person team doesn't need. Feature flags (via the `platform` module) handle incomplete-feature-in-main scenarios instead.

**Merge requirements (enforced via branch protection):**
- At least one review (human or, at minimum, a second AI agent pass reviewing the diff) before merge to `main`.
- CI must pass: lint, typecheck, unit tests, and E2E tests for the critical paths (order placement, payment, menu edit).
- If the change meets any PBVI trigger condition (`06_DECISION_LOG.md`), the PR must include the corresponding decision log entry in the same diff — CI can check for a log entry timestamp matching the PR date as a soft reminder, but this is ultimately a review-checklist item.

## 3. Environments

Three environments, fully isolated — **never share a database, API keys, or third-party sandbox/production credentials across environments.**

| Environment | Purpose | Database | Payment provider mode | Deploy trigger |
|---|---|---|---|---|
| **dev** | Local + shared dev sandbox for active feature work | Dedicated dev RDS instance (or local Docker Postgres for individual machines) | Razorpay/Cashfree **test mode** | Auto-deploy on push to any `feature/*` branch (to a shared dev environment) or run fully locally |
| **staging/test** | Pre-production validation, QA, and where AI agents run full E2E suites before anything reaches real restaurants | Separate RDS instance, seeded with realistic but synthetic data | Payment provider **test mode** | Auto-deploy on merge to `main` |
| **prod** | Real restaurants, real diners, real money | Production RDS instance, automated backups + point-in-time recovery enabled from day one | Payment provider **live mode** | Manual approval gate after staging validation passes (never fully automatic for the first several months) |

**Absolute rule:** No agent or human ever points a dev/staging build at the production database or live payment credentials, even "just to check something." Enforce this via separate AWS accounts or at minimum separate IAM roles/secrets per environment, not just separate `.env` files that could be misconfigured.

## 4. Secrets Management

- All secrets (API keys, DB credentials, payment provider keys) live in **AWS Secrets Manager**, one secret set per environment.
- Local development uses a `.env.local` file (never committed — enforced via `.gitignore` checked into the repo from commit #1) populated from a `.env.example` template that lists required variable names with placeholder/dummy values only.
- CI/CD pipelines pull secrets from Secrets Manager at deploy time via scoped IAM roles — never hard-coded in GitHub Actions YAML.

## 5. CI/CD Pipeline (GitHub Actions)

```
on push to feature/* or fix/*:
  → lint + typecheck + unit tests

on PR to main:
  → all of the above + Playwright E2E suite against a dev/staging build
  → require passing checks + 1 review before merge allowed

on merge to main:
  → build + bundle API via esbuild (Lambda-optimized, ARM64 target)
  → deploy Lambda function + API Gateway to staging via Terraform/SAM
  → deploy Next.js apps to Amplify Hosting staging environment
  → run full E2E suite against staging
  → notify team (Slack/WhatsApp) staging is ready for manual verification

on manual promotion (human-triggered):
  → deploy staging artifact (not a rebuild) to prod Lambda + API Gateway
  → promote Amplify staging to prod
  → run smoke tests against prod
  → rollback automatically if smoke tests fail
```

**Why deploy the staging artifact to prod, not rebuild:** guarantees what was tested in staging is bit-for-bit what reaches production — a common and avoidable source of "worked in staging, broke in prod" bugs.

## 6. Database Migrations

- Managed via **Prisma Migrate**, migration files committed to the repo (`apps/api/prisma/migrations/`).
- Migrations run automatically against dev/staging on deploy; against prod only as an explicit, reviewed step in the deploy pipeline — never silently auto-applied to prod.
- Every migration that isn't purely additive (e.g., anything that drops/renames a column, changes a constraint) requires a decision-log entry per the PBVI trigger list.

## 7. Local Development Setup (for a new team member or a fresh AI agent session)

1. Clone the repo.
2. `pnpm install` at the root (Turborepo handles workspace linking).
3. Copy `.env.example` to `.env.local` in each app that needs it; fill in dev-environment values (never prod secrets).
4. `docker compose up` for local Postgres + Redis (compose file lives at repo root).
5. `pnpm dev` to run all apps concurrently via Turborepo.
6. Before writing any code: read `docs/05_SKILL.md` (which points to `../SKILL.md`).
7. Review `docs/12_DATABASE_SCHEMA.md` for the Prisma schema and `docs/13_API_CONTRACTS.md` for API endpoint shapes.
