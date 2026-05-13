// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Type Definitions
// ═══════════════════════════════════════════════════════════

// ── Auth Types ───────────────────────────────────────────
export interface AuthUser {
  id: string;
  azazelId: string;
  email: string;
  username: string;
  role: 'USER' | 'PREMIUM' | 'ADMIN' | 'SUPERADMIN';
  emailVerified: boolean;
  avatar: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SessionInfo {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  current: boolean;
}

// ── Search Types ─────────────────────────────────────────
export type SearchTypeEnum =
  | 'EMAIL'
  | 'USERNAME'
  | 'IP'
  | 'DOMAIN'
  | 'PHONE'
  | 'NAME'
  | 'HASH'
  | 'CRYPTO'
  | 'AUTO';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SearchQuery {
  query: string;
  type: SearchTypeEnum;
}

export interface BreachResult {
  id: string;
  source: string;
  breachName: string | null;
  breachDate: string | null;
  severity: SeverityLevel;
  leakType: string | null;
  recordCount: number | null;
  fields: BreachFields;
}

export interface BreachFields {
  email?: string;
  username?: string;
  password?: string;
  hash?: string;
  phone?: string;
  name?: string;
  ip?: string;
  domain?: string;
  address?: string;
  [key: string]: string | undefined;
}

export interface SearchResponse {
  id: string;
  query: string;
  searchType: SearchTypeEnum;
  providers: string[];
  resultCount: number;
  duration: number;
  results: BreachResult[];
  createdAt: string;
}

// ── Provider Types ───────────────────────────────────────
export interface ProviderResult {
  source: string;
  breachName: string | null;
  breachDate: string | null;
  fields: Record<string, string | undefined>;
  rawData: Record<string, unknown>;
  leakType: string | null;
  recordCount: number | null;
}

export interface IOSINTProvider {
  name: string;
  search(type: SearchTypeEnum, value: string): Promise<ProviderResult[]>;
  supports(type: SearchTypeEnum): boolean;
}

// ── Subscription Types ───────────────────────────────────
export type PlanType = 'FREE' | 'PREMIUM';

export interface SubscriptionInfo {
  plan: PlanType;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'PAST_DUE';
  dailySearches: number;
  searchesUsed: number;
  searchesRemaining: number;
  monthlyApiCalls: number;
  apiCallsUsed: number;
  expiresAt: string | null;
  features: string[];
}

// ── API Key Types ────────────────────────────────────────
export interface ApiKeyInfo {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  active: boolean;
  usageCount: number;
  rateLimit: number;
  createdAt: string;
}

export interface ApiKeyCreated extends ApiKeyInfo {
  key: string; // Full key, shown only once
}

// ── Notification Types ───────────────────────────────────
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SYSTEM';
  read: boolean;
  link: string | null;
  createdAt: string;
}

// ── Admin Types ──────────────────────────────────────────
export interface AdminUserRow {
  id: string;
  azazelId: string;
  email: string;
  username: string;
  role: string;
  plan: PlanType;
  banned: boolean;
  emailVerified: boolean;
  searchCount: number;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSearches: number;
  searchesToday: number;
  revenue: number;
  premiumUsers: number;
  bannedUsers: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  database: ServiceStatus;
  redis: ServiceStatus;
  snusbase: ServiceStatus;
  leakcheck: ServiceStatus;
  leakosint: ServiceStatus;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  latencyMs: number;
  lastCheck: string;
}

// ── API Response Types ───────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
