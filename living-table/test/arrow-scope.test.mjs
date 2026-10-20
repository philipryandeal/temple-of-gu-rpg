import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=f=>readFile(new URL('../'+f,import.meta.url),'utf8');
test('arrow keys move a Seeker only from the board or a Seeker, and focus stays on the Seeker',async()=>{
  const ui=await read('courtyard-ui.mjs'),html=await read('courtyard.html');
  assert.match(html,/id="board" tabindex="0"/,'the board can take focus');
  assert.match(ui,/board\.addEventListener\('keydown'/);
  assert.doesNotMatch(ui,/document\.addEventListener\('keydown',e=>\{\s*const direction/,'no page-wide arrow handler');
  assert.match(ui,/if\(target!==board&&!target\?\.closest\?\.\('\.token'\)\)return;/);
  assert.match(ui,/\.focus\(\{preventScroll:true\}\)/);
});
