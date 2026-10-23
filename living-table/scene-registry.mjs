// Illustrated rooms contain no new mandatory rules or Guide-only revelations.
const records=[["river-crossing","04","The River Crossing","river-crossing-board.png"],["cemetery-gate","05","The Cemetery Gate","cemetery-gate-board.png"],["congo-square","06","Congo Square","congo-square-board.png"],["gran-bwa-forest","07","Gran Bwa Forest","gran-bwa-forest-board.png"],["rada-rainbow-bridge","08","The Rada Rainbow Bridge","rada-rainbow-bridge-board.png"],["living-machines-church","09","The Living Machines Church","living-machines-church-board.png"],["data-forge","10","The Data Forge","data-forge-board.png"]];
const additionalRecords=[["shinto-no-kami-01","01","Fushimi Inari","fushimi-inari.png"],["shinto-no-kami-02","02","Ise Jingū","ise-jingu.png"],["shinto-no-kami-03","03","Izumo Taisha","izumo-taisha.png"],["shinto-no-kami-04","04","Kasuga Taisha","kasuga-taisha.png"],["shinto-no-kami-05","05","Kifune Shrine","kifune-shrine.png"],["shinto-no-kami-06","06","Kumano Nachi","kumano-nachi.png"],["shinto-no-kami-07","07","Ōmiwa Jinja","omiwa-jinja.png"],["shinto-no-kami-08","08","Tō-ji","to-ji.png"],["call-of-the-taino-01","01","Caguana Ceremonial Plaza","caguana-plaza.png"],["call-of-the-taino-02","02","Caguana Ball Court","caguana-ball-court.png"],["call-of-the-taino-03","03","Cuevas del Pomier","cuevas-del-pomier.png"],["call-of-the-taino-04","04","El Yunque","el-yunque.png"],["call-of-the-taino-05","05","Las Caritas","las-caritas.png"],["call-of-the-taino-06","06","Los Haitises","los-haitises.png"],["call-of-the-taino-07","07","Piedra Escrita","piedra-escrita.png"],["call-of-the-taino-08","08","Punta del Este","punta-del-este.png"]];
const allRecords=[...records,...additionalRecords];
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
export const SCENES=Object.freeze(Object.fromEntries(allRecords.map(record=>{
 const room=make(record);return [room.id,room];
})));
