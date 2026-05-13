import type { SearchTypeEnum, ProviderResult, IOSINTProvider } from '@/types';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — LeakCheck Provider
// Searches breach data via spoofwave proxy
// ═══════════════════════════════════════════════════════════

const LEAKCHECK_TYPE_MAP: Record<string, string> = {
  EMAIL: 'email',
  USERNAME: 'username',
  PHONE: 'phone',
  HASH: 'hash',
  AUTO: 'auto',
  NAME: 'keyword',
  DOMAIN: 'keyword',
};

const SUPPORTED_TYPES: SearchTypeEnum[] = [
  'EMAIL', 'USERNAME', 'PHONE', 'HASH', 'AUTO', 'NAME', 'DOMAIN'
];

export class LeakCheckProvider implements IOSINTProvider {
  name = 'LeakCheck';

  private apiUrl: string;
  private licenseKey: string;

  constructor() {
    this.apiUrl = process.env.LEAKCHECK_API_URL || 'https://spoofwave.com/api/leakcheck';
    this.licenseKey = process.env.LEAKCHECK_LICENSE_KEY || '';
  }

  supports(type: SearchTypeEnum): boolean {
    return SUPPORTED_TYPES.includes(type);
  }

  async search(type: SearchTypeEnum, value: string): Promise<ProviderResult[]> {
    if (!this.supports(type) || !this.licenseKey) {
      return [];
    }

    const searchType = LEAKCHECK_TYPE_MAP[type] || 'auto';

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: this.licenseKey,
          value,
          search_type: searchType,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[LeakCheck] HTTP ${response.status}: ${errorText}`);
        return [];
      }

      const json = await response.json();
      console.log(`[LeakCheck] Raw response:`, JSON.stringify(json, null, 2));

      if (!json.success || !json.results) {
        console.warn(`[LeakCheck] No results returned or success=false.`);
        return [];
      }

      const normalized = this.normalizeResults(json.results);
      console.log(`[LeakCheck] Normalized ${normalized.length} results`);
      return normalized;
    } catch (error) {
      console.error('[LeakCheck] Fatal error:', error);
      return [];
    }
  }

  private normalizeResults(results: LeakCheckResult[]): ProviderResult[] {
    return results.map((entry) => ({
      source: 'LeakCheck',
      breachName: entry.source?.name || null,
      breachDate: entry.source?.breach_date || null,
      leakType: this.buildLeakType(entry),
      recordCount: null,
      fields: {
        email: entry.email || undefined,
        username: entry.username || undefined,
        password: entry.password || undefined,
        hash: entry.hash_password || undefined,
        phone: entry.phone || undefined,
        domain: entry.domain || undefined,
        name: entry.name || entry.first_name
          ? `${entry.first_name || ''} ${entry.last_name || ''}`.trim()
          : undefined,
        ip: entry.ip || undefined,
        address: entry.address || undefined,
        last_login: entry.last_login || undefined,
        dob: entry.dob || undefined,
        gender: entry.gender || undefined,
      },
      rawData: entry as unknown as Record<string, unknown>,
    }));
  }

  private buildLeakType(entry: LeakCheckResult): string {
    if (entry.fields && Array.isArray(entry.fields)) {
      return entry.fields.join(', ');
    }
    if (entry.source?.compilation) return 'Compilation';
    if (entry.source?.passwordless) return 'Passwordless';
    return 'Database Leak';
  }
}

interface LeakCheckResult {
  source?: {
    name: string;
    breach_date: string | null;
    unverified?: number;
    passwordless?: number;
    compilation?: number;
  };
  email?: string;
  username?: string;
  password?: string;
  hash_password?: string;
  phone?: string;
  domain?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  ip?: string;
  address?: string;
  last_login?: string;
  dob?: string;
  gender?: string;
  fields?: string[];
}
