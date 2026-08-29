# Cost Model — OrderMitra

**Purpose:** Prove that OrderMitra is profitable at ₹299–₹599/month per restaurant, and define cost alert thresholds so we never drift into unprofitability without noticing.

---

## 1. Per-Restaurant AI Cost Breakdown (Monthly)

Based on Claude Sonnet and Gemini Flash API pricing as of August 2026, for a **typical small restaurant** (50–100 orders/day, 30–80 menu items).

| AI Task | Trigger | Est. calls/month | Model | Input tokens/call | Output tokens/call | Est. cost/month |
|---|---|---|---|---|---|---|
| Dish upsell suggestion | Diner views item | ~3,000 | Gemini Flash | ~300 | ~80 | ~$0.15 |
| Menu item description | Owner adds/edits item | ~30 | Claude Sonnet | ~200 | ~150 | ~$0.05 |
| Daily sales digest | Once per day | 30 | Claude Sonnet | ~1,500 | ~500 | ~$0.25 |
| Review prompt copy | Post-order nudge | ~50 | Gemini Flash | ~150 | ~60 | ~$0.02 |
| **Total AI cost/restaurant/month** | | | | | | **~$0.47 (~₹40)** |

**Key assumptions:**
- Upsell suggestions are **cached per menu item** (not per diner per visit) — cache invalidation only on menu change. This reduces 3,000 LLM calls to ~80 unique calls + cache hits.
- With caching, realistic AI cost drops to **~$0.15–0.25/restaurant/month (~₹13–21).**
- Gemini Flash is used for all high-frequency, low-stakes calls. Claude Sonnet only for owner-facing quality-sensitive generation.

### Cost guardrail
> **Alert threshold:** If AI cost per restaurant exceeds ₹100/month (~$1.20), investigate immediately — either caching has broken, prompts have ballooned, or a model price change has occurred.

---

## 2. Infrastructure Cost Per Tier (Monthly)

### Phase 1 (10–30 restaurants) — AWS Free Tier + Serverless

| Service | 10 restaurants | 30 restaurants | Notes |
|---|---|---|---|
| Lambda (API) | $0 | $0 | 1M requests/month always free; 10–30 restaurants produce ~50K–150K API calls/month |
| API Gateway | $0 | $0 | 1M REST calls/month free |
| RDS db.t3.micro (PostgreSQL) | $0 (credits) | $0 (credits) → $13.14 after | Free under AWS credits; ~$13/month after credits expire |
| Upstash Redis | $0 | $0 | Free tier: 500K commands/month — easily covers 30 restaurants |
| S3 (menu photos) | $0 | $0 | 5GB free; ~30 restaurants × 50 items × 200KB photo = ~300MB |
| SQS + SNS | $0 | $0 | 1M requests/month always free each |
| CloudFront (CDN) | $0 | $0 | 1TB/month always free |
| Amplify Hosting (2 Next.js apps) | $0 | $0 | Free tier: 1,000 build mins, 15GB serving |
| Sentry (error tracking) | $0 | $0 | Free tier: 5K errors/month |
| **Total infra/month** | **$0** | **$0–$13** | |

### Phase 2 (30–100 restaurants)

| Service | 50 restaurants | 100 restaurants | Notes |
|---|---|---|---|
| Lambda | $0 | ~$2–5 | May start exceeding free tier at ~500K–1M calls |
| API Gateway | $0 | ~$3–5 | Same threshold |
| RDS db.t3.micro → db.t3.small | $13 | $26 | May need to upgrade to t3.small for 100 restaurants |
| Upstash Redis | $0 → $10 | $10 | May need paid plan at 500K+ commands |
| S3 | ~$0.50 | ~$1.50 | Growing photo storage |
| SQS/SNS | $0 | $0 | Still within free tier |
| CloudFront | $0 | $0 | Still within free tier |
| Amplify | $0 | ~$5 | May exceed free tier build minutes |
| **Total infra/month** | **~$14** | **~$50** | |

### Phase 3+ (100–500 restaurants)

| Service | 200 restaurants | 500 restaurants | Notes |
|---|---|---|---|
| Lambda → Fargate | $30–60 | $60–120 | Cold starts may justify always-on compute at this scale |
| RDS db.t3.medium | $52 | $104 | Multi-AZ for reliability |
| ElastiCache (Redis) | $15 | $30 | Replace Upstash when commands exceed 10M/month |
| S3 | $3 | $8 | |
| SQS/SNS | ~$2 | ~$5 | |
| CloudFront | $0 | ~$10 | May exceed free tier |
| **Total infra/month** | **~$102** | **~$277** | |

