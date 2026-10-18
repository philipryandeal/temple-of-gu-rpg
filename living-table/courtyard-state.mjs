import {SEEKERS} from './courtyard-data.mjs';
import {evaluateLesson} from './casting.mjs';
import {validateSeeker} from './seeker.mjs';
export const SCENE_ID = 'courtyard-fet';
export const SAVE_VERSION = 1;
export const MAX_SEATS = 6;
export const MAX_JOURNAL_LENGTH = 20000;
const ALLOWED = new Set(SEEKERS.map(s=>s.id));
const validCoordinate = n=>typeof n==='number'&&Number.isFinite(n)&&n>=2&&n<=98;
const copyToken = t=>({id:t.id,name:t.name,lineage:t.lineage,x:t.x,y:t.y,virtues:{...t.virtues},tone:t.tone});
export function initialTable() {
  return {version:SAVE_VERSION,scene:SCENE_ID,tokens:SEEKERS.map(copyToken),revealed:false,rolls:[],journal:''};
}
export function moveToken(table,id,x,y) {
  if(!ALLOWED.has(id)||!validCoordinate(x)||!validCoordinate(y)) throw new RangeError('Invalid token move');
  return {...table,tokens:table.tokens.map(t=>t.id===id?{...t,x,y}:t)};
}
export function revealClue(table,value) {
  if(typeof value!=='boolean') throw new TypeError('Clue visibility must be boolean');
  return {...table,revealed:value};
}
// This is player-authored text, not a Guide privilege or a magic action.
export function setJournal(table,value) {
  if(typeof value!=='string'||value.length>MAX_JOURNAL_LENGTH) throw new RangeError('Journal exceeds the supported length');
  return {...table,journal:value};
}
export function recordRoll(table,id,virtue,dice) {
  const token=table.tokens.find(t=>t.id===id);
  if(!token||!Object.hasOwn(token.virtues,virtue)) throw new RangeError('Invalid Seeker or Virtue');
  const result=evaluateLesson(dice,virtue,token.virtues[virtue]);
  return {...table,rolls:[...table.rolls,{id,virtue,dice:[...dice],total:result.total,outcome:result.outcome}].slice(-30)};
}
// Imported files are untrusted. Rebuild an allowed shape; never trust privileges, extra keys or dice totals.
export function parseTable(raw) {
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==SAVE_VERSION||raw.scene!==SCENE_ID) throw new Error('Not a Scene 01 save file');
  if(!Array.isArray(raw.tokens)||raw.tokens.length!==MAX_SEATS) throw new Error('Save must contain six demo token slots');
  const seen=new Set();
  const tokens=raw.tokens.map(t=>{
    if(!t||typeof t!=='object'||!ALLOWED.has(t.id)||seen.has(t.id)||!validCoordinate(t.x)||!validCoordinate(t.y)) throw new Error('Invalid token in save');
    seen.add(t.id);
    const source=SEEKERS.find(s=>s.id===t.id);
    if(t.name!==source.name||t.lineage!==source.lineage||t.tone!==source.tone||
       !t.virtues||!validateSeeker({name:t.name,lineage:t.lineage,virtues:t.virtues}).ok||
       Object.keys(t.virtues).length!==4||
       !Object.keys(source.virtues).every(k=>source.virtues[k]===t.virtues[k])) throw new Error('Unrecognized demo character');
    return {...copyToken(source),x:t.x,y:t.y};
  });
  if(typeof raw.revealed!=='boolean') throw new Error('Invalid clue flag');
  if(!Array.isArray(raw.rolls)||raw.rolls.length>30) throw new Error('Invalid dice history');
  const rolls=raw.rolls.map(r=>{
    if(!r||!ALLOWED.has(r.id)||typeof r.virtue!=='string'||!Array.isArray(r.dice)) throw new Error('Invalid roll');
    const token=tokens.find(t=>t.id===r.id);
    if(!Object.hasOwn(token.virtues,r.virtue)) throw new Error('Invalid roll virtue');
    const derived=evaluateLesson(r.dice,r.virtue,token.virtues[r.virtue]);
    if(r.total!==derived.total||r.outcome!==derived.outcome) throw new Error('Tampered dice history');
    return {id:r.id,virtue:r.virtue,dice:[...r.dice],total:derived.total,outcome:derived.outcome};
  });
  // Backward compatible with earlier Scene 01 exports that had no journal.
  const journal=raw.journal===undefined?'':raw.journal;
  if(typeof journal!=='string'||journal.length>MAX_JOURNAL_LENGTH) throw new Error('Invalid journal in save');
  return {version:SAVE_VERSION,scene:SCENE_ID,tokens,rolls,revealed:raw.revealed,journal};
}
