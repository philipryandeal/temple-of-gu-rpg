import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SCENE,ZONES,OBJECTS,SOLO_CHOICES} from '../botanica-data.mjs';
import {initialTable,parseTable,setJournal,resizeTable,recordRoll} from '../botanica-state.mjs';
import {makeServer} from '../server.mjs';
test('Botanica data has seven interactive areas and supported objects',()=>{
 assert.equal(SCENE.id,'botanica');assert.equal(ZONES.length,7);
 const ids=new Set(ZONES.map(z=>z.id)), objects=new Set(OBJECTS.map(o=>o.id));
 for(const z of ZONES){assert.ok(z.x>=2&&z.x<=98&&z.y>=2&&z.y<=98);for(const id of z.objects)assert.ok(objects.has(id));}
 for(const choice of SOLO_CHOICES)assert.ok(ids.has(choice.id));
 assert.ok(ZONES.some(z=>z.title==='Puerto Rican Flag'));
});
test('Botanica sessions are separate from Courtyard and Shrine sessions',()=>{
 const t=setJournal(resizeTable(initialTable(1),3),'Botanica notes.');
 assert.equal(parseTable(JSON.parse(JSON.stringify(t))).journal,'Botanica notes.');
 for(const scene of ['courtyard-fet','shrine-room'])assert.throws(()=>parseTable({...t,scene}));
 assert.equal(recordRoll(t,'s1','suuru',[3,4],2).rolls[0].total,9);
});
test('Botanica uses the existing tabletop and gets its own journal',async()=>{
 const html=await readFile(new URL('../botanica.html',import.meta.url),'utf8');
 const ui=await readFile(new URL('../botanica-ui.mjs',import.meta.url),'utf8');
 assert.match(html,/Scene 03: The Botanica/);
 assert.match(html,/botanica-board.png/);
 assert.match(html,/id="tokens"/);
 assert.match(html,/id="field-journal-notes"/);
 assert.match(ui,/gu-rpg:scene03:field-journal:v1/);
 assert.match(ui,/gu-scene03-session.json/);
});
test('Botanica art and scripts are served but test code is not',async()=>{
 const server=makeServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{const base='http://127.0.0.1:'+server.address().port;
  for(const path of ['/botanica.html','/botanica-ui.mjs','/botanica-data.mjs','/botanica-state.mjs','/botanica-board.png'])assert.equal((await fetch(base+path)).status,200,path);
  assert.equal((await fetch(base+'/test/botanica.test.mjs')).status,404);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
