import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { DigitalProduct, Order, Customer, SupportTicket, Agent } from '../types';

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

export interface AdminSession {
  id: string;
  userId: string;
  sessionToken: string;
  expiresAt: string;
  createdAt: string;
}

export class SQLiteEngine {
  private db: DatabaseSync;
  private dbPath: string;

  constructor(customPath?: string) {
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = customPath || path.join(dataDir, 'neonforge.db');
    this.db = new DatabaseSync(this.dbPath);
    this.initialize();
  }

  private initialize(): void {
    // Enable WAL mode for high concurrency and crash resilience
    this.db.exec(`PRAGMA journal_mode = WAL;`);
    this.db.exec(`PRAGMA foreign_keys = ON;`);
    this.db.exec(`PRAGMA busy_timeout = 5000;`);

    // Schema definition
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        sku TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        niche TEXT,
        price REAL NOT NULL,
        compare_at_price REAL,
        description TEXT,
        profit_margin REAL,
        sales_count INTEGER DEFAULT 0,
        total_revenue REAL DEFAULT 0,
        deliverable_type TEXT,
        is_published_to_etsy INTEGER DEFAULT 0,
        data_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number TEXT UNIQUE NOT NULL,
        customer_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_title TEXT NOT NULL,
        amount REAL NOT NULL,
        platform_fee REAL DEFAULT 0,
        net_profit REAL DEFAULT 0,
        channel TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL,
        license_key TEXT NOT NULL,
        download_token TEXT NOT NULL,
        download_count INTEGER DEFAULT 0,
        max_downloads INTEGER DEFAULT 5,
        etsy_payment_details_json TEXT,
        data_json TEXT,
        timestamp TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
      CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_orders_download_token ON orders(download_token);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        total_spend REAL DEFAULT 0,
        orders_count INTEGER DEFAULT 0,
        vip_tier TEXT DEFAULT 'Silver',
        last_order_date TEXT,
        location TEXT,
        data_json TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        product_title TEXT NOT NULL,
        issue_type TEXT NOT NULL,
        data_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        data_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        session_token TEXT UNIQUE NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);

