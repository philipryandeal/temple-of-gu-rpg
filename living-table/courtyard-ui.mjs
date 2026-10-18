import {SCENE,ZONES,OBJECTS,SOLO_CHOICES} from './courtyard-data.mjs';
import {initialTable,moveToken,revealClue,recordRoll,parseTable,setJournal} from './courtyard-state.mjs';
let table=initialTable(),selected='s1',activeZone=null;
const $=s=>document.querySelector(s);
const zones=$('#zones'),tokens=$('#tokens'),select=$('#seeker-select'),sheet=$('#sheet');
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const escText=(node,text)=>{node.textContent=text;};
const journalInput=$('#field-journal-notes'),journalStatus=$('#journal-status');
const JOURNAL_KEY='gu-rpg:scene01:field-journal:v1';
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
for(const t of table.tokens){
 const o=document.createElement('option');o.value=t.id;o.textContent=t.name;select.append(o);
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
function showSheet(){
 const t=table.tokens.find(t=>t.id===selected);select.value=selected;
 sheet.replaceChildren();
 const p=document.createElement('p');p.textContent=t.name+' · '+t.lineage+' (sample character, playtest only)';sheet.append(p);
 const stats=document.createElement('div');stats.className='statline';
 for(const [k,v] of Object.entries(t.virtues)){const s=document.createElement('span');s.textContent=k[0].toUpperCase()+k.slice(1)+' +'+v;stats.append(s)}
 sheet.append(stats);
 const info=document.createElement('p');info.className='fine';info.textContent='Partial example sheet: published Archetypes, Balance, Ebo, Mysteries and inventory require the full rulebook-based character builder.';sheet.append(info);
}
let drag=null;
function renderTokens(){
 tokens.replaceChildren();
 for(const t of table.tokens){
  const b=document.createElement('button');b.className='token'+(t.id===selected?' selected':'');
  b.style.left=t.x+'%';b.style.top=t.y+'%';
  b.textContent=t.id.slice(1);b.title=t.name;b.setAttribute('aria-label',t.name+'; position '+Math.round(t.x)+', '+Math.round(t.y));
  b.addEventListener('click',()=>{selected=t.id;renderTokens();showSheet()});
  b.addEventListener('pointerdown',e=>{
   if(e.button!==0)return;e.preventDefault();selected=t.id;drag={id:t.id,pointer:e.pointerId,moved:false};b.setPointerCapture(e.pointerId);
   renderSelection();
  });
  b.addEventListener('pointermove',e=>{
   if(!drag||drag.id!==t.id||drag.pointer!==e.pointerId)return;
   const rect=$('#board').getBoundingClientRect();
   const x=clamp((e.clientX-rect.left)/rect.width*100,2,98),y=clamp((e.clientY-rect.top)/rect.height*100,2,98);
   table=moveToken(table,t.id,x,y);b.style.left=x+'%';b.style.top=y+'%';drag.moved=true;
  });
  const end=e=>{
   if(!drag||drag.id!==t.id||drag.pointer!==e.pointerId)return;
   drag=null;renderTokens();showSheet();
  };
  b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end);
  tokens.append(b);
 }
}
function renderSelection(){select.value=selected;showSheet();for(const b of tokens.children)b.classList.toggle('selected',b.title===table.tokens.find(t=>t.id===selected).name);}
function renderHistory(){
 const box=$('#roll-history');box.replaceChildren();
 for(const r of table.rolls.slice(-4).reverse()){
  const p=document.createElement('p');const t=table.tokens.find(t=>t.id===r.id);
  p.textContent=t.name+': '+r.dice.join(' + ')+' + '+t.virtues[r.virtue]+' ('+r.virtue+') = '+r.total+' · '+r.outcome;box.append(p);
 }
}
function render(){renderTokens();showSheet();renderHistory();$('#reveal').checked=table.revealed;$('#clue').hidden=!table.revealed;escText($('#clue'),SCENE.proposedMystery);journalInput.value=table.journal;}
select.addEventListener('change',()=>{selected=select.value;renderTokens();showSheet()});
document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>{
 const direction=b.dataset.move,delta={left:[-2,0],right:[2,0],up:[0,-2],down:[0,2]}[direction];
 const t=table.tokens.find(t=>t.id===selected);
 table=moveToken(table,selected,clamp(t.x+delta[0],2,98),clamp(t.y+delta[1],2,98));renderTokens();
}));
$('#inspect-selected').addEventListener('click',()=>{showSheet();select.focus()});
$('#roll').addEventListener('click',()=>{
 const v=$('#virtue').value;const dice=new Uint32Array(2);crypto.getRandomValues(dice);
 const result=Array.from(dice,n=>(n%6)+1);
 table=recordRoll(table,selected,v,result);
 const r=table.rolls.at(-1);escText($('#roll-result'),result.join(' + ')+' + '+table.tokens.find(t=>t.id===selected).virtues[v]+' = '+r.total+' · '+r.outcome);
 renderHistory();
});
$('#reveal').addEventListener('change',e=>{table=revealClue(table,e.target.checked);render()});
$('#reset').addEventListener('click',()=>{if(!confirm('Reset the table AND clear your Field Journal? Export session first if you want to keep your notes, tokens and rolls.'))return;table=initialTable();selected='s1';clearSavedJournal();render()});
$('#export').addEventListener('click',()=>{
 const data=new Blob([JSON.stringify(table,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(data);const link=document.createElement('a');link.href=url;link.download='gu-scene01-session.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
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
