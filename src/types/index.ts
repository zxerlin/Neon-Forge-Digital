export type DeliverableType =
  | 'notion_template'
  | 'prompt_matrix'
  | 'svg_bundle'
  | 'financial_planner'
  | 'ui_kit'
  | 'audio_sfx_pack';

export type LicenseType = 'Personal Use' | 'Commercial Standard' | 'Extended Resale Pro';

export interface DeliverableFile {
  name: string;
  size: string;
  format: string;
  downloadUrl?: string;
  contentPreview?: string;
}

export interface ProductOptionChoice {
  id: string;
  label: string;
  priceModifier: number;
  licenseType?: LicenseType;
  badge?: string;
  description?: string;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  required: boolean;
  choices: ProductOptionChoice[];
}

export interface OrderBumpOption {
  id: string;
  title: string;
  tagline: string;
  price: number;
  badge: string;
  highlightText: string;
  deliverableFile?: DeliverableFile;
}

export interface DigitalProduct {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  slug: string;
  niche: string;
  price: number;
  compareAtPrice: number;
  profitMargin: number; // e.g. 98%
  salesCount: number;
  totalRevenue: number;
  rating: number;
  reviewsCount: number;
  deliverableType: DeliverableType;
  deliverableFiles: DeliverableFile[];
  licenseType: LicenseType;
  description: string;
  features: string[];
  mockupTheme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentGlow?: string;
    icon?: string;
  };
  etsyOptimization: {
    seoTitle: string;
    thirteenTags: string[];
    listingCategory: string;
    etsySearchVolumeScore: number; // 0 - 100
    competitionLevel: 'Low' | 'Medium' | 'High';
    listingId?: string | number;
  };
  marketingAssets: {
    redditHook: string;
    xThreadHook: string;
    tikTokScript: string;
    pinterestPinTitle: string;
  };
  compliance: {
    commercialRightsWarranted: boolean;
    digitalSalesTaxExemptNote: string;
    vatMossCompliant: boolean;
    licenseAgreementText: string;
  };
  optionGroups?: ProductOptionGroup[];
  orderBumps?: OrderBumpOption[];
  createdAt: string;
  isPublishedToEtsy: boolean;
  isPublishedToStore: boolean;
  status: 'active' | 'draft' | 'archived';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  sectorId: number;
  neonColor: 'cyan' | 'magenta' | 'lime' | 'amber' | 'purple' | 'red' | 'blue' | 'emerald';
  status: 'idle' | 'working' | 'ready';
  level: number;
  tasksCompleted: number;
  speed: string; // e.g. "0.8s execution"
  currentTask: string;
  avatarIcon: string;
  logs: string[];
}

export interface FactorySector {
  id: number;
  code: string;
  name: string;
  shortDesc: string;
  neonClass: string;
  colorHex: string;
  borderColor: string;
  glowColor: string;
  agentId: string;
  agentName: string;
  agentRole: string;
  kpiLabel: string;
  kpiValue: string;
  subKpi: string;
  status: 'online' | 'boosted' | 'syncing';
  icon: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalSpend: number;
  ordersCount: number;
  vipTier: 'Bronze' | 'Silver' | 'Cyber Gold' | 'Obsidian VIP';
  lastOrderDate: string;
  location: string;
  notes: string;
}

export interface EtsyPaymentDetails {
  receiptId: string;
  paymentId?: string;
  paymentStatus: 'pending_settlement' | 'settled' | 'adjusted' | 'paid' | 'canceled';
  grossAmount: number;
  transactionFee: number; // 6.5% standard
  processingFee: number;  // 3% + $0.25
  listingFee: number;     // $0.20 auto-renew
  regulatoryFee?: number; // 0.3% - 1.1% where applicable
  taxWithheld?: number;   // Marketplace Facilitator VAT / Sales Tax
  netDeposit: number;     // Actual net funds deposited to seller account
  settledAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productTitle: string;
  amount: number;
  platformFee: number;
  netProfit: number;
  channel: 'Direct Storefront' | 'Etsy Sync' | 'Gumroad Mirror';
  paymentMethod: 'Credit Card / Stripe' | 'Apple Pay' | 'Crypto' | 'Etsy Payments';
  status: 'Completed & Delivered' | 'Processing' | 'Refunded' | 'Canceled & Refunded';
  licenseKey: string;
  downloadToken: string;
  downloadCount: number;
  maxDownloads: number;
  timestamp: string;
  createdAt?: string;
  etsyPaymentDetails?: EtsyPaymentDetails;
  selectedOptions?: Record<string, string>;
  selectedOrderBumps?: string[];
  optionsPriceAdjustment?: number;
  orderBumpsAmount?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  issueType: 'Download Issue' | 'Commercial License Inquiry' | 'Customization Request' | 'Refund Request';
  subject: string;
  customerMessage: string;
  timestamp: string;
  status: 'Open' | 'Resolved' | 'AI Drafted';
  aiDraftReply: string;
}

export interface CompliancePermit {
  id: string;
  category: 'Tax' | 'Copyright & Licensing' | 'Etsy Compliance' | 'Consumer Protection';
  title: string;
  status: 'Compliant' | 'Ready for File' | 'Verified';
  summary: string;
  practicalSteps: string[];
  legalReference: string;
}

export interface StripeConfig {
  isConfigured: boolean;
  publishableKey?: string;
  secretKeyMasked?: string;
  mode: 'live' | 'test';
  webhookSecretSet: boolean;
  currency: string;
  autoFulfill: boolean;
}

export interface SquareConfig {
  isConfigured: boolean;
  applicationId?: string;
  locationId?: string;
  accessTokenMasked?: string;
  environment: 'sandbox' | 'production';
  webhookSignatureKeySet: boolean;
  currency: string;
  autoFulfill: boolean;
}

export interface EtsyShopConfig {
  isConnected: boolean;
  shopName: string;
  shopId: string;
  apiKeyMasked?: string;
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

export interface EtsyListingPayload {
  title: string;
  description: string;
  price: number;
  quantity: number;
  tags: string[];
  taxonomyId: number;
  whoMade: 'i_did';
  isSupply: false;
  whenMade: '2020_2024' | 'made_to_order';
  itemType: 'download';
  digitalFileUrls: string[];
}

export interface MultiChannelStats {
  stripeGross: number;
  stripeNet: number;
  stripeTxCount: number;
  etsyGross: number;
  etsyNet: number;
  etsyTxCount: number;
  directGross: number;
  totalSyncedSkuCount: number;
}

export interface SocialPlatformConfig {
  discordWebhookUrl?: string;
  slackWebhookUrl?: string;
  zapierWebhookUrl?: string;
  makeWebhookUrl?: string;
  twitterApiKey?: string;
  twitterApiSecret?: string;
  twitterAccessToken?: string;
  twitterAccessSecret?: string;
  redditClientId?: string;
  redditClientSecret?: string;
  redditUsername?: string;
  redditPassword?: string;
  lastDispatchedAt?: string;
  totalDispatchedPosts?: number;
}