      CREATE TABLE IF NOT EXISTS event_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        agent TEXT NOT NULL,
        text TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS processed_webhooks (
        event_id TEXT PRIMARY KEY,
        provider TEXT NOT NULL,
        order_number TEXT,
        processed_at TEXT NOT NULL
      );
    `);
  }

  public getDbPath(): string {
    return this.dbPath;
  }

  // --- Transactions Helper ---
  public transaction<T>(fn: () => T): T {
    this.db.exec('BEGIN IMMEDIATE TRANSACTION;');
    try {
      const result = fn();
      this.db.exec('COMMIT;');
      return result;
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }

  // --- Products ---
  public getProducts(): DigitalProduct[] {
    const rows = this.db.prepare('SELECT data_json FROM products ORDER BY created_at DESC').all() as Array<{ data_json: string }>;
    return rows.map(r => JSON.parse(r.data_json));
  }

  public getProductById(id: string): DigitalProduct | null {
    const row = this.db.prepare('SELECT data_json FROM products WHERE id = ?').get(id) as { data_json: string } | undefined;
    return row ? JSON.parse(row.data_json) : null;
  }

  public getProductBySku(sku: string): DigitalProduct | null {
    const row = this.db.prepare('SELECT data_json FROM products WHERE sku = ?').get(sku) as { data_json: string } | undefined;
    return row ? JSON.parse(row.data_json) : null;
  }

  public saveProduct(product: DigitalProduct): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO products (
        id, sku, title, subtitle, niche, price, compare_at_price,
        description, profit_margin, sales_count, total_revenue, deliverable_type,
        is_published_to_etsy, data_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      product.id,
      product.sku,
      product.title,
      product.subtitle || '',
      product.niche || 'Digital Asset',
      product.price,
      product.compareAtPrice || product.price,
      product.description || '',
      product.profitMargin || 98.0,
      product.salesCount || 0,
      product.totalRevenue || 0,
      product.deliverableType || 'notion_template',
      product.isPublishedToEtsy ? 1 : 0,
      JSON.stringify(product),
      product.createdAt || new Date().toISOString()
    );
  }

  // --- Orders ---
  public getOrders(): Order[] {
    const rows = this.db.prepare('SELECT data_json FROM orders ORDER BY timestamp DESC').all() as Array<{ data_json: string }>;
    return rows.map(r => JSON.parse(r.data_json));
  }

  public getOrderByNumber(orderNumber: string): Order | null {
    const row = this.db.prepare('SELECT data_json FROM orders WHERE order_number = ?').get(orderNumber) as { data_json: string } | undefined;
    return row ? JSON.parse(row.data_json) : null;
  }

  public getOrderByDownloadToken(token: string): Order | null {
    const row = this.db.prepare('SELECT data_json FROM orders WHERE download_token = ?').get(token) as { data_json: string } | undefined;
    return row ? JSON.parse(row.data_json) : null;
  }

  public saveOrder(order: Order): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO orders (
        id, order_number, customer_id, customer_name, customer_email,
        product_id, product_title, amount, platform_fee, net_profit,
        channel, payment_method, status, license_key, download_token,
        download_count, max_downloads, etsy_payment_details_json, data_json, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      order.id || `ord-${Date.now()}`,
      order.orderNumber || `#ORD-${Date.now()}`,
      order.customerId || `cust-${Date.now()}`,
      order.customerName || 'Customer',
      order.customerEmail || 'buyer@store.com',
      order.productId || 'prod-default',
      order.productTitle || 'Digital Asset',
      typeof order.amount === 'number' ? order.amount : 0,
      typeof order.platformFee === 'number' ? order.platformFee : 0,
      typeof order.netProfit === 'number' ? order.netProfit : 0,
      order.channel || 'Direct Storefront',
      order.paymentMethod || 'Credit Card / Stripe',
      order.status || 'Completed & Delivered',
      order.licenseKey || '',
      order.downloadToken || '',
      typeof order.downloadCount === 'number' ? order.downloadCount : 0,
      typeof order.maxDownloads === 'number' ? order.maxDownloads : 5,
      order.etsyPaymentDetails ? JSON.stringify(order.etsyPaymentDetails) : null,
      JSON.stringify(order),
      order.timestamp || new Date().toISOString()
    );
  }

  public clearOrdersAndCustomers(): void {
    this.db.exec('DELETE FROM orders;');
    this.db.exec('DELETE FROM customers;');
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    const rows = this.db.prepare('SELECT data_json FROM customers ORDER BY total_spend DESC').all() as Array<{ data_json: string }>;
    return rows.map(r => JSON.parse(r.data_json));
  }

  public saveCustomer(customer: Customer): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO customers (
        id, name, email, total_spend, orders_count, vip_tier,
        last_order_date, location, data_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      customer.id,
      customer.name,
      customer.email,
      customer.totalSpend,
      customer.ordersCount,
      customer.vipTier,
      customer.lastOrderDate,
      customer.location || '',
      JSON.stringify(customer)
    );
  }

  // --- Tickets ---
  public getTickets(): SupportTicket[] {
    const rows = this.db.prepare('SELECT data_json FROM tickets').all() as Array<{ data_json: string }>;
    return rows.map(r => JSON.parse(r.data_json));
  }

  public saveTicket(ticket: SupportTicket): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO tickets (
        id, customer_name, customer_email, product_title, issue_type, data_json
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      ticket.id,
      ticket.customerName,
      ticket.customerEmail,
      ticket.productTitle,
      ticket.issueType,
      JSON.stringify(ticket)
    );
  }

  // --- Agents ---
  public getAgents(): Agent[] {
    const rows = this.db.prepare('SELECT data_json FROM agents').all() as Array<{ data_json: string }>;
    return rows.map(r => JSON.parse(r.data_json));
  }

  public saveAgent(agent: Agent): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO agents (
        id, name, role, data_json
      ) VALUES (?, ?, ?, ?)
    `);

    stmt.run(
      agent.id,
      agent.name,
      agent.role,
      JSON.stringify(agent)
    );
  }

  // --- Admin Users & Sessions ---
  public getAdminUser(username: string): AdminUser | null {
    const row = this.db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as {
      id: string;
      username: string;
      password_hash: string;
      salt: string;
      role: string;
      created_at: string;
    } | undefined;

    if (!row) return null;
    return {
      id: row.id,
      username: row.username,
      passwordHash: row.password_hash,
      salt: row.salt,
      role: row.role as any,
      createdAt: row.created_at
    };
  }

  public saveAdminUser(user: AdminUser): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO admin_users (id, username, password_hash, salt, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(user.id, user.username, user.passwordHash, user.salt, user.role, user.createdAt);
  }

  public saveAdminSession(session: AdminSession): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO admin_sessions (id, user_id, session_token, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(session.id, session.userId, session.sessionToken, session.expiresAt, session.createdAt);
  }

  public getAdminSession(token: string): { session: AdminSession; user: AdminUser } | null {
    const row = this.db.prepare(`
      SELECT 
        s.id AS s_id, s.user_id, s.session_token, s.expires_at, s.created_at AS s_created_at,
        u.id AS u_id, u.username, u.password_hash, u.salt, u.role, u.created_at AS u_created_at
      FROM admin_sessions s
      JOIN admin_users u ON s.user_id = u.id
      WHERE s.session_token = ?
    `).get(token) as any;

    if (!row) return null;

    // Check expiration
    if (new Date(row.expires_at).getTime() < Date.now()) {
      this.deleteAdminSession(token);
      return null;
    }

    return {
      session: {
        id: row.s_id,
        userId: row.user_id,
        sessionToken: row.session_token,
        expiresAt: row.expires_at,
        createdAt: row.s_created_at
      },
      user: {
        id: row.u_id,
        username: row.username,
        passwordHash: row.password_hash,
        salt: row.salt,
        role: row.role,
        createdAt: row.u_created_at
      }
    };
  }

  public deleteAdminSession(token: string): void {
    this.db.prepare('DELETE FROM admin_sessions WHERE session_token = ?').run(token);
  }

  public pruneExpiredSessions(): void {
    const nowIso = new Date().toISOString();
    this.db.prepare('DELETE FROM admin_sessions WHERE expires_at < ?').run(nowIso);
  }

  // --- Webhook Idempotency ---
  public isWebhookProcessed(eventId: string): boolean {
    const row = this.db.prepare('SELECT event_id FROM processed_webhooks WHERE event_id = ?').get(eventId);
    return Boolean(row);
  }

  public recordWebhookProcessed(eventId: string, provider: string, orderNumber?: string): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO processed_webhooks (event_id, provider, order_number, processed_at)
      VALUES (?, ?, ?, ?)
    `).run(eventId, provider, orderNumber || null, new Date().toISOString());
  }

  // --- System Configuration & Metrics ---
  public getConfig<T>(key: string): T | null {
    const row = this.db.prepare('SELECT value_json FROM system_config WHERE key = ?').get(key) as { value_json: string } | undefined;
    return row ? JSON.parse(row.value_json) : null;
  }

  public saveConfig(key: string, value: any): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO system_config (key, value_json, updated_at)
      VALUES (?, ?, ?)
    `).run(key, JSON.stringify(value), new Date().toISOString());
  }

  public getEventLogs(limit = 50): Array<{ id: string; timestamp: string; agent: string; text: string; type: string }> {
    const rows = this.db.prepare('SELECT id, timestamp, agent, text, type FROM event_logs ORDER BY created_at DESC LIMIT ?').all(limit) as any[];
    return rows;
  }

  public saveEventLog(log: { id: string; timestamp: string; agent: string; text: string; type: string }): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO event_logs (id, timestamp, agent, text, type, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(log.id, log.timestamp, log.agent, log.text, log.type, new Date().toISOString());
  }

  // Stats for telemetry
  public getStats() {
    const productCount = (this.db.prepare('SELECT count(*) as cnt FROM products').get() as any).cnt;
    const orderCount = (this.db.prepare('SELECT count(*) as cnt FROM orders').get() as any).cnt;
    const customerCount = (this.db.prepare('SELECT count(*) as cnt FROM customers').get() as any).cnt;
    const ticketCount = (this.db.prepare('SELECT count(*) as cnt FROM tickets').get() as any).cnt;
    return {
      productCount,
      orderCount,
      customerCount,
      ticketCount,
      dbPath: this.dbPath,
      journalMode: 'WAL'
    };
  }

  public close(): void {
    this.db.close();
  }
}
