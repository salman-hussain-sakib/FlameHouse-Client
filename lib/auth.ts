import { createHmac } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'flamehouse-local-secret';
const JWT_ALGORITHM = 'sha256';

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

export interface JwtPayload {
  sub: string;
  role: 'user' | 'admin';
  email: string;
  exp: number;
}

export function signJwt(payload: Omit<JwtPayload, 'exp'>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = now + 60 * 60 * 8;
  const data: JwtPayload = { ...payload, exp: expiresIn };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(data));
  const signature = createHmac(JWT_ALGORITHM, JWT_SECRET).update(`${encodedHeader}.${encodedPayload}`).digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;

    const expectedSignature = createHmac(JWT_ALGORITHM, JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
    if (expectedSignature !== signature) return null;

    const decodedPayload = JSON.parse(base64UrlDecode(payload)) as JwtPayload;
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) return null;

    return decodedPayload;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authorizationHeader?: string | null): string | null {
  if (!authorizationHeader?.startsWith('Bearer ')) return null;
  return authorizationHeader.slice(7).trim();
}