---

## 3. Break-Even Analysis

### At ₹299/month per restaurant

| Restaurants | Monthly revenue | Monthly cost (infra + AI) | Profit/Loss |
|---|---|---|---|
| 5 | ₹1,495 (~$18) | ~₹170 (~$2) | ✅ +₹1,325 |
| 10 | ₹2,990 (~$36) | ~₹340 (~$4) | ✅ +₹2,650 |
| 30 | ₹8,970 (~$108) | ~₹1,700 (~$20) | ✅ +₹7,270 |
| 100 | ₹29,900 (~$360) | ~₹5,900 (~$71) | ✅ +₹24,000 |
| 500 | ₹1,49,500 (~$1,800) | ~₹26,500 (~$319) | ✅ +₹1,23,000 |

**Break-even: ~2 restaurants** (infrastructure is effectively $0 at this scale on free tier + serverless).

### At ₹599/month per restaurant

| Restaurants | Monthly revenue | Monthly cost (infra + AI) | Profit/Loss |
|---|---|---|---|
| 5 | ₹2,995 (~$36) | ~₹170 (~$2) | ✅ +₹2,825 |
| 10 | ₹5,990 (~$72) | ~₹340 (~$4) | ✅ +₹5,650 |
| 100 | ₹59,900 (~$720) | ~₹5,900 (~$71) | ✅ +₹54,000 |
| 500 | ₹2,99,500 (~$3,600) | ~₹26,500 (~$319) | ✅ +₹2,73,000 |

### Hidden costs NOT in the infrastructure line (account for these)

| Cost | Monthly estimate | Notes |
|---|---|---|
| WhatsApp Business API (via BSP) | ₹0.50–1.00 per message (business-initiated) | ~₹500–2,000/month at 30 restaurants (daily digest + order confirmations) |
| SMS fallback | ₹0.15–0.25 per SMS | Much cheaper; use only when WhatsApp unavailable |
| Domain + SSL | ~₹100/month (~$1.20) | Annual domain cost amortized |
| Razorpay/Cashfree transaction fee | Borne by restaurant/diner, not by OrderMitra | This is the PA's revenue, not our cost — but the owner sees it |
| **AI model API costs** | Already counted above | |

### WhatsApp cost is the biggest hidden variable

At 30 restaurants × 50 orders/day × ₹0.75 average message cost = **~₹33,750/month** for WhatsApp alone — this would be devastating.

**Mitigation (CRITICAL — implement from Phase 1):**
1. Use **user-initiated messages** (within 24-hour window) wherever possible — these are free or much cheaper than business-initiated.
2. Batch the daily digest into a **single message per owner per day**, not per-order notifications.
3. For order confirmations, use the free 24-hour reply window after the diner messages first (e.g., diner sends "Hi" to the WhatsApp bot to initiate).
4. Fallback to **in-app push notifications** (free, via PWA service worker) as the primary channel, with WhatsApp as opt-in premium.

> **Revised strategy:** PWA push notifications for order updates (free), WhatsApp only for daily owner digest and diner receipts where explicitly opted in. This drops WhatsApp cost to ~₹1,500–3,000/month at 30 restaurants.

---

## 4. Monthly Cost Monitoring Checklist

Track these numbers every month from Phase 1:

- [ ] AI API cost per restaurant (alert if >₹100)
- [ ] Total AWS bill (alert if >₹5,000/month before 50 restaurants)
- [ ] WhatsApp BSP cost per restaurant (alert if >₹100)
- [ ] Upstash Redis command count (alert at 400K/month — approaching free tier limit)
- [ ] Lambda invocation count (alert at 800K/month — approaching free tier limit)
- [ ] RDS storage usage (alert at 15GB — approaching free tier limit)

---

## 5. When to upgrade (decision triggers, not calendar dates)

| Trigger | Action |
|---|---|
| Lambda cold starts > 3 seconds measured at p95 for ordering endpoints | Evaluate Fargate or provisioned concurrency |
| Upstash commands > 400K/month | Move to paid Upstash plan ($10/month) or evaluate ElastiCache |
| RDS CPU > 70% sustained during meal peaks | Upgrade to db.t3.small |
| >100 restaurants live | Run a full cost review and update this document |
| WhatsApp cost > 20% of total revenue | Shift to PWA push notifications as primary, WhatsApp as opt-in only |
