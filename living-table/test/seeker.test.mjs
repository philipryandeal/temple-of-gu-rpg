import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSeeker,LINEAGES} from '../seeker.mjs';
const example={name:'Amara',lineage:'taino',virtues:{suuru:2,oye:1,foriti:1,iwa:0}};
test('six published lineages',()=>assert.equal(LINEAGES.length,6));
test('accepts published starting modifiers',()=>assert.equal(validateSeeker(example).ok,true));
test('rejects AI-generated invalid scores',()=>assert.equal(validateSeeker({...example,virtues:{suuru:2,oye:2,foriti:1,iwa:0}}).ok,false));
test('rejects unknown lineage and invalid name',()=>{assert.equal(validateSeeker({...example,lineage:'fictional'}).ok,false);assert.equal(validateSeeker({...example,name:''}).ok,false)});
