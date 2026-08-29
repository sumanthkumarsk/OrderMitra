# Product Requirements Document — OrderMitra

**Doc reference:** PRD-ORDERMITRA-2026-V1
**Status:** Foundation — approved for Phase 0 implementation
**Owner:** Founding team (3 members)
**Last updated:** 2026-08-29 (append changes to `06_DECISION_LOG.md`, don't silently edit history here — see versioning note at bottom)

---

## 1. Problem Statement

Small independent restaurants, cafes, and dhabas in India (single outlet, 1–15 tables, often no dedicated IT staff) are stuck between two bad options:

1. **Paper menus + manual order-taking** — slow, error-prone, no data, reprinting cost every price change.
2. **Existing QR/POS platforms** (Petpooja, DotPe, UrbanPiper, and dozens of clones) — built for scale, priced with hidden middleware costs (₹4,000–15,000/month) or percentage commissions that punish success, require dedicated hardware, and take 15–30 minutes to reflect a menu change.

There is no product priced and designed for a **single-outlet, budget-constrained owner** that also gives them things that actually move revenue: AI-assisted upsell, WhatsApp-native communication, and help getting found (reviews), instead of just digitizing the paper menu.

## 2. Vision

OrderMitra is the cheapest, most reliable QR ordering companion for small Indian restaurants — built AI-first so a single owner with no staff and unreliable WiFi gets outsized value: an AI that suggests dishes to diners, writes their menu copy, tells them what to cook more of tomorrow, and nudges happy customers to leave reviews — all for a flat, low monthly fee with zero commission.

## 3. Non-Negotiable Principles (read before changing anything)

These principles override any single feature idea. Any proposed feature or architecture change that conflicts with these must be flagged in the decision log, not silently implemented.

1. **Cheap and flat-fee.** No percentage commission on orders, ever. Flat monthly subscription only.
2. **Works on bad infrastructure.** The owner's existing phone is the "kitchen screen." No dedicated hardware requirement. Must degrade gracefully offline and sync when back online.
3. **No app download for diners.** Web-based QR menu only (PWA), for both customer and, at MVP stage, the owner.
4. **We are not a payment aggregator.** We integrate with an RBI-licensed PA (Razorpay/Cashfree) for all payment collection. We never hold merchant funds ourselves. (Legal boundary — see Architecture doc §8.)
5. **Single-outlet first.** Multi-location/enterprise features are explicitly out of scope until Phase 4+ and real paying customers justify them.
6. **AI serves the owner, not just the diner.** Every phase must ship at least one feature that helps the owner directly (menu copy, sales insight, pricing suggestion), not only customer-facing AI.
7. **Every irreversible or costly decision gets logged** in `06_DECISION_LOG.md` before implementation.

## 4. Target Users

### Primary: The Owner-Operator
- Runs 1 outlet: cafe, dhaba, small multi-cuisine restaurant, or QSR.
- Not tech-savvy; manages the business from their personal phone.
- Price-sensitive: currently pays ₹0–₹1,000/month for any digital tools, or nothing.
- Speaks and thinks in a regional language + Hindi/English mix.
- Wants: fewer order mistakes, faster table turnover, some way to look "modern," and ideally more revenue per table — without hiring anyone or learning new software.

### Secondary: The Diner
- Has a smartphone, is comfortable scanning a QR code, does not want to download an app.
- Wants: fast menu browsing, accurate order, no waiting for a waiter to take the order, easy payment.

### Tertiary (Phase 3+): Kitchen staff
- Needs a simple, loud, clear order queue display — not a full POS terminal.

## 5. Core User Journeys

### Journey A — Diner orders (MVP)
1. Diner scans QR code on the table.
2. Web menu loads (PWA, no login required, works on 3G).
3. Diner browses categories, sees photos, gets AI-suggested add-ons ("goes well with...").
4. Diner places order; order appears instantly on the owner's phone/tablet (kitchen view) with table number.
5. Diner pays via UPI/card through embedded Razorpay/Cashfree checkout, or chooses "pay at counter."
6. Diner optionally gets a WhatsApp/SMS receipt and, after order completion, a one-tap Google review prompt.

### Journey B — Owner manages menu (MVP)
1. Owner logs into admin panel (own phone or laptop).
2. Adds/edits items, prices, photos (camera upload), marks items "out of stock" instantly.
3. Changes reflect on the live customer menu within seconds, not 15–30 minutes.
4. Owner gets a daily WhatsApp digest: total orders, top sellers, AI-suggested action ("Butter Naan sold out by 8pm three days running — consider prepping more").

### Journey C — Owner onboards (MVP)
1. Owner signs up (phone number + OTP, no long form).
2. Guided menu setup: AI helps generate item descriptions from a photo + item name, minimizing typing.
3. QR codes auto-generated per table, downloadable/printable PDF.
4. Owner is live and taking orders same day — this is a hard product requirement, not aspirational.

## 6. Functional Requirements by Phase (summary — full breakdown in `04_ROADMAP_AND_FEATURES.md`)

| Phase | Theme | Examples |
|---|---|---|
| 0 | Validation | Customer interviews, pricing test, no code |
| 1 | MVP | QR menu, ordering, AI dish suggestions, admin panel, Razorpay/Cashfree checkout, WhatsApp notifications |
| 2 | Retention & insight | Loyalty (phone-based), daily AI sales digest, review nudge, offline-first sync |
| 3 | Kitchen & scale | Kitchen display view, multi-staff roles, basic POS/printer integration, regional language packs |
| 4 | Growth | Multi-outlet support, analytics dashboard, first real POS API integrations, marketing tools |
| 5 | Enterprise (conditional) | Multi-tenant enterprise features, hotel/multi-property support, deeper POS/PMS integration — only if Phase 1–4 metrics justify it |

## 7. Non-Functional Requirements

- **Reliability:** Order placement must succeed even on a flaky connection (client-side queue + retry). A dropped order is a lost sale and a trust-breaking event — treat as a P0 bug class forever.
- **Latency:** Menu load under 2 seconds on 3G/4G. Order-to-kitchen-screen latency under 3 seconds.
- **Cost to serve:** Infrastructure cost per restaurant per month must stay low enough that the flat ₹299–₹599 price remains profitable at small scale — this constrains architecture choices (see Tech Stack doc, serverless-first reasoning).
- **Security & privacy:** No storage of full payment card data (PCI scope stays with the payment aggregator). Diner phone numbers used for loyalty/receipts must have a clear, purpose-specific consent flow (DPDP Act, India) and be deletable on request. Full compliance requirements, including consent implementation, data retention, and breach notification procedures, are in `10_COMPLIANCE.md` — these are Phase 1 requirements, not deferred.
- **Localization:** UI and AI-generated content must support English + Hindi + at least 2 additional regional languages by Phase 3.
- **Accessibility:** Menu must be usable with screen readers and at minimum font-scaling; touch targets sized for one-handed phone use.

## 8. Explicit Out-of-Scope (for now)

- Building our own payment aggregation/escrow (illegal without RBI PA license).
- Native mobile apps (customer or owner) before Phase 4.
- Deep POS integrations before Phase 3.
- Multi-location/franchise management before Phase 4.
- Delivery logistics/rider management — we are dine-in/takeaway ordering, not a delivery marketplace.

## 9. Success Metrics

- **Phase 0:** 15–20 structured owner interviews completed; validated willingness to pay at target price point.
- **Phase 1:** 10 paying restaurants live; order success rate >99%; menu update reflected in <10 seconds.
- **Phase 2:** >30% of diners recognized as repeat (phone-based) within 60 days at a given restaurant; measurable average-order-value lift vs. pre-OrderMitra baseline (owner-reported or POS-confirmed).
- **Phase 3+:** Defined once Phase 1–2 data exists — do not pre-commit numbers you can't yet justify.

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Feature creep into "enterprise platform" before revenue | Non-negotiable principle #5, enforced via roadmap gating in `04_ROADMAP_AND_FEATURES.md` |
| Owner churn due to complexity | Every new feature must pass the "can an owner use this with zero training?" test before merge |
| Payment/regulatory misstep | Principle #4; all payment flows route through licensed PA; legal review before any money-movement feature ships |
| AI cost overrun at low price point | Model selection + caching strategy defined in `03_TECH_STACK.md`; monitor cost-per-restaurant monthly |
| Architecture requiring a rewrite at Phase 3+ | Modular monolith design in `02_ARCHITECTURE.md` specifically chosen to avoid this |

## 11. Versioning note

This PRD is a living foundation document. **Do not silently rewrite sections** — when scope changes, add a dated entry to `06_DECISION_LOG.md` explaining what changed and why, then update this file to reflect the new agreed state. The decision log is the audit trail; this PRD is always the current source of truth.
