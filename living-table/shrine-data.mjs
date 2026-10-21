// Scene 02 follows the Scene 01 narrative contract. Mystery threads are optional and Guide-adjudicated.
export const SCENE=Object.freeze({
 id:'shrine-room',name:'The Shrine Room',subtitle:'The Temple of Gu · Scene 02 · Playtest',
 opening:'The music of the Fèt grows softer as you pass through the inner doorway. Candlelight illuminates an altar, flowers, vessels and shelves of devotional objects. Outside, the celebration continues. Inside, something invites your attention. Where will you begin?',
 proposedMystery:'A bell rings inside the room, much like the second bell heard in the courtyard. Near the altar, an empty space suggests something may have been moved. Are these events related to the missing makout, or are they simply coincidences? Only the Guide decides.'
});
export const ZONES=Object.freeze([
 {id:'doorway',title:'Inner Doorway',x:11,y:53,description:'The entrance back to the courtyard. The music of the Fèt remains audible. Visitors can return or observe who passes through.',objects:[]},
 {id:'altar',title:'Central Altar',x:50,y:23,description:'A devotional space arranged with candles, flowers and vessels. The Guide decides which objects guests may inspect or handle.',objects:['bell','candles','vessels','flowers']},
 {id:'offerings',title:'Offering Table',x:78,y:44,description:'Gifts, cups and fabric are arranged here. A curious empty space may or may not be important to the story.',objects:['cloth','empty-space']},
 {id:'shelves',title:'Shrine Shelves',x:88,y:22,description:'Vessels and devotional objects occupy the shelves. Ask the Guide what each object means in the story.',objects:['container','vessels']},
 {id:'candles',title:'Candle Alcove',x:22,y:25,description:'Candlelight casts shifting shadows across nearby walls and objects.',objects:['candles']},
 {id:'attendant',title:"Attendant's Place",x:77,y:75,description:'A temple attendant receives visitors and tends the room. Their knowledge and responses belong to the Guide.',objects:[]},
 {id:'quiet',title:'Quiet Corner',x:28,y:78,description:'A place to listen, reflect, exchange observations and plan your next move.',objects:[]}
]);
export const OBJECTS=Object.freeze([
 {id:'bell',title:'Bell',description:'A bell that might connect to the sounds heard during the Fèt. Its significance is not predetermined.'},
 {id:'candles',title:'Candles',description:'Sources of light and atmosphere; no automatic magical effect.'},
 {id:'vessels',title:'Offering vessels',description:'Containers arranged within the shrine. Ask the Guide before handling them.'},
 {id:'flowers',title:'Flowers',description:'Devotional gifts and decorations.'},
 {id:'cloth',title:'Cloth',description:'Fabric arranged among the shrine objects.'},
 {id:'container',title:'Small container',description:'An ordinary-looking container inviting further questions, subject to the Guide.'},
 {id:'empty-space',title:'Empty space',description:'A gap near the altar that might be a clue if the Guide chooses to use the proposed mystery.'}
]);
export const SEEKERS=Object.freeze([
 {id:'s1',name:'Seeker One',lineage:'taino',x:26,y:66,virtues:{suuru:2,oye:1,foriti:1,iwa:0},tone:'coral'},
 {id:'s2',name:'Seeker Two',lineage:'yoruba',x:32,y:71,virtues:{suuru:1,oye:2,foriti:0,iwa:1},tone:'aqua'},
 {id:'s3',name:'Seeker Three',lineage:'congo',x:38,y:76,virtues:{suuru:1,oye:0,foriti:2,iwa:1},tone:'gold'},
 {id:'s4',name:'Seeker Four',lineage:'indo-european',x:44,y:81,virtues:{suuru:0,oye:1,foriti:1,iwa:2},tone:'lilac'},
 {id:'s5',name:'Seeker Five',lineage:'shinto',x:50,y:76,virtues:{suuru:2,oye:0,foriti:1,iwa:1},tone:'pink'},
 {id:'s6',name:'Seeker Six',lineage:'hindu',x:56,y:81,virtues:{suuru:1,oye:1,foriti:2,iwa:0},tone:'mint'}
]);
export const SOLO_CHOICES=Object.freeze([
 {id:'altar',label:'Examine the altar',reply:'The objects are carefully arranged. One small area looks bare. Ask the Guide what you notice.'},
 {id:'attendant',label:'Speak with the attendant',reply:'The attendant welcomes respectful questions but asks guests not to handle everything. Ask the Guide what they know.'},
 {id:'candles',label:'Investigate the bell',reply:'The bell appears ordinary. Whether it caused the mysterious sound remains for the Guide to determine.'},
 {id:'quiet',label:'Sit in the quiet corner',reply:'The drums continue outside. Listen, reflect, and decide where your curiosity leads.'}
]);