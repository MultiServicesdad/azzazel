import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/services/auth.service';

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

    const saved = await prisma.savedResult.findMany({
      where: { userId: user.id },
      include: {
        search: {
          include: {
            results: {
              take: 5 // Preview only
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch saved investigations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { searchId, name, notes, tags } = await request.json();

    if (!searchId) {
      return NextResponse.json({ success: false, error: 'Search ID is required' }, { status: 400 });
    }

    // Check if search exists and belongs to user
    const search = await prisma.search.findUnique({
      where: { id: searchId, userId: user.id }
    });

    if (!search) {
      return NextResponse.json({ success: false, error: 'Investigation not found' }, { status: 404 });
    }

    const saved = await prisma.savedResult.create({
      data: {
        userId: user.id,
        searchId,
        name: name || search.query,
        notes,
        tags: tags || []
      }
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'This investigation is already in your vault' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to save investigation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('azazel_access')?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(accessToken);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await request.json();

    await prisma.savedResult.delete({
      where: { id, userId: user.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete from vault' }, { status: 500 });
  }
}
