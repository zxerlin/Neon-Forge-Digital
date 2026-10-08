import crypto from 'crypto';

export interface EtsyOAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes: string[];
}

export interface EtsyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface EtsyReceiptPayment {
  payment_id: number;
  buyer_user_id: number;
  shop_id: number;
  receipt_id: number;
  amount_gross: { amount: number; divisor: number; currency_code: string };
  amount_fees: { amount: number; divisor: number; currency_code: string };
  amount_net: { amount: number; divisor: number; currency_code: string };
  posted_gross?: { amount: number; divisor: number; currency_code: string };
  posted_fees?: { amount: number; divisor: number; currency_code: string };
  posted_net?: { amount: number; divisor: number; currency_code: string };
  status: string;
  create_timestamp: number;
  update_timestamp: number;
}

export interface EtsyReceiptTransaction {
  transaction_id: number;
  title: string;
  description: string;
  seller_user_id: number;
  buyer_user_id: number;
  create_timestamp: number;
  paid_timestamp: number;
  quantity: number;
  listing_id: number;
  sku?: string;
  price: { amount: number; divisor: number; currency_code: string };
  shipping_cost: { amount: number; divisor: number; currency_code: string };
}

export interface EtsyReceipt {
  receipt_id: number;
  receipt_type: number;
  seller_user_id: number;
  seller_email: string;
  buyer_user_id: number;
  buyer_email: string;
  name: string;
  first_line: string;
  second_line: string;
  city: string;
  state: string;
  zip: string;
  status: string;
  formatted_address: string;
  country_iso: string;
  payment_method: string;
  payment_email: string;
  message_from_seller: string;
  message_from_buyer: string;
  is_paid: boolean;
  is_shipped: boolean;
  create_timestamp: number;
  update_timestamp: number;
  is_delivered: boolean;
  discount_amt: { amount: number; divisor: number; currency_code: string };
  subtotal: { amount: number; divisor: number; currency_code: string };
  grandtotal: { amount: number; divisor: number; currency_code: string };
  transactions?: EtsyReceiptTransaction[];
}

export interface EtsyShopConfigState {
  isConnected: boolean;
  shopName: string;
  shopId: string;
  apiKeyMasked: string;
  apiSecretSet: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
  syncFrequencyMinutes: number;
  lastSyncAt: string;
  activeListingsCount: number;
  currency: string;
  autoSyncNewProducts: boolean;
}

// AES-256-GCM Token Encryption at Rest
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || process.env.ADMIN_PASSWORD || process.env.ADMIN_API_KEY || 'neonforge-etsy-token-secret-vault-2026';
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptTokenAtRest(plainText?: string): string | undefined {
  if (!plainText) return plainText;
  if (plainText.startsWith('enc:v1:')) return plainText; // already encrypted
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptTokenAtRest(cipherText?: string): string | undefined {
  if (!cipherText || !cipherText.startsWith('enc:v1:')) return cipherText;
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 5) return cipherText;
    const iv = Buffer.from(parts[2], 'hex');
    const tag = Buffer.from(parts[3], 'hex');
    const encrypted = Buffer.from(parts[4], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return cipherText;
  }
}

export class EtsyService {
  private codeVerifiers: Map<string, { codeVerifier: string; createdAt: number }> = new Map();

  constructor() {}

  // Base64URL encoding helper
  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Constructs the official Etsy x-api-key header:
   * Format: <keystring>:<shared_secret> when shared secret is available, or <keystring>.
   */
  public getFormattedApiKey(): string {
    const keystring = process.env.ETSY_API_KEY || process.env.ETSY_KEYSTRING || '';
    const secret = process.env.ETSY_SHARED_SECRET || '';
    if (keystring && secret && !keystring.includes(':')) {
      return `${keystring}:${secret}`;
    }
    return keystring;
  }

