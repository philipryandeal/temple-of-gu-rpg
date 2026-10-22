import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {makeServer} from '../server.mjs';
import {SCENES} from '../scene-registry.mjs';
const expected=[["river-crossing","04","The River Crossing","river-crossing-board.png"],["cemetery-gate","05","The Cemetery Gate","cemetery-gate-board.png"],["congo-square","06","Congo Square","congo-square-board.png"],["gran-bwa-forest","07","Gran Bwa Forest","gran-bwa-forest-board.png"],["rada-rainbow-bridge","08","The Rada Rainbow Bridge","rada-rainbow-bridge-board.png"],["living-machines-church","09","The Living Machines Church","living-machines-church-board.png"],["data-forge","10","The Data Forge","data-forge-board.png"]];
test('all seven illustrated rooms are registered with their original PNG names',()=>{
 assert.equal(Object.keys(SCENES).length,7);
 for(const [id,number,name,image] of expected){
  const scene=SCENES[id];assert.ok(scene,id);
  assert.equal(scene.number,number);assert.equal(scene.name,name);assert.equal(scene.image,image);
  assert.equal(scene.zones.length,3);assert.equal(scene.choices.length,3);
  assert.ok(scene.zones.every(z=>z.x>=2&&z.x<=98&&z.y>=2&&z.y<=98));
 }
});
test('seven new rooms share approved template controls and have isolated save names',async()=>{
 const html=await readFile(new URL('../scene.html',import.meta.url),'utf8');
 const ui=await readFile(new URL('../scene-ui.mjs',import.meta.url),'utf8');
 const state=await readFile(new URL('../scene-state.mjs',import.meta.url),'utf8');
 const entrance=await readFile(new URL('../entrance-scenes.mjs',import.meta.url),'utf8');
 for(const id of ['reset','export','import','board','zones','tokens','field-journal-notes','seeker-select','virtue-bonus','roll','solo']){
  assert.ok(html.includes('id="'+id+'"'),'keeps '+id);
 }
 assert.match(html,/courtyard.css/);
 assert.match(html,/scene-ui.mjs/);
 assert.match(ui,/gu-rpg:scene/);
 assert.match(ui,/SCENE.number/);
 assert.match(ui,/parseTable/);
 assert.match(ui,/recordRoll/);
 assert.match(state,/SCENE_ID = SCENE.id/);
 for(const [id] of expected)assert.ok(entrance.includes("'"+id+"':'./scene.html'"),id);
});
test('all seven image assets, HTML and modules serve correctly, private code stays blocked',async()=>{
 const server=makeServer();await new Promise(done=>server.listen(0,'127.0.0.1',done));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  for(const path of ['scene.html','scene-ui.mjs','scene-data.mjs','scene-state.mjs','scene-registry.mjs']){
   const response=await fetch(base+'/'+path);
   assert.equal(response.status,200,path);
  }
  for(const [id,number,name,image] of expected){
   const response=await fetch(base+'/'+image);
   assert.equal(response.status,200,id);
   assert.match(response.headers.get('content-type'),/image\/png/);
   const png=Buffer.from(await response.arrayBuffer());
   assert.ok(png.length>100000,image);
   assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a',image);
   assert.ok(png.readUInt32BE(16)>=1000 && png.readUInt32BE(20)>=750,image);
  }
  assert.equal((await fetch(base+'/server.mjs')).status,404);
  assert.equal((await fetch(base+'/test/illustrated-scenes.test.mjs')).status,404);
 }finally{await new Promise(done=>server.close(done));}
});
