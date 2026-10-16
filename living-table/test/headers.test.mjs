import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeServer } from '../server.mjs';
test('security headers on 200, 404 and 405, and favicon served', async () => {
  const server = makeServer();
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const checks = [[await fetch(base + '/'), 200], [await fetch(base + '/nope'), 404], [await fetch(base + '/x', { method: 'PUT' }), 405], [await fetch(base + '/favicon.ico'), 200]];
    for (const [res, status] of checks) {
      assert.equal(res.status, status);
      assert.match(res.headers.get('strict-transport-security') ?? '', /max-age=\d+/);
      assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
      assert.equal(res.headers.get('permissions-policy'), 'camera=(), microphone=(), geolocation=()');
      assert.equal(res.headers.get('x-frame-options'), 'DENY');
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      assert.ok(res.headers.get('content-security-policy'));
      assert.equal(res.headers.get('x-powered-by'), null);
    }
    assert.equal(checks[3][0].headers.get('content-type'), 'image/x-icon');
  } finally { server.close(); }
});
