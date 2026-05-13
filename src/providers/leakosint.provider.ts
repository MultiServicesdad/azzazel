import type { SearchTypeEnum, ProviderResult, IOSINTProvider } from '@/types';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — LeakOSINT Provider
// Searches leak databases via LeakOSINT Telegram API
// ═══════════════════════════════════════════════════════════

// LeakOSINT accepts free-text queries - all types are supported
const SUPPORTED_TYPES: SearchTypeEnum[] = [
  'EMAIL', 'USERNAME', 'PHONE', 'NAME', 'DOMAIN', 'IP', 'HASH', 'AUTO'
];

export class LeakOSINTProvider implements IOSINTProvider {
  name = 'LeakOSINT';

  private apiUrl: string;
  private token: string;

  constructor() {
    this.apiUrl = process.env.LEAKOSINT_API_URL || 'https://leakosintapi.com/';
    this.token = process.env.LEAKOSINT_TOKEN || '';
  }

  supports(type: SearchTypeEnum): boolean {
    return SUPPORTED_TYPES.includes(type);
  }

  async search(type: SearchTypeEnum, value: string): Promise<ProviderResult[]> {
    if (!this.supports(type) || !this.token) {
      return [];
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.token,
          request: value,
          limit: 100,
          lang: 'en',
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (!response.ok) {
        console.error(`[LeakOSINT] HTTP ${response.status}`);
        return [];
      }

      const json = await response.json();

      if (json['Error code']) {
        console.error(`[LeakOSINT] API Error: ${json['Error code']}`);
        return [];
      }

      if (!json.List) {
        return [];
      }

      return this.normalizeResults(json.List);
    } catch (error) {
      console.error('[LeakOSINT] Search error:', error);
      return [];
    }
  }

  private normalizeResults(
    list: Record<string, LeakOSINTDatabase>
  ): ProviderResult[] {
    const results: ProviderResult[] = [];

    for (const [dbName, dbData] of Object.entries(list)) {
      if (dbName === 'No results found') continue;
      if (!dbData.Data || !Array.isArray(dbData.Data)) continue;

      for (const record of dbData.Data) {
        const fields: Record<string, string | undefined> = {};

        // Map all available fields
        for (const [key, val] of Object.entries(record)) {
          if (typeof val === 'string' && val.trim()) {
            const normalizedKey = this.normalizeFieldName(key);
            if (normalizedKey) {
              fields[normalizedKey] = val;
            }
          }
        }

        results.push({
          source: 'LeakOSINT',
          breachName: dbName,
          breachDate: null,
          leakType: dbData.InfoLeak || 'Database Leak',
          recordCount: null,
          fields,
          rawData: { database: dbName, ...record },
        });
      }
    }

    return results;
  }

  private normalizeFieldName(key: string): string | null {
    const keyLower = key.toLowerCase();

    const mappings: Record<string, string> = {
      email: 'email',
      'e-mail': 'email',
      mail: 'email',
      login: 'username',
      username: 'username',
      user: 'username',
      nickname: 'username',
      password: 'password',
      pass: 'password',
      passwd: 'password',
      hash: 'hash',
      password_hash: 'hash',
      phone: 'phone',
      telephone: 'phone',
      tel: 'phone',
      mobile: 'phone',
      name: 'name',
      fullname: 'name',
      full_name: 'name',
      firstname: 'name',
      first_name: 'name',
      lastname: 'name',
      last_name: 'name',
      ip: 'ip',
      ip_address: 'ip',
      ipaddress: 'ip',
      address: 'address',
      city: 'address',
      country: 'address',
      domain: 'domain',
      salt: 'salt',
      dob: 'dob',
      date_of_birth: 'dob',
      birthdate: 'dob',
      gender: 'gender',
      sex: 'gender',
      last_login: 'last_login',
      lastlogin: 'last_login',
    };

    return mappings[keyLower] || null;
  }
}

interface LeakOSINTDatabase {
  InfoLeak?: string;
  Data?: Record<string, string>[];
}
