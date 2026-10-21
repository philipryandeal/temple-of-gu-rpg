import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=f=>readFile(new URL('../'+f,import.meta.url),'utf8');
const lum=h=>{const [r,g,b]=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4);return 0.2126*r+0.7152*g+0.0722*b;};
const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05);};
const rule=(css,sel)=>{const i=css.indexOf(sel+' {')>=0?css.indexOf(sel+' {'):css.indexOf(sel+'{');assert.ok(i>=0,sel);return css.slice(i,css.indexOf('}',i));};
test('orange buttons use light text as WCAG large text (>=3:1)',async()=>{
  const style=await read('style.css'),cy=await read('courtyard.css');
  const v=Object.fromEntries([...style.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(m=>[m[1],m[2]]));
  const r=ratio(v['temple-text'],v['temple-accent']);
  assert.ok(r>=3,`light on orange ${r.toFixed(2)}`);
  for(const [css,sel] of [[style,'.enter-button'],[cy,'.primary']]){
    const body=rule(css,sel);
    assert.match(body,/color: var\(--temple-text\)/,sel);
    assert.match(body,/font-size: 1\.1875rem/,sel+' is >=18.66px');
    assert.match(body,/font-weight: (700|750|800|900)/,sel+' is bold');
  }
  assert.match(style,/\.kore-entry\{[^}]*color:var\(--temple-text\)!important/);
  assert.match(rule(cy,'.token.selected'),/color: var\(--temple-text\)/);
  assert.doesNotMatch(cy+style,/color: var\(--temple-panel\)/,'no dark button text left');
});
test('Import session stays keyboard-reachable with a visible focus ring',async()=>{
  const cy=await read('courtyard.css');
  assert.doesNotMatch(cy,/\.file-action input \{ display: none; \}/);
  assert.match(cy,/\.file-action input \{ position: absolute; inset: 0;[^}]*opacity: 0;/);
  assert.match(cy,/\.file-action:focus-within \{ outline: 3px solid var\(--temple-accent\)/);
  for(const f of ['courtyard.html','shrine.html','botanica.html'])assert.match(await read(f),/<label class="file-action">Import session<input id="import" type="file"/,f);
});
