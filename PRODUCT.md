# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (React) App Router with TypeScript, Tailwind CSS, shadcn/ui. Backend is NestJS, Prisma, PostgreSQL on AWS.

## Users

**Primary:** The Owner-Operator of a small Indian restaurant (cafe, dhaba, QSR). Not highly tech-savvy, uses their personal phone, price-sensitive.
**Secondary:** The Diner. Has a smartphone, scans QR codes, doesn't want to download an app.

## Product Purpose

The cheapest, most reliable QR ordering companion for small Indian restaurants. Built AI-first to give a single owner with no staff outsized value (AI dish suggestions, automated menus, sales insights, review nudges) for a low, flat monthly fee with zero commissions.

## Positioning

Unlike existing enterprise-heavy POS systems or commission-based aggregators, OrderMitra is purpose-built for the single-outlet budget-constrained owner, offering AI-assisted revenue growth without hidden fees or expensive hardware.

## Operating Context

Small, single-outlet restaurants with 1–15 tables, often with bad infrastructure (unreliable WiFi) and no dedicated IT staff. The owner manages everything from their personal phone which acts as the "kitchen screen". 

## Capabilities and Constraints

- **Capabilities:** Web-based PWA (no app downloads), table-specific QR menus, AI-assisted menu copy generation, AI-suggested add-ons for diners, daily WhatsApp sales digests, integration with Razorpay/Cashfree.
- **Constraints:** Must work gracefully offline and sync when online. Must load under 2s on 3G/4G. Single-outlet only (multi-location is out of scope). No storage of payment card data. No native apps.

## Brand Commitments

- **Name:** OrderMitra
- **Identity:** Cheap, reliable, accessible. 
- **Language:** English + Hindi + Regional languages (UI and AI content).

## Evidence on Hand

- Validated willingness to pay at a low price point via owner interviews (Phase 0).
- Product architecture, roadmap, and compliance documents are established in the repository.

## Product Principles

1. Cheap and flat-fee. No percentage commission.
2. Works on bad infrastructure (existing phones, bad WiFi).
3. No app downloads for diners (PWA only).
4. AI serves the owner, not just the diner.
5. Single-outlet first.

## Accessibility & Inclusion

- UI must be usable with screen readers.
- Minimum font-scaling support.
- Touch targets sized for one-handed phone use.
