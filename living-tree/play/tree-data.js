// The ten Sephirotic stations and twenty-two edges follow Adam's Techno-Kabbalah Tree.
// Locations are Temple of Gu campaign interpretations, not equivalences between Loa and Sefirot.
// Ryan approved Kether as Return to Gu; chapter encounters and reserved paths remain unbuilt.
export const stations = [
  {
    "id": "kether",
    "n": 1,
    "name": "Return to Gu",
    "short": "RETURN",
    "x": 450,
    "y": 90,
    "domain": "Homecoming · Kether",
    "detail": "The journey closes at home. Witness what was restored, what remains wounded, and what the seeker carries back to the community."
  },
  {
    "id": "chokmah",
    "n": 2,
    "name": "Papa Candelo’s Kongo Bush",
    "short": "CANDELO",
    "x": 645,
    "y": 210,
    "domain": "Division 5 · Chokmah",
    "detail": "The living Kongo bush: forests, ancestral relationships, plant knowledge, and the responsibilities of a changing land."
  },
  {
    "id": "binah",
    "n": 3,
    "name": "Papa Gede’s Graveyard",
    "short": "GEDE",
    "x": 255,
    "y": 210,
    "domain": "Division 4 · Binah",
    "detail": "The cemetery and its archives. Memory, remembrance, and what must be distinguished from a record poisoned by the unseen saboteur."
  },
  {
    "id": "chesed",
    "n": 4,
    "name": "Metresili Freda’s Realm",
    "short": "METRESILI",
    "x": 645,
    "y": 435,
    "domain": "Division 6 · Chesed",
    "detail": "The realm of the Metressas. Beauty, connection, glamour, and the discernment needed when appearances conceal a wound."
  },
  {
    "id": "gevurah",
    "n": 5,
    "name": "Ogou Feray’s Machine Forge",
    "short": "OGOU FERAY",
    "x": 255,
    "y": 435,
    "domain": "Division 3 · Gevurah",
    "detail": "The great iron forge of Gu’s Digital World. Intelligent machines and companions face sabotage, repair, and difficult choices."
  },
  {
    "id": "tiphereth",
    "n": 6,
    "name": "The Restoration Nexus",
    "short": "RESTORATION",
    "x": 450,
    "y": 548,
    "domain": "Campaign confrontation · Tiphereth",
    "detail": "The clues converge here. A proposed confrontation setting where the seeker faces the hacker-technomancer and considers how Gu may be restored."
  },
  {
    "id": "netzach",
    "n": 7,
    "name": "Tinyo Alawe’s Cool Waters",
    "short": "TINYO ALAWE",
    "x": 645,
    "y": 675,
    "domain": "Division 7 · Netzach",
    "detail": "Cool waters, Taíno and Cemí relationships, and a threatened community’s journey toward restoration."
  },
  {
    "id": "hod",
    "n": 8,
    "name": "Belie Belcan’s Heavenly Realm",
    "short": "BELIE BELCAN",
    "x": 255,
    "y": 675,
    "domain": "Division 2 · Hod",
    "detail": "A heavenly realm where guardianship and conflict demand discernment. Not every voice claiming authority can be trusted."
  },
  {
    "id": "yesod",
    "n": 9,
    "name": "Papa Legba’s Crossroads",
    "short": "PAPA LEGBA",
    "x": 450,
    "y": 804,
    "domain": "Division 1 · Yesod",
    "detail": "All roads are requested, never seized. The Tcha Tcha calls Papa Legba; only he may grant passage after the seeker meets his conditions."
  },
  {
    "id": "malkuth",
    "n": 10,
    "name": "The Temple of Gu",
    "short": "THE TEMPLE",
    "x": 450,
    "y": 950,
    "domain": "Opening threshold · Malkuth",
    "detail": "Torii, Fá, the Poto Mitan, the living Fèt, Ogou’s welcome, Ọ̀ṣun’s mandate, and the seeker’s preparation before the road."
  }
];
export const paths = [
  {
    "n": 11,
    "from": "chokmah",
    "to": "binah",
    "kind": "campaign"
  },
  {
    "n": 12,
    "from": "chokmah",
    "to": "chesed",
    "kind": "campaign"
  },
  {
    "n": 13,
    "from": "chesed",
    "to": "netzach",
    "kind": "campaign"
  },
  {
    "n": 14,
    "from": "gevurah",
    "to": "tiphereth",
    "kind": "reserved"
  },
  {
    "n": 15,
    "from": "chokmah",
    "to": "tiphereth",
    "kind": "reserved"
  },
  {
    "n": 16,
    "from": "chesed",
    "to": "tiphereth",
    "kind": "reserved"
  },
  {
    "n": 17,
    "from": "netzach",
    "to": "hod",
    "kind": "reserved"
  },
  {
    "n": 18,
    "from": "binah",
    "to": "tiphereth",
    "kind": "reserved"
  },
  {
    "n": 19,
    "from": "tiphereth",
    "to": "hod",
    "kind": "reserved"
  },
  {
    "n": 20,
    "from": "gevurah",
    "to": "hod",
    "kind": "campaign"
  },
  {
    "n": 21,
    "from": "tiphereth",
    "to": "yesod",
    "kind": "reserved"
  },
  {
    "n": 22,
    "from": "chesed",
    "to": "gevurah",
    "kind": "reserved"
  },
  {
    "n": 23,
    "from": "binah",
    "to": "gevurah",
    "kind": "campaign"
  },
  {
    "n": 24,
    "from": "netzach",
    "to": "yesod",
    "kind": "reserved"
  },
  {
    "n": 25,
    "from": "kether",
    "to": "tiphereth",
    "kind": "campaign"
  },
  {
    "n": 26,
    "from": "kether",
    "to": "binah",
    "kind": "reserved"
  },
  {
    "n": 27,
    "from": "netzach",
    "to": "tiphereth",
    "kind": "campaign"
  },
  {
    "n": 28,
    "from": "kether",
    "to": "chokmah",
    "kind": "reserved"
  },
  {
    "n": 29,
    "from": "netzach",
    "to": "malkuth",
    "kind": "reserved"
  },
  {
    "n": 30,
    "from": "hod",
    "to": "yesod",
    "kind": "campaign"
  },
  {
    "n": 31,
    "from": "hod",
    "to": "malkuth",
    "kind": "reserved"
  },
  {
    "n": 32,
    "from": "yesod",
    "to": "malkuth",
    "kind": "campaign"
  }
];
export const campaignRoads = [32,30,20,23,11,12,13,27,25];
