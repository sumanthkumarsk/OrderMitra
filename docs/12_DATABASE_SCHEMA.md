# Database Schema — OrderMitra (Phase 1)

**This is the foundational schema for Phase 1 MVP.** It covers the tables needed for: restaurant onboarding, menu management, ordering, payments, and compliance (consent records). Later phases add tables for loyalty, analytics events, and kitchen display — those are NOT defined here to avoid speculative schema design.

**ORM:** Prisma (see `03_TECH_STACK.md`). The schema below is written in Prisma SDL.

---

## 1. Multi-Tenancy Enforcement

Every tenant-scoped table includes a mandatory `restaurant_id` column. This is enforced at three levels:

1. **Prisma schema** — `restaurant_id` is a required field, never nullable.
2. **Application layer** — every query in a tenant-scoped module must filter by `restaurant_id` (enforced via a NestJS middleware/guard that injects the tenant context).
3. **PostgreSQL Row-Level Security (RLS)** — as a defense-in-depth measure, RLS policies ensure that even a buggy query can't leak data across tenants. RLS policies are defined in raw SQL migrations alongside Prisma migrations.

---

## 2. Core Schema (Prisma SDL)

```prisma
// ============================================================
// prisma/schema.prisma — OrderMitra Phase 1
// ============================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// IDENTITY MODULE
// ============================================================

model Restaurant {
  id              String           @id @default(cuid())
  name            String
  slug            String           @unique  // URL-friendly identifier for QR links
  phone           String           @unique  // owner's phone, used for auth
  email           String?
  address         String?
  city            String?
  state           String?
  pincode         String?
  gstin           String?          // GST registration number, optional for small restaurants
  gstRate         Decimal?         @default(0) @db.Decimal(5, 2) // e.g., 5.00 for 5% GST
  logoUrl         String?
  currency        String           @default("INR")
  timezone        String           @default("Asia/Kolkata")
  isActive        Boolean          @default(true)
  onboardingStep  Int              @default(0) // tracks guided setup progress

  // Subscription
  plan            PlanType         @default(TRIAL)
  planExpiresAt   DateTime?

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  // Relations
  staff           Staff[]
  menuCategories  MenuCategory[]
  menuItems       MenuItem[]
  tables          RestaurantTable[]
  orders          Order[]
  payments        Payment[]
  consentRecords  ConsentRecord[]

  @@map("restaurants")
}

enum PlanType {
  TRIAL
  BASIC     // ₹299/month
  STANDARD  // ₹599/month
  // Future tiers added here via migration, not by editing this enum directly
}

model Staff {
  id              String       @id @default(cuid())
  restaurantId    String
  phone           String
  name            String
  role            StaffRole    @default(OWNER)
  isActive        Boolean      @default(true)

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  restaurant      Restaurant   @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  @@unique([restaurantId, phone])  // same phone can't be staff at same restaurant twice
  @@index([restaurantId])
  @@map("staff")
}

enum StaffRole {
  OWNER
  MANAGER    // Phase 3
  KITCHEN    // Phase 3
  WAITER     // Phase 3
}

// ============================================================
// MENU MODULE
// ============================================================

model MenuCategory {
  id              String       @id @default(cuid())
  restaurantId    String
  name            String       // e.g., "Starters", "Main Course", "Beverages"
  description     String?
  displayOrder    Int          @default(0)
  isActive        Boolean      @default(true)

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  restaurant      Restaurant   @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  items           MenuItem[]

  @@index([restaurantId])
  @@map("menu_categories")
}

model MenuItem {
  id              String       @id @default(cuid())
  restaurantId    String
  categoryId      String
  name            String
  description     String?      // AI-generated or owner-written
  price           Decimal      @db.Decimal(10, 2)
  imageUrl        String?
  isVeg           Boolean      @default(true)  // India-specific: veg/non-veg is a critical filter
  isAvailable     Boolean      @default(true)  // "out of stock" toggle
  displayOrder    Int          @default(0)
  tags            String[]     @default([])    // e.g., ["spicy", "bestseller", "chef-special"]

  // AI-generated fields (cached, regenerated on menu change)
  aiUpsellItemIds String[]     @default([])    // IDs of suggested "goes well with" items
  aiDescription   String?                       // AI-generated description (separate from owner-written)

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  restaurant      Restaurant   @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  category        MenuCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  orderItems      OrderItem[]

  @@index([restaurantId])
  @@index([categoryId])
  @@map("menu_items")
}

// ============================================================
// ORDERING MODULE
// ============================================================

model RestaurantTable {
  id              String       @id @default(cuid())
  restaurantId    String
  tableNumber     String       // "1", "2", "A1", etc.
  qrCodeUrl       String?      // URL to the generated QR code image in S3
  isActive        Boolean      @default(true)

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  restaurant      Restaurant   @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  orders          Order[]

  @@unique([restaurantId, tableNumber])
  @@index([restaurantId])
  @@map("restaurant_tables")
}

model Order {
  id              String       @id @default(cuid())
  restaurantId    String
  tableId         String?      // nullable for takeaway orders
  orderNumber     Int          // sequential per restaurant per day (e.g., #1, #2, #3)
  status          OrderStatus  @default(RECEIVED)
  orderType       OrderType    @default(DINE_IN)

  // Diner info (optional, only if diner provided phone for receipt)
  dinerPhone      String?
  dinerName       String?

  // Pricing
  subtotal        Decimal      @db.Decimal(10, 2)
  gstAmount       Decimal      @default(0) @db.Decimal(10, 2)
  totalAmount     Decimal      @db.Decimal(10, 2)

  // Offline-sync support
  idempotencyKey  String       @unique  // client-generated, prevents duplicate orders on retry
  clientTimestamp  DateTime?   // when the order was placed on the client (may differ from server time if offline)

  // Metadata
  notes           String?      // diner's special instructions
  
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  completedAt     DateTime?

  restaurant      Restaurant   @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  table           RestaurantTable? @relation(fields: [tableId], references: [id])
  items           OrderItem[]
  payment         Payment?

  @@index([restaurantId])
  @@index([restaurantId, createdAt])  // for daily order history queries
  @@index([idempotencyKey])
  @@map("orders")
}

enum OrderStatus {
  RECEIVED     // order placed, visible on kitchen screen
  PREPARING    // kitchen has started
  READY        // ready for pickup/serving
  COMPLETED    // served/picked up
  CANCELLED    // cancelled by owner
}

enum OrderType {
  DINE_IN
  TAKEAWAY
}

model OrderItem {
  id              String       @id @default(cuid())
  orderId         String
  menuItemId      String
  quantity        Int
  unitPrice       Decimal      @db.Decimal(10, 2)  // price at time of order (not current menu price)
  totalPrice      Decimal      @db.Decimal(10, 2)  // quantity × unitPrice
  notes           String?      // item-level special instructions

  order           Order        @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItem        MenuItem     @relation(fields: [menuItemId], references: [id])

  @@index([orderId])
  @@map("order_items")
}

// ============================================================
// PAYMENTS MODULE (adapter — stores references only, never card/bank data)
// ============================================================

model Payment {
  id                  String         @id @default(cuid())
  restaurantId        String
  orderId             String         @unique
  method              PaymentMethod
  status              PaymentStatus  @default(PENDING)
  amount              Decimal        @db.Decimal(10, 2)

  // Payment aggregator references (Razorpay/Cashfree)
  providerName        String?        // "razorpay" or "cashfree"
  providerOrderId     String?        // Razorpay order_id or Cashfree order_id
  providerPaymentId   String?        // Razorpay payment_id or Cashfree cf_payment_id
  providerSignature   String?        // for webhook verification

  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt
  paidAt              DateTime?

  order               Order          @relation(fields: [orderId], references: [id])

  // NOTE: No card_number, cvv, bank_account, or any PCI-scoped field here — EVER.
  // NOTE: No "wallet_balance" or "escrow_amount" field — EVER. (RBI PA boundary)

  @@index([restaurantId])
  @@index([providerPaymentId])
  @@map("payments")
}

enum PaymentMethod {
  UPI
  CARD
  CASH       // "pay at counter"
  WALLET     // future: Paytm/PhonePe wallet (still via PA, not our own wallet)
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

// ============================================================
// COMPLIANCE MODULE (DPDP Act — see 10_COMPLIANCE.md)
// ============================================================

model ConsentRecord {
  id              String       @id @default(cuid())
  restaurantId    String?      // null for platform-level consent (e.g., owner signup)
  phone           String       // the data subject's phone number
  purpose         ConsentPurpose
  granted         Boolean      @default(true)
  consentVersion  String       @default("v1")  // version of the consent notice shown
  method          String       // e.g., "qr_ordering_flow_v1", "owner_signup_v1"
  ipAddress       String?      // for audit trail

  grantedAt       DateTime     @default(now())
  revokedAt       DateTime?    // null if still active

  restaurant      Restaurant?  @relation(fields: [restaurantId], references: [id])

  @@index([phone])
  @@index([restaurantId])
  @@map("consent_records")
}

enum ConsentPurpose {
  ORDER_UPDATES       // WhatsApp/SMS order confirmation
  MARKETING           // promotional messages (Phase 2+)
  LOYALTY             // repeat-customer tracking (Phase 2+)
  ACCOUNT_AUTH        // owner account authentication
}

// ============================================================
// PLATFORM MODULE (subscription, feature flags — minimal for Phase 1)
// ============================================================

model FeatureFlag {
  id              String       @id @default(cuid())
  key             String       @unique  // e.g., "ai_upsell_enabled", "loyalty_enabled"
  description     String?
  enabledGlobal   Boolean      @default(false)
  // Per-restaurant overrides handled via a join table in Phase 2+

  @@map("feature_flags")
}
```

