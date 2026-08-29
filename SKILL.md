---
name: ordermitra-project-foundation
description: Load this skill before performing ANY task on the OrderMitra codebase — writing code, designing schema, adding a dependency, changing an API contract, or making an architecture decision. Covers the mandatory project context, non-negotiable principles, tech stack, and the decision-logging workflow every change must follow.
---

# OrderMitra — Agent Operating Instructions

You are working on **OrderMitra**, a QR-based AI ordering platform for small Indian restaurants. This skill file is your entry point. Read it fully before writing any code.

## Before doing anything else

1. Read `docs/01_PRD.md` if you don't already have the product context loaded this session.
2. Read `docs/02_ARCHITECTURE.md` before touching anything that spans more than one module, or before adding a new service/table/queue.
3. Read `docs/03_TECH_STACK.md` before introducing any new library, framework, cloud service, or AI provider. **Do not introduce anything not listed there without following the decision workflow below.**
4. Check `docs/04_ROADMAP_AND_FEATURES.md` to confirm the task you're about to do belongs to the **current** phase. If it belongs to a later phase, flag this to the human instead of building it early.
5. Skim the most recent entries in `docs/06_DECISION_LOG.md` — someone (human or another agent) may have already made a relevant decision this week that isn't reflected in your training data or context window.
6. Read `docs/10_COMPLIANCE.md` before implementing any feature that collects personal data (phone numbers, names) or touches payments — DPDP Act requirements apply from day one.
7. Check `docs/11_COST_MODEL.md` if your change involves AI API calls or new cloud services — verify it stays within the per-restaurant cost budget.

## The Non-Negotiable Principles (from the PRD — do not violate these even if asked)

1. Flat-fee pricing only — never build percentage-commission billing logic.
2. Must work with flaky connectivity — any new client-side feature needs an offline/retry story, not just a happy-path implementation.
3. No native app requirement — web/PWA only unless a decision-log entry says otherwise.
4. **Never build code that lets OrderMitra hold or move merchant funds directly.** Payments always go through the licensed aggregator adapter (Razorpay/Cashfree). If a task seems to require this, stop and flag it — this is a legal boundary, not a style preference.
5. Single-outlet first — don't build multi-outlet/enterprise data models "just in case" ahead of Phase 4.
6. Every phase needs at least one owner-facing AI feature, not just diner-facing.
7. **Log before you build**, per the PBVI workflow below.
8. **Never collect personal data without a consent flow** — see `docs/10_COMPLIANCE.md`. DPDP Act penalties reach ₹250 crore.

## The PBVI Decision Workflow (mandatory for non-trivial changes)

Before implementing anything that is: a new dependency, a schema change, a new third-party integration, a new API contract, a pricing/business-logic change, or any deviation from `02_ARCHITECTURE.md` / `03_TECH_STACK.md` —

1. **Propose** — state clearly what you're about to do and why, in plain language.
2. **Basis** — check it against `docs/01_PRD.md`, `docs/02_ARCHITECTURE.md`, `docs/03_TECH_STACK.md`. Does it conflict with anything there?
3. **Verify** — check `docs/06_DECISION_LOG.md` for prior related decisions. Don't silently reverse a past decision — if you believe a past decision was wrong, say so explicitly and log the reversal with reasoning.
4. **Implement** — only after 1–3, write the code, AND append an entry to `docs/06_DECISION_LOG.md` in the same work session (see template in that file). A change without a log entry is treated as incomplete work.

If you are an autonomous agent (e.g., running in Antigravity) and cannot get human confirmation before proceeding on an ambiguous point, choose the most conservative interpretation consistent with the Non-Negotiable Principles, implement it, and clearly flag the assumption in both your output and the decision log entry so a human can correct it quickly.

## Module boundaries (do not violate)

Refer to `docs/02_ARCHITECTURE.md` §1 for the full module list. The rule that matters most for you as a coding agent: **a module may only talk to another module through its exported service interface — never by importing another module's database models/repositories directly.** This is what keeps future microservice extraction possible. If you find yourself reaching across a module boundary directly, stop and either (a) find or create the proper service method, or (b) flag that the boundary itself may need to change, and log it.

## Coding standards quick reference

- TypeScript everywhere (backend: NestJS, frontend: Next.js) — see `docs/03_TECH_STACK.md` for the full stack and the justification for each choice.
- All new endpoints require input validation (zod/class-validator) and a corresponding Playwright or Vitest test for at least the happy path plus one failure path.
- All new tables must include `restaurant_id` (tenant scoping) unless explicitly platform-global (e.g., a shared cuisine-tag lookup table) — and if global, that must be a deliberate, logged decision.
- No inline AI prompts in business logic files — prompts live in `ai-assist/prompts/`, versioned.
- No secrets, API keys, or credentials in code or committed files — use environment variables sourced from the environment strategy in `docs/07_REPO_AND_ENV_STRATEGY.md`.
- Refer to `docs/12_DATABASE_SCHEMA.md` for the Prisma schema and `docs/13_API_CONTRACTS.md` for endpoint shapes before creating new tables or endpoints.

## Multi-agent collaboration (3 team members, each possibly running their own agent)

See `docs/09_AI_MULTI_AGENT_WORKFLOW.md` for the full protocol. The short version: check which module/feature is currently claimed (via the task board / branch naming convention) before starting work, to avoid two agents editing the same module simultaneously and producing conflicting architectural choices.

## Design and copy

Any UI work should follow `docs/08_DESIGN_SYSTEM.md` — do not default to generic AI-website patterns (cream background + serif + terracotta accent, or dark background + single neon accent) unless that has been deliberately chosen there. Copy should follow the "written content" guidance in that same document — plain, active-voice, owner/diner-centric language, not sales-speak.

## What "done" means for any task

A task is not done when the code compiles. It is done when:
- [ ] It respects all Non-Negotiable Principles above.
- [ ] It stays within the current Roadmap phase (or was explicitly approved to jump ahead, logged).
- [ ] It has tests for the critical path.
- [ ] It has a decision-log entry if it met the PBVI trigger criteria.
- [ ] It doesn't silently touch another module's internals.
