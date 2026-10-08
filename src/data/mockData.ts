import { DigitalProduct, Agent, FactorySector, Customer, Order, SupportTicket, CompliancePermit } from '../types';

export const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'prod-cyber-notion-01',
    sku: 'DIG-NOTION-CYBER-88',
    title: 'Cyberpunk 2088 Freelance OS & Client Portal',
    subtitle: 'High-utility Notion operating system for high-ticket freelancers & creators with automated billing tracking',
    slug: 'cyberpunk-notion-freelance-os',
    niche: 'Productivity & Notion Systems',
    price: 39.00,
    compareAtPrice: 79.00,
    profitMargin: 97.4,
    salesCount: 0,
    totalRevenue: 0.00,
    rating: 4.96,
    reviewsCount: 0,
    deliverableType: 'notion_template',
    deliverableFiles: [
      {
        name: 'Cyberpunk_Freelance_OS_v3.notion',
        size: '14.2 MB',
        format: 'Notion Workspace Link + JSON Template',
        contentPreview: `# CYBERPUNK FREELANCE OS v3.2
## Master Modules:
1. Active Client Matrix & Pipeline Tracker
2. Invoice & Retainer Auto-Calculator
3. Scope Creep Defense & Contract Vault
4. Deliverable Hand-off Portal with Password Vault
*Instant Duplicate Link Included*`
      },
      {
        name: 'QuickStart_Commercial_License.pdf',
        size: '840 KB',
        format: 'Cryptographic PDF License',
        contentPreview: 'Authorized for Single Creator Commercial Operations.'
      }
    ],
    licenseType: 'Commercial Standard',
    description: 'An advanced dark-neon Notion operating system designed specifically for digital agency owners and boutique freelancers. Features interactive Kanban boards, automated project margin calculators, client onboarding portals, and automated contract builders.',
    features: [
      '12 pre-configured cyberpunk dark mode dashboard databases',
      'Automated invoice calculation formula with milestone checkpoints',
      'Client onboarding presentation room with embeddable deliverables',
      'Zero monthly subscription fees for your end clients'
    ],
    mockupTheme: {
      primaryColor: '#00f0ff',
      secondaryColor: '#ff007f',
      accentGlow: 'rgba(0, 240, 255, 0.4)',
      icon: 'LayoutDashboard'
    },
    etsyOptimization: {
      seoTitle: 'Cyberpunk Notion Template Freelance OS Client Portal Notion Dashboard Dark Mode Notion Planner Business Notion',
      thirteenTags: [
        'notion template',
        'freelance os',
        'client portal',
        'notion dashboard',
        'business planner',
        'agency dashboard',
        'dark mode notion',
        'notion setup',
        'productivity tool',
        'freelancer hub',
        'invoice tracker',
        'project manager',
        'cyberpunk planner'
      ],
      listingCategory: 'Digital Prints / Digital Planners / Templates',
      etsySearchVolumeScore: 94,
      competitionLevel: 'Medium'
    },
    marketingAssets: {
      redditHook: 'How I replaced 5 SaaS subscriptions ($140/mo) with a single dark cyberpunk Notion OS (Free workflow breakdown)',
      xThreadHook: 'Stop paying $39/mo for client portals. Here is how top 1% freelancers run 6-figure businesses on a $39 one-time Notion OS 🧵👇',
      tikTokScript: 'POV: You open your Notion workspace and it looks like a sci-fi cockpit. Showing the exact layout that made me $4.2k this month.',
      pinterestPinTitle: 'Cyberpunk Notion Freelance Planner | Best Notion Template for Solopreneurs 2026'
    },
    compliance: {
      commercialRightsWarranted: true,
      digitalSalesTaxExemptNote: 'Exempt digital good delivered via automated electronic transmission.',
      vatMossCompliant: true,
      licenseAgreementText: 'Grants perpetual, non-exclusive worldwide rights to use in commercial projects.'
    },
    createdAt: '2026-08-14',
    isPublishedToEtsy: false,
    isPublishedToStore: true,
    status: 'active'
  },
  {
    id: 'prod-midjourney-vault-02',
    sku: 'DIG-AI-MJV6-PROMPT-12',
    title: 'Midjourney v6.2 Master Photorealism Codex',
    subtitle: '500+ curated hyper-detailed parameters, lighting codes & cinematic prompt formulas for commercial stock & packaging',
    slug: 'midjourney-master-photorealism-codex',
    niche: 'AI Design & Generative Assets',
    price: 27.00,
    compareAtPrice: 59.00,
    profitMargin: 98.8,
    salesCount: 0,
    totalRevenue: 0.00,
    rating: 4.98,
    reviewsCount: 0,
    deliverableType: 'prompt_matrix',
    deliverableFiles: [
      {
        name: 'MJ_V6_Photorealism_Codex.xlsx',
        size: '8.4 MB',
        format: 'Searchable Interactive Formula Spreadsheet',
        contentPreview: `Columns: [Category, Aspect Ratio, Film Stock, Aperture, Lighting Engine, Raw Seed, Master Prompt]
500 Tested Commercial Architecture, Macro Photography & Hyper-real Character Prompts.`
      },
      {
        name: 'Negative_Prompt_Blacklist_2026.txt',
        size: '120 KB',
        format: 'Text Presets',
        contentPreview: 'Exclusion codes to eradicate plastic skin, mutant hands, and artifact blooms.'
      }
    ],
    licenseType: 'Extended Resale Pro',
    description: 'Stop burning credits on muddy AI images. This handcrafted prompt engine contains rigorous studio-lighting setups (Arri Alexa 65, Hasselblad H6D, Cinestill 800T) tested across 500+ iterations with real photographic grain.',
    features: [
      '500+ battle-tested commercial prompts with visual proof sheet',
      'Negative prompt matrix eliminating 99% of AI artifacts',
      'Instant copy-paste formula for product mockups and advertising banners',
      'Commercial resale license included for generated visual outputs'
    ],
    mockupTheme: {
      primaryColor: '#ff007f',
      secondaryColor: '#b026ff',
      accentGlow: 'rgba(255, 0, 127, 0.4)',
      icon: 'Sparkles'
    },
    etsyOptimization: {
      seoTitle: 'Midjourney Prompts Photorealistic AI Art Prompts V6 Midjourney Guide Commercial AI Prompts Digital Download Prompt Book',
      thirteenTags: [
        'midjourney prompts',
        'ai art prompts',
        'photorealistic ai',
        'midjourney v6',
        'commercial prompts',
        'ai prompt guide',
        'graphic design ai',
        'digital prompt book',
        'stock photo prompts',
        'cinematic prompts',
        'prompt engineering',
        'creative prompt',
        'instant download'
      ],
      listingCategory: 'Digital / Graphic Design Tools',
      etsySearchVolumeScore: 98,
      competitionLevel: 'Low'
    },
    marketingAssets: {
      redditHook: 'Spent $350 on Midjourney fast hours testing 500 camera lenses. Here is the exact cheat-sheet so you dont waste tokens',
      xThreadHook: 'Midjourney v6.2 is 10x better if you stop typing "hyperrealistic 8k". Use these 7 cinematography parameters instead:',
      tikTokScript: 'Look at the before vs after. Left: normal prompt. Right: using my Cinestill formula. Grab the sheet in bio.',
      pinterestPinTitle: 'Midjourney Photorealistic Prompt Book | Aesthetic AI Photography Guide'
    },
    compliance: {
      commercialRightsWarranted: true,
      digitalSalesTaxExemptNote: 'Educational & technical digital dataset, automated delivery.',
      vatMossCompliant: true,
      licenseAgreementText: 'Allows commercial reproduction and monetization of all resulting generations.'
    },
    createdAt: '2026-08-20',
    isPublishedToEtsy: false,
    isPublishedToStore: true,
    status: 'active'
  },
  {
    id: 'prod-dark-finance-03',
    sku: 'DIG-SHEET-FIN-09',
    title: 'Neon Vault 50/30/20 Wealth Automation Tracker',
    subtitle: 'Automated Google Sheets & Excel budget dashboard with sinking funds, FIRE projection curves & net worth graph',
    slug: 'neon-vault-wealth-automation-tracker',
    niche: 'Personal Finance & Spreadsheets',
    price: 24.50,
    compareAtPrice: 49.00,
    profitMargin: 97.9,
    salesCount: 0,
    totalRevenue: 0.00,
    rating: 4.92,
    reviewsCount: 0,
    deliverableType: 'financial_planner',
    deliverableFiles: [
      {
        name: 'NeonVault_Wealth_Tracker_v4.xlsx',
        size: '5.2 MB',
        format: 'Automated Excel with Neon Cyber Theme',
        contentPreview: 'Integrated multi-currency support, debt snowball vs avalanche auto-calculator, emergency fund runway calculator.'
      },
      {
        name: 'Google_Sheets_OneClick_Copy.url',
        size: '1 KB',
        format: 'Cloud Sync Web Link',
        contentPreview: 'https://docs.google.com/spreadsheets/d/template-neon-vault-copy'
      }
    ],
    licenseType: 'Personal Use',
    description: 'Transform financial tracking from a boring chore into an exhilarating command center. Features sleek cyber graphs, multi-currency conversion, automated debt payoff payoff timelines, and passive income milestone dials.',
    features: [
      'Multi-currency auto-conversion using live Google Finance API formulas',
      'Debt payoff showdown: Snowball vs Avalanche visual battle map',
      'FIRE (Financial Independence) target year countdown calculator',
      'Works on mobile Google Sheets app and desktop Excel 365'
    ],
    mockupTheme: {
      primaryColor: '#39ff14',
      secondaryColor: '#00f0ff',
      accentGlow: 'rgba(57, 255, 20, 0.4)',
      icon: 'TrendingUp'
    },
    etsyOptimization: {
      seoTitle: 'Budget Spreadsheet Google Sheets Budget Template Excel Budget Neon Wealth Tracker Monthly Budget Debt Snowball Calculator',
      thirteenTags: [
        'budget spreadsheet',
        'google sheets budget',
        'excel budget',
        'monthly budget',
        'personal finance',
        'wealth tracker',
        'debt snowball',
        'fire calculator',
        'cyberpunk sheet',
        'finance dashboard',
        'money planner',
        'savings tracker',
        'paycheck budget'
      ],
      listingCategory: 'Digital / Spreadsheets / Budgeting',
      etsySearchVolumeScore: 96,
      competitionLevel: 'Medium'
    },
    marketingAssets: {
      redditHook: 'I built an Excel spreadsheet that actually made budgeting feel like a video game (Free template link inside)',
      xThreadHook: 'Most budget templates look like a tax audit from 1997. Here is my neon dark-mode sheet that tracked my journey to $100k 📊',
      tikTokScript: 'When your budget sheet looks like you are hacking NASA. Watch what happens when I input my paycheck...',
      pinterestPinTitle: 'Aesthetic Google Sheets Budget Template | Neon Finance Tracker 2026'
    },
    compliance: {
      commercialRightsWarranted: true,
      digitalSalesTaxExemptNote: 'Interactive software template, instant digital delivery.',
      vatMossCompliant: true,
      licenseAgreementText: 'Personal lifetime usage license with unlimited family household installs.'
    },
    createdAt: '2026-08-28',
    isPublishedToEtsy: false,
    isPublishedToStore: true,
    status: 'active'
  },
  {
    id: 'prod-vector-cyber-04',
    sku: 'DIG-SVG-CYBERICONS-33',
    title: 'Neon Cyberpunk 450+ Vector Icon & HUD Suite',
    subtitle: 'Handcrafted SVG, EPS, PNG and Figma component pack for app creators, streamers, laser cutters & merch designers',
    slug: 'neon-cyberpunk-vector-hud-suite',
    niche: 'Vector Graphics & Streaming Assets',
    price: 32.00,
    compareAtPrice: 65.00,
    profitMargin: 98.1,
    salesCount: 0,
    totalRevenue: 0.00,
    rating: 4.95,
    reviewsCount: 0,
    deliverableType: 'svg_bundle',
    deliverableFiles: [
      {
        name: 'CyberHUD_Vectors_Pack_450.zip',
        size: '48.6 MB',
        format: 'Organized Vector Directory (SVG, EPS, PNG @ 4096px)',
        contentPreview: 'HUD circles, targeting reticles, circuit line dividers, cyberpunk kanji decals, glow overlays.'
      },
      {
        name: 'Figma_Component_Library.fig',
        size: '18.1 MB',
        format: 'Figma Auto-Layout Component System',
        contentPreview: '450 variants with adjustable neon glow strokes and responsive frame scaling.'
      }
    ],
    licenseType: 'Commercial Standard',
    description: 'A comprehensive vector asset kit built with mathematically precise bezier curves. Ideal for Twitch streamer stream decks, sci-fi game UI, custom apparel, and laser engraved merchandise.',
    features: [
      '450 original vector assets in 6 categories: HUDs, Glitches, Circuits, Badges, Kanji, Framing',
      'Clean uncompounded vector paths ready for Cricut, Glowforge, and Illustrator',
      '4K transparent PNGs with baked neon glow for instant overlay',
      'Full commercial rights for merchandise and commercial software UI'
    ],
    mockupTheme: {
      primaryColor: '#ffb700',
      secondaryColor: '#ff007f',
      accentGlow: 'rgba(255, 183, 0, 0.4)',
      icon: 'Component'
    },
    etsyOptimization: {
      seoTitle: 'Cyberpunk SVG Bundle Neon HUD Icons Sci Fi Vectors Streamer Assets Twitch Overlay Cricut Cut Files Laser Engrave File',
      thirteenTags: [
        'cyberpunk svg',
        'hud vector',
        'sci fi icons',
        'streamer overlay',
        'twitch assets',
        'cricut cut file',
        'laser cut vector',
        'neon icons',
        'commercial svg',
        'game ui assets',
        'glow icons',
        'figma library',
        'digital clip art'
      ],
      listingCategory: 'Digital / Clip Art & Vectors / SVG',
      etsySearchVolumeScore: 91,
      competitionLevel: 'Low'
    },
    marketingAssets: {
      redditHook: 'Showcasing 450 handcrafted SVG vectors I designed for my cyberpunk UI project (Clean source files for laser & web)',
      xThreadHook: 'Good vector HUDs are impossible to find without dirty messy curves. Here is a pristine 450-vector pack for UI designers:',
      tikTokScript: 'Speed-designing a neon twitch overlay in 30 seconds using these modular SVG HUD components.',
      pinterestPinTitle: 'Cyberpunk Vector SVG HUD Pack | Sci-Fi Graphic Design Asset Library'
    },
    compliance: {
      commercialRightsWarranted: true,
      digitalSalesTaxExemptNote: 'Vector graphic software assets, non-physical transmission.',
      vatMossCompliant: true,
      licenseAgreementText: 'Includes commercial production rights for up to 5,000 physical or digital end products.'
    },
    createdAt: '2026-09-02',
    isPublishedToEtsy: false,
    isPublishedToStore: true,
    status: 'active'
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent-0',
    name: 'Agent 0 (Apex Prime)',
    role: 'Autonomous Gateway & Cash Commissioning Overseer',
    sectorId: 0,
    neonColor: 'amber',
    status: 'working',
    level: 10,
    tasksCompleted: 4892,
    speed: '0.01s real-time audit',
    currentTask: 'Auto-applying Stripe webhooks, validating end pages & live customer visibility',
    avatarIcon: 'ShieldAlert',
    logs: [
      '[00:00:15] Initialized Agent 0 Autonomous Gateway Engine.',
      '[00:00:45] Live key verifier armed: pk_live and sk_live validation listener active.',
      '[00:01:20] Customer visibility scanner tracking storefront URL reachability.'
    ]
  },
  {
    id: 'agent-nova',
    name: 'Nova',
    role: 'Trend Radar & Niche Miner',
    sectorId: 1,
    neonColor: 'cyan',
    status: 'working',
    level: 7,
    tasksCompleted: 842,
    speed: '0.4s telemetry',
    currentTask: 'Scanning Etsy Search API for "Notion Dark Theme 2026" delta volume',
    avatarIcon: 'Radar',
    logs: [
      '[00:04:12] Detected 34% search surge in "Cyberpunk Notion Dashboard"',
      '[00:05:22] Low competition flagged: Average Etsy sellers lack automated client portals',
      '[00:07:01] Synthesizing niche opportunity score: 96.4/100 (HIGH PROFIT)'
    ]
  },
  {
    id: 'agent-aria',
    name: 'Aria',
    role: 'Handmade Digital Creator',
    sectorId: 2,
    neonColor: 'magenta',
    status: 'working',
    level: 9,
    tasksCompleted: 1250,
    speed: '1.2s procedural',
    currentTask: 'Synthesizing Notion DB schema + Markdown deliverable package',
    avatarIcon: 'Cpu',
    logs: [
      '[00:03:10] Compiling database relation matrix for client retainer tracker',
      '[00:04:45] Crafting prompt matrix parameters with negative seed exclusions',
      '[00:06:58] Output verified: Zero placeholders, 100% functional deliverable'
    ]
  },
  {
    id: 'agent-rex',
    name: 'Rex',
    role: 'Dynamic Pricing Strategist',
    sectorId: 4,
    neonColor: 'amber',
    status: 'ready',
    level: 6,
    tasksCompleted: 619,
    speed: '0.2s elasticity',
    currentTask: 'Optimizing bundle discount ladder: $39.00 -> 2-pack upsell @ $54.00',
    avatarIcon: 'CircleDollarSign',
    logs: [
      '[00:01:15] Elasticity index computed: Price sensitivity threshold is $44.50',
      '[00:03:30] Anchor pricing set to $79.00 strike-through with 51% live launch discount',
      '[00:06:12] Estimated conversion lift: +28.4% on checkout'
    ]
  },
  {
    id: 'agent-zed',
    name: 'Zed',
    role: 'Packager & License Vault',
    sectorId: 3,
    neonColor: 'lime',
    status: 'working',
    level: 8,
    tasksCompleted: 980,
    speed: '0.5s packaging',
    currentTask: 'Minting SHA-256 license certificates & zero-trust download tokens',
    avatarIcon: 'PackageCheck',
    logs: [
      '[00:02:11] Generating watermarked commercial certificate with buyer UUID',
      '[00:04:19] Bundling high-res visual mockups into zip container (48.6 MB)',
      '[00:06:40] Cloud storage mirror synced to global CDN nodes'
    ]
  },
  {
    id: 'agent-maya',
    name: 'Maya',
    role: 'Viral Traffic Reactor',
    sectorId: 6,
    neonColor: 'purple',
    status: 'working',
    level: 7,
    tasksCompleted: 734,
    speed: '0.9s viral engine',
    currentTask: 'Drafting Reddit r/Notion showcase post + Twitter launch thread',
    avatarIcon: 'Flame',
    logs: [
      '[00:01:50] Reddit hook drafted: "How I replaced 5 SaaS subscriptions with 1 Notion OS"',
      '[00:03:40] TikTok storyboard mapped: 3-second hook with neon screen reveal',
      '[00:06:05] Pinterest pin metadata populated with high-intent keywords'
    ]
  },
  {
    id: 'agent-sage',
    name: 'Sage',
    role: 'Etsy 13-Tag SEO Master',
    sectorId: 5,
    neonColor: 'blue',
    status: 'ready',
    level: 8,
    tasksCompleted: 1104,
    speed: '0.3s keyword ranker',
    currentTask: 'Matching long-tail Etsy search tokens to 13-tag listing slots',
    avatarIcon: 'SearchCheck',
    logs: [
      '[00:02:40] Verified zero single-word tags; all 13 are high-relevance compound terms',
      '[00:04:15] First 40 characters of Etsy title primed with primary buyer keyword',
      '[00:06:33] Category taxonomy locked: Digital Downloads > Business Templates'
    ]
  },
  {
    id: 'agent-leo',
    name: 'Leo',
    role: 'Financial Intelligence & Audit',
    sectorId: 9,
    neonColor: 'emerald',
    status: 'working',
    level: 9,
    tasksCompleted: 2310,
    speed: '0.1s real-time',
    currentTask: 'Auditing net margins after Stripe 2.9% + $0.30 fee vs Etsy 6.5% fee',
    avatarIcon: 'TrendingUp',
    logs: [
      '[00:01:00] Real-time treasury ledger mounted: Live authoritative transaction tracking active.',
      '[00:03:20] Direct Storefront margin: 97.1% net after payment processing fees.',
      '[00:06:50] Cryptographic settlement listener armed across Stripe & Etsy channels.'
    ]
  },
  {
    id: 'agent-kai',
    name: 'Kai',
    role: 'Autonomous Customer Support & CRM',
    sectorId: 8,
    neonColor: 'red',
    status: 'ready',
    level: 7,
    tasksCompleted: 512,
    speed: '0.6s empathic NLP',
    currentTask: 'Auto-resolving ticket #409: "How to duplicate Notion template on iPad"',
    avatarIcon: 'BotMessageSquare',
    logs: [
      '[00:02:05] Customer ticket detected: iPad Notion duplicate instruction inquiry',
      '[00:03:10] AI solution generated with step-by-step iPad screenshot guide',
      '[00:05:44] Response dispatched in under 4 minutes. Customer satisfaction: 100%'
    ]
  }
];

