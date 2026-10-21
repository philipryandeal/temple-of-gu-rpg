import { KORE_INSTRUCTIONS } from './kore-prompt.mjs';
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
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
});
const quota = new Map();
function allowed(ip) {
  const now=Date.now(), entry=quota.get(ip);
  if (quota.size>3000) quota.clear();
  if (!entry || now-entry.at>3600000) {quota.set(ip,{at:now,count:1});return true;}
  if (entry.count>=12)return false;
  entry.count++;return true;
}
async function chatWithKore(req,res,headers) {
 const jsonHeaders={...headers,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'};
 const reply=(status,value)=>{res.writeHead(status,jsonHeaders);res.end(JSON.stringify(value));};
 if(process.env.KORE_CHAT_ENABLED!=='true'||!process.env.OPENAI_API_KEY||!process.env.OPENAI_MODEL){reply(503,{error:'The Oracle chat is not enabled yet.'});return;}
 const ip=String(req.socket.remoteAddress||'unknown');
 if(!allowed(ip)){reply(429,{error:'The Oracle is resting. Please return later.'});return;}
 let raw='',bytes=0;
 try{
  for await (const chunk of req){bytes+=chunk.length;if(bytes>8500){reply(413,{error:'Message too long'});return;}raw+=chunk.toString('utf8');}
  const parsed=JSON.parse(raw);
  const messages=parsed.messages;
  if(!Array.isArray(messages)||messages.length<1||messages.length>10||!messages.every(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string'&&m.content.length>0&&m.content.length<=700)||messages.at(-1).role!=='user') {reply(400,{error:'Invalid conversation'});return;}
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'content-type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:process.env.OPENAI_MODEL,store:false,instructions:KORE_INSTRUCTIONS,input:messages,max_output_tokens:350}),signal:controller.signal});
   if(!response.ok){reply(502,{error:'The Oracle is temporarily unavailable.'});return;}
   const result=await response.json();
   const answer=(result.output||[]).flatMap(o=>(o.content||[]).filter(c=>c.type==='output_text').map(c=>c.text)).join('\n').trim();
   if(!answer){reply(502,{error:'No Guide reply received.'});return;}
   reply(200,{reply:answer.slice(0,2500)});
  }finally{clearTimeout(timeout);}
 }catch{if(!res.headersSent)reply(400,{error:'Unable to process this request.'});}
}
const ASSETS = new Set(['/','/index.html','/kore.html','/human.html','/synthetic.html','/dyad.html','/egbe.html','/roads.json','/style.css','/game.mjs','/casting.mjs','/ui.mjs','/kore-client.mjs','/favicon.ico','/botanica.html','/botanica-ui.mjs','/botanica-data.mjs','/botanica-state.mjs','/botanica-board.png.png','/shrine.html','/shrine-ui.mjs','/shrine-data.mjs','/shrine-state.mjs','/shrine-room-board.png.png','/entrance-scenes.mjs','/courtyard.html','/courtyard.css','/courtyard-ui.mjs','/courtyard-data.mjs','/courtyard-state.mjs','/courtyard.svg','/courtyard-fet-board.png','/magical-tools-and-weapons.html','/the-technomancers-grimoire.html','/rootwork-and-remedies.html','/spells-and-invocations.html']);
const PUBLIC_ORIGIN = 'https://templeofgu.com';
const INDEXABLE = new Set(['/', '/index.html', '/courtyard.html']);
export function makeServer() {
  return http.createServer(async (req, res) => {
    const publicHost = ['templeofgu.com', 'www.templeofgu.com'].includes(String(req.headers.host || '').toLowerCase().split(':')[0]);
    const headers = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"
    };
    if (req.method==='POST' && req.url==='/api/kore') {await chatWithKore(req,res,headers);return;}
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { ...headers, Allow: 'GET, HEAD' }); res.end(); return;
    }
    let pathname;
    try { pathname = new URL(req.url, 'http://localhost').pathname; }
    catch { res.writeHead(400, headers); res.end(); return; }
    if (pathname === '/kore' || pathname === '/kore/') pathname = '/kore.html';
    if (pathname === '/health') {
      res.writeHead(200, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : 'ok'); return;
    }
    if (pathname === '/robots.txt') {
      const text = publicHost
        ? 'User-agent: *\nAllow: /\nSitemap: ' + PUBLIC_ORIGIN + '/sitemap.xml\n'
        : 'User-agent: *\nDisallow: /\n';
      res.writeHead(200, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : text);
      return;
    }
    if (pathname === '/sitemap.xml' && publicHost) {
      const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        '<url><loc>' + PUBLIC_ORIGIN + '/</loc></url>' +
        '<url><loc>' + PUBLIC_ORIGIN + '/courtyard.html</loc></url></urlset>';
      const xmlHeaders = { ...headers, 'Content-Type': 'application/xml; charset=utf-8' };
      delete xmlHeaders['X-Robots-Tag'];
      res.writeHead(200, xmlHeaders);
      res.end(req.method === 'HEAD' ? undefined : xml);
      return;
    }
    // Explicit allowlist prevents serving source code, tests, or dotfiles.
    if (!ASSETS.has(pathname)) { res.writeHead(404, headers); res.end(); return; }
    const filename = pathname === '/' ? 'index.html' : pathname.slice(1);
    const target = resolve(root, filename);
    if (!target.startsWith(resolve(root) + sep)) { res.writeHead(404, headers); res.end(); return; }
    try {
      if (!(await stat(target)).isFile()) throw new Error('not a file');
      const body = await readFile(target);
      const robots = publicHost && INDEXABLE.has(pathname) ? 'index, follow' : 'noindex, nofollow';
      const assetHeaders={...headers,'X-Robots-Tag': robots, 'Content-Type': MIME[extname(target)] ?? 'application/octet-stream'};
      if(pathname==='/kore.html')assetHeaders['Content-Security-Policy'] += '; frame-src https://kore-temple-rpg-production.up.railway.app';
      res.writeHead(200, assetHeaders);
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
