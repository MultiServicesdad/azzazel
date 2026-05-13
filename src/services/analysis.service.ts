import { redis, cacheGet, cacheSet } from '@/lib/redis';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Intelligence Analysis Service
// ═══════════════════════════════════════════════════════════

export interface PasswordAnalysis {
  entropy: number;
  strength: 'WEAK' | 'MEDIUM' | 'STRONG' | 'VERY_STRONG';
  crackTime: string;
  isCommon: boolean;
  patterns: string[];
}

export function analyzePassword(password: string): PasswordAnalysis {
  const length = password.length;
  let entropy = 0;

  if (/[a-z]/.test(password)) entropy += 26;
  if (/[A-Z]/.test(password)) entropy += 26;
  if (/[0-9]/.test(password)) entropy += 10;
  if (/[^a-zA-Z0-9]/.test(password)) entropy += 32;

  const totalEntropy = Math.log2(entropy || 1) * length;

  let strength: PasswordAnalysis['strength'] = 'WEAK';
  let crackTime = 'seconds';

  if (totalEntropy > 80) { strength = 'VERY_STRONG'; crackTime = 'centuries'; }
  else if (totalEntropy > 60) { strength = 'STRONG'; crackTime = 'years'; }
  else if (totalEntropy > 40) { strength = 'MEDIUM'; crackTime = 'days'; }

  const patterns: string[] = [];
  if (length < 8) patterns.push('Too short');
  if (!/[A-Z]/.test(password)) patterns.push('No uppercase');
  if (!/[0-9]/.test(password)) patterns.push('No numbers');
  if (!/[^a-zA-Z0-9]/.test(password)) patterns.push('No symbols');

  return {
    entropy: Math.round(totalEntropy),
    strength,
    crackTime,
    isCommon: ['123456', 'password', 'qwerty', '12345678'].includes(password.toLowerCase()),
    patterns,
  };
}

export interface IPIntelligence {
  ip: string;
  asn?: string;
  isp?: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  isProxy: boolean;
  isVPN: boolean;
  isTor: boolean;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export async function getIPIntelligence(ip: string): Promise<IPIntelligence | null> {
  const cacheKey = `geo:${ip}`;
  
  // Try cache first
  const cached = await cacheGet<IPIntelligence>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,isp,as,proxy,hosting`);
    const data = await res.json();

    if (data.status !== 'success') {
      console.warn(`[GeoIP] Failed to lookup ${ip}: ${data.message}`);
      return null;
    }

    const intel: IPIntelligence = {
      ip,
      asn: data.as,
      isp: data.isp,
      country: data.country,
      countryCode: data.countryCode,
      region: data.regionName,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      isProxy: data.proxy || data.hosting,
      isVPN: false, // ip-api free doesn't explicitly flag VPN, but proxy/hosting is a good indicator
      isTor: false,
      threatLevel: (data.proxy || data.hosting) ? 'MEDIUM' : 'LOW',
    };

    // Cache for 24 hours
    await cacheSet(cacheKey, intel, 86400);

    return intel;
  } catch (error) {
    console.error('[GeoIP] Error fetching intelligence:', error);
    return null;
  }
}

export function calculateRiskScore(results: any[]): number {
  let score = 0;
  results.forEach(r => {
    if (r.severity === 'CRITICAL') score += 25;
    else if (r.severity === 'HIGH') score += 15;
    else if (r.severity === 'MEDIUM') score += 5;
  });
  return Math.min(score, 100);
}
