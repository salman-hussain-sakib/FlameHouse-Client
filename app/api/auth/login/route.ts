import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db-helpers';
import { signJwt } from '@/lib/auth';


export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const { password: _p, ...safeUser } = user;
    const token = signJwt({ sub: safeUser.id, role: safeUser.role, email: safeUser.email });
    return NextResponse.json({ user: safeUser, token }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
