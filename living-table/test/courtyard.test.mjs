import test from 'node:test';
import assert from 'node:assert/strict';
import {SCENE,ZONES,OBJECTS,SEEKERS} from '../courtyard-data.mjs';
import {initialTable,moveToken,recordRoll,parseTable,resizeTable,setJournal,MAX_JOURNAL_LENGTH,MAX_SEATS} from '../courtyard-state.mjs';
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
test('save round-trip maintains positions and rolls without the retired Guide reveal',()=>{
  let t=moveToken(initialTable(),'s3',70,61);
  t=recordRoll(t,'s3','foriti',[4,2]);
  assert.deepEqual(parseTable(JSON.parse(JSON.stringify(t))),t);
  assert.ok(!Object.hasOwn(t,'revealed'));
});
test('old sessions with a Guide reveal flag import without restoring retired UI state',()=>{
  const t=recordRoll(setJournal(initialTable(2),'Clues from the Fèt'),'s1','suuru',[3,5]);
  for (const revealed of [true,false]) {
    const restored=parseTable({...t,revealed});
    assert.deepEqual(restored,t);
    assert.equal(restored.journal,'Clues from the Fèt');
    assert.equal(restored.rolls.length,1);
  }
  assert.throws(()=>parseTable({...t,revealed:'yes'}),/clue flag/);
});
test('import rejects forged seats, dice results, unsupported versions and prototype pollution',()=>{
  const t=initialTable();
  assert.throws(()=>parseTable({...t,version:99}));
  assert.throws(()=>parseTable({...t,tokens:[...t.tokens,{id:'s7',x:4,y:5}]}));
  assert.throws(()=>parseTable({...t,rolls:[{id:'s1',virtue:'suuru',dice:[6,6],total:1,outcome:'Lesson deferred'}]}));
  assert.throws(()=>parseTable({...t,tokens:t.tokens.map(x=>({...x,name:'<script>oops</script>'}))}));
});

test('Field Journal accepts two paragraphs and survives export and import without changing rolls',()=>{
  const notes='First paragraph: I heard a bell near the altar.\n\nSecond paragraph: The musicians heard a different bell.';
  let t=setJournal(initialTable(),notes);
  t=recordRoll(t,'s1','suuru',[4,5]);
  assert.deepEqual(parseTable(JSON.parse(JSON.stringify(t))),t);
  assert.equal(t.journal,notes);
  assert.equal(initialTable().journal,'');
});
test('Field Journal text is validated; old saves without journal remain importable',()=>{
  const original=initialTable();
  const legacy={...original};delete legacy.journal;
  assert.equal(parseTable(legacy).journal,'');
  assert.throws(()=>setJournal(original,42),/Journal/);
  assert.throws(()=>setJournal(original,'x'.repeat(MAX_JOURNAL_LENGTH+1)),/Journal/);
  assert.throws(()=>parseTable({...original,journal:['malformed']}),/journal/);
  assert.throws(()=>parseTable({...original,journal:'x'.repeat(MAX_JOURNAL_LENGTH+1)}),/journal/);
  assert.equal(setJournal(original,'<script>alert(1)</script>').journal,'<script>alert(1)</script>');
});

test('personal tabletop starts with 1, 3 or 6 demo pieces and rejects unsupported counts',async()=>{
 for(const count of [1,3,6]){
  const t=initialTable(count);
  assert.equal(t.tokens.length,count);
  assert.deepEqual(parseTable(JSON.parse(JSON.stringify(t))),t);
 }
 for(const count of [0,7,2.5,NaN,'3']) assert.throws(()=>initialTable(count));
 const solo=initialTable(1);
 assert.throws(()=>moveToken(solo,'s2',40,40),'non-participating marker cannot move');
 assert.throws(()=>recordRoll(solo,'s2','suuru',[2,3]));
 assert.throws(()=>parseTable({...solo,tokens:[SEEKERS[1]]}),/token/i);
});
test('resizing local tabletop keeps notes and active token locations; removed players cannot roll',async()=>{
 let t=setJournal(initialTable(3),'Our adventure begins.');
 t=moveToken(t,'s2',40,45);
 t=recordRoll(t,'s2','oye',[4,3]);
 t=resizeTable(t,1);
 assert.equal(t.tokens.length,1);
 assert.equal(t.journal,'Our adventure begins.');
 assert.equal(t.rolls.length,0);
 t=resizeTable(t,3);
 assert.equal(t.tokens.length,3);
 assert.equal(t.journal,'Our adventure begins.');
 assert.equal(t.tokens[0].id,'s1');
 assert.throws(()=>resizeTable(t,8));
});
