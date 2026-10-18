import test from 'node:test';
import assert from 'node:assert/strict';
import {SCENE,ZONES,OBJECTS,SEEKERS} from '../courtyard-data.mjs';
import {initialTable,moveToken,revealClue,recordRoll,parseTable,MAX_SEATS} from '../courtyard-state.mjs';
test('Scene 01 has seven distinct zones, ten inspectable objects, six valid sample seats',()=>{
  assert.equal(SCENE.id,'courtyard-fet');
  assert.equal(ZONES.length,7);
  assert.equal(new Set(ZONES.map(z=>z.id)).size,7);
  assert.equal(OBJECTS.length,10);
  assert.equal(SEEKERS.length,MAX_SEATS);
  assert.equal(new Set(SEEKERS.map(s=>s.id)).size,MAX_SEATS);
});
test('free movement permits positions within the illustrated board',()=>{
  const table=initialTable();
  const moved=moveToken(table,'s1',46.75,78);
  assert.equal(moved.tokens[0].x,46.75);
  assert.equal(table.tokens[0].x,23);
  assert.throws(()=>moveToken(table,'s7',40,45));
  assert.throws(()=>moveToken(table,'s1',500,45));
});
test('original 2d6 + Virtue result cannot be hand-set',()=>{
  const table=recordRoll(initialTable(),'s1','suuru',[3,5]);
  assert.equal(table.rolls[0].total,10);
  assert.equal(table.rolls[0].outcome,'Full success');
  assert.throws(()=>recordRoll(initialTable(),'s1','wrong',[2,3]));
});
test('save round-trip maintains positions, rolls and Guide reveal for local-only table',()=>{
  let t=moveToken(initialTable(),'s3',70,61);
  t=revealClue(t,true);
  t=recordRoll(t,'s3','foriti',[4,2]);
  assert.deepEqual(parseTable(JSON.parse(JSON.stringify(t))),t);
});
test('import rejects forged seats, dice results, unsupported versions and prototype pollution',()=>{
  const t=initialTable();
  assert.throws(()=>parseTable({...t,version:99}));
  assert.throws(()=>parseTable({...t,tokens:[...t.tokens,{id:'s7',x:4,y:5}]}));
  assert.throws(()=>parseTable({...t,rolls:[{id:'s1',virtue:'suuru',dice:[6,6],total:1,outcome:'Lesson deferred'}]}));
  assert.throws(()=>parseTable({...t,tokens:t.tokens.map(x=>({...x,name:'<script>oops</script>'}))}));
});