  /**
   * Generates PKCE code_verifier, code_challenge and state for Etsy OAuth v3
   */
  public generateOAuthFlow(redirectUri: string): { authUrl: string; state: string; codeChallenge: string } {
    const clientId = process.env.ETSY_API_KEY || process.env.ETSY_KEYSTRING || 'etsy_v3_client_app_key';
    const state = crypto.randomBytes(16).toString('hex');
    const codeVerifier = this.base64UrlEncode(crypto.randomBytes(32));
    
    // Store verifier with 10 min TTL
    this.codeVerifiers.set(state, { codeVerifier, createdAt: Date.now() });

    // S256 Challenge
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    const codeChallenge = this.base64UrlEncode(hash);

    const scopes = [
      'listings_r',
      'listings_w',
      'listings_d',
      'shops_r',
      'shops_w',
      'transactions_r',
      'billing_r'
    ].join('%20');

    const authUrl = `https://www.etsy.com/oauth/connect?response_type=code` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scopes}` +
      `&state=${state}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    return { authUrl, state, codeChallenge };
  }

  /**
   * Exchanges authorization code for OAuth access token
   */
  public async exchangeCodeForToken(code: string, state: string, redirectUri: string): Promise<EtsyTokenResponse> {
    const record = this.codeVerifiers.get(state);
    if (!record) {
      throw new Error('Invalid or expired OAuth state parameter. Possible CSRF attack detected.');
    }

    const { codeVerifier } = record;
    this.codeVerifiers.delete(state); // One-time use

    const clientId = process.env.ETSY_API_KEY || process.env.ETSY_KEYSTRING;
    if (!clientId) {
      throw new Error('Etsy API credentials (ETSY_API_KEY) are not configured on server.');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier
    });

    const response = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Etsy OAuth Token Exchange Failed: HTTP ${response.status} - ${errText}`);
    }

    const data = await response.json() as EtsyTokenResponse;
    return data;
  }

  /**
   * Refreshes an expired Etsy OAuth access token using the stored refresh token
   */
  public async refreshAccessToken(refreshToken: string): Promise<EtsyTokenResponse> {
    const rawRefreshToken = decryptTokenAtRest(refreshToken) || refreshToken;
    const clientId = process.env.ETSY_API_KEY || process.env.ETSY_KEYSTRING;
    if (!clientId) {
      throw new Error('Etsy API credentials (ETSY_API_KEY) are not configured on server.');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: rawRefreshToken
    });

    const response = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Etsy OAuth Token Refresh Failed: HTTP ${response.status} - ${errText}`);
    }

    const data = await response.json() as EtsyTokenResponse;
    return data;
  }

  /**
   * Retrieves a valid access token, auto-refreshing if within 5 minutes of expiration
   */
  public async getValidAccessToken(
    config: EtsyShopConfigState,
    onTokenRefreshed?: (newTokens: EtsyTokenResponse) => void
  ): Promise<string | null> {
    const decryptedAccessToken = decryptTokenAtRest(config.accessToken);
    const decryptedRefreshToken = decryptTokenAtRest(config.refreshToken);

    if (decryptedAccessToken && config.tokenExpiresAt && Date.now() < config.tokenExpiresAt - 300000) {
      return decryptedAccessToken;
    }

    if (decryptedRefreshToken) {
      try {
        const refreshed = await this.refreshAccessToken(decryptedRefreshToken);
        config.accessToken = encryptTokenAtRest(refreshed.access_token);
        config.refreshToken = encryptTokenAtRest(refreshed.refresh_token);
        config.tokenExpiresAt = Date.now() + (refreshed.expires_in * 1000);
        if (onTokenRefreshed) {
          onTokenRefreshed(refreshed);
        }
        return refreshed.access_token;
      } catch (err) {
        console.error('[Etsy Service] Automatic token refresh failed:', err);
      }
    }

    const fallback = decryptedAccessToken || process.env.ETSY_ACCESS_TOKEN || null;
    return fallback;
  }

  /**
   * Complete Digital Listing Publishing Pipeline:
   * 1. Create Draft Listing (type: "download", state: "draft")
   * 2. Upload Digital File (POST /listings/{id}/files)
   *    -> CRITICAL: If file upload fails, STOP and keep draft; do NOT activate!
   * 3. Activate Listing (PATCH /listings/{id}, state: "active") ONLY IF upload succeeded
   */
  public async publishDigitalListingToEtsy(
    shopId: string,
    listingData: {
      title: string;
      description: string;
      price: number;
      tags: string[];
      taxonomyId?: number;
      whoMade?: string;
      whenMade?: string;
      fileBuffer?: Buffer;
      fileName?: string;
    },
    accessToken?: string
  ): Promise<{ success: boolean; listingId?: string; listingUrl?: string; fileId?: string; error?: string }> {
    const token = accessToken || process.env.ETSY_ACCESS_TOKEN;
    const apiKeyHeader = this.getFormattedApiKey();

    if (!token || !apiKeyHeader) {
      return {
        success: false,
        error: 'Etsy API credentials unconfigured: Requires ETSY_API_KEY and active OAuth ETSY_ACCESS_TOKEN.'
      };
    }

    const safeTitle = listingData.title.slice(0, 140);
    const safeTags = listingData.tags.slice(0, 13).map(t => t.slice(0, 20).toLowerCase());

    try {
      // Step 1: Create Draft Digital Listing
      const createResponse = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKeyHeader,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: 999,
          title: safeTitle,
          description: listingData.description,
          price: listingData.price,
          who_made: listingData.whoMade || 'i_did',
          when_made: listingData.whenMade || '2020_2026',
          taxonomy_id: listingData.taxonomyId || 1115,
          type: 'download',
          state: 'draft',
          tags: safeTags
        })
      });

      if (!createResponse.ok) {
        const errorBody = await createResponse.text();
        return {
          success: false,
          error: `Etsy Draft Listing Creation Failed: HTTP ${createResponse.status} - ${errorBody}`
        };
      }

      const created = await createResponse.json() as { listing_id: number };
      const listingId = created.listing_id;
      let fileId: string | undefined;

      // Step 2: Upload Digital File Attachment if deliverable is provided
      if (listingData.fileBuffer && listingData.fileName) {
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(listingData.fileBuffer)], { type: 'application/octet-stream' });
        formData.append('file', blob, listingData.fileName);
        formData.append('name', listingData.fileName);

        const uploadResponse = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}/listings/${listingId}/files`, {
          method: 'POST',
          headers: {
            'x-api-key': apiKeyHeader,
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          const uploadErr = await uploadResponse.text();
          // STRICT PRODUCTION REQUIREMENT: Failed digital upload MUST HALT publishing and KEEP listing as draft
          return {
            success: false,
            listingId: String(listingId),
            error: `Etsy Digital File Upload Failed: HTTP ${uploadResponse.status} - ${uploadErr}. Listing remains in draft state and was NOT published or activated.`
          };
        }

        const uploadData = await uploadResponse.json() as { listing_file_id: number };
        fileId = String(uploadData.listing_file_id);
      }

      // Step 3: Activate the Listing ONLY after verified successful digital upload
      const activateResponse = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}/listings/${listingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKeyHeader,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          state: 'active'
        })
      });

      if (!activateResponse.ok) {
        const activateErr = await activateResponse.text();
        return {
          success: false,
          listingId: String(listingId),
          error: `Etsy Listing Activation Failed: HTTP ${activateResponse.status} - ${activateErr}. Listing remains in draft state.`
        };
      }

      return {
        success: true,
        listingId: String(listingId),
        listingUrl: `https://www.etsy.com/listing/${listingId}`,
        fileId
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: `Network error communicating with Etsy API: ${msg}`
      };
    }
  }

  /**
   * Fetches authentic receipt details from Etsy Open API v3
   */
  public async getReceiptDetails(
    shopId: string,
    receiptId: string | number,
    accessToken?: string
  ): Promise<{ success: boolean; receipt?: EtsyReceipt; error?: string }> {
    const token = accessToken || process.env.ETSY_ACCESS_TOKEN;
    const apiKeyHeader = this.getFormattedApiKey();

    if (!token || !apiKeyHeader) {
      return { success: false, error: 'Etsy credentials not configured.' };
    }

    try {
      const response = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}/receipts/${receiptId}`, {
        headers: {
          'x-api-key': apiKeyHeader,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, error: `Etsy Receipt API HTTP ${response.status}: ${errText}` };
      }

      const receipt = await response.json() as EtsyReceipt;
      return { success: true, receipt };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Fetches transaction items for a receipt from Etsy Open API v3
   */
  public async getReceiptTransactions(
    shopId: string,
    receiptId: string | number,
    accessToken?: string
  ): Promise<{ success: boolean; transactions?: EtsyReceiptTransaction[]; error?: string }> {
    const token = accessToken || process.env.ETSY_ACCESS_TOKEN;
    const apiKeyHeader = this.getFormattedApiKey();

    if (!token || !apiKeyHeader) {
      return { success: false, error: 'Etsy credentials not configured.' };
    }

    try {
      const response = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}/receipts/${receiptId}/transactions`, {
        headers: {
          'x-api-key': apiKeyHeader,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, error: `Etsy Transactions API HTTP ${response.status}: ${errText}` };
      }

      const data = await response.json() as { results?: EtsyReceiptTransaction[] };
      return { success: true, transactions: data.results || [] };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Fetches resource directly by URL provided in Etsy webhook payload (e.g. resource_url)
   */
  public async fetchResourceByUrl<T = any>(
    resourceUrl: string,
    accessToken?: string
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    const token = accessToken || process.env.ETSY_ACCESS_TOKEN;
    const apiKeyHeader = this.getFormattedApiKey();

    if (!token || !apiKeyHeader) {
      return { success: false, error: 'Etsy credentials not configured to fetch resource_url.' };
    }

    try {
      const url = resourceUrl.startsWith('http') ? resourceUrl : `https://openapi.etsy.com/v3/${resourceUrl.replace(/^\//, '')}`;
      const response = await fetch(url, {
        headers: {
          'x-api-key': apiKeyHeader,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, error: `Etsy Resource API HTTP ${response.status}: ${errText}` };
      }

      const data = await response.json() as T;
      return { success: true, data };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Fetches payments resource for a shop via official Open API v3 (GET /v3/application/shops/{shop_id}/payments)
   */
  public async getShopPayments(
    shopId: string,
    accessToken?: string,
    limit = 25
  ): Promise<{ success: boolean; payments?: EtsyReceiptPayment[]; error?: string }> {
    const token = accessToken || process.env.ETSY_ACCESS_TOKEN;
    const apiKeyHeader = this.getFormattedApiKey();

    if (!token || !apiKeyHeader) {
      return {
        success: false,
        error: 'Etsy credentials not configured for shop payments query.'
      };
    }

    try {
      const response = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}/payments?limit=${limit}`, {
        headers: {
          'x-api-key': apiKeyHeader,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        return {
          success: false,
          error: `Etsy Shop Payments API Error: HTTP ${response.status} - ${errText}`
        };
      }

      const data = await response.json() as { results?: EtsyReceiptPayment[] };
      return {
        success: true,
        payments: data.results || []
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Fetches shop payment account ledger entries via official Open API v3
   */
  public async getShopLedgerEntries(
    shopId: string,
    accessToken?: string,
    limit = 25
  ): Promise<{ success: boolean; entries?: any[]; error?: string }> {
    const token = accessToken || process.env.ETSY_ACCESS_TOKEN;
    const apiKeyHeader = this.getFormattedApiKey();

    if (!token || !apiKeyHeader) {
      return { success: false, error: 'Etsy credentials not configured.' };
    }

    try {
      const response = await fetch(`https://openapi.etsy.com/v3/application/shops/${shopId}/payment-account/ledger-entries?limit=${limit}`, {
        headers: {
          'x-api-key': apiKeyHeader,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, error: `HTTP ${response.status} - ${errText}` };
      }

      const data = await response.json() as { results?: any[] };
      return { success: true, entries: data.results || [] };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }
}

export const etsyService = new EtsyService();
