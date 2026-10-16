import test from 'node:test';
import assert from 'node:assert/strict';
import { SIZE, START, POTO, move, stepToward, canInspect, INSPECTION, focusAfterMovement } from '../game.mjs';
test('starting location is in bounds and outside Poto Mitan',()=>{ assert.ok(START.x>=0&&START.x<SIZE);assert.ok(START.y>=0&&START.y<SIZE);assert.notDeepEqual(START,POTO); });
test('seeker moves one tile',()=>assert.deepEqual(move(START,-1,0),{x:2,y:5}));
test('no diagonal, teleport or invalid movement',()=>{assert.equal(move(START,1,1),START);assert.equal(move(START,0,2),START);});
test('cannot leave grid',()=>assert.deepEqual(move({x:0,y:0},-1,0),{x:0,y:0}));
test('Poto Mitan cannot be crossed',()=>assert.deepEqual(move({x:3,y:4},0,-1),{x:3,y:4}));
test('click destination advances one step rather than teleporting',()=>assert.deepEqual(stepToward(START,6,5),{x:4,y:5}));
test('inspection requires adjacency',()=>{assert.equal(canInspect(START),false);assert.equal(canInspect({x:3,y:4}),true);assert.match(INSPECTION,/Poto Mitan/);});

test('keyboard movement on grid restores focus to moved seeker coordinate',()=>assert.deepEqual(focusAfterMovement(true,{x:2,y:5}),{x:2,y:5}));
test('external movement buttons retain their own focus',()=>assert.equal(focusAfterMovement(false,{x:2,y:5}),null));
