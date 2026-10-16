import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateLesson, outcomeFor, STARTING_SCORES } from '../casting.mjs';
test('starting scores match published +2 +1 +1 +0',()=>assert.deepEqual([...STARTING_SCORES],[0,1,1,2]));
test('published 2d6 outcomes use 6 / 7–9 / 10 thresholds',()=>{assert.equal(outcomeFor(6),'Lesson deferred');assert.match(outcomeFor(7),/Success with cost/);assert.match(outcomeFor(9),/Success with cost/);assert.equal(outcomeFor(10),'Full success');});
test('two dice and selected virtue make total',()=>assert.deepEqual(evaluateLesson([4,5],'oye',1),{dice:[4,5],virtue:'oye',modifier:1,total:10,outcome:'Full success'}));
test('reject impossible dice and virtue inputs',()=>{assert.throws(()=>evaluateLesson([0,6],'iwa',0));assert.throws(()=>evaluateLesson([1,7],'iwa',0));assert.throws(()=>evaluateLesson([1,2],'fake',0));assert.throws(()=>evaluateLesson([1,2],'iwa',9));});
