import { NextRequest, NextResponse } from 'next/server';
import { getMenuItems, addMenuItem, DBMenuItem } from '@/lib/db-helpers';
import { getTokenFromHeader, verifyJwt } from '@/lib/auth';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const featured = searchParams.get('featured') === 'true' ? true : undefined;

  const items = await getMenuItems({ category, search, featured });
  return NextResponse.json({ items }, { status: 200 });
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, description, longDescription, images,
            spicyLevel, isVeg, calories, ingredients, createdBy } = body;

    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    if (!name || !price || !category || !description || !longDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem: DBMenuItem = {
      id: 'custom-' + Date.now(),
      name,
      price: Number(price),
      category,
      description,
      longDescription,
      images: images ?? [],
      rating: 5.0,
      spicyLevel: Number(spicyLevel ?? 0),
      isVeg: Boolean(isVeg),
      isFeatured: false,
      calories: Number(calories ?? 0),
      ingredients: ingredients ?? [],
      createdBy: createdBy ?? 'anonymous',
    };

    const created = await addMenuItem(newItem);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
