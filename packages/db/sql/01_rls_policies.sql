-- Enable Row Level Security on all tenant-scoped tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- 1. Restaurant Table Policy
-- A user can only see the restaurant if their session context matches
CREATE POLICY tenant_isolation_restaurants ON restaurants
  USING (id = current_setting('app.current_restaurant_id', TRUE));

-- 2. Staff Table Policy
CREATE POLICY tenant_isolation_staff ON staff
  USING (restaurant_id = current_setting('app.current_restaurant_id', TRUE));

-- 3. Menu Categories
CREATE POLICY tenant_isolation_menu_categories ON menu_categories
  USING (restaurant_id = current_setting('app.current_restaurant_id', TRUE));

-- 4. Menu Items
CREATE POLICY tenant_isolation_menu_items ON menu_items
  USING (restaurant_id = current_setting('app.current_restaurant_id', TRUE));

-- 5. Restaurant Tables
CREATE POLICY tenant_isolation_restaurant_tables ON restaurant_tables
  USING (restaurant_id = current_setting('app.current_restaurant_id', TRUE));

-- 6. Orders
CREATE POLICY tenant_isolation_orders ON orders
  USING (restaurant_id = current_setting('app.current_restaurant_id', TRUE));

-- 7. Order Items
-- Order items don't have restaurant_id directly, they join through orders
CREATE POLICY tenant_isolation_order_items ON order_items
  USING (order_id IN (
    SELECT id FROM orders WHERE restaurant_id = current_setting('app.current_restaurant_id', TRUE)
  ));

-- 8. Payments
CREATE POLICY tenant_isolation_payments ON payments
  USING (restaurant_id = current_setting('app.current_restaurant_id', TRUE));

-- 9. Consent Records
CREATE POLICY tenant_isolation_consent_records ON consent_records
  USING (restaurant_id = current_setting('app.current_restaurant_id', TRUE));
