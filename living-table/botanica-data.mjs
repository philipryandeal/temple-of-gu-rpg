// Scene 03 follows the founder-approved personal tabletop, with optional Guide-led story threads.
export const SCENE=Object.freeze({
 id:'botanica',name:'The Botanica',subtitle:'The Temple of Gu · Scene 03 · Playtest',
 opening:'The door opens with a gentle brass bell. Shelves crowd the room with jars, bottles, candles, books and herbs. A Puerto Rican flag hangs proudly among the treasures. Behind the counter, the keeper looks up from a ledger. "Did you come looking for a remedy, or did a question follow you through the door?" Where will you begin?',
 proposedMystery:'An unclaimed parcel sits behind the counter, its label marked with a curious symbol. It may connect to the missing makout and the bells heard in earlier rooms, or it may begin an entirely different adventure. The Guide decides.'
});
export const ZONES=Object.freeze([
 {id:'entrance',title:'Botanica Entrance',x:16,y:75,description:'A little brass bell announces each visitor. The Fèt can still be heard outside.',objects:['doorbell']},
 {id:'counter',title:'Keeper’s Counter',x:55,y:42,description:'The keeper greets visitors here. An open ledger and an unclaimed parcel invite questions, but the keeper determines what can be examined.',objects:['ledger','parcel']},
 {id:'herbs',title:'Herbal Shelves',x:20,y:27,description:'Dried herbs, labeled jars and bundles line the shelves. Their fictional uses require Guide approval; this room gives no real-world remedies.',objects:['herb-jars']},
 {id:'candles',title:'Candle Display',x:82,y:24,description:'Candles in many colors occupy a display near the wall. They carry no automatic game effects.',objects:['candles']},
 {id:'books',title:'Books and Records',x:76,y:55,description:'Books, notebooks and labels preserve stories and knowledge. The keeper may help interpret them.',objects:['book']},
 {id:'flag',title:'Puerto Rican Flag',x:49,y:16,description:'A Puerto Rican flag hangs with pride among the Botanica’s treasures, honoring the room’s cultural character.',objects:[]},
 {id:'worktable',title:'Preparation Table',x:42,y:81,description:'An orderly working space with vessels and tools, where conversation and observation can lead the next step of an adventure.',objects:['vessels']}
]);
export const OBJECTS=Object.freeze([
 {id:'doorbell',title:'Door bell',description:'A small brass bell over the entrance; perhaps an ordinary echo of other bells in the story.'},
 {id:'ledger',title:'Shop ledger',description:'An open book of notes and orders. The Guide and keeper decide what may be read.'},
 {id:'parcel',title:'Unclaimed parcel',description:'A wrapped package with a curious mark. Its contents and importance are intentionally undecided.'},
 {id:'herb-jars',title:'Herb jars',description:'Labeled jars and dried plant bundles. No recipes, medical claims, or automatic powers are assigned.'},
 {id:'candles',title:'Candles',description:'Colorful candles that illuminate the shop and might prompt a conversation.'},
 {id:'book',title:'Books',description:'Books and notebooks invite questions about the Botanica and its stories.'},
 {id:'vessels',title:'Working vessels',description:'Tools and containers used in fictional preparation scenes, handled only with the Guide’s permission.'}
]);
export const SEEKERS=Object.freeze([
 {id:'s1',name:'Seeker One',lineage:'taino',x:25,y:68,virtues:{suuru:2,oye:1,foriti:1,iwa:0},tone:'coral'},
 {id:'s2',name:'Seeker Two',lineage:'yoruba',x:31,y:73,virtues:{suuru:1,oye:2,foriti:0,iwa:1},tone:'aqua'},
 {id:'s3',name:'Seeker Three',lineage:'congo',x:37,y:78,virtues:{suuru:1,oye:0,foriti:2,iwa:1},tone:'gold'},
 {id:'s4',name:'Seeker Four',lineage:'indo-european',x:43,y:73,virtues:{suuru:0,oye:1,foriti:1,iwa:2},tone:'lilac'},
 {id:'s5',name:'Seeker Five',lineage:'shinto',x:49,y:78,virtues:{suuru:2,oye:0,foriti:1,iwa:1},tone:'pink'},
 {id:'s6',name:'Seeker Six',lineage:'hindu',x:55,y:73,virtues:{suuru:1,oye:1,foriti:2,iwa:0},tone:'mint'}
]);
export const SOLO_CHOICES=Object.freeze([
 {id:'counter',label:'Ask the keeper about the parcel',reply:'The keeper considers your question, then looks at the unclaimed parcel. Ask the Guide what they are willing to share.'},
 {id:'herbs',label:'Browse the herbal shelves',reply:'Names and fragrances surround you. Ask the Guide what the keeper explains about this fictional collection.'},
 {id:'books',label:'Examine the books',reply:'You find titles, notes, and records. Their significance belongs to the Guide and the unfolding story.'},
 {id:'entrance',label:'Listen to the door bell',reply:'The little bell rings whenever the door moves. Could it explain what you heard earlier? Ask the Guide.'}
]);