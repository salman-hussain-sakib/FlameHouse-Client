import test from 'node:test';
import assert from 'node:assert/strict';
import { signJwt, verifyJwt } from './auth';

test('sign and verify JWT round-trip', () => {
  const token = signJwt({ sub: 'user-123', role: 'admin', email: 'admin@example.com' });
  const payload = verifyJwt(token);

  assert.ok(payload);
  assert.equal(payload?.sub, 'user-123');
  assert.equal(payload?.role, 'admin');
  assert.equal(payload?.email, 'admin@example.com');
});

test('invalid token is rejected', () => {
  assert.equal(verifyJwt('not-a-valid-token'), null);
});
