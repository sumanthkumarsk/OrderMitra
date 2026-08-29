# API Contracts — OrderMitra (Phase 1 MVP)

**Decision:** Generate OpenAPI spec from NestJS decorators (via `@nestjs/swagger`) rather than hand-maintaining a separate spec file. This document defines the **key endpoint shapes** for the critical flows so frontend and backend agents can work in parallel without conflicting on data shapes.

**Base URL pattern:** `https://api.ordermitra.in/v1` (production), versioned from day one.

---

## 1. Authentication

All owner/staff endpoints require authentication via JWT bearer token. Diner-facing endpoints (menu browsing, order placement) are unauthenticated but restaurant-scoped via the URL path.

### POST `/v1/auth/send-otp`
Send OTP to owner's phone for login/signup.

```json
// Request
{ "phone": "+919876543210" }

// Response 200
{ "message": "OTP sent", "expiresInSeconds": 300 }
```

### POST `/v1/auth/verify-otp`
Verify OTP and return JWT.

```json
// Request
{ "phone": "+919876543210", "otp": "123456" }

// Response 200
{
  "token": "eyJhbGciOi...",
  "refreshToken": "...",
  "restaurant": {
    "id": "clxyz...",
    "name": "Sharma's Kitchen",
    "slug": "sharmas-kitchen",
    "onboardingStep": 0
  },
  "isNewUser": true
}
```

---

## 2. Menu (Diner-Facing — Unauthenticated)

### GET `/v1/restaurants/:slug/menu`
Full menu for a restaurant, used by the diner PWA after QR scan.

```json
// Response 200
{
  "restaurant": {
    "name": "Sharma's Kitchen",
    "logoUrl": "https://...",
    "isAcceptingOrders": true
  },
  "categories": [
    {
      "id": "cat_1",
      "name": "Starters",
      "items": [
        {
          "id": "item_1",
          "name": "Paneer Tikka",
          "description": "Marinated cottage cheese, grilled in tandoor",
          "price": 249.00,
          "imageUrl": "https://...",
          "isVeg": true,
          "isAvailable": true,
          "tags": ["bestseller", "spicy"],
          "aiSuggestions": ["item_5", "item_12"]  // "goes well with" item IDs
        }
      ]
    }
  ]
}
```

**Caching:** This response is cached at the CDN level (CloudFront) with a short TTL (30 seconds) and cache-busted on menu update via cache invalidation. This ensures "menu edits reflect in under 10 seconds" (PRD requirement).

---

## 3. Menu Management (Owner-Facing — Authenticated)

### POST `/v1/admin/menu/categories`
Create a menu category.

```json
// Request (Auth: Bearer token)
{ "name": "Starters", "displayOrder": 1 }

// Response 201
{ "id": "cat_1", "name": "Starters", "displayOrder": 1 }
```

### POST `/v1/admin/menu/items`
Create a menu item.

```json
// Request (Auth: Bearer token, multipart for image upload)
{
  "categoryId": "cat_1",
  "name": "Paneer Tikka",
  "price": 249.00,
  "isVeg": true,
  "imageFile": <binary>  // optional, uploaded to S3
}

// Response 201
{
  "id": "item_1",
  "name": "Paneer Tikka",
  "price": 249.00,
  "imageUrl": "https://cdn.ordermitra.in/...",
  "aiDescription": "Soft paneer cubes marinated in spices, char-grilled to perfection"  // auto-generated
}
```

### PATCH `/v1/admin/menu/items/:itemId`
Update a menu item (partial update).

```json
// Request
{ "price": 269.00, "isAvailable": false }

// Response 200
{ "id": "item_1", "price": 269.00, "isAvailable": false, "updatedAt": "..." }
```

