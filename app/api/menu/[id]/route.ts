import { NextRequest, NextResponse } from 'next/server';
import { getMenuItemById, deleteMenuItem, getReviewsForItem } from '@/lib/db-helpers';
import { getTokenFromHeader, verifyJwt } from '@/lib/auth';


export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await getMenuItemById(id);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  const reviews = await getReviewsForItem(id);
  return NextResponse.json({ item, reviews }, { status: 200 });
}


export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = getTokenFromHeader(_request.headers.get('authorization'));
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payload = verifyJwt(token);
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const deleted = await deleteMenuItem(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
