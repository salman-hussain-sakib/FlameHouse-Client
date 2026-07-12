import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByUserId, getAllOrders, createOrder, DBOrder } from '@/lib/db-helpers';
import { getTokenFromHeader, verifyJwt } from '@/lib/auth';


export async function GET(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (userId && userId !== payload.sub && payload.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const orders = userId ? await getOrdersByUserId(userId) : await getAllOrders();
  return NextResponse.json({ orders }, { status: 200 });
}


export async function POST(request: NextRequest) {
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
    const { userId, items, cartTotal } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing userId or items' }, { status: 400 });
    }

    if (payload.sub !== userId && payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const total = Number((cartTotal * 1.08 + 3.99).toFixed(2));

    const newOrder: DBOrder = {
      id: 'ord-' + Math.floor(Math.random() * 9000000 + 1000000),
      userId,
      items,
      total,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };

    const created = await createOrder(newOrder);
    return NextResponse.json({ order: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
