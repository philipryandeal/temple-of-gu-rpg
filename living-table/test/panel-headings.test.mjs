import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('scene side-panel headings carry no leading numbers',async()=>{
  for(const f of ['courtyard.html','shrine.html','botanica.html']){
    const html=await readFile(new URL('../'+f,import.meta.url),'utf8');
    assert.match(html,/id="seekers-heading">YOUR SEEKERS</,f);
    assert.match(html,/id="dice-heading">THE SEEKER'S DICE</,f);
    assert.doesNotMatch(html,/class="eyebrow"[^>]*>\s*\d+\.\s/,f);
  }
});