export const FACTORY_SECTORS: FactorySector[] = [
  {
    id: 0,
    code: 'SEC-00',
    name: 'Apex Gateway & Cash Commissioning Bay',
    shortDesc: 'Autonomous Stripe live webhooks, end pages binder, and customer visibility scanner',
    neonClass: 'amber',
    colorHex: '#f59e0b',
    borderColor: 'border-amber-500/50',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    agentId: 'agent-0',
    agentName: 'Agent 0',
    agentRole: 'Cash Gateway Overseer',
    kpiLabel: 'Gateway Readiness',
    kpiValue: 'Live Auto-Settler',
    subKpi: '1-Click Stripe Webhook',
    status: 'boosted',
    icon: 'ShieldCheck'
  },
  {
    id: 1,
    code: 'SEC-01',
    name: 'Trend Radar Chamber',
    shortDesc: 'Autonomous search volume mining & unsaturated niche detection',
    neonClass: 'cyan',
    colorHex: '#00f0ff',
    borderColor: 'border-cyan-500/50',
    glowColor: 'rgba(0, 240, 255, 0.25)',
    agentId: 'agent-nova',
    agentName: 'Nova',
    agentRole: 'Trend Radar',
    kpiLabel: 'Niches Analyzed',
    kpiValue: '3,480 / wk',
    subKpi: 'Opportunity Index: 96.4%',
    status: 'boosted',
    icon: 'Radar'
  },
  {
    id: 2,
    code: 'SEC-02',
    name: 'Digital Forge',
    shortDesc: 'Handmade asset creation: Notion systems, prompt codices, UI suites',
    neonClass: 'magenta',
    colorHex: '#ff007f',
    borderColor: 'border-pink-500/50',
    glowColor: 'rgba(255, 0, 127, 0.25)',
    agentId: 'agent-aria',
    agentName: 'Aria',
    agentRole: 'Content Creator',
    kpiLabel: 'Assets Compiled',
    kpiValue: '12 Active SKUs',
    subKpi: 'Handmade Quality: 100%',
    status: 'online',
    icon: 'Cpu'
  },
  {
    id: 3,
    code: 'SEC-03',
    name: 'Packaging & Vault',
    shortDesc: 'Automated zip bundling, PDF licensing & digital cryptographic stamps',
    neonClass: 'lime',
    colorHex: '#39ff14',
    borderColor: 'border-lime-500/50',
    glowColor: 'rgba(57, 255, 20, 0.25)',
    agentId: 'agent-zed',
    agentName: 'Zed',
    agentRole: 'Packager',
    kpiLabel: 'Deliveries Sealed',
    kpiValue: 'Active Catalog Vault',
    subKpi: 'SHA-256 Tokenized',
    status: 'online',
    icon: 'PackageCheck'
  },
  {
    id: 4,
    code: 'SEC-04',
    name: 'Pricing Elasticity Hub',
    shortDesc: 'Dynamic pricing, automated order bumps & conversion upsell ladders',
    neonClass: 'amber',
    colorHex: '#ffb700',
    borderColor: 'border-amber-500/50',
    glowColor: 'rgba(255, 183, 0, 0.25)',
    agentId: 'agent-rex',
    agentName: 'Rex',
    agentRole: 'Pricing Strategist',
    kpiLabel: 'Pricing Matrix',
    kpiValue: 'Dynamic Ladders Armed',
    subKpi: 'Direct Bank Settlement',
    status: 'online',
    icon: 'CircleDollarSign'
  },
  {
    id: 5,
    code: 'SEC-05',
    name: 'Etsy & Storefront Nexus',
    shortDesc: 'Instant Stripe/Card checkout & 13-tag Etsy API automated publishing',
    neonClass: 'blue',
    colorHex: '#3b82f6',
    borderColor: 'border-blue-500/50',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    agentId: 'agent-sage',
    agentName: 'Sage',
    agentRole: 'Etsy SEO Master',
    kpiLabel: 'Live Channels',
    kpiValue: 'Etsy + Custom Store',
    subKpi: 'Zero Platform Lock-in',
    status: 'boosted',
    icon: 'Store'
  },
  {
    id: 6,
    code: 'SEC-06',
    name: 'Viral Traffic Reactor',
    shortDesc: 'Autonomous Reddit hooks, Twitter threads, TikTok scripts & Pins',
    neonClass: 'purple',
    colorHex: '#b026ff',
    borderColor: 'border-purple-500/50',
    glowColor: 'rgba(176, 38, 255, 0.25)',
    agentId: 'agent-maya',
    agentName: 'Maya',
    agentRole: 'Marketing Agent',
    kpiLabel: 'Viral Impressions',
    kpiValue: '48.2K Organic',
    subKpi: 'Click-Through: 4.8%',
    status: 'online',
    icon: 'Flame'
  },
  {
    id: 7,
    code: 'SEC-07',
    name: 'Permits & Compliance Core',
    shortDesc: 'Digital sales tax, EU VAT MOSS, commercial licenses & legal warranties',
    neonClass: 'cyan',
    colorHex: '#06b6d4',
    borderColor: 'border-cyan-400/50',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    agentId: 'agent-zed',
    agentName: 'Zed & Legal AI',
    agentRole: 'Compliance Guardian',
    kpiLabel: 'Permit Readiness',
    kpiValue: '100% Compliant',
    subKpi: 'Zero Dropship Risks',
    status: 'online',
    icon: 'ShieldCheck'
  },
  {
    id: 8,
    code: 'SEC-08',
    name: 'Cyber CRM & Support Hub',
    shortDesc: 'Instant AI ticket triage, customer lifetime value & VIP loyalty tiers',
    neonClass: 'red',
    colorHex: '#ef4444',
    borderColor: 'border-red-500/50',
    glowColor: 'rgba(239, 68, 68, 0.25)',
    agentId: 'agent-kai',
    agentName: 'Kai',
    agentRole: 'Customer Support',
    kpiLabel: 'Resolution Time',
    kpiValue: '3.8 Minutes',
    subKpi: 'Customer CSAT: 99.2%',
    status: 'online',
    icon: 'Users'
  },
  {
    id: 9,
    code: 'SEC-09',
    name: 'Command & Profit Matrix',
    shortDesc: 'Real-time revenue ticker, net margins, Stripe deposit forecasts',
    neonClass: 'emerald',
    colorHex: '#10b981',
    borderColor: 'border-emerald-500/50',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    agentId: 'agent-leo',
    agentName: 'Leo',
    agentRole: 'Financial AI',
    kpiLabel: 'Live Revenue Yield',
    kpiValue: '$0.00 Base',
    subKpi: 'Authoritative Live State',
    status: 'boosted',
    icon: 'LineChart'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-409',
    customerName: 'David Chen',
    customerEmail: 'david.chen@graphiclab.co',
    productTitle: 'Cyberpunk 2088 Freelance OS',
    issueType: 'Download Issue',
    subject: 'Cannot open Notion duplicate button on iPad Safari',
    customerMessage: 'Hey team, I purchased the Freelance OS but when I tap Duplicate on my iPad Safari browser, it redirects to the login screen and doesnt import. What should I do?',
    timestamp: '15 mins ago',
    status: 'AI Drafted',
    aiDraftReply: `Hi David! Kai from NeonForge support here.\n\nThis happens on iPad when Safari opens Notion in private browsing or when you are signed into a different workspace. Here is the 10-second fix:\n1. Open the Notion iPad app directly and make sure you are logged in.\n2. In Safari, long-press the template link and select "Open in Notion App".\n3. Tap the "Duplicate" button in the top right corner.\n\nI have also extended your download link expiry by 30 days just in case! Let me know if you need anything else.`
  },
  {
    id: 'tkt-408',
    customerName: 'Sophie Leroux',
    customerEmail: 'sophie@atelier-paris.fr',
    productTitle: 'Neon Cyberpunk 450+ Vector Icon Suite',
    issueType: 'Commercial License Inquiry',
    subject: 'Can I use these vectors on physical hoodies for my clothing brand?',
    customerMessage: 'Hello! I love the HUD vectors. We are planning a limited release of 400 streetwear hoodies. Does the Commercial Standard license cover this or do I need the Extended license?',
    timestamp: '2 hours ago',
    status: 'Resolved',
    aiDraftReply: `Hi Sophie!\n\nYes! Your Commercial Standard license covers up to 5,000 physical manufactured units (including streetwear, hoodies, and laser engraving). Since your run is 400 units, you are 100% cleared to print without paying any additional royalties!\n\nBest of luck with the drop!`
  }
];

