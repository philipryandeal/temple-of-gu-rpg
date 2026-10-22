// Illustrated rooms contain no new mandatory rules or Guide-only revelations.
const records=[["river-crossing","04","The River Crossing","river-crossing-board.png"],["cemetery-gate","05","The Cemetery Gate","cemetery-gate-board.png"],["congo-square","06","Congo Square","congo-square-board.png"],["gran-bwa-forest","07","Gran Bwa Forest","gran-bwa-forest-board.png"],["rada-rainbow-bridge","08","The Rada Rainbow Bridge","rada-rainbow-bridge-board.png"],["living-machines-church","09","The Living Machines Church","living-machines-church-board.png"],["data-forge","10","The Data Forge","data-forge-board.png"]];
const areas=[{id:'left',title:'Left side',x:18,y:52},{id:'center',title:'Center',x:50,y:42},{id:'right',title:'Right side',x:82,y:52}];
const make=([id,number,name,image])=>Object.freeze({
 id,number,name,image,
 opening:'You have entered '+name+'. Move your Seekers as your Guide directs and record what matters to the adventure.',
 zones:Object.freeze(areas.map(p=>Object.freeze({
  id:p.id,title:p.title,x:p.x,y:p.y,objects:[],
  description:'Look around the '+p.title.toLowerCase()+' of '+name+'. Ask your Guide what you can discover here.'
 }))),
 objects:Object.freeze([]),
 choices:Object.freeze(areas.map(p=>Object.freeze({
  id:p.id,label:'Explore the '+p.title.toLowerCase(),
  reply:'Tell your Guide what you are investigating; your group decides what happens next.'
 })))
});
export const SCENES=Object.freeze(Object.fromEntries(records.map(record=>{
 const room=make(record);return [room.id,room];
})));
