import {stations, paths, campaignRoads} from './tree-data.js';
const SVG='http://www.w3.org/2000/svg';
const map=document.getElementById('gu-tree');
const details={tag:document.getElementById('gu-detail-tag'),title:document.getElementById('gu-detail-title'),copy:document.getElementById('gu-detail-copy')};
const byId=new Map(stations.map(station=>[station.id,station]));
const element=(tag,attrs={})=>{const node=document.createElementNS(SVG,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));return node;};
const edgeElements=new Map();
const nodeElements=new Map();
let selection={type:'station',id:'malkuth'};

function paint(what){
  for(const [n,el] of edgeElements){const edge=paths.find(path=>path.n===n);const active=what.type==='path'?what.id===n:(edge.from===what.id||edge.to===what.id);el.classList.toggle('is-active',active);}
  for(const [id,el] of nodeElements){const edge=what.type==='path'?paths.find(path=>path.n===what.id):null;el.classList.toggle('is-active',what.type==='station'&&what.id===id);el.classList.toggle('is-connected',!!edge&&(edge.from===id||edge.to===id));}
}
function describe(what){
  if(what.type==='station'){
    const station=byId.get(what.id);
    details.tag.textContent=station.domain;
    details.title.textContent=station.name;
    details.copy.textContent=station.detail;
  }else{
    const path=paths.find(item=>item.n===what.id);
    const origin=byId.get(path.from),destination=byId.get(path.to);
    details.tag.textContent='TREE PATH '+path.n+' · '+(path.kind==='campaign'?'MAIN STORY ROAD':'RESERVED CROSSING');
    details.title.textContent=origin.name+' ↔ '+destination.name;
    details.copy.textContent=path.kind==='campaign'?
      'This is part of the nine-road story route. The path is a proposed map connection, not an automatic portal: Papa Legba alone decides passage in the adventure.':
      'This is an authentic connection on the shared Tree of Life. Its Temple RPG encounter is not yet written or unlocked.';
  }
}
// Hover and focus only light the road or station under the pointer (CSS does
// that). The story panel changes on a deliberate choice: a click, a tap, or
// Enter. Nothing on the page moves while the pointer wanders the Tree.
function select(target){selection=target;paint(target);describe(target);}
function events(el,target){
  el.addEventListener('click',()=>select(target));
  el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(target);}});
}
function draw(){
  map.replaceChildren();
  map.append(element('ellipse',{cx:450,cy:515,rx:348,ry:484,class:'gu-tree-orbit'}));
  map.append(element('ellipse',{cx:450,cy:515,rx:315,ry:447,class:'gu-tree-orbit'}));
  for(const path of paths){
    const from=byId.get(path.from),to=byId.get(path.to);
    const group=element('g',{class:'gu-tree-branch'+(path.kind==='campaign'?' is-main':''),role:'button',tabindex:0,'aria-label':'Path '+path.n+', '+from.name+' to '+to.name+', '+(path.kind==='campaign'?'main story route':'reserved crossing')});
    group.append(element('line',{class:'gu-tree-line',x1:from.x,y1:from.y,x2:to.x,y2:to.y}));
    group.append(element('line',{class:'gu-tree-hit',x1:from.x,y1:from.y,x2:to.x,y2:to.y}));
    events(group,{type:'path',id:path.n});
    edgeElements.set(path.n,group);map.append(group);
  }
  for(const station of stations){
    const group=element('g',{class:'gu-tree-node',role:'button',tabindex:0,'aria-label':station.name+', '+station.domain});
    group.append(element('circle',{class:'gu-tree-halo',cx:station.x,cy:station.y,r:63}));
    group.append(element('circle',{class:'gu-tree-disc',cx:station.x,cy:station.y,r:49}));
    const number=element('text',{class:'gu-tree-number',x:station.x,y:station.y+11});
    number.textContent=station.n;group.append(number);
    const caption=element('text',{class:'gu-tree-caption',x:station.x,y:station.y+85});
    caption.textContent=station.short;group.append(caption);
    events(group,{type:'station',id:station.id});
    nodeElements.set(station.id,group);map.append(group);
  }
  select(selection);
}
draw();
for(const link of document.querySelectorAll('[data-gu-station]')){
  link.addEventListener('click',()=>{const id=link.dataset.guStation;if(byId.has(id))select({type:'station',id});});
}
document.getElementById('begin-journey').addEventListener('click',()=>{
  select({type:'station',id:'malkuth'});
  requestAnimationFrame(()=>nodeElements.get('malkuth')?.focus({preventScroll:true}));
});
// The full campaign order is in data for a later build; this public map does not simulate progress.
void campaignRoads;
