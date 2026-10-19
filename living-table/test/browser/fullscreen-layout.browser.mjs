// Optional headless-Chrome layout check (not part of `npm test`; needs puppeteer-core and Chrome).
// Usage: start `npm start`, then: CHROME=/path/to/chrome BASE=http://127.0.0.1:3000 node test/browser/fullscreen-layout.browser.mjs
// Checks, at phone and desktop sizes, in normal view, real fullscreen and the CSS fallback:
//  - no hotspot is covered by the Fullscreen button or the Scene Journal (even after Supply Table fills it),
//  - every hotspot centre still hits its own hotspot,
//  - in fullscreen/fallback, Tab never leaves the frame (background is inert), and exiting restores it.
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let puppeteer;try{puppeteer=require('puppeteer-core');}catch{console.log('SKIP: puppeteer-core not installed');process.exit(0);}
const BASE=process.env.BASE||'http://127.0.0.1:3000';
const sizes=[[390,844,'phone portrait'],[844,390,'phone landscape'],[1366,768,'laptop'],[1920,1080,'desktop']];
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});
let failures=0;const fail=m=>{failures++;console.log('FAIL',m);};
for(const mode of ['normal','native','fallback'])for(const [w,h,label] of sizes){
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  if(mode==='fallback')await page.evaluateOnNewDocument(()=>{delete Element.prototype.requestFullscreen;Object.defineProperty(Document.prototype,'fullscreenEnabled',{get:()=>false});});
  await page.setViewport({width:w,height:h,isMobile:w<600,hasTouch:w<600});
  await page.goto(BASE+'/courtyard.html',{waitUntil:'networkidle0'});
  if(mode!=='normal'){await page.click('#fullscreen-toggle');await new Promise(r=>setTimeout(r,400));}
  // Fill the Scene Journal with the Supply Table's objects (the largest panel).
  await page.evaluate(()=>[...document.querySelectorAll('#zones button')].find(b=>b.title==='Supply Table').click());
  await new Promise(r=>setTimeout(r,150));
  const result=await page.evaluate(()=>{
    const r=e=>e.getBoundingClientRect();const hit=(a,b)=>a.left<b.right&&b.left<a.right&&a.top<b.bottom&&b.top<a.bottom;
    const cover=[document.querySelector('#fullscreen-toggle'),document.querySelector('#scene-panel')].filter(e=>{const x=r(e);return x.width>0&&x.height>0;});
    const spots=[...document.querySelectorAll('#zones button')];
    const overlaps=[];const blocked=[];
    for(const s of spots){const sr=r(s);
      for(const c of cover)if(hit(sr,r(c)))overlaps.push(s.title+' × '+(c.id));
      const cx=sr.left+sr.width/2,cy=sr.top+sr.height/2;
      if(cx>=0&&cy>=0&&cx<innerWidth&&cy<innerHeight){const el=document.elementFromPoint(cx,cy);if(!(el===s||s.contains(el)))blocked.push(s.title+' -> '+(el?.id||el?.className||el?.tagName));}
    }
    return {overlaps,blocked,immersive:!!document.fullscreenElement||document.querySelector('#frame').classList.contains('is-pseudo-fullscreen')};
  });
  if(result.overlaps.length)fail(`${mode} ${label}: overlap ${result.overlaps.join(', ')}`);
  if(result.blocked.length)fail(`${mode} ${label}: blocked ${result.blocked.join(', ')}`);
  if(mode!=='normal'){
    if(!result.immersive)fail(`${mode} ${label}: did not enter immersive view`);
    let escaped=null;
    for(let i=0;i<40;i++){await page.keyboard.press('Tab');const inside=await page.evaluate(()=>{const a=document.activeElement;return a===document.body||document.querySelector('#frame').contains(a)?null:(a.id||a.tagName);});if(inside){escaped=inside;break;}}
    if(escaped)fail(`${mode} ${label}: Tab reached hidden ${escaped}`);
    await page.click('#fullscreen-toggle');await new Promise(r=>setTimeout(r,400));
    const after=await page.evaluate(()=>({inert:document.querySelectorAll('[inert]').length,panel:document.querySelector('#scene-panel').parentElement.className,immersive:!!document.fullscreenElement||document.querySelector('#frame').classList.contains('is-pseudo-fullscreen')}));
    if(after.inert||after.immersive||after.panel!=='sidebar')fail(`${mode} ${label}: exit did not restore ${JSON.stringify(after)}`);
  }
  if(errors.length)fail(`${mode} ${label}: console ${errors.join(' | ')}`);
  console.log(`ok ${mode} ${label} (${w}x${h})`);
  await page.close();
}
await browser.close();
console.log(failures?`${failures} failure(s)`:'all layout checks passed');process.exit(failures?1:0);
