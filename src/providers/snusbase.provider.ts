import type { SearchTypeEnum, ProviderResult, IOSINTProvider } from '@/types';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Snusbase Provider
// Searches breach data via spoofwave proxy
// ═══════════════════════════════════════════════════════════

const SNUSBASE_TYPE_MAP: Record<string, string> = {
  EMAIL: 'email',
  USERNAME: 'username',
  NAME: 'name',
  HASH: 'hash',
  IP: 'lastip',
};

const SUPPORTED_TYPES: SearchTypeEnum[] = ['EMAIL', 'USERNAME', 'NAME', 'HASH', 'IP'];

export class SnusbaseProvider implements IOSINTProvider {
  name = 'Snusbase';

  private apiUrl: string;
  private licenseKey: string;

  constructor() {
    this.apiUrl = process.env.SNUSBASE_API_URL || 'https://spoofwave.com/api/snusbase';
    this.licenseKey = process.env.SNUSBASE_LICENSE_KEY || '';
  }

  supports(type: SearchTypeEnum): boolean {
    return SUPPORTED_TYPES.includes(type);
  }

  async search(type: SearchTypeEnum, value: string): Promise<ProviderResult[]> {
    if (!this.supports(type) || !this.licenseKey) {
      return [];
    }

    const term = SNUSBASE_TYPE_MAP[type];
    if (!term) return [];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: this.licenseKey,
          term,
          value,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Snusbase] HTTP ${response.status}: ${errorText}`);
        return [];
      }

      const json = await response.json();
      console.log(`[Snusbase] Raw response success: ${json.success}`);

      const resultsData = json.data?.results || json.data;

      if (!json.success || !resultsData) {
        console.warn(`[Snusbase] No data returned or success=false.`);
        return [];
      }

      const normalized = this.normalizeResults(resultsData);
      console.log(`[Snusbase] Normalized ${normalized.length} results`);
      return normalized;
    } catch (error) {
      console.error('[Snusbase] Fatal error:', error);
      return [];
    }
  }

  private normalizeResults(data: Record<string, unknown>): ProviderResult[] {
    const results: ProviderResult[] = [];

    // Snusbase returns data grouped by database name
    for (const [dbName, entries] of Object.entries(data)) {
      if (!Array.isArray(entries)) continue;

      for (const entry of entries) {
        if (typeof entry !== 'object' || !entry) continue;

        const record = entry as Record<string, string>;

        results.push({
          source: 'Snusbase',
          breachName: dbName || null,
          breachDate: null,
          leakType: this.detectLeakType(record),
          recordCount: null,
          fields: {
            email: record.email || record.Email || undefined,
            username: record.username || record.Username || record.login || record.Login || undefined,
            password: record.password || record.Password || undefined,
            hash: record.hash || record.Hash || undefined,
            salt: record.salt || record.Salt || undefined,
            name: record.name || record.Name || undefined,
            ip: record.lastip || record.ip || record.IP || record.IP_Address || undefined,
            phone: record.phone || record.Phone || undefined,
            domain: record.email?.split('@')[1] || record._domain || undefined,
            address: record.address || undefined,
            city: record.city || undefined,
            state: record.state || undefined,
            country: record.country || undefined,
            zip: record.zip || undefined,
            company: record.company || undefined,
            dob: record.birthdate || undefined,
            source_db: dbName,
          },
          rawData: record,
        });
      }
    }

    return results;
  }

  private detectLeakType(record: Record<string, string>): string {
    const types: string[] = [];
    if (record.password || record.Password) types.push('Password');
    if (record.hash || record.Hash) types.push('Hash');
    if (record.email || record.Email) types.push('Email');
    if (record.phone || record.Phone) types.push('Phone');
    return types.join(', ') || 'Unknown';
  }
}
