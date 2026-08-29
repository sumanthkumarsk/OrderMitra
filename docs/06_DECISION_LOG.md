# Decision Log — OrderMitra

**This is an append-only file.** Never delete or rewrite a past entry — if a decision is later reversed, add a new entry that references and supersedes the old one. This file is the single most important artifact for "the foundation never fails," because it is the record of *why* things are the way they are, which survives even when the humans or AI agents who made the original call are no longer in the conversation/session.

## When to add an entry (the PBVI trigger list)

Add an entry whenever any of the following happens — by a human or an AI agent:
- A new dependency, library, or third-party service is introduced.
- A schema/database change that isn't purely additive-and-obvious.
- A deviation from anything stated in `02_ARCHITECTURE.md` or `03_TECH_STACK.md`.
- A pricing, billing, or legal/compliance-relevant decision.
- A feature is pulled forward from a later roadmap phase, or pushed out of scope.
- A past decision in this log is reversed or revised.
- Any moment an AI agent had to make an assumption because a human wasn't available to confirm — log the assumption even if you believe it's obviously correct.

## Entry template (copy this for every new entry)

```
### [YYYY-MM-DD] Short title of the decision
- **Made by:** (human name / "Agent — <tool>, session with <human>")
- **Context:** What prompted this decision? What problem were we solving?
- **Options considered:** Briefly list alternatives, even if only 2.
- **Decision:** What we're doing.
- **Reasoning:** Why this option over the others — tie back to PRD principles / architecture doc where relevant.
- **Affects:** Which doc(s)/module(s) this touches (e.g., "03_TECH_STACK.md — adds Resend for email").
- **Status:** Active / Superseded by [link to later entry]
```

---

## Log entries

### [2026-08-29] Initial foundation established
- **Made by:** Founding team (3 members), with Claude assistance for research and document drafting.
- **Context:** Starting from a broad "enterprise QR ordering platform" PRD; market research showed this space is a commodity for restaurants generally, but underserved for small single-outlet owners on price and AI-assisted owner tooling.
- **Options considered:** (1) Build the original enterprise-scope PRD as-is. (2) Narrow to small-restaurant, AI-first, flat-fee positioning first, expand later.
- **Decision:** Option 2. Product is OrderMitra, targeting single-outlet small restaurants first, with enterprise/hotel scope explicitly deferred to Phase 5.
- **Reasoning:** Avoids the #1 documented startup failure mode (building for a market need that isn't validated yet) and matches the team's actual resources (3 people, pre-revenue).
- **Affects:** `01_PRD.md`, `04_ROADMAP_AND_FEATURES.md` (entire structure).
- **Status:** Active.

### [2026-08-29] Architecture chosen as modular monolith, not microservices
- **Made by:** Founding team, with Claude assistance.
- **Context:** Needed an architecture that supports future features (kitchen displays, POS integration, multi-outlet) without requiring a rewrite, while being operable by a 3-person team.
- **Options considered:** (1) Microservices from day one. (2) Traditional unstructured monolith. (3) Modular monolith with enforced module boundaries and a defined extraction path.
- **Decision:** Option 3.
- **Reasoning:** Microservices add operational overhead disproportionate to team size; an unstructured monolith risks becoming unmaintainable as features are added. Modular monolith gives most of the benefit of both without the cost of either, provided boundaries are enforced from day one (see `02_ARCHITECTURE.md` §1).
- **Affects:** `02_ARCHITECTURE.md` (entire document), `03_TECH_STACK.md` (NestJS chosen partly for this reason).
- **Status:** Active.

### [2026-08-29] AWS chosen as primary cloud over GCP
- **Made by:** Founding team, with Claude assistance.
- **Context:** Team was open to either AWS or GCP.
- **Options considered:** AWS, GCP, or a deliberately cloud-agnostic multi-cloud approach from day one.
- **Decision:** AWS as primary, with Terraform-based IaC to keep a migration path open; multi-cloud active-active explicitly rejected for now.
- **Reasoning:** AWS has a more mature managed-service ecosystem for this exact stack (RDS, ElastiCache, SQS/SNS, S3) and strong documented integration patterns with Indian payment providers. GCP remains an option for specific future AI/data workloads if a concrete cost/capability case emerges.
- **Affects:** `03_TECH_STACK.md` §7.
- **Status:** Active. Revisit if real cost modeling in Phase 1–2 suggests otherwise — that comparison has NOT yet been done with real numbers.

