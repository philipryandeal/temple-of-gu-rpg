import {SCENE,SEEKERS} from './scene-data.mjs';
import {evaluateLesson,VIRTUES} from './casting.mjs';
export const SCENE_ID = SCENE.id;
export const SAVE_VERSION = 1;
export const MAX_SEATS = 6;
export const MIN_SEATS = 1;
export function validSeatCount(n) { return Number.isInteger(n)&&n>=MIN_SEATS&&n<=MAX_SEATS; }
export const MAX_JOURNAL_LENGTH = 20000;
const ALLOWED = new Set(SEEKERS.map(s=>s.id));
const validCoordinate = n=>typeof n==='number'&&Number.isFinite(n)&&n>=2&&n<=98;
const validBonus = n=>Number.isInteger(n)&&n>=0&&n<=2;
const copyToken = t=>({id:t.id,name:t.name,lineage:t.lineage,x:t.x,y:t.y,virtues:{...t.virtues},tone:t.tone});
export function initialTable(count=MAX_SEATS) {
  if(!validSeatCount(count)) throw new RangeError('Choose between one and six Seekers');
  return {version:SAVE_VERSION,scene:SCENE_ID,tokens:SEEKERS.slice(0,count).map(copyToken),rolls:[],bonuses:{},journal:''};
}
// Change the number of locally visible demo pieces without discarding the journal.
export function resizeTable(table,count) {
  if(!validSeatCount(count)) throw new RangeError('Choose between one and six Seekers');
  const tokens=SEEKERS.slice(0,count).map(source=>table.tokens.find(t=>t.id===source.id)??copyToken(source));
  const live=new Set(tokens.map(t=>t.id));
  const bonuses=Object.fromEntries(Object.entries(table.bonuses??{}).filter(([id])=>live.has(id)));
  return {...table,tokens,rolls:table.rolls.filter(r=>live.has(r.id)),bonuses};
}
export function moveToken(table,id,x,y) {
  if(!ALLOWED.has(id)||!table.tokens.some(t=>t.id===id)||!validCoordinate(x)||!validCoordinate(y)) throw new RangeError('Invalid token move');
  return {...table,tokens:table.tokens.map(t=>t.id===id?{...t,x,y}:t)};
}
// This is player-authored text, not a Guide privilege or a magic action.
export function setJournal(table,value) {
  if(typeof value!=='string'||value.length>MAX_JOURNAL_LENGTH) throw new RangeError('Journal exceeds the supported length');
  return {...table,journal:value};
}
// User-supplied bonuses are small manual tabletop inputs, not generated character sheets.
export function getBonus(table,id,virtue) {
  if(!table.tokens.some(t=>t.id===id)||!VIRTUES.includes(virtue)) throw new RangeError('Invalid Seeker or Virtue');
  return table.bonuses?.[id]?.[virtue] ?? 0;
}
export function setBonus(table,id,virtue,bonus) {
  if(!table.tokens.some(t=>t.id===id)||!VIRTUES.includes(virtue)||!validBonus(bonus))
    throw new RangeError('Virtue bonus must be 0, 1, or 2 for the starting rules');
  return {...table,bonuses:{...table.bonuses,[id]:{...table.bonuses?.[id],[virtue]:bonus}}};
}
export function recordRoll(table,id,virtue,dice,bonus) {
  if(!table.tokens.some(t=>t.id===id)||!VIRTUES.includes(virtue)||!validBonus(bonus))
    throw new RangeError('Invalid Seeker, Virtue or bonus');
  const result=evaluateLesson(dice,virtue,bonus);
  return {...table,rolls:[...table.rolls,{id,virtue,dice:[...dice],bonus,total:result.total,outcome:result.outcome}].slice(-30)};
}
// Imported files are untrusted. Rebuild an allowed shape; never trust privileges, extra keys or dice totals.
export function parseTable(raw) {
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==SAVE_VERSION||raw.scene!==SCENE_ID) throw new Error('Not a save file for this scene');
  if(!Array.isArray(raw.tokens)||!validSeatCount(raw.tokens.length)) throw new Error('Save must contain 1–6 demo token slots');
  const seen=new Set();
  const tokens=raw.tokens.map((t,i)=>{
    if(!t||typeof t!=='object'||!ALLOWED.has(t.id)||t.id!==SEEKERS[i].id||seen.has(t.id)||!validCoordinate(t.x)||!validCoordinate(t.y)) throw new Error('Invalid token in save');
    seen.add(t.id);
    const source=SEEKERS.find(s=>s.id===t.id);
    if(t.name!==source.name||t.lineage!==source.lineage||t.tone!==source.tone||
       !t.virtues||typeof t.virtues!=='object'||Array.isArray(t.virtues)||
       Object.keys(t.virtues).length!==4||
       !Object.keys(source.virtues).every(k=>source.virtues[k]===t.virtues[k])) throw new Error('Unrecognized demo character');
    return {...copyToken(source),x:t.x,y:t.y};
  });
  // Older exports lack the manually entered Virtue bonus map.
  const rawBonuses=raw.bonuses===undefined?{}:raw.bonuses;
  if(!rawBonuses||typeof rawBonuses!=='object'||Array.isArray(rawBonuses)) throw new Error('Invalid bonus map');
  const bonuses={};
  for(const [id,values] of Object.entries(rawBonuses)){
    if(!tokens.some(t=>t.id===id)||!values||typeof values!=='object'||Array.isArray(values)) throw new Error('Invalid bonus token');
    const restored={};
    for(const [virtue,bonus] of Object.entries(values)){
      if(!VIRTUES.includes(virtue)||!validBonus(bonus)) throw new Error('Invalid Virtue bonus');
      restored[virtue]=bonus;
    }
    bonuses[id]=restored;
  }
  // Accept but discard the old local-only Guide reveal flag in legacy exports.
  if(raw.revealed!==undefined && typeof raw.revealed!=='boolean') throw new Error('Invalid legacy clue flag');
  if(!Array.isArray(raw.rolls)||raw.rolls.length>30) throw new Error('Invalid dice history');
  const rolls=raw.rolls.map(r=>{
    if(!r||!ALLOWED.has(r.id)||typeof r.virtue!=='string'||!Array.isArray(r.dice)) throw new Error('Invalid roll');
    const token=tokens.find(t=>t.id===r.id);
    if(!token||!VIRTUES.includes(r.virtue)) throw new Error('Invalid roll virtue');
    // Original exports omitted bonus: use the old fixed sample score ONLY to verify
    // their historical dice results, never when making a new roll.
    const legacy=r.bonus===undefined;
    const bonus=legacy?token.virtues[r.virtue]:r.bonus;
    if(!validBonus(bonus)) throw new Error('Invalid roll bonus');
    const derived=evaluateLesson(r.dice,r.virtue,bonus);
    if(r.total!==derived.total||r.outcome!==derived.outcome) throw new Error('Tampered dice history');
    return {id:r.id,virtue:r.virtue,dice:[...r.dice],...(legacy?{}:{bonus}),total:derived.total,outcome:derived.outcome};
  });
  // Backward compatible with earlier Scene 01 exports that had no journal.
  const journal=raw.journal===undefined?'':raw.journal;
  if(typeof journal!=='string'||journal.length>MAX_JOURNAL_LENGTH) throw new Error('Invalid journal in save');
  return {version:SAVE_VERSION,scene:SCENE_ID,tokens,rolls,bonuses,journal};
}
