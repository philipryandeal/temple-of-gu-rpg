import { SIZE, POTO, START, move, stepToward, canInspect, INSPECTION, focusAfterMovement } from './game.mjs';
const gate = document.querySelector('#gate'), play = document.querySelector('#play'), board = document.querySelector('#board');
const status = document.querySelector('#status'), inspect = document.querySelector('#inspect');
let seeker = { ...START };
const directions = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
function announce(message) { status.textContent = message; }
function render(focusCell = null) {
  // When a tile is activated, restore focus to the same grid coordinate after rebuilding.
  // Controls outside the grid keep their own focus.
  board.replaceChildren();
  for (let y=0;y<SIZE;y++) for (let x=0;x<SIZE;x++) {
    const tile=document.createElement('button'); tile.type='button';tile.className='tile';
    const isPoto=x===POTO.x&&y===POTO.y, isSeeker=x===seeker.x&&y===seeker.y;
    if(isPoto)tile.classList.add('poto');if(isSeeker)tile.classList.add('seeker');
    tile.setAttribute('aria-label',`Row ${y+1}, column ${x+1}${isPoto?', Poto Mitan':''}${isSeeker?', seeker':''}`);
    tile.setAttribute('aria-current',isSeeker?'location':'false');
    const symbol=document.createElement('span');symbol.className='symbol';symbol.textContent=isSeeker?'●':isPoto?'✦':'·';tile.append(symbol);
    tile.addEventListener('click',()=>{ if(isPoto){describe();return;} const next=stepToward(seeker,x,y);if(next===seeker)announce('The path is not open in that direction.');else {seeker=next;announce('You move through the peristyle.');}render({x,y}); });
    board.append(tile);
  }
  inspect.disabled=!canInspect(seeker);
  if (focusCell) board.children[focusCell.y * SIZE + focusCell.x]?.focus();
}
function describe() { announce(canInspect(seeker)? INSPECTION:'Move beside the Poto Mitan to inspect it.'); }
function take(dir) {const delta=directions[dir];if(!delta)return;const fromGrid=board.contains(document.activeElement);const next=move(seeker,...delta);if(next===seeker)announce('The path is not open in that direction.');else{seeker=next;announce('You move through the peristyle.');}render(focusAfterMovement(fromGrid, seeker));}
document.querySelector('#enter').addEventListener('click',()=>{gate.hidden=true;play.hidden=false;seeker={...START};render();announce('You enter the Temple peristyle during the Fèt.');board.children[START.y * SIZE + START.x]?.focus();});
document.querySelector('#exit').addEventListener('click',()=>{play.hidden=true;gate.hidden=false;document.querySelector('#enter').focus();});
document.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('click',()=>take(b.dataset.dir)));
inspect.addEventListener('click',describe);
document.addEventListener('keydown',e=>{if(play.hidden||e.altKey||e.ctrlKey||e.metaKey)return;const key={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'}[e.key];if(!key)return; if(e.target?.matches('input, textarea, select'))return;e.preventDefault();take(key);});
