import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, DBOrder } from '@/lib/db-helpers';
import { getTokenFromHeader, verifyJwt } from '@/lib/auth';


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: DBOrder['status'] };

    const validStatuses = ['Pending', 'Confirmed', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ order: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
