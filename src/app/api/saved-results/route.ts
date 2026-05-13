import { NextRequest, NextResponse } from 'next/server';
import { getSavedResults, saveSearchResult, deleteSavedResult } from '@/services/saved-results.service';
import { getUserFromToken } from '@/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const results = await getSavedResults(user.id);
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchId } = await request.json();
    if (!searchId) return NextResponse.json({ error: 'Search ID is required' }, { status: 400 });

    const saved = await saveSearchResult({ userId: user.id, searchId });
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUserFromToken(accessToken);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    await deleteSavedResult(user.id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
