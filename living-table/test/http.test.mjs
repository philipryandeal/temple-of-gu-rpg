import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { makeServer } from '../server.mjs';

const server = makeServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
after(() => new Promise(resolve => server.close(resolve)));
const origin = 'http://127.0.0.1:' + server.address().port;

test('simple entrance offers one-to-six Seeker selector and eight scene options', async () => {
 const response=await fetch(origin+'/');
 assert.equal(response.status,200);
 assert.ok((response.headers.get('content-type')||'').startsWith('text/html'));
 const html=await response.text();
 assert.ok(html.includes('<form action="./courtyard.html" method="get">'));
 assert.match(html,/<select id="seekers" name="seekers"/);
 assert.match(html,/<select id="scene" name="scene"/);
 for(const n of [1,2,3,4,5,6])assert.match(html,new RegExp('<option value="'+n+'"'));
 const options=html.split('<select id="scene" name="scene" required>')[1]?.split('</select>')[0]||'';
 assert.equal((options.match(/<option /g)||[]).length,8);
 assert.equal((options.match(/disabled>/g)||[]).length,7);
 assert.match(html,/01 — The Courtyard Fèt/);
 assert.match(html,/Enter the Table/);
 assert.ok(!html.includes('class="roads"'), 'Four Roads cards are retired from main entrance');
 assert.match(response.headers.get('content-security-policy'),/form-action 'self'/);
});
test('the human road opens at Torii\'s gate', async () => {
  const r = await fetch(origin + '/human.html');
  assert.equal(r.status, 200);
  const html = await r.text();
  assert.match(html, /Torii's Gate/);
  assert.match(html, /src="\.\/ui\.mjs"/);
});
test('legacy road pages and data remain readable for backward compatibility, not the main entrance', async () => {
  for (const road of ['synthetic','dyad','egbe']) {
    const r = await fetch(origin + '/' + road + '.html');
    assert.equal(r.status, 200, road);
    assert.match(await r.text(), /not open yet/, road);
  }
  const j = await fetch(origin + '/roads.json');
  assert.match(j.headers.get('content-type'), /^application\/json/);
  const data = await j.json();
  assert.deepEqual(data.roads.map(r => r.road), ['human','synthetic','dyad','egbe']);
  const css = await fetch(origin + '/style.css');
  assert.match(css.headers.get('content-type'), /^text\/css/);
});
test('module routes serve JavaScript without MIME confusion', async () => {
  for (const name of ['ui.mjs','game.mjs']) {
    const r = await fetch(origin + '/' + name);
    assert.equal(r.status, 200);
    assert.match(r.headers.get('content-type'), /^text\/javascript/);
    assert.ok((await r.text()).length > 10);
  }
});
test('health endpoint and HEAD are supported', async () => {
  const health = await fetch(origin + '/health');
  assert.equal(health.status, 200);
  assert.equal(await health.text(), 'ok');
  const head = await fetch(origin + '/index.html', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.match(head.headers.get('content-type'), /^text\/html/);
});
test('unknown routes and private source files do not leak', async () => {
  for (const route of ['/missing','/README.md','/server.mjs','/test/http.test.mjs','/Dockerfile','/.gitignore']) {
    assert.equal((await fetch(origin + route)).status, 404, route);
  }
});
test('writes are rejected; response stays noindex', async () => {
  const response = await fetch(origin + '/', { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
});
