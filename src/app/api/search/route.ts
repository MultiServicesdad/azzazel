export const runtime = "edge";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { searchSchema } from '@/lib/validations';
import { getUserFromToken } from '@/services/auth.service';
import { executeSearch } from '@/services/search.service';
import { checkRateLimit } from '@/lib/redis';
import { prisma } from '@/lib/prisma';
import type { PlanType } from '@/types';

// GET: Fetch authenticated user's own search history only
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

    const searches = await prisma.search.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 50),
      select: {
        id: true,
        query: true,
        searchType: true,
        status: true,
        resultCount: true,
        duration: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, data: searches });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch searches' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = await checkRateLimit(`rl:search:${user.id}`, 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Try again later.' },
        { status: 429, headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': '0' } }
      );
    }

    // Validate input
    const body = await request.json();
    const result = searchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid search query', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const plan: PlanType = (user.subscription?.plan as PlanType) || 'FREE';

    const searchResult = await executeSearch({
      userId: user.id,
      query: result.data.query,
      type: result.data.type,
      plan,
    });

    return NextResponse.json({
      success: true,
      data: searchResult,
      meta: { remaining: rateLimit.remaining },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    const status = message.includes('limit') ? 429 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
