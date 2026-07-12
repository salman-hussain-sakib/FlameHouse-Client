import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, updateUserProfile } from '@/lib/db-helpers';
import { getTokenFromHeader, verifyJwt } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payload = verifyJwt(token);
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const users = await getAllUsers();
  return NextResponse.json({ users }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, updates } = body as { userId?: string; updates?: Record<string, unknown> };

    if (!userId || payload.sub !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await updateUserProfile(userId, updates as Record<string, unknown>);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _p, ...safeUser } = updated;
    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
