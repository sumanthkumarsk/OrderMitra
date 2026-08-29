# AI + Multi-Agent Collaboration Workflow — OrderMitra

**Context:** 3 human team members, each likely running their own AI coding agent (Antigravity, possibly others), working in the same monorepo. This document exists to prevent the specific failure mode of two agents making conflicting architectural choices in parallel without either human noticing until merge time.

## 1. Roles (adjust names, keep the structure)

| Role | Primary modules owned | Responsibility |
|---|---|---|
| Member A | `identity`, `platform`, `payments` | Auth, multi-tenancy, billing, payment adapter |
| Member B | `menu`, `ordering`, `notifications` | Core ordering flow, offline sync, WhatsApp/SMS |
| Member C | `ai-assist`, `analytics`, `loyalty` | AI features, insight generation, retention features |

Frontend work (customer PWA, admin PWA, design system package) is shared but should be claimed per-task using the same convention below — frontend changes often cut across all three backend owners' domains.

## 2. Claiming work (prevents collision)

Before starting any task (human or agent):
1. Check the task board / issue tracker for whether the module/feature is already claimed.
2. Create a branch named `feature/<module>-<short-description>` (per `07_REPO_AND_ENV_STRATEGY.md`) — this branch name itself is the "claim."
3. If two people/agents need to touch the same module simultaneously, coordinate explicitly (a quick message) rather than letting both agents proceed independently — module boundaries reduce collision risk but don't eliminate it entirely for shared files (e.g., `shared-types`).

## 3. Session start-of-work checklist (for every agent, every session)

1. Load `docs/05_SKILL.md`.
2. Pull latest `main`, check `docs/06_DECISION_LOG.md` for anything new since last session.
3. Confirm the task at hand is in the current roadmap phase (`04_ROADMAP_AND_FEATURES.md`).
4. Confirm which module(s) the task touches and whether that module is "owned" by a different team member for architectural decisions (per §1) — cross-module or architecture-level changes should loop in the module owner even if another agent is doing the implementation.

## 4. When agents disagree with a past decision

An AI agent may reasonably conclude a past decision in `06_DECISION_LOG.md` should change (e.g., "this library is now deprecated," "this pattern doesn't scale the way we assumed"). The correct flow:

1. Do **not** silently implement the change.
2. Surface the disagreement explicitly to the human directing that session, with reasoning.
3. If the human agrees, implement the change **and** add a new decision-log entry that explicitly references and supersedes the old one (never delete the old entry).
4. If there's any ambiguity about whether this affects another team member's owned module, flag it for that person before merging.

## 5. Code review across agents

- Every PR gets at least one review before merge to `main` (per `07_REPO_AND_ENV_STRATEGY.md`).
- Reviews should explicitly check: does this violate any Non-Negotiable Principle (PRD §3)? Does it cross a module boundary improperly (Architecture §1)? Does it need a decision-log entry that's missing?
- It's acceptable and encouraged for one team member's AI agent to review another's PR as a first pass, with a human doing final sign-off — this speeds up iteration without removing human accountability.

## 6. Weekly sync artifact

At the end of each week, someone (human, can be AI-drafted) should produce a short summary appended to a `docs/WEEKLY_LOG.md` (create when first needed) covering: what shipped, what's in progress, any new decision-log entries, and any risks flagged. This is deliberately lightweight — a paragraph, not a report — but having *some* running record prevents the team from losing track of state across 3 parallel workstreams.

## 7. Antigravity-specific notes

- Antigravity supports multiple agents working in parallel with editor/terminal/browser access and produces task artifacts (plans, walkthroughs) as it works — save/export these artifacts into the relevant PR description when they explain a non-obvious implementation choice, so the reasoning isn't lost once the agent session ends.
- Since Antigravity can use multiple model backends (Gemini, Claude, etc.), keep model choice per-agent a personal/session preference — it doesn't need to be standardized across the team, but the **output** (code, decisions) must still conform to `03_TECH_STACK.md` regardless of which model produced it.
