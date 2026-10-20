import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=f=>readFile(new URL('../'+f,import.meta.url),'utf8');
const lum=h=>{const [r,g,b]=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4);return 0.2126*r+0.7152*g+0.0722*b;};
const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
test('fullscreen has a focusable button inside the frame, a CSS fallback and an in-frame Scene Journal',async()=>{
  const html=await read('courtyard.html'),ui=await read('courtyard-ui.mjs'),css=await read('courtyard.css');
  const frame=html.slice(html.indexOf('id="frame"'),html.indexOf('<div class="movement">'));
  assert.match(frame,/<div class="frame-bar" id="frame-bar"><button type="button" id="fullscreen-toggle"[^>]*aria-pressed="false">Fullscreen<\/button><\/div>/);
  assert.match(html,/<section class="panel" id="scene-panel">/);
  assert.match(ui,/setPseudoFullscreen\(true\)/);
  assert.match(ui,/event\.key === 'Escape' && pseudoFullscreen/);
  assert.match(ui,/frameBar\.append\(scenePanel\)/);
  assert.doesNotMatch(ui,/window\.alert\('Fullscreen is unavailable/);
  assert.match(css,/\.board-frame\.is-pseudo-fullscreen \{ position: fixed; inset: 0;/);
  assert.match(css,/grid-template-columns: minmax\(0, 1fr\) minmax\(15rem, 22rem\)/);
  assert.match(css,/\.board-frame:fullscreen #scene-panel, \.board-frame\.is-pseudo-fullscreen #scene-panel \{ margin: 0; \}/);
});
test('Kore kicker text meets 4.5:1 on its panel',async()=>{
  const css=await read('style.css');
  const vars=Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(m=>[m[1],m[2]]));
  const color=css.match(/\.kore-kicker\{color:var\(--([a-z-]+)\)/)[1];
  assert.ok(ratio(vars[color],vars['temple-panel'])>=4.5,`${vars[color]} on ${vars['temple-panel']}`);
});

test('the Fullscreen button and Scene Journal never sit on the map; background goes inert while immersive',async()=>{
  const html=await read('courtyard.html'),ui=await read('courtyard-ui.mjs'),css=await read('courtyard.css');
  const board=html.slice(html.indexOf('id="board"'),html.indexOf('id="frame-bar"'));
  assert.doesNotMatch(board,/fullscreen-toggle|scene-panel/,'controls are outside the board element');
  // Neither control is absolutely positioned over the map any more.
  assert.doesNotMatch(css,/\.fullscreen-toggle \{[^}]*position: absolute/);
  assert.doesNotMatch(css,/#scene-panel \{[^}]*position: absolute/);
  assert.match(ui,/function setBackgroundInert\(on\)/);
  assert.match(ui,/sibling\.inert = true/);
  assert.match(ui,/setBackgroundInert\(immersive\)/);
  assert.match(ui,/inertMarked\.pop\(\)\.inert = false/);
});
