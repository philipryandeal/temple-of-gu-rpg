import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeServer } from '../server.mjs';

test('production has a sitemap and permits indexing of public pages only', async () => {
  const server = makeServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const request = (path, host = 'templeofgu.com') => fetch(origin + path, { headers: { host } });
  try {
    for (const page of ['/', '/courtyard.html']) {
      const response = await request(page);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('x-robots-tag'), 'index, follow');
    }
    for (const page of ['/human.html', '/dyad.html', '/egbe.html', '/synthetic.html']) {
      assert.equal((await request(page)).headers.get('x-robots-tag'), 'noindex, nofollow');
    }
    const sitemap = await request('/sitemap.xml');
    assert.equal(sitemap.status, 200);
    assert.match(await sitemap.text(), /https:\/\/templeofgu.com\/courtyard.html/);
    const robots = await request('/robots.txt');
    assert.match(await robots.text(), /Sitemap: https:\/\/templeofgu.com\/sitemap.xml/);
    assert.equal((await request('/', 'preview.up.railway.app')).headers.get('x-robots-tag'), 'noindex, nofollow');
    assert.equal((await request('/sitemap.xml', 'preview.up.railway.app')).status, 404);
    assert.match(await (await request('/robots.txt', 'preview.up.railway.app')).text(), /Disallow: \//);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
