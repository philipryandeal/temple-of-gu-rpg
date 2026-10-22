import {SCENE,ZONES,OBJECTS,SOLO_CHOICES} from './scene-data.mjs';
import {initialTable,resizeTable,moveToken,recordRoll,parseTable,setJournal,getBonus,setBonus} from './scene-state.mjs';
const requestedSeats=new URLSearchParams(location.search).get('seekers');
const startingSeats=/^[1-6]$/.test(requestedSeats??'')?Number(requestedSeats):1;
let table=initialTable(startingSeats),selected='s1',activeZone=null;
const $=s=>document.querySelector(s);
// One familiar interface, different art, copy and local save for every new room.
document.title=SCENE.name+' | Temple of Gu Living Table';
$('#scene-heading').textContent='Scene '+SCENE.number+': '+SCENE.name;
$('#board').setAttribute('aria-label','Illustrated '+SCENE.name+' tabletop, with draggable Seeker tokens and inspectable places');
$('#scene-image').src='./'+SCENE.image;
$('#scene-image').alt='Illustrated overhead '+SCENE.name+' tabletop';
$('#field-journal-title').textContent='Notes from '+SCENE.name;
$('#journal-tag').textContent='SCENE '+SCENE.number;
$('#info-title').textContent='Welcome to '+SCENE.name;
$('#info-body').textContent=SCENE.opening;
$('#solo-intro').textContent='Where will you look next?';
$('#field-journal-notes').placeholder='What happened in '+SCENE.name+'? What will you remember?';
const zones=$('#zones'),tokens=$('#tokens'),select=$('#seeker-select'),bonusInput=$('#virtue-bonus');
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const escText=(node,text)=>{node.textContent=text;};
const journalInput=$('#field-journal-notes'),journalStatus=$('#journal-status');

