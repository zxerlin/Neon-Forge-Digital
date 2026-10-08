-- NeonForge OS Production Database Schema
-- Compatible with PostgreSQL 14+, Neon, Supabase, Cloud SQL

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    sku VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    slug VARCHAR(255) NOT NULL,
    niche VARCHAR(64) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    profit_margin INTEGER DEFAULT 98,
    sales_count INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0.00,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    reviews_count INTEGER DEFAULT 0,
    deliverable_type VARCHAR(64) NOT NULL,
    license_type VARCHAR(64) NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    mockup_theme JSONB,
    etsy_optimization JSONB,
    marketing_assets JSONB,
    compliance JSONB,
    is_published_to_etsy BOOLEAN DEFAULT FALSE,
    is_published_to_store BOOLEAN DEFAULT TRUE,
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    total_spend DECIMAL(12, 2) DEFAULT 0.00,
    orders_count INTEGER DEFAULT 0,
    vip_tier VARCHAR(64) DEFAULT 'Bronze',
    location VARCHAR(128),
    last_order_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE RESTRICT,
    product_title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    net_profit DECIMAL(10, 2) NOT NULL,
    channel VARCHAR(64) NOT NULL, -- 'Direct Storefront', 'Etsy Sync', 'Gumroad Mirror'
    payment_method VARCHAR(64) NOT NULL, -- 'Credit Card / Stripe', 'Apple Pay', 'Etsy Payments', 'Square Pay'
    status VARCHAR(64) DEFAULT 'Completed & Delivered',
    license_key VARCHAR(128) NOT NULL,
    download_token VARCHAR(128) NOT NULL,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 5,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    etsy_payment_details JSONB -- Two-phase Etsy ledger breakdown
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    issue_type VARCHAR(64) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    customer_message TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'Open',
    ai_draft_reply TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_ledger_audit (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id),
    receipt_id VARCHAR(64),
    payment_id VARCHAR(64),
    channel VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL, -- 'order.paid', 'payment.settled'
    gross_amount DECIMAL(10, 2) NOT NULL,
    transaction_fee DECIMAL(10, 2) NOT NULL,
    processing_fee DECIMAL(10, 2) NOT NULL,
    listing_fee DECIMAL(10, 2) NOT NULL,
    regulatory_fee DECIMAL(10, 2) DEFAULT 0.00,
    tax_withheld DECIMAL(10, 2) DEFAULT 0.00,
    net_deposit DECIMAL(10, 2) NOT NULL,
    status VARCHAR(32) NOT NULL, -- 'pending_settlement', 'settled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_channel ON orders(channel);
CREATE INDEX IF NOT EXISTS idx_ledger_receipt_id ON financial_ledger_audit(receipt_id);
