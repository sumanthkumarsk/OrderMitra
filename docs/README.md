# OrderMitra — Project Foundation Documents

**Project codename:** PROJECT-MITRA
**Product/brand name:** OrderMitra
**Repo name:** `ordermitra`
**Tagline:** *"Your restaurant's AI-powered ordering companion — cheap, simple, never fails."*

> "Mitra" = friend/companion in Hindi. The name is deliberate: small restaurant
> owners don't want another "enterprise SaaS platform" — they want a friend
> that handles ordering, suggests upsells, and never breaks. Alternate names
> considered: TableGenie, MenuSetu, PlateAI — OrderMitra scored highest for
> being ownable, easy to say in Hindi/English, and not sounding like every
> other "AI-powered platform." Confirm domain/trademark availability before
> final lock-in (not yet checked).

---

## Why this document set exists

Most startups fail not because the idea was bad, but because:
1. The foundation (architecture, environments, decisions) was never written down, so every new AI session / new developer re-guesses it and drifts.
2. Nobody records **why** a decision was made, so it gets silently reversed six weeks later by someone (or some AI agent) who didn't know the reason.
3. The MVP scope creeps into the "enterprise vision" before a single paying customer exists.

This document set exists to make those three failure modes structurally hard to hit. Every document here is written so an **AI coding agent (Antigravity, Claude Code, etc.) can read it and act correctly without a human re-explaining context every session.**

## How to use this with 3 team members + AI agents

- Every team member's AI agent (in Antigravity or elsewhere) should be pointed at this folder **first**, before starting any task — see `05_SKILL.md`, which is written specifically as the agent-facing instruction file.
- Nobody — human or agent — merges architecture-affecting code without first appending an entry to `06_DECISION_LOG.md`. No exceptions. This is the single rule that prevents the "foundation quietly rots" failure mode.
- Feature scope for what's being built *right now* always comes from `04_ROADMAP_AND_FEATURES.md`, not from memory or a new idea in the chat. If a new idea comes up mid-build, it gets added to the backlog section of that file, not built immediately.

## Document index

| File | Purpose | Primary audience |
|---|---|---|
| `01_PRD.md` | What we're building and why, in full detail | Everyone — humans and AI agents |
| `02_ARCHITECTURE.md` | System design, how components fit together, why it won't collapse under future features | Engineers + AI agents |
| `03_TECH_STACK.md` | Exact languages, frameworks, cloud services, AI models/MCPs to use | Engineers + AI agents |
| `04_ROADMAP_AND_FEATURES.md` | Phases, and features ordered basic → advanced | Everyone |
| `05_SKILL.md` | Pointer to root `SKILL.md` — instruction file for AI agents | AI agents specifically |
| `06_DECISION_LOG.md` | Append-only record of every non-trivial decision, who/what made it, and why | Everyone — living document |
| `07_REPO_AND_ENV_STRATEGY.md` | Git repo layout, branching, CI/CD, dev/test/prod environments | Engineers + AI agents |
| `08_DESIGN_SYSTEM.md` | Visual identity, UI principles, tone of voice | Design + frontend + AI agents |
| `09_AI_MULTI_AGENT_WORKFLOW.md` | How 3 humans and their AI agents divide work without collisions | Everyone |
| `10_COMPLIANCE.md` | DPDP Act, RBI PA boundary, GST invoicing — legal requirements from day one | Everyone — **read before collecting any user data** |
| `11_COST_MODEL.md` | Per-restaurant AI + infra costs, break-even analysis, monitoring thresholds | Engineers + founders |
| `12_DATABASE_SCHEMA.md` | Core Prisma schema for Phase 1 — tables, relations, RLS policies | Engineers + AI agents |
| `13_API_CONTRACTS.md` | MVP API endpoint shapes for frontend/backend parallel development | Engineers + AI agents |

## The one rule above all others

**If an AI agent or a human is about to make a choice that isn't already answered in these documents (a new library, a new service, a schema change, a new third-party integration, a pricing change) — STOP, write it into `06_DECISION_LOG.md` first with the reasoning, then proceed.** This is what "PBVI" discipline means in this project: **P**ropose → **B**asis (why) → **V**erify (against existing docs) → **I**mplement. Never implement first and document later.