export const COMPLIANCE_CHECKLIST: CompliancePermit[] = [
  {
    id: 'comp-01',
    category: 'Etsy Compliance',
    title: 'Handmade Digital Goods Policy Compliance',
    status: 'Compliant',
    summary: 'Etsy explicitly bans reselling generic third-party drop-shipped goods. Handmade digital goods created by you (Notion templates, prompt codices, vector graphics, custom spreadsheets) are 100% allowed and favored by Etsy algorithms.',
    practicalSteps: [
      'Original IP Warranty: Maintain source files (Notion workspace ID, vector SVG source nodes, raw test prompts).',
      'Zero Dropshipping: Direct instant digital download delivery (Etsy hosts up to 5 files $\\le$ 20MB directly).',
      'Listing clarity: Clearly state "Instant Digital Download - No physical product shipped" in the top 3 lines of description.'
    ],
    legalReference: 'Etsy Seller Policy § 2.A (Handmade Digital Items & Self-Authored Content)'
  },
  {
    id: 'comp-02',
    category: 'Tax',
    title: 'Digital Sales Tax & Marketplace Facilitator Nexus',
    status: 'Compliant',
    summary: 'When selling via Etsy, Etsy acts as the Marketplace Facilitator and automatically collects and remits US sales tax in all 45 states with sales tax laws.',
    practicalSteps: [
      'For Etsy sales: Zero manual state tax filing required; Etsy remits automatically.',
      'For Direct Storefront sales: Stripe Tax can be enabled to calculate destination-based tax on digital goods.',
      'Keep automated transaction logs with timestamps and country of purchase.'
    ],
    legalReference: 'US Supreme Court South Dakota v. Wayfair, Inc. (Marketplace Facilitator Laws)'
  },
  {
    id: 'comp-03',
    category: 'Tax',
    title: 'EU VAT MOSS (Mini One Stop Shop) Compliance',
    status: 'Ready for File',
    summary: 'EU consumers buying automated digital services are subject to VAT in their member state. Etsy handles this automatically. For custom storefronts, reverse charge applies to B2B customers with valid VAT IDs.',
    practicalSteps: [
      'Store customer country code and IP geolocation on purchase record.',
      'Provide instant VAT receipt / invoice with breakdown of gross vs net price.',
      'For B2B buyers: Validate VIES VAT number to apply 0% reverse-charge rate.'
    ],
    legalReference: 'EU Council Directive 2006/112/EC on Digital Services VAT'
  },
  {
    id: 'comp-04',
    category: 'Copyright & Licensing',
    title: 'Automated Commercial Rights License & Warranty',
    status: 'Verified',
    summary: 'Every purchase generates a cryptographically stamped license agreement that protects you against copyright disputes and sets ironclad boundaries on resale.',
    practicalSteps: [
      'Stamp each PDF delivery with the customer UUID, timestamp, and SKU.',
      'Explicitly prohibit raw file redistribution, sub-licensing, or posting to public torrent/P2P hubs.',
      'Include clear "Digital Products are Non-Refundable Once Downloaded" terms compliant with FTC and EU consumer rules.'
    ],
    legalReference: 'WIPO Copyright Treaty & US Digital Millennium Copyright Act (DMCA)'
  }
];

