import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { makeServer } from '../server.mjs';

function get(port, path, hostname='templeofgu.com') {
  return new Promise((resolve, reject) => {
    const request = http.get({
      hostname: '127.0.0.1', port, path, headers: { Host: hostname }
    }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('error', reject);
      response.on('end', () => resolve({
        status: response.statusCode,
        headers: response.headers,
        body: Buffer.concat(chunks).toString('utf8')
      }));
    });
    request.on('error', reject);
  });
}

test('production indexes its two finished pages and exposes its sitemap', async () => {
  const server = makeServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  try {
    for (const page of ['/', '/courtyard.html']) {
      const response = await get(port, page);
      assert.equal(response.status, 200);
      assert.equal(response.headers['x-robots-tag'], 'index, follow');
    }
    for (const page of ['/human.html', '/synthetic.html', '/dyad.html', '/egbe.html']) {
      assert.equal((await get(port, page)).headers['x-robots-tag'], 'noindex, nofollow');
    }
    const sitemap = await get(port, '/sitemap.xml');
    assert.equal(sitemap.status, 200);
    assert.match(sitemap.body, /https:\/\/templeofgu.com\/courtyard.html/);
    assert.match(sitemap.headers['content-type'], /application\/xml/);
    const robots = await get(port, '/robots.txt');
    assert.match(robots.body, /Sitemap: https:\/\/templeofgu.com\/sitemap.xml/);
    assert.equal((await get(port, '/', 'preview.up.railway.app')).headers['x-robots-tag'], 'noindex, nofollow');
    assert.equal((await get(port, '/sitemap.xml', 'preview.up.railway.app')).status, 404);
    assert.match((await get(port, '/robots.txt', 'preview.up.railway.app')).body, /Disallow: \//);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
