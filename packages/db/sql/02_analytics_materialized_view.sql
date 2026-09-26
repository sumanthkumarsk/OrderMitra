-- Create a Materialized View for Daily Sales Facts (Star Schema simulation)
-- This allows the dashboard to query pre-aggregated data rapidly.

CREATE MATERIALIZED VIEW daily_sales_fact AS
SELECT 
    o.restaurant_id,
    DATE_TRUNC('day', o.created_at) AS sale_date,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(o.total_amount) AS total_revenue,
    SUM(o.gst_amount) AS total_tax,
    COUNT(DISTINCT o.table_id) AS unique_tables_served
FROM orders o
WHERE o.status = 'COMPLETED'
GROUP BY 
    o.restaurant_id, 
    DATE_TRUNC('day', o.created_at);

-- Create index on the materialized view for fast lookups
CREATE UNIQUE INDEX idx_daily_sales_fact 
ON daily_sales_fact(restaurant_id, sale_date);

-- Note: You should set up a pg_cron job or an application-level cron 
-- to refresh this view periodically:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_fact;
