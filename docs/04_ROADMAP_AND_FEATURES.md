# Roadmap & Features — OrderMitra

**Rule enforced by this document:** No feature below the current phase gets built early "because it's easy" or "because an AI agent suggested it mid-session." New ideas go into the **Backlog (Unscheduled)** section at the bottom, not directly into a sprint.

---

## Phase 0 — Validation (no product code)

**Goal:** Confirm the problem and price point before building anything.

- [ ] 15–20 structured interviews with small restaurant/cafe owners (target segment from PRD §4).
- [ ] Confirm current spend on any digital ordering tool (₹0? ₹500? commission-based?).
- [ ] Test willingness to pay at ₹299–₹599/month flat, zero commission.
- [ ] Identify the single most common POS/billing tool (if any) among interviewees — informs Phase 3 POS integration priority.
- [ ] Confirm which regional language(s) matter most for the first 10–20 target restaurants.

**Exit criteria:** At least 8–10 of those owners would plausibly pay for what's described. If not, revisit the PRD before writing code.

---

## Phase 1 — MVP (Basic, ship-first features)

**Goal:** A single restaurant can go live, take real orders, and get paid — same day as signup.

### Diner-facing
- QR code → web menu (PWA), categories, photos, item descriptions.
- Add to cart, place order, table number auto-attached to QR.
- AI-suggested add-on/upsell per item ("goes well with...") — single cheap LLM call, cached per menu item.
- Checkout via Razorpay/Cashfree (UPI, cards) or "pay at counter" option.
- Order status view (received → preparing → ready) — simple polling (every 5 seconds).
- WhatsApp/SMS order confirmation.

### Owner-facing (Admin PWA)
- Phone number + OTP signup, guided menu setup wizard.
- Add/edit/delete menu items, mark out-of-stock instantly.
- AI-assisted item description generator (owner uploads photo + name, AI drafts a description they can edit).
- Auto-generated per-table QR codes, downloadable/printable.
- Kitchen order queue view (owner's own phone/tablet) — new order alert (sound + visual), mark order ready/complete.
- Basic order history and daily total.

### Platform/foundation (invisible but required)
- Multi-tenant data isolation (restaurant_id scoping + RLS).
- Offline order queueing on diner client (see Architecture §6).
- Error tracking (Sentry) wired in.
- Dev/staging/prod environments live (see `07_REPO_AND_ENV_STRATEGY.md`) before first paying customer.

**Exit criteria:** 10 paying restaurants live, >99% order success rate, menu edits reflect in under 10 seconds.

---

## Phase 2 — Retention & Owner Insight

**Goal:** Make the product indispensable, not just "nice to have."

- Phone-number-based repeat-customer recognition (no login/app needed) — "welcome back" on menu load.
- Simple loyalty: stamp-card style reward (e.g., "order 5 times, get a free item") — owner-configurable.
- Daily AI-generated WhatsApp digest to owner: total orders, revenue, top sellers, one actionable AI insight ("Paneer Tikka underperforming on weekends — consider a combo").
- Post-order Google review nudge (only sent to diners who didn't flag a problem).
- Improved offline-first sync robustness based on real Phase 1 failure data.
- Basic discount/combo/offer creation tool for the owner.
- AI-assisted pricing insight (flag items priced inconsistently vs. ingredient-cost trend, informational only — never auto-changes prices).

**Exit criteria:** Measurable average-order-value lift and repeat-customer rate reported back to restaurants as a retention/upsell tool for OrderMitra itself.

---

## Phase 3 — Kitchen & Scale Readiness

**Goal:** Support restaurants with actual kitchen staff and more complex operations, and prepare technical groundwork for POS integration.

- Dedicated Kitchen Display view (larger UI, role-restricted login for kitchen staff vs. owner/admin).
- Multi-staff roles: owner, manager, kitchen, waiter (view-only order status).
- Regional language packs (Hindi + 2 more, per Phase 0 findings) for both diner menu and owner admin UI.
- First real POS/printer integration: thermal printer KOT printing (Bluetooth/network printer support) — a lighter lift than full POS API integration, and heavily requested by small restaurants per market research.
- Basic single-POS API integration (whichever POS Phase 0 interviews identified as most common) — read/write menu + orders.
- Table management (merge/split tables, basic reservations if requested by early customers — validate before building).

**Exit criteria:** At least one cohort of restaurants using OrderMitra as their primary order-and-kitchen workflow, not a bolt-on.

---

## Phase 4 — Growth Features

**Goal:** Support restaurants that are succeeding and growing, and make OrderMitra's own growth loop stronger.

- Multi-outlet support for owners who now run 2+ locations (built on the existing `restaurant_id`/tenant model — see Architecture §3 escape hatch).
- Owner-facing analytics dashboard (trends over time, not just daily digest).
- Additional POS integrations, prioritized by actual customer demand.
- Marketing tools: WhatsApp broadcast to repeat customers (opt-in, compliant), simple promotional QR/link for social sharing.
- Referral program (restaurant refers another restaurant).

---

## Phase 5 — Enterprise / Hotel (conditional — only if data justifies it)

**Goal:** Only pursue if Phase 1–4 metrics show demand from larger, multi-property, or hospitality customers. This is where the original "enterprise platform" vision belongs — not before.

- Multi-property/hotel support (restaurant + bar + room service + spa ordering under one property).
- Deeper POS/PMS integrations for hospitality.
- Multilingual expansion for international guests (beyond the domestic-regional-language work in Phase 3).
- Enterprise-grade SLAs, dedicated support, possibly isolated infrastructure per Architecture §3 escape hatch.

---

## Backlog (Unscheduled — ideas parked here, not built early)

> Any new idea from a founder, an interview, or an AI agent goes here first. Promoting an item out of the backlog into a phase requires a decision-log entry explaining why it's ready.

- Voice-based ordering (diner speaks order instead of tapping).
- Ingredient-level inventory tracking / waste reduction insights.
- Dynamic pricing suggestions based on demand patterns.
- Table-side tablet hardware option (paid add-on) for restaurants that want it.
- Integration with food delivery aggregators (Swiggy/Zomato) for order consolidation — high complexity, explicitly deferred.
- Customer-facing loyalty app (native) — deferred per "no native apps" principle until strongly justified.
