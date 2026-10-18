import test from 'node:test';
import assert from 'node:assert/strict';
import {ZONES,SOLO_CHOICES} from '../courtyard-data.mjs';
test('every solo choice opens a matching Courtyard zone',()=>{
  const zoneIds=new Set(ZONES.map(z=>z.id));
  for(const choice of SOLO_CHOICES) assert.ok(zoneIds.has(choice.id),`choice "${choice.label}" has id ${choice.id} with no matching zone`);
  assert.equal(SOLO_CHOICES.find(c=>c.label==='Join the gathering').id,'gathering');
});
