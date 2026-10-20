import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('click, pointerdown and drag end put focus back on the selected Seeker (preventScroll)',async()=>{
  const ui=await readFile(new URL('../courtyard-ui.mjs',import.meta.url),'utf8');
  assert.match(ui,/function focusSelected\(\)\{[^}]*\.focus\(\{preventScroll:true\}\)/);
  assert.match(ui,/addEventListener\('click',\(\)=>\{selected=t\.id;renderTokens\(\);renderBonus\(\);focusSelected\(\)\}\)/);
  assert.match(ui,/renderSelection\(\);b\.focus\(\{preventScroll:true\}\);/);
  assert.match(ui,/drag=null;renderTokens\(\);renderBonus\(\);focusSelected\(\);/);
  assert.match(ui,/e\.preventDefault\(\);\s*if\(!stepSelected\(direction\)\)return;\s*focusSelected\(\);/);
});
