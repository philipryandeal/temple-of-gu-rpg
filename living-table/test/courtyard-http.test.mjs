import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {makeServer} from '../server.mjs';
const server=makeServer();
await new Promise(done=>server.listen(0,'127.0.0.1',done));
after(()=>new Promise(done=>server.close(done)));
const root='http://127.0.0.1:'+server.address().port;
test('Courtyard Scene 01 is locally accessible, with separate background and scripted hotspots',async()=>{
 for(const [route,mime] of [['/courtyard.html','text/html'],['/courtyard.css','text/css'],['/courtyard-ui.mjs','text/javascript'],['/courtyard-data.mjs','text/javascript'],['/courtyard-state.mjs','text/javascript'],['/courtyard.svg','image/svg+xml'],['/courtyard-fet-board.png','image/png']]){
  const response=await fetch(root+route);
  assert.equal(response.status,200,route);
  assert.ok((response.headers.get('content-type')||'').startsWith(mime),route);
  assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
 }
 const html=await(await fetch(root+'/courtyard.html')).text();
 assert.match(html,/courtyard-fet-board\.png/);
 assert.match(html,/id="tokens"/);
 assert.match(html,/id="roll"/);
 assert.match(html,/id="export"/);
 assert.match(html,/id="field-journal-notes"/);
 assert.match(html,/id="journal-status"/);
});
test('The new Courtyard scene art is a real high-resolution 4:3 PNG',async()=>{
 const response=await fetch(root+'/courtyard-fet-board.png');
 assert.equal(response.status,200);
 assert.match(response.headers.get('content-type')||'',/image\/png/);
 const image=Buffer.from(await response.arrayBuffer());
 assert.ok(image.length>100_000,'nonempty illustrated asset');
 assert.equal(image.subarray(0,8).toString('hex'),'89504e470d0a1a0a','PNG signature');
 const width=image.readUInt32BE(16),height=image.readUInt32BE(20);
 assert.ok(width>=1000&&height>=750,'full-resolution playable board');
 assert.equal(width*3,height*4,'board artwork matches the 4:3 play surface');
});
test('No server-side session writes or unlisted source exposure',async()=>{
 assert.equal((await fetch(root+'/api/sessions',{method:'POST',headers:{'content-type':'application/json'},body:'{}'})).status,405);
 assert.equal((await fetch(root+'/courtyard-secrets.json')).status,404);
 assert.equal((await fetch(root+'/seeker.mjs')).status,404);
});

test('Field Journal sits below the board, has a generous writing area and is not submitted to a server',async()=>{
 const html=await(await fetch(root+'/courtyard.html')).text();
 const css=await(await fetch(root+'/courtyard.css')).text();
 const ui=await(await fetch(root+'/courtyard-ui.mjs')).text();
 assert.ok(html.indexOf('id="frame"')<html.indexOf('id="field-journal-notes"'));
 assert.match(html,/rows="14"/);
 assert.match(css,/min-height:\s*340px/);
 assert.match(css,/height:\s*clamp\(340px,\s*44vh,\s*560px\)/);
 assert.match(ui,/localStorage\.setItem\(JOURNAL_KEY,table\.journal\)/);
 assert.match(ui,/restoreJournalFromBrowser\(\)/);
 assert.match(ui,/saveJournalInBrowser\(\)/);
 assert.ok(!html.includes('action="/api/'));
});

test('scene masthead reserves room for the playfield and moves entrance navigation to the footer',async()=>{
 const html=await(await fetch(root+'/courtyard.html')).text();
 const css=await(await fetch(root+'/courtyard.css')).text();
 const header=html.split('<header class="mast">')[1]?.split('</header>')[0];
 const footer=html.split('<footer>')[1]?.split('</footer>')[0];
 assert.ok(header);
 assert.ok(footer);
 assert.match(header,/<h1>Scene 01: The Courtyard Fèt<\/h1>/);
 assert.ok(!header.includes('Choose a scene'));
 assert.ok(!header.includes('GU UNIVERSE'));
 assert.ok(!header.includes('One board'));
 assert.ok(!header.includes('<p'));
 for(const control of ['id="reset"','id="export"','id="import"']) assert.ok(header.includes(control),control);
 assert.ok(footer.includes('href="./index.html"'));
 assert.ok(footer.includes('Choose a scene'));
 assert.match(css,/\.mast h1\s*\{[^}]*font-size:\s*clamp\(1\.45rem,\s*2\.4vw,\s*2\.2rem\)/);
});