export const SYSTEM_TEARDOWN = {
  whopAcademyAnalysis: {
    headline: 'Whop / AI Agent Academy System Teardown',
    verdict: 'High-Converting Marketing Shell, Fatal Execution Gaps in Reality',
    keyWeaknesses: [
      {
        title: 'The Manual "Copy-Paste" Bottleneck',
        detail: 'Their own screenshots explicitly reveal: "The honest reality: You copy/paste posts to social media... You upload the product file to Gumroad...". It is not an autonomous machine; it still traps the creator in 4 hours of tedious manual copy-pasting daily.'
      },
      {
        title: 'Platform Hostage & 10%-15% Revenue Skimming',
        detail: 'Relying exclusively on Gumroad or Whop means you pay 10% + credit card processing fees, and if Gumroad suspends your merchant account, your entire business vanishes with zero customer data ownership.'
      },
      {
        title: 'No Digital Licensing or Watermarking',
        detail: 'Delivering raw files with no cryptographic license stamps means your digital products get re-uploaded to Reddit and pirate sites within 48 hours.'
      },
      {
        title: 'No Autonomous CRM or Retention Loop',
        detail: 'Zero retention mechanism. 80% of digital product profit comes from back-end cross-sells and VIP tier upgrades, which their dashboard completely ignores.'
      }
    ],
    neonForgeAdvantage: [
      'Dual-Stream Revenue: Direct Stripe Storefront (100% margin) + Etsy Automated Sync Engine.',
      'True Autonomous Pipeline: Generates real, deployable Notion templates, Midjourney codices, spreadsheets and SVG vectors.',
      'Instant One-Click Customer Delivery & License Vault: Every buyer receives a secure tokenized portal with download limits.',
      'Integrated Custom Cyber CRM: Tracks customer LTV, VIP tiers, and has Kai AI to resolve tickets in under 4 minutes.',
      'Ironclad Permits & Tax Readiness: Built-in commercial license stamps, VAT MOSS compliance, and Etsy marketplace facilitator documentation.'
    ]
  },
  sixtyDayIncomeRoadmap: [
    {
      phase: 'Phase 1 (Days 1 - 14): Foundation & 3 Anchor SKUs',
      targetRevenue: '$400 - $800',
      milestones: [
        'Deploy 3 high-demand handmade digital assets (Notion Freelance OS, Midjourney Codex, Neon Finance Tracker).',
        'Auto-populate 13 Etsy SEO tags with >90 volume scores.',
        'Launch direct storefront with Stripe instant payout integration.'
      ]
    },
    {
      phase: 'Phase 2 (Days 15 - 35): Traffic Reactor & First 50 Buyers',
      targetRevenue: '$1,500 - $2,800',
      milestones: [
        'Deploy Maya Traffic Reactor: post organic high-value breakdowns on r/Notion, r/digitalnomad, and X threads.',
        'Implement Rex bundle pricing: Offer the 3-in-1 Ultimate Creator Cyber Suite at $59 (average order value jumps 40%).',
        'Automate review request drip emails 48 hours post-purchase.'
      ]
    },
    {
      phase: 'Phase 3 (Days 36 - 60): Scale, Etsy Dominance & Autonomous Flow',
      targetRevenue: '$3,500 - $5,500+/mo recurring',
      milestones: [
        'Etsy listings gain "Bestseller" and "Star Seller" badges through 100% on-time automated delivery and 5-star reviews.',
        'Kai Support AI manages 100% of customer questions autonomously.',
        'Direct Storefront generates 60% of total revenue with 97%+ pure profit margin.'
      ]
    }
  ]
};
