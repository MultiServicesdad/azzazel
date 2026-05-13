import { prisma } from '@/lib/prisma';
import { PATTERNS } from '@/lib/constants';
import { sanitizeForPrisma } from '@/lib/utils';
import { censorFields, calculateSeverity } from './censorship.service';
import { analyzePassword, calculateRiskScore } from './analysis.service';
import { SnusbaseProvider } from '@/providers/snusbase.provider';
import { LeakCheckProvider } from '@/providers/leakcheck.provider';
import { LeakOSINTProvider } from '@/providers/leakosint.provider';
import { getIPIntelligence } from './analysis.service';
import type { SearchTypeEnum, ProviderResult, IOSINTProvider, PlanType } from '@/types';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Search Aggregation Service
// ═══════════════════════════════════════════════════════════

const allProviders: IOSINTProvider[] = [
  new SnusbaseProvider(),
  new LeakCheckProvider(),
  new LeakOSINTProvider(),
];

export function detectSearchType(input: string): SearchTypeEnum {
  const trimmed = input.trim();
  if (PATTERNS.email.test(trimmed)) return 'EMAIL';
  if (PATTERNS.ipv4.test(trimmed) || PATTERNS.ipv6.test(trimmed)) return 'IP';
  if (PATTERNS.domain.test(trimmed)) return 'DOMAIN';
  if (PATTERNS.phone.test(trimmed)) return 'PHONE';
  if (PATTERNS.sha256.test(trimmed) || PATTERNS.sha1.test(trimmed) || PATTERNS.md5.test(trimmed)) return 'HASH';
  if (PATTERNS.bcrypt.test(trimmed)) return 'HASH';
  if (PATTERNS.cryptoWallet.test(trimmed)) return 'CRYPTO';
  if (trimmed.includes(' ')) return 'NAME';
  return 'USERNAME';
}