### [2026-08-29] Payments handled via licensed Payment Aggregator only — no in-house escrow
- **Made by:** Founding team, with Claude assistance (based on RBI Payment Aggregator regulation research).
- **Context:** Original PRD draft included "payment escrow settlement" as a platform pillar, implying OrderMitra itself would hold/settle merchant funds.
- **Options considered:** (1) Build in-house escrow/settlement. (2) Integrate exclusively with an RBI-licensed PA (Razorpay/Cashfree) and never touch funds directly.
- **Decision:** Option 2, permanently, unless the company pursues its own RBI PA license in the future (a major, separate legal/business decision that would need its own dedicated review).
- **Reasoning:** Under RBI's Payment Aggregator and Payment Gateway guidelines, only RBI-authorized entities may aggregate and hold merchant funds. Building this in-house without a license would be illegal.
- **Affects:** `01_PRD.md` (non-negotiable principle #4), `02_ARCHITECTURE.md` §8, `05_SKILL.md`.
- **Status:** Active — treat as a hard legal boundary, not a preference.

### [2026-08-29] Lambda + API Gateway chosen over ECS Fargate for Phase 1–2 compute
- **Made by:** Founding team, with Claude (Antigravity) assistance based on AWS free tier and cost model analysis.
- **Context:** Original plan specified ECS Fargate. Cost analysis showed Fargate's always-on minimum (~$30–60/month) would consume 15–100% of revenue at the ₹299–599/month price point with 10–30 restaurants. Lambda + API Gateway scales to zero and has an always-free tier of 1M requests/month.
- **Options considered:** (1) ECS Fargate (always-on). (2) Lambda + API Gateway (serverless, scale-to-zero). (3) EC2 t3.micro (free tier credits). (4) Switch to GCP Cloud Run (scale-to-zero, but team has no GCP account).
- **Decision:** Option 2 for Phase 1–2. NestJS on Lambda via `@vendia/serverless-express`, bundled with esbuild, ARM64 target. Upgrade to Fargate only when Lambda cold starts exceed 3 seconds at p95 on ordering endpoints (a measured trigger, not a calendar date).
- **Reasoning:** Team already has an AWS account. Lambda free tier covers Phase 1 entirely at $0/month compute cost. Cold starts are mitigated by esbuild bundling + 512MB memory + ARM64. WebSocket replaced by simple polling (5s) for MVP — simpler, cheaper, and adequate for 10–30 restaurants.
- **Affects:** `03_TECH_STACK.md` §7, `02_ARCHITECTURE.md` §2 diagram, `07_REPO_AND_ENV_STRATEGY.md` §5 CI/CD pipeline.
- **Status:** Active. Supersedes the Fargate reference in original architecture docs.

### [2026-08-29] Upstash Redis chosen over AWS ElastiCache for Phase 1–2 caching
- **Made by:** Founding team, with Claude (Antigravity) assistance.
- **Context:** ElastiCache has no free tier (~$15/month minimum). At the target revenue of ₹3,000–18,000/month (10–30 restaurants), this is a significant fixed cost for a caching layer. Upstash offers serverless Redis with 500K commands/month free.
- **Options considered:** (1) ElastiCache for Redis ($15/month minimum). (2) Upstash Redis (serverless, free tier). (3) No Redis at all (rely on Postgres for everything).
- **Decision:** Option 2. Upstash Redis for cache, session, and rate-limiting. Provides both TCP and HTTP/REST APIs, making it Lambda-compatible.
- **Reasoning:** Free tier (500K commands/month, 256MB) is more than sufficient for 50 restaurants. HTTP API eliminates Lambda cold-start connection issues common with TCP-only Redis. Upgrade to ElastiCache only when Upstash free tier is consistently exceeded.
- **Affects:** `03_TECH_STACK.md` §5, `02_ARCHITECTURE.md` §2 diagram.
- **Status:** Active.

### [2026-08-29] AWS Amplify Hosting chosen over Vercel for Next.js deployment
- **Made by:** Founding team, with Claude (Antigravity) assistance based on Vercel pricing research.
- **Context:** Next.js SSR apps need a deployment platform. Vercel is the default recommendation for Next.js but its free (Hobby) tier explicitly prohibits commercial use. OrderMitra processes payments = commercial use.
- **Options considered:** (1) Vercel Hobby tier (free, but TOS prohibits commercial use). (2) Vercel Pro ($20/seat/month × 3 = $60/month). (3) AWS Amplify Hosting (free tier: 1,000 build mins, 15GB serving). (4) Self-hosted via OpenNext on Lambda@Edge.
- **Decision:** Option 3 (Amplify Hosting), with Option 4 (OpenNext) as fallback if Amplify's Next.js SSR proves unreliable.
- **Reasoning:** Stays within AWS ecosystem (one account, one bill), free tier covers Phase 1, supports Next.js App Router SSR natively. Avoids Vercel's $60/month cost or TOS violation risk.
- **Affects:** `03_TECH_STACK.md` §3, `02_ARCHITECTURE.md` §2 diagram, `07_REPO_AND_ENV_STRATEGY.md` §5.
- **Status:** Active.

### [2026-08-29] shadcn/ui (Radix-based) chosen as headless component library
- **Made by:** Founding team, with Claude (Antigravity) assistance.
- **Context:** A 3-person team building every button, modal, dropdown, and toast from scratch is a significant time sink. Need accessible, tested interaction primitives that can be styled with OrderMitra's custom design tokens.
- **Options considered:** (1) Build all components from scratch. (2) shadcn/ui (Radix-based, copy-paste, unstyled). (3) Headless UI (Tailwind Labs). (4) Full component library like Chakra UI or MUI (opinionated styling).
- **Decision:** Option 2 (shadcn/ui). Components are copied into the codebase (not installed as a dependency), built on Radix UI accessibility primitives, and styled with Tailwind — fully customizable with the OrderMitra design tokens from `08_DESIGN_SYSTEM.md`.
- **Reasoning:** Gives accessible, tested behavior (focus traps, keyboard navigation, ARIA attributes) without fighting against an opinionated visual framework. Copy-paste model means no version lock-in and full control over customization.
- **Affects:** `03_TECH_STACK.md` §3, `08_DESIGN_SYSTEM.md` (component usage).
- **Status:** Active.

### [2026-08-29] DPDP Act compliance elevated to Phase 1 requirement (not deferred)
- **Made by:** Founding team, with Claude (Antigravity) assistance based on DPDP Act 2023 + 2025 Rules research.
- **Context:** Original PRD mentioned DPDP Act as a one-liner. Research confirmed: the DPDP Act and 2025 Rules are now in force, penalties reach ₹250 crore, and compliance is mandatory from the first diner phone number collected — which happens in Phase 1 (WhatsApp receipts, loyalty phone recognition).
- **Options considered:** (1) Defer compliance to Phase 2–3 ("we're small, nobody will notice"). (2) Implement minimum viable compliance in Phase 1 (consent flows, data deletion, privacy notice, retention policy).
- **Decision:** Option 2. New document `10_COMPLIANCE.md` created with DPDP Act requirements, consent flow designs, data retention policy, and a Phase 1 minimum compliance checklist.
- **Reasoning:** "We're small" is not a legal defense. Consent flows and data deletion endpoints are architecturally simple to build in Phase 1 but extremely expensive to retrofit later (every existing user record would need retroactive consent). Non-negotiable Principle #8 added to SKILL.md.
- **Affects:** `01_PRD.md` §7, `10_COMPLIANCE.md` (new), `12_DATABASE_SCHEMA.md` (ConsentRecord table), `SKILL.md` (new principle #8).
- **Status:** Active.

<!--
Add new entries above this line, most recent at the bottom of the "Log entries" section,
using the template above. Do not edit or delete entries above.
-->
