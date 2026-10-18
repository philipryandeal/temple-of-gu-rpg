// Scene 01 data is a proposed playtest adaptation of the October 18 founder brief.
// No ritual instruction, undisclosed mysteries or new gameplay effects are asserted.
export const SCENE = Object.freeze({
  id: 'courtyard-fet',
  name: 'The Courtyard Fèt',
  subtitle: 'The Temple of Gu · Scene 01 · Playtest',
  opening: 'Music fills the courtyard. Candles burn. Visitors exchange greetings and offerings around the Poto Mitan. You have arrived at a communal Fèt. Where will you begin?',
  proposedMystery: 'A bell sounds from the altar, although nobody seems to be standing beside it. A second bell rings elsewhere. Later, someone notices that a makout is missing. Are the events connected?'
});
export const ZONES = Object.freeze([
  {id:'gate',title:'Courtyard Gate',x:13,y:48,description:'An open gate connects the courtyard to the road. It is the starting point for arriving Seekers.',objects:[]},
  {id:'poto',title:'Poto Mitan',x:50,y:52,description:'The symbolic center of the Temple courtyard. There is space around it for Seekers to gather and converse.',objects:[]},
  {id:'altar',title:'Devotional Altar',x:50,y:17,description:'Candles, vessels and devotional objects decorate a raised table. Interactions with offerings and sacred objects are subject to the Guide’s permission.',objects:['bell','candles','offering']},
  {id:'supply',title:'Supply Table',x:86,y:42,description:'Supplies are arranged on a working table. A makout and other fictional game items may be examined here.',objects:['cup','belt','mouchwas','portable-altar','makout','bath','colognes']},
  {id:'music',title:'Music Corner',x:16,y:76,description:'Drums and chairs gather the musicians. Guests may listen, speak with NPCs, or gather information.',objects:[]},
  {id:'gathering',title:'Gathering Area',x:76,y:77,description:'Seats offer room for conversation, introductions, negotiation and planning.',objects:[]},
  {id:'door',title:'Inner Doorway',x:92,y:18,description:'An adjoining room awaits future scenes. Whether this door opens is determined by the Guide and the story.',objects:[]}
]);
export const OBJECTS = Object.freeze([
  {id:'bell',title:'Bell',description:'A bell used for signals, announcements and attention. The proposed opening mystery begins with a bell sounding unexpectedly.'},
  {id:'cup',title:'Cup',description:'A vessel that may appear in offering, exchange or gathering scenes. No mechanical effect has been assigned.'},
  {id:'belt',title:'Magical belt',description:'Wearable fictional ritual equipment. Any powers require separately approved story and rules.'},
  {id:'mouchwas',title:'Mouchwas',description:'Colorful fabric worn or displayed as part of character identity and community life.'},
  {id:'portable-altar',title:'Portable altar',description:'Fictional adventure equipment for prepared scenes, with all uses subject to Guide and canon review.'},
  {id:'makout',title:'Makout',description:'A carrying bag for approved inventory. A missing makout is the proposed opening mystery, not mandatory game canon.'},
  {id:'bath',title:'Spiritual bath materials',description:'Fictional preparations and cleansing-themed story objects. Real-world recipes and restricted practices are not included.'},
  {id:'colognes',title:'Colognes',description:'Scents and bottles that may contribute to atmosphere or proposed investigation clues.'},
  {id:'candles',title:'Candles',description:'Light and ambiance for the Fèt; the Guide determines any story effects.'},
  {id:'offering',title:'Offering table',description:'A place for hospitality, fictional exchange and reciprocity. No real-world ritual is simulated.'}
]);
export const SEEKERS = Object.freeze([
  {id:'s1',name:'Seeker One',lineage:'taino',x:23,y:62,virtues:{suuru:2,oye:1,foriti:1,iwa:0},tone:'coral'},
  {id:'s2',name:'Seeker Two',lineage:'yoruba',x:28,y:67,virtues:{suuru:1,oye:2,foriti:0,iwa:1},tone:'aqua'},
  {id:'s3',name:'Seeker Three',lineage:'congo',x:33,y:72,virtues:{suuru:1,oye:0,foriti:2,iwa:1},tone:'gold'},
  {id:'s4',name:'Seeker Four',lineage:'indo-european',x:38,y:77,virtues:{suuru:0,oye:1,foriti:1,iwa:2},tone:'lilac'},
  {id:'s5',name:'Seeker Five',lineage:'shinto',x:43,y:72,virtues:{suuru:2,oye:0,foriti:1,iwa:1},tone:'pink'},
  {id:'s6',name:'Seeker Six',lineage:'hindu',x:48,y:77,virtues:{suuru:1,oye:1,foriti:2,iwa:0},tone:'mint'}
]);
export const SOLO_CHOICES = Object.freeze([
  {id:'altar',label:'Investigate the altar',reply:'The candlelight catches the polished bell. No one here claims to have rung it. You may ask the Guide for a Virtue check when an action is uncertain.'},
  {id:'music',label:'Speak with the musicians',reply:'The musicians recall hearing two bells with subtly different sounds. They do not agree about where the second one came from.'},
  {id:'supply',label:'Examine the supply table',reply:'There is a space beside the table where a makout might have rested. Whether it was taken or moved remains an open question.'},
  {id:'gather',label:'Join the gathering',reply:'The Fèt continues around you. Take your time to meet your companions and decide whether you wish to follow the mystery.'}
]);