// Fullscreen changes only the board's presentation. The map, hotspot buttons,
// movable tokens and journal state stay mounted in their original DOM nodes.
const board = $('#board');
const boardFrame = $('#frame');
const isBareBoard = target => target === board || target === zones || target === tokens || target === board.querySelector('img');
const scenePanel = $('#scene-panel');
const frameBar = $('#frame-bar');
const panelHome = {parent: scenePanel.parentNode, next: scenePanel.nextSibling};
let pseudoFullscreen = false;
const nativeFullscreen = () => document.fullscreenElement === boardFrame;
const isImmersive = () => nativeFullscreen() || pseudoFullscreen;
// Keep the Scene Journal (inspection results) visible by moving it into the frame while immersive.
function syncImmersive() {
  const immersive = isImmersive();
  if (immersive && scenePanel.parentNode !== frameBar) frameBar.append(scenePanel);
  if (!immersive && scenePanel.parentNode === frameBar) panelHome.parent.insertBefore(scenePanel, panelHome.next);
  setBackgroundInert(immersive);
}
// While immersive, everything outside the frame is inert, so keyboard focus cannot
// land on hidden controls behind the map. Only elements this code marked are restored.
const inertMarked = [];
function setBackgroundInert(on) {
  if (on && inertMarked.length === 0) {
    for (let node = boardFrame; node && node !== document.body; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling !== node && !sibling.inert && sibling.tagName !== 'SCRIPT') { sibling.inert = true; inertMarked.push(sibling); }
      }
    }
  } else if (!on) {
    while (inertMarked.length) inertMarked.pop().inert = false;
  }
}
function setPseudoFullscreen(on) {
  pseudoFullscreen = on;
  boardFrame.classList.toggle('is-pseudo-fullscreen', on);
  document.body.classList.toggle('has-pseudo-fullscreen', on);
  syncImmersive();
}
function toggleBoardFullscreen() {
  if (pseudoFullscreen) { setPseudoFullscreen(false); return; }
  if (nativeFullscreen()) { Promise.resolve(document.exitFullscreen()).catch(() => {}); return; }
  // Fall back to a CSS full-page view where the Fullscreen API is unavailable (e.g. iPhone Safari).
  if (typeof boardFrame.requestFullscreen !== 'function' || document.fullscreenEnabled === false) { setPseudoFullscreen(true); return; }
  try {
    Promise.resolve(boardFrame.requestFullscreen()).catch(() => setPseudoFullscreen(true));
  } catch {
    setPseudoFullscreen(true);
  }
}
document.addEventListener('fullscreenchange', syncImmersive);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && pseudoFullscreen) setPseudoFullscreen(false); });
// On desktops a normal double-click toggles; individual Seeker/area buttons
// retain their own click interactions rather than swallowing a double-click.
let lastTouchToggle = 0;
board.addEventListener('dblclick', event => {
  if (!isBareBoard(event.target) || Date.now() - lastTouchToggle < 700) return;
  event.preventDefault();
  toggleBoardFullscreen();
});
// Some touch browsers do not synthesize dblclick. Detect a deliberate double
// tap on bare scenery, but not drags or taps on interactive game pieces.
let touchDown = null;
let previousTap = null;
board.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' || !isBareBoard(event.target)) return;
  touchDown = {x:event.clientX, y:event.clientY, id:event.pointerId};
});
board.addEventListener('pointerup', event => {
  if (event.pointerType !== 'touch' || !touchDown || touchDown.id !== event.pointerId) return;
  const moved = Math.hypot(event.clientX-touchDown.x, event.clientY-touchDown.y);
  touchDown = null;
  if (!isBareBoard(event.target) || moved > 18) { previousTap = null; return; }
  const now = Date.now();
  if (previousTap && now-previousTap.at < 400
      && Math.hypot(event.clientX-previousTap.x, event.clientY-previousTap.y) < 32) {
    previousTap = null;
    lastTouchToggle = now;
    toggleBoardFullscreen();
  } else {
    previousTap = {at:now, x:event.clientX, y:event.clientY};
  }
});
board.addEventListener('pointercancel', () => { touchDown = null; previousTap = null; });
const JOURNAL_KEY='gu-rpg:scene'+SCENE.number+':field-journal:v1';
const journalMessage=message=>{if(journalStatus.textContent!==message)escText(journalStatus,message);};
// Device-only storage; writing to the journal never sends notes to the server.
function saveJournalInBrowser() {
 try{
  localStorage.setItem(JOURNAL_KEY,table.journal);
  journalMessage('Saved on this device. Use Export session to keep a backup.');
 }catch{
  journalMessage('Browser storage is unavailable. Export session to keep these notes.');
 }
}
function restoreJournalFromBrowser() {
 try{
  const saved=localStorage.getItem(JOURNAL_KEY);
  if(saved!==null){
   table=setJournal(table,saved);
   journalMessage('Your notes were restored from this browser.');
  }
 }catch{journalMessage('Local notes could not be restored. Use Export session for backups.');}
}
function clearSavedJournal() {
 try{
  localStorage.removeItem(JOURNAL_KEY);
  journalMessage('Journal cleared from this browser.');
 }catch{journalMessage('Could not clear browser storage. This device may still retain older notes.');}
}
journalInput.addEventListener('input',()=>{
 table=setJournal(table,journalInput.value);
 saveJournalInBrowser();
});
for(const zone of ZONES){
 const b=document.createElement('button');b.className='hotspot';b.type='button';
 b.style.left=zone.x+'%';b.style.top=zone.y+'%';b.textContent=zone.id==='poto'?'✦':'i';
 b.setAttribute('aria-label','Inspect '+zone.title);b.title=zone.title;
 b.addEventListener('click',()=>showZone(zone));zones.append(b);
}
function renderSeekerOptions(){
 select.replaceChildren();
 for(const t of table.tokens){const o=document.createElement('option');o.value=t.id;o.textContent=t.name;select.append(o);}
}
function showZone(zone){
 activeZone=zone.id;escText($('#info-title'),zone.title);escText($('#info-body'),zone.description);
 const list=$('#items');list.replaceChildren();
 for(const id of zone.objects){
  const obj=OBJECTS.find(o=>o.id===id);const b=document.createElement('button');
  b.className='object-button';b.textContent='Inspect '+obj.title;
  b.addEventListener('click',()=>{escText($('#info-title'),obj.title);escText($('#info-body'),obj.description);});
  list.append(b);
 }
}
function renderBonus(){
 select.value=selected;
 bonusInput.value=String(getBonus(table,selected,$('#virtue').value));
}
let drag=null;
// Put focus back on the (redrawn) selected Seeker so arrow keys keep working after a click, tap or drag.
function focusSelected(){
 const name=table.tokens.find(t=>t.id===selected)?.name;
 [...tokens.children].find(b=>b.title===name)?.focus({preventScroll:true});
}
function renderTokens(){
 tokens.replaceChildren();
 for(const t of table.tokens){
  const b=document.createElement('button');b.className='token'+(t.id===selected?' selected':'');
  b.style.left=t.x+'%';b.style.top=t.y+'%';
  b.textContent=t.id.slice(1);b.title=t.name;b.setAttribute('aria-label',t.name+'; position '+Math.round(t.x)+', '+Math.round(t.y));
  b.addEventListener('click',()=>{selected=t.id;renderTokens();renderBonus();focusSelected()});
  b.addEventListener('pointerdown',e=>{
   if(e.button!==0)return;e.preventDefault();selected=t.id;drag={id:t.id,pointer:e.pointerId,moved:false};b.setPointerCapture(e.pointerId);
   renderSelection();b.focus({preventScroll:true});
  });
  b.addEventListener('pointermove',e=>{
   if(!drag||drag.id!==t.id||drag.pointer!==e.pointerId)return;
   const rect=$('#board').getBoundingClientRect();
   const x=clamp((e.clientX-rect.left)/rect.width*100,2,98),y=clamp((e.clientY-rect.top)/rect.height*100,2,98);
   table=moveToken(table,t.id,x,y);b.style.left=x+'%';b.style.top=y+'%';drag.moved=true;
  });
  const end=e=>{
   if(!drag||drag.id!==t.id||drag.pointer!==e.pointerId)return;
   drag=null;renderTokens();renderBonus();focusSelected();
  };
  b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end);
  tokens.append(b);
 }
}
function renderSelection(){renderBonus();for(const b of tokens.children)b.classList.toggle('selected',b.title===table.tokens.find(t=>t.id===selected).name);}
function renderHistory(){
 const box=$('#roll-history');box.replaceChildren();
 for(const r of table.rolls.slice(-4).reverse()){
  const p=document.createElement('p');const t=table.tokens.find(t=>t.id===r.id);
  p.textContent=t.name+': '+r.dice.join(' + ')+' + '+(r.bonus??t.virtues[r.virtue])+' ('+r.virtue+') = '+r.total+' · '+r.outcome;box.append(p);
 }
}
function render(){renderSeekerOptions();$('#seat-count').value=String(table.tokens.length);renderTokens();renderBonus();renderHistory();journalInput.value=table.journal;}
select.addEventListener('change',()=>{selected=select.value;renderTokens();renderBonus()});
$('#virtue').addEventListener('change',renderBonus);
// Remember each selected piece's entered bonus in the exported local session.
bonusInput.addEventListener('input',()=>{
 if(/^[012]$/.test(bonusInput.value)) table=setBonus(table,selected,$('#virtue').value,Number(bonusInput.value));
});
$('#seat-count').addEventListener('change',e=>{
 table=resizeTable(table,Number(e.target.value));
 if(!table.tokens.some(t=>t.id===selected)) selected='s1';
 render();
});
// A deliberate tap moves a Seeker noticeably; dragging remains pixel-precise.
const MOVE_STEP=6;
const MOVES={left:[-MOVE_STEP,0],right:[MOVE_STEP,0],up:[0,-MOVE_STEP],down:[0,MOVE_STEP]};
function stepSelected(direction){
 const delta=MOVES[direction],t=table.tokens.find(t=>t.id===selected);
 if(!delta||!t)return;
 table=moveToken(table,selected,clamp(t.x+delta[0],2,98),clamp(t.y+delta[1],2,98));
 renderTokens();
 return true;
}
document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>stepSelected(b.dataset.move)));
// Arrow keys move the selected Seeker only while the board itself or a Seeker
// token has focus, so normal page scrolling and other controls keep their keys.
// After each move, focus returns to the moved Seeker (renderTokens rebuilds it).
board.addEventListener('keydown',e=>{
 const direction={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];
 if(!direction||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
 const target=e.target;
 if(target!==board&&!target?.closest?.('.token'))return;
 e.preventDefault();
 if(!stepSelected(direction))return;
 focusSelected();
});
$('#inspect-selected').addEventListener('click',()=>{select.focus()});
$('#roll').addEventListener('click',()=>{
 if(!/^[012]$/.test(bonusInput.value)){
  escText($('#roll-result'),'Enter a whole-number Virtue bonus: 0, 1, or 2.');
  bonusInput.focus();
  return;
 }
 const v=$('#virtue').value,bonus=Number(bonusInput.value);
 table=setBonus(table,selected,v,bonus);
 const dice=new Uint32Array(2);crypto.getRandomValues(dice);
 const result=Array.from(dice,n=>(n%6)+1);
 table=recordRoll(table,selected,v,result,bonus);
 const r=table.rolls.at(-1);
 escText($('#roll-result'),result.join(' + ')+' + '+bonus+' = '+r.total+' · '+r.outcome);
 renderHistory();
});
$('#reset').addEventListener('click',()=>{if(!confirm('Reset the table AND clear your Field Journal? Export session first if you want to keep your notes, tokens and rolls.'))return;table=initialTable(table.tokens.length);selected='s1';clearSavedJournal();render()});
$('#export').addEventListener('click',()=>{
 const data=new Blob([JSON.stringify(table,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(data);const link=document.createElement('a');link.href=url;link.download='gu-scene'+SCENE.number+'-session.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('#import').addEventListener('change',async e=>{
 const f=e.target.files[0];if(!f)return;
 try {if(f.size>100000)throw new Error('Session file is too large');table=parseTable(JSON.parse(await f.text()));selected='s1';render();saveJournalInBrowser();alert('Session and Field Journal loaded in this browser.');}
 catch(err){alert('Could not import session: '+err.message)}
 finally{e.target.value=''}
});
const solo=$('#solo');
for(const choice of SOLO_CHOICES){const b=document.createElement('button');b.className='solo-button';b.textContent=choice.label;
 b.addEventListener('click',()=>{escText($('#solo-reply'),choice.reply);const zone=ZONES.find(z=>z.id===choice.id);if(zone)showZone(zone)});
 solo.append(b);
}
restoreJournalFromBrowser();
render();
