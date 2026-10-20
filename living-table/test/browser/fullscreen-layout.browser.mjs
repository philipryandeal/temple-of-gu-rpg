// Optional headless-Chrome layout check (not part of `npm test`; needs puppeteer-core and Chrome).
// Usage: start `npm start`, then: CHROME=/path/to/chrome BASE=http://127.0.0.1:3000 node test/browser/fullscreen-layout.browser.mjs
// At phone and desktop sizes, in normal view, real fullscreen and the CSS fallback, checks that:
//  - there is no Fullscreen/Exit fullscreen button and the frame has no empty bar below the map,
//  - hotspots sit at their data coordinates on the 4:3 board,
//  - double-click (desktop) / double-tap (touch) enters and exits; Escape exits the fallback,
//  - the Scene Journal never covers a hotspot (even when the Supply Table fills it),
//  - while immersive, Tab never leaves the frame (inert background), and exiting restores everything.
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let puppeteer;try{puppeteer=require('puppeteer-core');}catch{console.log('SKIP: puppeteer-core not installed');process.exit(0);}
const BASE=process.env.BASE||'http://127.0.0.1:3000';
const sizes=[[390,844,'phone portrait'],[844,390,'phone landscape'],[1366,768,'laptop'],[1920,1080,'desktop']];
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});
let failures=0;const fail=m=>{failures++;console.log('FAIL',m);};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
// A spot on the bare board (no hotspot or token) to double-click / double-tap.
const bareSpot=page=>page.evaluate(()=>{
  document.querySelector('#board').scrollIntoView({block:'start'});
  const b=document.querySelector('#board').getBoundingClientRect();
  for(const [fx,fy] of [[.35,.3],[.65,.3],[.35,.2],[.6,.6],[.3,.6],[.4,.85]]){
    const x=b.left+b.width*fx,y=b.top+b.height*fy;if(y<=0||y>=innerHeight)continue;const el=document.elementFromPoint(x,y);
    if(el&&(el.id==='board'||el.id==='zones'||el.id==='tokens'||el.tagName==='IMG'))return {x,y};
  }
  return {x:b.left+b.width*.35,y:b.top+b.height*.3};
});
async function toggle(page,touch){
  const {x,y}=await bareSpot(page);
  if(touch){
    const c=await page.target().createCDPSession();
    for(let i=0;i<2;i++){await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(120);}
  }else{await page.mouse.click(x,y,{count:2});}
  await wait(450);
}
const immersive=page=>page.evaluate(()=>!!document.fullscreenElement||document.querySelector('#frame').classList.contains('is-pseudo-fullscreen'));
for(const mode of ['normal','native','fallback'])for(const [w,h,label] of sizes){
  const touch=w<600;const page=await browser.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  if(mode==='fallback')await page.evaluateOnNewDocument(()=>{delete Element.prototype.requestFullscreen;Object.defineProperty(Document.prototype,'fullscreenEnabled',{get:()=>false});});
  await page.setViewport({width:w,height:h,isMobile:touch,hasTouch:touch});
  await page.goto(BASE+'/courtyard.html',{waitUntil:'networkidle0'});
  const base=await page.evaluate(()=>{
    const R=e=>e.getBoundingClientRect();const frame=document.querySelector('#frame'),board=document.querySelector('#board');
    const fr=R(frame),br=R(board),bw=parseFloat(getComputedStyle(frame).borderTopWidth)+parseFloat(getComputedStyle(frame).borderBottomWidth);
    const buttons=[...document.querySelectorAll('button')].filter(b=>/full\s*screen/i.test(b.textContent+b.getAttribute('aria-label')));
    return {buttons:buttons.length,gap:Math.round(fr.height-br.height-bw),ratio:+(br.width/br.height).toFixed(3)};
  });
  if(base.buttons)fail(`${mode} ${label}: ${base.buttons} fullscreen button(s) present`);
  if(Math.abs(base.gap)>1)fail(`${mode} ${label}: ${base.gap}px of empty frame below the map`);
  if(Math.abs(base.ratio-1.333)>0.01)fail(`${mode} ${label}: board ratio ${base.ratio}`);
  if(mode!=='normal'){await toggle(page,touch);if(!(await immersive(page)))fail(`${mode} ${label}: double-${touch?'tap':'click'} did not enter`);}
  await page.evaluate(()=>[...document.querySelectorAll('#zones button')].find(b=>b.title==='Supply Table').click());
  await wait(150);
  const result=await page.evaluate(async()=>{
    const {ZONES}=await import('./courtyard-data.mjs');
    const r=e=>e.getBoundingClientRect();const hit=(a,b)=>a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom;
    const br=r(document.querySelector('#board'));const panel=document.querySelector('#scene-panel');const pr=r(panel);
    const overlaps=[],blocked=[],misaligned=[];
    for(const s of document.querySelectorAll('#zones button')){
      const sr=r(s),cx=sr.left+sr.width/2,cy=sr.top+sr.height/2;
      const z=ZONES.find(z=>z.title===s.title);
      if(z&&(Math.abs((cx-br.left)/br.width*100-z.x)>0.6||Math.abs((cy-br.top)/br.height*100-z.y)>0.6))misaligned.push(s.title);
      if(pr.width>0&&hit(sr,pr))overlaps.push(s.title);
      if(cx>=0&&cy>=0&&cx<innerWidth&&cy<innerHeight){const el=document.elementFromPoint(cx,cy);if(!(el===s||s.contains(el)))blocked.push(s.title+' -> '+(el?.id||el?.className||el?.tagName));}
    }
    return {overlaps,blocked,misaligned,panelIn:panel.parentElement.id};
  });
  if(result.misaligned.length)fail(`${mode} ${label}: misaligned ${result.misaligned.join(', ')}`);
  if(result.overlaps.length)fail(`${mode} ${label}: panel covers ${result.overlaps.join(', ')}`);
  if(result.blocked.length)fail(`${mode} ${label}: blocked ${result.blocked.join(', ')}`);
  if(mode!=='normal'){
    if(result.panelIn!=='frame-bar')fail(`${mode} ${label}: Scene Journal not in the frame`);
    let escaped=null;
    for(let i=0;i<40;i++){await page.keyboard.press('Tab');const out=await page.evaluate(()=>{const a=document.activeElement;return a===document.body||document.querySelector('#frame').contains(a)?null:(a.id||a.tagName);});if(out){escaped=out;break;}}
    if(escaped)fail(`${mode} ${label}: Tab reached hidden ${escaped}`);
    if(mode==='fallback'){await page.keyboard.press('Escape');await wait(200);if(await immersive(page))fail(`${mode} ${label}: Escape did not exit`);await toggle(page,touch);if(!(await immersive(page)))fail(`${mode} ${label}: re-enter failed`);}
    await toggle(page,touch);
    const after=await page.evaluate(()=>({inert:document.querySelectorAll('[inert]').length,panel:document.querySelector('#scene-panel').parentElement.className,immersive:!!document.fullscreenElement||document.querySelector('#frame').classList.contains('is-pseudo-fullscreen')}));
    if(after.inert||after.immersive||after.panel!=='sidebar')fail(`${mode} ${label}: double-${touch?'tap':'click'} exit did not restore ${JSON.stringify(after)}`);
  }
  if(errors.length)fail(`${mode} ${label}: console ${errors.join(' | ')}`);
  console.log(`ok ${mode} ${label} (${w}x${h})`);
  await page.close();
}
await browser.close();
console.log(failures?`${failures} failure(s)`:'all layout checks passed');process.exit(failures?1:0);
