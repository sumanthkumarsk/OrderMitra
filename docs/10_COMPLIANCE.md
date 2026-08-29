# Compliance & Legal Requirements — OrderMitra

**This document covers the legal/regulatory obligations OrderMitra must satisfy from day one.** Not Phase 3, not "when we scale" — from the first diner phone number collected.

---

## 1. Digital Personal Data Protection (DPDP) Act, 2023

The DPDP Act (and the 2025 Rules now in force) classifies OrderMitra as a **Data Fiduciary** the moment we collect, store, or process personal data from diners or restaurant owners. Non-compliance penalties reach up to ₹250 crore.

### 1.1 What personal data does OrderMitra collect?

| Data point | Collected from | Purpose | Phase |
|---|---|---|---|
| Phone number | Owner | Authentication, account identity | Phase 1 |
| Phone number | Diner | WhatsApp/SMS receipt, loyalty recognition | Phase 1 |
| Name | Owner | Account profile | Phase 1 |
| Order history | Diner (linked to phone number) | Loyalty, AI recommendations, repeat-customer detection | Phase 2+ |
| Location (restaurant address) | Owner | QR code context, future discovery features | Phase 1 |
| Payment reference IDs | Diner (via Razorpay/Cashfree) | Transaction records, refund support | Phase 1 |

### 1.2 Consent requirements (mandatory from Phase 1)

Under the DPDP Act, consent must be **free, specific, informed, unconditional, and unambiguous.** This means:

1. **Separate consent per purpose.** Collecting a phone number for an order confirmation is a different legal "purpose" than using it for marketing messages or loyalty tracking. You **cannot** bundle these into a single "I agree to everything" checkbox.

