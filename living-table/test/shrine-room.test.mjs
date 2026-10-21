import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SCENE,ZONES,OBJECTS,SOLO_CHOICES} from '../shrine-data.mjs';
import {initialTable,parseTable,setJournal,resizeTable,recordRoll} from '../shrine-state.mjs';
import {makeServer} from '../server.mjs';
const read=path=>readFile(new URL(path,import.meta.url),'utf8');

test('Shrine has seven inspectable zones with valid linked objects and exploration prompts',()=>{
 assert.equal(SCENE.id,'shrine-room');assert.equal(ZONES.length,7);
 const ids=new Set(ZONES.map(z=>z.id)),objects=new Set(OBJECTS.map(o=>o.id));
 for(const z of ZONES){assert.ok(z.x>=2&&z.x<=98&&z.y>=2&&z.y<=98);for(const obj of z.objects)assert.ok(objects.has(obj));}
 for(const choice of SOLO_CHOICES)assert.ok(ids.has(choice.id));
});
test('scene 02 exports and imports independently without accepting scene 01 saves',()=>{
 const source=setJournal(resizeTable(initialTable(1),3),'Shrine notes stay here.');
 const saved=parseTable(JSON.parse(JSON.stringify(source)));
 assert.equal(saved.journal,'Shrine notes stay here.');assert.equal(saved.tokens.length,3);
 assert.throws(()=>parseTable({...source,scene:'courtyard-fet'}));
 assert.equal(recordRoll(source,'s1','suuru',[3,4],2).rolls[0].total,9);
});
test('entrance routes the enabled shrine choice, with scene 01 preserved',async()=>{
 const html=await read('../index.html'), script=await read('../entrance-scenes.mjs');
 assert.match(html,/<option value="shrine-room">02/);
 assert.match(html,/<option value="courtyard-fet" selected>/);
 assert.match(script,/'shrine-room':'\.\/shrine.html'/);
 assert.match(script,/'courtyard-fet':'\.\/courtyard.html'/);
 const shrine=await read('../shrine.html');
 assert.match(shrine,/Scene 02: The Shrine Room/);
 assert.match(shrine,/shrine-room-board\.png\.png/);
 assert.match(shrine,/shrine-ui\.mjs/);
 const ui=await read('../shrine-ui.mjs');
 assert.match(ui,/gu-rpg:scene02:field-journal:v1/);
 assert.match(ui,/gu-scene02-session\.json/);
});
test('server serves shrine and its art while keeping source files private',async()=>{
 const server=makeServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const base='http://127.0.0.1:'+server.address().port;
  for(const route of ['/shrine.html','/shrine-ui.mjs','/shrine-state.mjs','/shrine-data.mjs','/shrine-room-board.png.png','/entrance-scenes.mjs']){
   const res=await fetch(base+route);assert.equal(res.status,200,route);
  }
  assert.equal((await fetch(base+'/test/shrine-room.test.mjs')).status,404);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
