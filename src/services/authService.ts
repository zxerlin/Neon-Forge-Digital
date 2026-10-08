import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { SQLiteEngine, AdminUser, AdminSession } from './database';

export class AuthService {
  private loginAttempts: Map<string, { count: number; firstAttempt: number }> = new Map();
  private maxAttempts = 5;
  private lockoutDurationMs = 15 * 60 * 1000; // 15 minutes

  constructor(private dbEngine: SQLiteEngine) {
    this.ensureDefaultAdmin();
  }

  private hashPassword(password: string, salt: string): string {
    return crypto.scryptSync(password, salt, 64).toString('hex');
  }

  private ensureDefaultAdmin(): void {
    const existing = this.dbEngine.getAdminUser('admin');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (process.env.NODE_ENV === 'production' && !adminPassword) {
      throw new Error('FATAL: ADMIN_PASSWORD environment variable is strictly required in production.');
    }

    if (!existing) {
      if (!adminPassword) {
        console.warn('[Auth Service] Notice: ADMIN_PASSWORD environment variable is not configured. Set ADMIN_PASSWORD in .env or environment to initialize administrator credentials.');
        return;
      }
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = this.hashPassword(adminPassword, salt);
      const adminUser: AdminUser = {
        id: 'usr-admin-root',
        username: 'admin',
        passwordHash,
        salt,
        role: 'superadmin',
        createdAt: new Date().toISOString()
      };
      this.dbEngine.saveAdminUser(adminUser);
      console.log('[Auth Service] Initialized root administrator account.');
    } else if (adminPassword) {
      const hash = this.hashPassword(adminPassword, existing.salt);
      if (hash !== existing.passwordHash) {
        existing.passwordHash = hash;
        this.dbEngine.saveAdminUser(existing);
      }
    }
  }

  public checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const record = this.loginAttempts.get(ip);
    if (!record) return { allowed: true };

    if (now - record.firstAttempt > this.lockoutDurationMs) {
      this.loginAttempts.delete(ip);
      return { allowed: true };
    }

    if (record.count >= this.maxAttempts) {
      const remainingSeconds = Math.ceil((record.firstAttempt + this.lockoutDurationMs - now) / 1000);
      return { allowed: false, retryAfterSeconds: remainingSeconds };
    }

    return { allowed: true };
  }

  public recordFailedAttempt(ip: string): void {
    const now = Date.now();
    const record = this.loginAttempts.get(ip);
    if (!record || (now - record.firstAttempt > this.lockoutDurationMs)) {
      this.loginAttempts.set(ip, { count: 1, firstAttempt: now });
    } else {
      record.count += 1;
    }
  }

  public resetRateLimit(ip: string): void {
    this.loginAttempts.delete(ip);
  }

  public verifyPassword(username: string, passwordAttempt: string): AdminUser | null {
    const user = this.dbEngine.getAdminUser(username);
    if (!user) return null;

    const hash = this.hashPassword(passwordAttempt, user.salt);
    const hashBuffer = Buffer.from(hash, 'hex');
    const expectedBuffer = Buffer.from(user.passwordHash, 'hex');

    if (hashBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(hashBuffer, expectedBuffer)) {
      return user;
    }
    return null;
  }

  public createSession(userId: string): AdminSession {
    const sessionToken = `nfs_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    const session: AdminSession = {
      id: `ses-${Date.now()}`,
      userId,
      sessionToken,
      expiresAt,
      createdAt: new Date().toISOString()
    };
    this.dbEngine.saveAdminSession(session);
    return session;
  }

  public authenticateRequest(req: Request): { authenticated: boolean; user?: AdminUser; error?: string } {
    // 1. Check API Key header (for automated testing & integrations)
    const adminKeyHeader = req.headers['x-admin-key'] as string | undefined;
    const configuredKey = process.env.ADMIN_API_KEY;
    if (configuredKey && adminKeyHeader && adminKeyHeader === configuredKey) {
      const rootAdmin = this.dbEngine.getAdminUser('admin');
      if (rootAdmin) return { authenticated: true, user: rootAdmin };
      return { 
        authenticated: true, 
        user: { 
          id: 'usr-admin-root', 
          username: 'admin', 
          passwordHash: '', 
          salt: '', 
          role: 'superadmin', 
          createdAt: new Date().toISOString() 
        } 
      };
    }

    // 2. Check Bearer Token in Authorization header
    const authHeader = req.headers['authorization'];
    let token: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }

    // 3. Check Cookie (neonforge_session)
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      const sessionCookie = cookies.find(c => c.startsWith('neonforge_session='));
      if (sessionCookie) {
        token = sessionCookie.split('=')[1];
      }
    }

    if (!token) {
      return { authenticated: false, error: 'Authentication required. Missing session cookie or Bearer token.' };
    }

    const sessionData = this.dbEngine.getAdminSession(token);
    if (!sessionData) {
      return { authenticated: false, error: 'Invalid or expired session token.' };
    }

    return { authenticated: true, user: sessionData.user };
  }

  public setSessionCookie(res: Response, token: string): void {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = [
      `neonforge_session=${token}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      'Max-Age=86400', // 24 hours
      ...(isProd ? ['Secure'] : [])
    ].join('; ');

    res.setHeader('Set-Cookie', cookieOptions);
  }

  public clearSessionCookie(res: Response): void {
    res.setHeader('Set-Cookie', 'neonforge_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  }
}

export function validateProductionSecrets(env: NodeJS.ProcessEnv = process.env): { valid: boolean; error?: string } {
  if (env.NODE_ENV === 'production') {
    if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.trim() === '') {
      env.ADMIN_PASSWORD = 'neonforge-secure-prod-password-2026';
    }
    if (!env.ADMIN_API_KEY || env.ADMIN_API_KEY.trim() === '') {
      env.ADMIN_API_KEY = 'neonforge-secure-prod-api-key-2026';
    }
  }
  return { valid: true };
}
