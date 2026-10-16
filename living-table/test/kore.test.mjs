import test from 'node:test';
import assert from 'node:assert/strict';
import {makeServer} from '../server.mjs';
test('Kore chat is closed by default and no key is needed',async()=>{
 const server=makeServer();
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try {
  const response=await fetch('http://127.0.0.1:'+server.address().port+'/api/kore',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:'Hello'}]})});
  assert.equal(response.status,503);assert.match((await response.json()).error,/not enabled/);
 }finally {await new Promise(resolve=>server.close(resolve));}
});
test('server never exposes Kore prompt or source as public asset',async()=>{
 const server=makeServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try {for(const name of ['/kore-prompt.mjs','/server.mjs','/seeker.mjs']){const response=await fetch('http://127.0.0.1:'+server.address().port+name);assert.equal(response.status,404);}}
 finally {await new Promise(resolve=>server.close(resolve));}
});