### PATCH `/v1/admin/menu/items/:itemId/availability`
Quick toggle for "out of stock" — separate endpoint for speed (owner's most common menu action).

```json
// Request
{ "isAvailable": false }

// Response 200
{ "id": "item_1", "isAvailable": false }
```

---

## 4. Ordering (Diner-Facing — Unauthenticated, restaurant-scoped)

### POST `/v1/restaurants/:slug/orders`
Place an order.

```json
// Request
{
  "tableNumber": "5",
  "items": [
    { "menuItemId": "item_1", "quantity": 2, "notes": "less spicy" },
    { "menuItemId": "item_5", "quantity": 1 }
  ],
  "orderType": "DINE_IN",
  "dinerPhone": "+919876543210",  // optional, for receipt
  "notes": "No onion please",
  "idempotencyKey": "client-uuid-abc123",  // client-generated, for offline-retry safety
  "clientTimestamp": "2026-08-29T13:05:00+05:30"  // when order was placed on client
}

// Response 201
{
  "orderId": "ord_xyz",
  "orderNumber": 42,
  "status": "RECEIVED",
  "subtotal": 747.00,
  "gstAmount": 37.35,
  "totalAmount": 784.35,
  "items": [
    { "name": "Paneer Tikka", "quantity": 2, "unitPrice": 249.00, "totalPrice": 498.00 },
    { "name": "Butter Naan", "quantity": 1, "unitPrice": 249.00, "totalPrice": 249.00 }
  ],
  "paymentOptions": {
    "online": {
      "razorpayOrderId": "order_RPay123...",
      "razorpayKey": "rzp_live_..."
    },
    "payAtCounter": true
  }
}

// Response 409 (idempotency key already used — order already exists)
{
  "error": "ORDER_ALREADY_EXISTS",
  "existingOrderId": "ord_xyz"
}

// Response 422 (item unavailable — went out of stock while diner was offline)
{
  "error": "ITEMS_UNAVAILABLE",
  "unavailableItems": [
    { "menuItemId": "item_1", "name": "Paneer Tikka", "reason": "out_of_stock" }
  ]
}
```

### GET `/v1/restaurants/:slug/orders/:orderId/status`
Poll order status (simple polling for MVP, every 5 seconds from client).

```json
// Response 200
{
  "orderId": "ord_xyz",
  "orderNumber": 42,
  "status": "PREPARING",
  "updatedAt": "2026-08-29T13:07:30+05:30"
}
```

---

## 5. Kitchen View (Owner-Facing — Authenticated)

### GET `/v1/admin/orders?status=RECEIVED,PREPARING&date=today`
Get active orders for kitchen display.

```json
// Response 200
{
  "orders": [
    {
      "orderId": "ord_xyz",
      "orderNumber": 42,
      "tableNumber": "5",
      "status": "RECEIVED",
      "items": [
        { "name": "Paneer Tikka", "quantity": 2, "notes": "less spicy" },
        { "name": "Butter Naan", "quantity": 1 }
      ],
      "notes": "No onion please",
      "createdAt": "2026-08-29T13:05:00+05:30",
      "minutesAgo": 3
    }
  ],
  "totalToday": 41,
  "revenueToday": 28450.00
}
```

### PATCH `/v1/admin/orders/:orderId/status`
Update order status (kitchen marks as preparing/ready/completed).

```json
// Request
{ "status": "READY" }

// Response 200
{ "orderId": "ord_xyz", "status": "READY", "updatedAt": "..." }
```

---

## 6. Payment Webhook (Server-to-Server — Razorpay/Cashfree → OrderMitra)

### POST `/v1/webhooks/razorpay`
Razorpay sends payment status updates. Verified via signature.

```json
// Razorpay webhook payload (example)
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_RPay456...",
        "order_id": "order_RPay123...",
        "amount": 78435,  // in paise
        "status": "captured"
      }
    }
  }
}

// Response 200 (acknowledge receipt)
{ "status": "ok" }
```

---

## 7. AI Features (Owner-Facing — Authenticated)

### POST `/v1/admin/ai/generate-description`
Generate an AI description for a menu item.

```json
// Request
{
  "itemName": "Paneer Tikka",
  "imageUrl": "https://...",  // optional — if owner uploaded a photo
  "isVeg": true
}

// Response 200
{
  "description": "Soft paneer cubes marinated in spices, char-grilled to perfection",
  "confidence": "high"
}
```

### GET `/v1/admin/ai/daily-digest`
Get today's AI-generated sales digest.

```json
// Response 200
{
  "date": "2026-08-29",
  "summary": "42 orders today, ₹28,450 total. Paneer Tikka was your top seller (18 orders). Butter Naan sold out by 8pm — consider prepping more tomorrow.",
  "topSellers": [
    { "name": "Paneer Tikka", "count": 18, "revenue": 4482.00 },
    { "name": "Butter Naan", "count": 15, "revenue": 3735.00 }
  ],
  "insight": "Paneer Tikka + Butter Naan are ordered together 67% of the time — consider a combo offer."
}
```

---

## 8. QR Code Generation (Owner-Facing — Authenticated)

### POST `/v1/admin/tables`
Create tables and auto-generate QR codes.

```json
// Request
{ "tableNumbers": ["1", "2", "3", "4", "5"] }

// Response 201
{
  "tables": [
    {
      "id": "tbl_1",
      "tableNumber": "1",
      "qrCodeUrl": "https://cdn.ordermitra.in/qr/sharmas-kitchen-table-1.png",
      "menuUrl": "https://ordermitra.in/m/sharmas-kitchen?table=1"
    }
  ],
  "printablePdfUrl": "https://cdn.ordermitra.in/qr/sharmas-kitchen-all-tables.pdf"
}
```

---

## 9. Data Deletion (DPDP Compliance)

### POST `/v1/privacy/delete-request`
Diner requests data deletion.

```json
// Request
{ "phone": "+919876543210" }

// Response 200
{ "message": "OTP sent to verify your identity before deletion" }
```

### POST `/v1/privacy/confirm-deletion`
Confirm deletion after OTP verification.

```json
// Request
{ "phone": "+919876543210", "otp": "123456" }

// Response 200
{
  "message": "Your data will be deleted within 72 hours",
  "dataAffected": ["order history", "phone number", "consent records"],
  "retainedAnonymized": ["anonymized transaction records (required for tax compliance)"]
}
```

---

## 10. Error Response Format (consistent across all endpoints)

```json
{
  "error": "ERROR_CODE",          // machine-readable, SCREAMING_SNAKE_CASE
  "message": "Human-readable description of what went wrong",
  "details": {}                    // optional, additional context
}
```

Common error codes:
- `UNAUTHORIZED` — missing or invalid JWT
- `FORBIDDEN` — valid JWT but no permission for this restaurant/action
- `NOT_FOUND` — resource doesn't exist
- `VALIDATION_ERROR` — request body failed schema validation (details contains field-level errors)
- `ORDER_ALREADY_EXISTS` — idempotency key collision
- `ITEMS_UNAVAILABLE` — one or more items went out of stock
- `PAYMENT_FAILED` — payment aggregator reported failure
- `RATE_LIMITED` — too many requests

---

## 11. Versioning and OpenAPI Generation

- API version is in the URL path (`/v1/`). Breaking changes get a new version (`/v2/`).
- **OpenAPI spec is auto-generated** from NestJS controller decorators via `@nestjs/swagger`. This document is the design reference; the generated spec is the source of truth for exact field types, validation rules, and response codes.
- The generated spec is served at `/v1/docs` (Swagger UI) in dev/staging environments only — not exposed in production.