2. **Notice before consent.** Before requesting any data, show a clear notice (in the user's language) that states:
   - What data is being collected.
   - Why (specific purpose).
   - How to withdraw consent later.
   - How to request data deletion.
   - How to file a grievance.

3. **Affirmative action required.** Pre-checked boxes, silence, or "by using this site you agree" do NOT constitute valid consent. The diner must actively opt in.

### 1.3 Implementation in OrderMitra

**Diner flow (Phase 1):**
- When a diner first interacts with a feature requiring their phone number (e.g., WhatsApp receipt, "pay at counter" with order tracking):
  1. Show a consent screen explaining: "We'll use your phone number to send you order updates via WhatsApp/SMS. We won't use it for marketing unless you separately opt in."
  2. Provide a clear "Allow" / "No thanks" choice. "No thanks" must still allow the diner to place an order — phone number collection for receipts is a convenience, not a gate.
  3. If diner provides phone number, store a `consent_record` with: purpose, timestamp, consent version, method (e.g., "QR ordering flow v1").

**Owner flow (Phase 1):**
- During signup (phone + OTP), the consent notice is part of the registration flow:
  1. "We'll use your phone number for account authentication and to send you daily order summaries via WhatsApp."
  2. Link to full privacy policy.
  3. Store consent record.

**Marketing consent (Phase 2+):**
- When loyalty or promotional features are introduced, a **separate** consent prompt must be shown. Never auto-enroll a diner whose phone number you already have for receipts into marketing messages.

### 1.4 Right to erasure (mandatory from Phase 1)

Any diner or owner must be able to request deletion of their personal data. Implementation:

- **Diner:** Since diners don't have accounts, erasure is requested via a link in the WhatsApp receipt or a footer link in the menu PWA → "Delete my data" → enter phone number → OTP verification → confirm deletion.
- **Owner:** Settings page in admin panel → "Delete my account and all data" → confirmation flow.
- **What gets deleted:** Personal identifiers (phone number, name). Order records can be anonymized (remove phone/name, keep order data for the restaurant's business records) rather than fully deleted — but this anonymization approach must be stated in the privacy notice.
- **Timeline:** Deletion must be completed within a reasonable timeframe. Target: 72 hours from confirmed request.

### 1.5 Data retention policy

| Data type | Retention period | Justification |
|---|---|---|
| Diner phone number (receipt/order tracking) | 90 days after last order at that restaurant, then auto-delete unless loyalty consent given | Purpose fulfilled after order cycle complete |
| Diner phone number (loyalty) | Until diner withdraws consent or requests deletion | Ongoing purpose with active consent |
| Owner account data | Until account deletion requested | Active service relationship |
| Order transaction records | 8 years (anonymized after diner data deletion) | GST/tax record-keeping obligation |
| Payment reference IDs | 8 years | Financial record-keeping obligation |

### 1.6 Breach notification

If a data breach occurs (unauthorized access, leak, or loss of personal data):
1. Notify the **Data Protection Board of India** within the prescribed timeline (currently: "without unreasonable delay" — target 72 hours).
2. Notify affected individuals (diners/owners) with: what happened, what data was affected, what steps they should take.
3. Document the breach internally: timeline, scope, root cause, remediation.

**Phase 1 requirement:** A documented incident response procedure (even if it's a simple runbook), not a fully automated breach detection system.

---

## 2. RBI Payment Aggregator Boundary (architectural enforcement)

Covered in detail in `02_ARCHITECTURE.md` §8. Summarized here for compliance reference:

- OrderMitra is **not** a Payment Aggregator. We use a licensed PA (Razorpay/Cashfree).
- We **never** store full card numbers, CVVs, or bank account details (PCI scope stays with the PA).
- We **never** hold, pool, or settle merchant funds.
- We store only: payment reference IDs, transaction status, amount, timestamp.
- The `payments` module is an adapter only — if any future feature seems to require holding funds, **stop and escalate** (see decision log).

**RBI PA authorization requirements (for reference — we do NOT need this):**
- ₹15 crore net worth at application
- ₹25 crore net worth by year 3
- Full PCI-DSS compliance
- PMLA reporting entity obligations

This is why we integrate with Razorpay/Cashfree and don't attempt this ourselves.

---

## 3. GST Invoicing Requirements

Indian restaurants are required to issue GST-compliant invoices. OrderMitra's role:

### What we must do (Phase 1):
- Generate a **receipt/bill** for each order that includes:
  - Restaurant name, address, GSTIN (if registered — not all small restaurants have GST registration)
  - Invoice/bill number (sequential)
  - Date and time
  - Itemized list with prices
  - GST breakdown (CGST + SGST for intra-state, IGST for inter-state — practically always intra-state for dine-in)
  - Total amount
- The restaurant owner inputs their GSTIN and tax rates during setup. OrderMitra computes and displays the breakdown — we do NOT file GST returns for them.

### What we must NOT do:
- Auto-file GST returns (that's the restaurant's or their CA's responsibility).
- Claim to be a "GST-compliant billing system" in marketing if we haven't been independently verified — use "generates GST-formatted invoices" instead.

### Phase 3+:
- Optional: Export order data in a format compatible with common GST filing tools (Tally, ClearTax) — this would be a genuine value-add for owners, but is not a Phase 1 requirement.

---

## 4. Phase 1 Minimum Compliance Checklist

Every item below must be implemented before the first paying restaurant goes live with real diners:

- [ ] Privacy notice displayed before any personal data collection (diner + owner flows)
- [ ] Separate consent prompts per purpose (order updates ≠ marketing ≠ loyalty)
- [ ] Consent records stored with timestamp, purpose, version
- [ ] "Delete my data" flow for diners (phone-number-based, OTP-verified)
- [ ] "Delete my account" flow for owners
- [ ] Data retention policy documented and communicated in privacy notice
- [ ] Incident response runbook written (even if simple)
- [ ] Payment module stores only reference IDs, never card/bank data
- [ ] No "wallet" or "balance" tables in schema
- [ ] GST-formatted receipt generation (with owner's GSTIN if provided)
- [ ] Privacy policy page accessible from menu PWA and admin PWA
- [ ] Cookie/tracking notice if any analytics tracking is used on the PWA

---

## 5. Documents to prepare (non-code, but required before launch)

- [ ] **Privacy Policy** (web page) — must cover all DPDP Act required disclosures
- [ ] **Terms of Service** (web page) — for restaurant owners subscribing to OrderMitra
- [ ] **Incident Response Runbook** — who to contact, what to do, notification templates
- [ ] **Data Processing Agreement template** — for any third-party processors (WhatsApp BSP, analytics, etc.)

> **Note:** These should be reviewed by a legal professional before launch. AI-generated legal documents are a starting point, not a substitute for legal counsel — especially for DPDP Act compliance where the regulatory framework is still being actively interpreted.
