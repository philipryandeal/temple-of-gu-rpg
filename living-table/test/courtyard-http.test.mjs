import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {makeServer} from '../server.mjs';
const server=makeServer();
await new Promise(done=>server.listen(0,'127.0.0.1',done));
after(()=>new Promise(done=>server.close(done)));
const root='http://127.0.0.1:'+server.address().port;
test('Courtyard Scene 01 is locally accessible, with separate background and scripted hotspots',async()=>{
 for(const [route,mime] of [['/courtyard.html','text/html'],['/courtyard.css','text/css'],['/courtyard-ui.mjs','text/javascript'],['/courtyard-data.mjs','text/javascript'],['/courtyard-state.mjs','text/javascript'],['/courtyard.svg','image/svg+xml']]){
  const response=await fetch(root+route);
  assert.equal(response.status,200,route);
  assert.ok((response.headers.get('content-type')||'').startsWith(mime),route);
  assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
 }
 const html=await(await fetch(root+'/courtyard.html')).text();
 assert.match(html,/courtyard.svg/);
 assert.match(html,/id="tokens"/);
 assert.match(html,/id="roll"/);
 assert.match(html,/id="export"/);
});
test('No server-side session writes or unlisted source exposure',async()=>{
 assert.equal((await fetch(root+'/api/sessions',{method:'POST',headers:{'content-type':'application/json'},body:'{}'})).status,405);
 assert.equal((await fetch(root+'/courtyard-secrets.json')).status,404);
});
