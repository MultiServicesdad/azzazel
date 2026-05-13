import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/services/apikey.service';
import { executeSearch } from '@/services/search.service';
import { searchSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/redis';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Public API v1 — Search
// ═══════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }

    const key = authHeader.split(' ')[1];
    const auth = await validateApiKey(key);

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized. Invalid API Key.' }, { status: 401 });
    }

    // 2. Scope check
    if (!auth.permissions.includes('search')) {
      return NextResponse.json({ error: 'Forbidden. Key lacks search scope.' }, { status: 403 });
    }

    // 3. Rate limiting
    const rateLimit = await checkRateLimit(`rl:api:search:${auth.userId}`, 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // 4. Validate input
    const body = await request.json();
    const result = searchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid parameters', details: result.error.flatten().fieldErrors }, { status: 400 });
    }

    // 5. Execute search
    const data = await executeSearch({
      userId: auth.userId,
      query: result.data.query,
      type: result.data.type,
      plan: auth.plan,
    });

    return NextResponse.json({
      success: true,
      data,
      meta: {
        remaining_requests: rateLimit.remaining,
      }
    });
  } catch (error) {
    console.error('[API V1 Search Error]', error);
    return NextResponse.json({ error: 'Internal intelligence failure' }, { status: 500 });
  }
}