---

## 3. RLS Policy Patterns (applied via raw SQL migrations)

These are applied alongside Prisma migrations as raw SQL in `prisma/migrations/`:

```sql
-- Example: Row-Level Security for the orders table
-- Applied after Prisma creates the table structure

-- Enable RLS on the table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see/modify rows where restaurant_id matches their session context
-- The app sets this context via: SET LOCAL app.current_restaurant_id = '<id>';
CREATE POLICY tenant_isolation_orders ON orders
  USING (restaurant_id = current_setting('app.current_restaurant_id', TRUE));

-- Repeat for all tenant-scoped tables:
-- menu_categories, menu_items, restaurant_tables, order_items, payments, consent_records, staff
```

**How the app sets the tenant context:** A NestJS middleware, executed on every request after authentication, runs `SET LOCAL app.current_restaurant_id = ?` on the database connection before the request handler executes. `SET LOCAL` scopes the setting to the current transaction, so there's no cross-request leakage.

---

## 4. Key Indexes and Performance Notes

- `orders(restaurantId, createdAt)` — critical for the daily order history and sales digest queries.
- `menu_items(restaurantId)` — menu browsing is the most frequent read operation.
- `orders(idempotencyKey)` — unique constraint ensures offline-retry safety.
- `consent_records(phone)` — for "delete my data" lookups across restaurants.

---

## 5. Phase 2+ Schema Additions (preview, not implemented yet)

These are documented here so Phase 1 schema decisions don't accidentally block them:

- `loyalty_stamps` table — linked to diner phone + restaurant_id, tracking stamp count toward rewards.
- `analytics_events` table (or external) — append-only event log for order.placed, order.completed, etc.
- `daily_digests` table — stores generated digest content per restaurant per day (avoids re-generating).
- `promotions` table — discounts, combos, time-limited offers.

None of these should be created in Phase 1. They're listed here so the Phase 1 schema doesn't use conflicting names or structures.
