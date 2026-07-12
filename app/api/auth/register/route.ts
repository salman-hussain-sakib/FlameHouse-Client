import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, DBUser } from '@/lib/db-helpers';
import { signJwt } from '@/lib/auth';


export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const newUser: DBUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      password,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };

    await createUser(newUser);

    const { password: _p, ...safeUser } = newUser;
    const token = signJwt({ sub: safeUser.id, role: safeUser.role, email: safeUser.email });
    return NextResponse.json({ user: safeUser, token }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
