// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Application Constants
// ═══════════════════════════════════════════════════════════

export const APP_NAME = 'Azazel OSINT';
export const APP_DESCRIPTION = 'Institutional cyber intelligence platform';
export const APP_VERSION = '1.0.0';

// ── Subscription Plans ───────────────────────────────────
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    dailySearches: 3,
    monthlyApiCalls: 0,
    maxSavedResults: 5,
    historyDays: 7,
    features: [
      '3 daily searches',
      'Basic breach detection',
      'Censored results',
      'Standard support',
    ],
    restrictions: [
      'No exports',
      'No API access',
      'Censored intelligence data',
    ],
  },
  PREMIUM: {
    name: 'Premium',
    price: 29.99,
    dailySearches: 100,
    monthlyApiCalls: 3000,
    maxSavedResults: -1, // unlimited
    historyDays: -1, // unlimited
    features: [
      '100 daily searches',
      'Full intelligence reveal',
      'Full Geolocation access',
      'Export CSV, JSON & PDF',
      'Institutional API Access',
      '3,000 API calls/month',
      'Unlimited saved results',
      'Priority support',
    ],
    restrictions: [],
  },
} as const;

// ── Search Types ─────────────────────────────────────────
export const SEARCH_TYPE_LABELS: Record<string, string> = {
  EMAIL: 'Email Address',
  USERNAME: 'Username',
  IP: 'IP Address',
  DOMAIN: 'Domain',
  PHONE: 'Phone Number',
  NAME: 'Full Name',
  HASH: 'Hash',
  CRYPTO: 'Crypto Wallet',
  AUTO: 'Auto Detect',
};

export const SEARCH_TYPE_ICONS: Record<string, string> = {
  EMAIL: 'Mail',
  USERNAME: 'User',
  IP: 'Globe',
  DOMAIN: 'Server',
  PHONE: 'Phone',
  NAME: 'UserSearch',
  HASH: 'Hash',
  CRYPTO: 'Wallet',
  AUTO: 'Search',
};

// ── Severity Levels ──────────────────────────────────────
export const SEVERITY_CONFIG = {
  LOW: {
    label: 'Low',
    color: 'text-zinc-400',
    bg: 'bg-zinc-400/5',
    border: 'border-zinc-800',
    dotColor: 'bg-zinc-600',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-zinc-300',
    bg: 'bg-zinc-400/10',
    border: 'border-zinc-700',
    dotColor: 'bg-zinc-500',
  },
  HIGH: {
    label: 'High',
    color: 'text-zinc-200',
    bg: 'bg-zinc-200/5',
    border: 'border-zinc-500',
    dotColor: 'bg-zinc-300',
  },
  CRITICAL: {
    label: 'Critical',
    color: 'text-white',
    bg: 'bg-white/5',
    border: 'border-white/20',
    dotColor: 'bg-white',
  },
} as const;

// ── Navigation ───────────────────────────────────────────
export const DASHBOARD_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Search', href: '/search', icon: 'Search' },
  { label: 'Saved Results', href: '/saved', icon: 'Bookmark' },
  { label: 'API Keys', href: '/api-keys', icon: 'Key' },
  { label: 'Notifications', href: '/notifications', icon: 'Bell' },
  { label: 'Subscription', href: '/subscription', icon: 'CreditCard' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
] as const;

export const ADMIN_NAV = [
  { label: 'Overview', href: '/admin', icon: 'BarChart3' },
  { label: 'Users', href: '/admin/users', icon: 'Users' },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: 'CreditCard' },
  { label: 'Search Logs', href: '/admin/searches', icon: 'FileSearch' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'TrendingUp' },
  { label: 'API Monitor', href: '/admin/api-monitor', icon: 'Activity' },
  { label: 'Abuse', href: '/admin/abuse', icon: 'ShieldAlert' },
  { label: 'Audit Log', href: '/admin/audit-log', icon: 'ScrollText' },
  { label: 'Feature Flags', href: '/admin/feature-flags', icon: 'ToggleLeft' },
  { label: 'System', href: '/admin/system', icon: 'Server' },
] as const;

// ── API ──────────────────────────────────────────────────
export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;

// ── Auth ─────────────────────────────────────────────────
export const AUTH_COOKIE_NAME = 'azazel_refresh';
export const CSRF_COOKIE_NAME = 'azazel_csrf';
export const ACCESS_TOKEN_HEADER = 'Authorization';
export const AZAZEL_ID_PREFIX = '0x';
export const AZAZEL_ID_BYTES = 64; // 128 hex chars

// ── Regex Patterns ───────────────────────────────────────
export const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  username: /^[a-zA-Z0-9_-]{3,32}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/,
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  ipv6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
  domain: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{6,14}$/,
  md5: /^[a-fA-F0-9]{32}$/,
  sha1: /^[a-fA-F0-9]{40}$/,
  sha256: /^[a-fA-F0-9]{64}$/,
  bcrypt: /^\$2[aby]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/,
  cryptoWallet: /^(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,39})$/,
  hex: /^[a-fA-F0-9]+$/,
} as const;
