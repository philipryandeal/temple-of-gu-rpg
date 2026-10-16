import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep, extname } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const MIME = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp'
});
const ASSETS = new Set(['/','/index.html','/human.html','/synthetic.html','/dyad.html','/egbe.html','/roads.json','/style.css','/game.mjs','/casting.mjs','/ui.mjs']);
export function makeServer() {
  return http.createServer(async (req, res) => {
    const headers = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'none'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
    };
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { ...headers, Allow: 'GET, HEAD' }); res.end(); return;
    }
    let pathname;
    try { pathname = new URL(req.url, 'http://localhost').pathname; }
    catch { res.writeHead(400, headers); res.end(); return; }
    if (pathname === '/health') {
      res.writeHead(200, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : 'ok'); return;
    }
    // Explicit allowlist prevents serving source code, tests, or dotfiles.
    if (!ASSETS.has(pathname)) { res.writeHead(404, headers); res.end(); return; }
    const filename = pathname === '/' ? 'index.html' : pathname.slice(1);
    const target = resolve(root, filename);
    if (!target.startsWith(resolve(root) + sep)) { res.writeHead(404, headers); res.end(); return; }
    try {
      if (!(await stat(target)).isFile()) throw new Error('not a file');
      const body = await readFile(target);
      res.writeHead(200, { ...headers, 'Content-Type': MIME[extname(target)] ?? 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.writeHead(404, headers); res.end();
    }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid PORT');
  makeServer().listen(port, '0.0.0.0', () => console.log('Living Table listening on ' + port));
}
