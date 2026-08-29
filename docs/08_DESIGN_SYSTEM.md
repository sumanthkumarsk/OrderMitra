# Design System — OrderMitra

## 1. Design brief, made concrete

Two very different people use this product in the same 90 seconds: a **diner** scanning a QR code at a table (wants speed, clarity, appetite appeal), and an **owner** checking orders on a cracked-screen Android phone between tasks (wants zero friction, big touch targets, no training needed). The design has to serve both without feeling like two different products.

**Explicitly avoiding the generic AI-design defaults:** not the cream-background/serif/terracotta look, not the dark-mode/single-neon-accent look, not a broadsheet/hairline-rule layout — none of these come from anything true about Indian small-restaurant dining. The signature element instead comes from the **thali/menu-card vernacular**: warm, appetite-driven color, and a layout built around a single scrollable card stack rather than a grid — because that's how people actually browse a physical menu card, top to bottom, one section at a time.

## 2. Token System

**Color** (named, 4–6 values):
- `--mitra-tandoor` `#C1440E` — primary accent, a warm burnt-clay/tandoor-red, used sparingly for CTAs (Add to Cart, Place Order) and active states. Distinct from the generic terracotta (#D97757) — this is deeper, closer to an actual tandoor/masala tone.
- `--mitra-turmeric` `#E8A93A` — secondary accent for highlights, "recommended" badges, AI-suggestion tags. Warm and appetite-positive without competing with the primary.
- `--mitra-paper` `#FAF6EF` — background, a warm off-white evoking a menu card, not sterile white.
- `--mitra-ink` `#2B231C` — primary text, a warm near-black (not pure black) for readability without harshness.
- `--mitra-leaf` `#4C6444` — success/confirmation states (order placed, payment successful) — a muted green, not a generic bright system-green.
- `--mitra-slate` `#6B6259` — secondary text, timestamps, metadata.

**Type:**
- Display/headings: a confident, slightly rounded sans-serif with warmth (e.g., **Poppins** or **Baloo 2** for Devanagari/Latin compatibility) — approachable, not corporate, and renders well for Hindi/regional-language headings without needing a separate display face per script.
- Body: a highly legible, neutral sans-serif optimized for small screens (e.g., **Inter** or **Noto Sans**, the latter chosen specifically for strong multi-script Indian-language support since Phase 3 requires it).
- Utility/data (prices, table numbers, timestamps): a tabular-figure variant of the body face — numbers must align cleanly in cart/receipt views.

**Layout concept:**
- Diner menu: a **single-column scrollable card stack**, one category at a time with a sticky category-jump bar — mirrors flipping through a physical menu, not a dense grid. Item cards are full-width, photo-forward, with the AI "pairs well with" suggestion appearing as a small inline chip under the item, not a disruptive popup.
- Owner admin/kitchen view: **large-touch-target list view**, optimized for a thumb on a phone held in one hand while the other hand is doing something else (a real usage condition for a busy owner) — no hover-dependent interactions, no small icon-only buttons without labels.

**Signature element:** The **order status strip** — a persistent, thin horizontal progress strip (Received → Preparing → Ready) rendered in the turmeric/tandoor palette that appears identically on both the diner's phone and the kitchen screen, so both sides are always looking at the same visual state. This is the one memorable, consistent thread tying the two very different interfaces together, and it directly encodes real information (order sequence), not decoration.

## 3. UI Principles

- **One-thumb usable.** Every primary action (add to cart, place order, mark order ready) must be reachable and tappable with one thumb on a mid-size phone.
- **No hover-only affordances.** This is a touch-first product; nothing important should depend on hover.
- **Big, obvious empty/loading/offline states.** Given the offline-first architecture, the UI must be explicit when it's operating offline/queued ("Order saved — will send when back online") rather than silently failing or looking broken.
- **Photos carry the sell.** Food photography is the primary driver of order value in this category — the design should never crop or shrink item photos to make room for decoration.
- **Respect low bandwidth.** Compress and lazy-load images aggressively; the design should look intentional even with images loading progressively (blur-up placeholders in the palette above, not gray boxes).

## 4. Voice & Copy Guidelines

Write from the diner's or owner's side of the screen, not the system's:

- Buttons say what happens: "Add to cart," "Place order," "Mark ready" — never "Submit" or "Confirm."
- Errors are specific and actionable, never apologetic filler: "Payment didn't go through — try again or pay at the counter," not "Something went wrong."
- Empty states invite action: an empty menu-setup screen says "Add your first dish," not "No items found."
- AI-generated content (item descriptions, digest copy) should sound like a helpful local friend, not a marketing copywriter — short, plain, specific ("Crispy on the outside, soft inside — a customer favorite" beats "An exquisite culinary delight").
- Keep every string ready for translation from day one — no string concatenation that breaks in other languages (e.g., don't build "You have " + count + " items", use proper ICU message formatting) — this matters because Phase 3 multilingual support is committed, not optional.

## 5. Accessibility Baseline

- Minimum 4.5:1 contrast ratio for all text against its background, checked against the token palette above (verify `--mitra-slate` on `--mitra-paper` specifically, as the lowest-contrast pairing).
- Touch targets minimum 44x44px.
- All interactive elements keyboard/screen-reader accessible even though the primary usage is touch — some owners will use this on a laptop.
- Respect `prefers-reduced-motion` for any transitions (order status strip animation, etc.).

## 6. What NOT to do

- No stock "happy diverse people eating" photography clichés — use real or realistic food photography only.
- No generic "AI sparkle" iconography for AI features — label AI suggestions plainly ("Suggested for you") rather than leaning on a magic-wand visual trope.
- No dense multi-column dashboards for the owner view at MVP — resist the urge to make the admin panel look like a "serious enterprise SaaS," which contradicts the entire positioning of this product.