export async function executeSearch(params: {
  userId: string;
  query: string;
  type: SearchTypeEnum;
  plan: PlanType;
}) {
  const { userId, query, plan } = params;
  const type = params.type === 'AUTO' ? detectSearchType(query) : params.type;
  const startTime = Date.now();

  console.log(`[Search] Executing query: "${query}" (Type: ${type}, Plan: ${plan})`);

  // Check API feature flags
  const flags = await prisma.featureFlag.findMany({
    where: { key: { in: ['API_SNUSBASE', 'API_LEAKCHECK', 'API_LEAKOSINT'] } }
  });

  const activeProviders = allProviders.filter(p => {
    const flag = flags.find(f => f.key === `API_${p.name.toUpperCase()}`);
    // Default to enabled if flag doesn't exist
    return flag ? flag.enabled : true;
  });

  // Fetch limits from flags or use defaults
  const limitFlags = await prisma.featureFlag.findMany({
    where: { key: { in: ['LIMIT_FREE_DAILY', 'LIMIT_PREMIUM_DAILY'] } }
  });

  const getLimitValue = (key: string, defaultValue: number) => {
    const flag = limitFlags.find(f => f.key === key);
    if (flag && flag.metadata && typeof flag.metadata === 'object') {
      const meta = flag.metadata as any;
      return typeof meta.value === 'number' ? meta.value : defaultValue;
    }
    return defaultValue;
  };

  const dailyLimit = plan === 'PREMIUM' 
    ? getLimitValue('LIMIT_PREMIUM_DAILY', 100) 
    : getLimitValue('LIMIT_FREE_DAILY', 3);

  // Check daily search limit
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (subscription) {
    const now = new Date();
    const resetAt = new Date(subscription.searchResetAt);
    if (now.toDateString() !== resetAt.toDateString()) {
      await prisma.subscription.update({
        where: { userId },
        data: { searchesUsed: 0, searchResetAt: now },
      });
    } else if (dailyLimit > 0 && subscription.searchesUsed >= dailyLimit) {
      throw new Error(`Daily search limit reached (${dailyLimit} searches). Upgrade your plan for more searches.`);
    }
  }

  // Create search record
  const search = await prisma.search.create({
    data: { 
      userId, 
      query: sanitizeForPrisma(query), 
      searchType: type as any, 
      providers: [], 
      status: 'PENDING' 
    },
  });

  try {
    // Fan-out to supporting providers
    const supporting = activeProviders.filter(p => p.supports(type));
    const providerNames = supporting.map(p => p.name);
    
    console.log(`[Search] Calling providers: ${providerNames.join(', ')}`);

    const results = await Promise.allSettled(supporting.map(async p => {
      console.log(`[Search] Requesting ${p.name}...`);
      const start = Date.now();
      const r = await p.search(type, query);
      console.log(`[Search] ${p.name} returned ${r.length} results in ${Date.now() - start}ms`);
      return r;
    }));

    // Collect successful results
    const allResults: ProviderResult[] = [];
    results.forEach((r, idx) => {
      const pName = supporting[idx].name;
      if (r.status === 'fulfilled') {
        console.log(`[Search] ${pName} returned ${r.value.length} results.`);
        allResults.push(...r.value);
      } else {
        console.error(`[Search] ${pName} failed:`, r.reason);
      }
    });

    // Deduplicate
    const deduped = deduplicateResults(allResults);
    console.log(`[Search] Total results: ${allResults.length}, Deduped: ${deduped.length}`);

    // Store results with censoring
    const dbResults = await Promise.all(
      deduped.map(async (r) => {
        const severity = calculateSeverity(r.fields as Record<string, string | undefined>);
        const censored = censorFields(r.fields as Record<string, string | undefined>, { plan });

        return prisma.searchResult.create({
          data: {
            searchId: search.id,
            source: r.source,
            breachName: sanitizeForPrisma(r.breachName) || 'Unknown',
            breachDate: r.breachDate ? new Date(r.breachDate) : null,
            severity,
            leakType: sanitizeForPrisma(r.leakType),
            recordCount: r.recordCount,
            fields: sanitizeForPrisma(censored) as any,
            rawData: (sanitizeForPrisma(r.rawData) || {}) as any,
          },
        });
      })
    );


    const duration = Date.now() - startTime;

    // Update search record
    await prisma.search.update({
      where: { id: search.id },
      data: {
        status: 'COMPLETED',
        resultCount: dbResults.length,
        duration,
        providers: providerNames,
      },
    });

    // Increment usage
    await prisma.subscription.update({
      where: { userId },
      data: { searchesUsed: { increment: 1 } },
    });

    const riskScore = calculateRiskScore(dbResults);
    
    // Analyze passwords if they exist in results
    const passwords = dbResults
      .map(r => (r.fields as any).password)
      .filter(Boolean)
      .slice(0, 5) as string[];
      
    const passwordInsights = passwords.map(p => ({
      password: p,
      analysis: analyzePassword(p)
    }));

    // Geo-enrichment for Premium users
    let geodata: any[] = [];
    if (plan !== 'FREE') {
      const uniqueIPs = new Set<string>();
      if (type === 'IP') uniqueIPs.add(query);
      
      dbResults.forEach(r => {
        const fields = r.fields as any;
        if (fields.ip && PATTERNS.ipv4.test(fields.ip)) uniqueIPs.add(fields.ip);
        if (fields.last_ip && PATTERNS.ipv4.test(fields.last_ip)) uniqueIPs.add(fields.last_ip);
      });

      if (uniqueIPs.size > 0) {
        const geoResults = await Promise.all(
          Array.from(uniqueIPs).slice(0, 10).map(ip => getIPIntelligence(ip))
        );
        geodata = geoResults.filter(Boolean);
      }
    }

    return {
      id: search.id,
      query,
      searchType: type,
      providers: providerNames,
      resultCount: dbResults.length,
      duration,
      results: dbResults.map(r => ({
        id: r.id,
        source: r.source,
        breachName: r.breachName,
        breachDate: r.breachDate?.toISOString() || null,
        severity: r.severity,
        leakType: r.leakType,
        recordCount: r.recordCount,
        fields: r.fields as Record<string, string | undefined>,
      })),
      insights: {
        riskScore,
        passwordInsights,
        geodata,
      },
      createdAt: search.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('[Search] Fatal error:', error);
    await prisma.search.update({
      where: { id: search.id },
      data: { status: 'FAILED' },
    });
    throw error;
  }
}

function deduplicateResults(results: ProviderResult[]): ProviderResult[] {
  const seen = new Set<string>();
  return results.filter(r => {
    const key = `${r.source}|${r.fields.email || ''}|${r.fields.username || ''}|${r.breachName || ''}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
