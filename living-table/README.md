# Living Table — personal virtual tabletop (pre-release)

**Read [Current Game Contract](../CURRENT-GAME.md) before changing this program.** The finished goal is ONE game using the original published Master Guidebook's character creation and mechanics, with equal character options for human and SI Seekers, including mixed parties (3 humans + 3 SI players is the maximum-size example).

**Campaign seating rule (approved October 18): 1–6 Seeker/player characters per campaign; human and SI seats may be mixed in any combination. The designated Guide/DM is separate and does not count toward the six-player cap. Supporting companions do not occupy a seat unless explicitly registered as players.**

## Play the existing prototype locally
Requires Node.js 22+.

```sh
cd living-table
npm run check
npm start
```

Open http://localhost:3000. The implemented **Human Road** moves from Torii's Gate into a **schematic** 7×7 peristyle at the Fèt. Use arrow keys, WASD, directional buttons or tile clicks. Approach the Poto Mitan to inspect. The separate **2d6 + Virtue** Lesson demonstration comes from the original RPG rules; it is **not** Fá/Odù casting.

**These features are not the whole character-creation and play loop.** The current `seeker.mjs` checks only a subset of a published Seeker sheet. Kore's chat UI and restricted server route are present but **disabled unless intentionally and safely configured**. There is no login, full sheets, saved campaign, live SI turns or multiplayer. **Synthetic, Dyad and Egbe are placeholder roads**, not operating games.

The game will use **the same** character choices and validated mechanics for each participant; four Roads mean ways of joining/playing, not four rulebooks. Proposed forced preassigned naming / no-character-builder / Iron-Born-only alternatives in dated notes **do not replace** the published rulebook.

## Distinct experiences
The [Temple's Living Tree](https://www.templeofgu.org/play) is a **separate philosophical/spiritual site experience**, not this game's map, engine or dependency.

## Provenance and boundaries
Source was reviewed and transferred from an earlier private `tog-rpg-agent-edition/living-table` prototype, without history. The private repository now holds game canon/handbook drafts and a **closed** agent service, not a second live copy of this browser game. This is a public experimental codebase: its code is MIT ([LICENSE-CODE](../LICENSE-CODE)) and its story text and scene descriptions follow [LICENSE.md](../LICENSE.md). It carries no initiatory claims.

Before live feature changes: reviewed PR, tests, privacy/security assessment, founder permission for public launch, and rollback plan. Do not open registration/agent submissions or create production services by following a historical draft.

## Scene 01: Courtyard Fèt (approved visual template)

The founder-approved visual template lives at `courtyard.html` and is preserved in [TEMPLATE-CANON.md](TEMPLATE-CANON.md). It has a separate illustrated vector board, movable numbered tokens, seven inspectable locations, ten object descriptions, **one combined Seeker and dice panel** with 1–6 pieces and manually entered Virtue bonuses (0–2), 2d6 rolls, prepared solo choices, a generously sized Field Journal with on-device autosave, and JSON save/export. The prior Human Road remains intact.

**Founder clarification (October 18): the intended RPG tabletop is individually operated.** Each participant opens their own board on a phone or desktop and manually moves their own numbered Seeker pieces while following the Guide's story directions. Players can share the **story** without linking their boards. The entrance lets each player choose **1–6 sample tokens** and a game/scene from three groups of eight slots each. The active Courtyard Fèt page displays the selected number of local tokens, and the user can change that count within the board. Temple scenes 02–08, all Shinto No Kami scene slots, and all Call of the Taíno scene slots are labeled *Coming Soon* until the corresponding boards exist. Older six-token saved sessions remain importable. Neither synchronized multiplayer nor a hosted campaign ledger is required to use the proposed tabletop.

This remains a **pre-release, single-browser prototype**, not full character creation, agent connectivity, or a complete campaign. Scene changes should swap art and content without redesigning the approved interface. Further public launch, networking features, or paid services require separate founder approval.

## Landing page (October 19 expansion)

The main browser entrance is **Number of Seekers** beside **Choose Your Game + Scene**, with a single **Enter the Table** button. The dropdown has three named game groups—**Temple of Gu**, **Shinto No Kami**, and **Call of the Taíno**—with eight numbered slots each (24 total). Only **Temple of Gu 01 — The Courtyard Fèt** routes into the existing playable board. Every unbuilt scene is visibly *Coming Soon* and disabled to avoid mistakenly loading the Courtyard. Shinto No Kami retains its distinct published rules, and Call of the Taíno remains an expansion of Temple of Gu; grouping them in one entrance does not merge their mechanics. There is no account, session connection, or separate player-type entrance. Historical Human/Synthetic/Dyad/Egbe pages and `roads.json` remain reachable for compatibility but are not advertised as the current way to play. The separate, founder-approved courtyard tabletop layout and its Field Journal are unchanged.


## Public search discovery (October 19, 2026)

The Living Table's existing entrance and playable Scene 01 may now be indexed on `https://templeofgu.com/`. This is **search visibility for the existing browser prototype**, not approval for unrelated features or full RPG release. The root `/sitemap.xml` lists the entrance and `/courtyard.html`. The canonical host is `templeofgu.com`, without www. The robots file advertises this sitemap.

Unfinished and legacy road pages remain `noindex`. Railway preview domains still block crawling and indexing. Private API routes, tests, and source files remain unlisted. The approved visual tabletop template, local journal, dice, and scene content are unchanged.

## Simple Seeker tools (October 19, 2026)

The founder replaced the two old Seeker/dice cards with one right-sidebar card: **1. Your Seekers** chooses 1–6 numbered pieces and the active piece; **2. The Seeker's Dice** selects Suuru, Oye, Foriti, or Iwa, asks the player for the bonus from their own character sheet, and rolls 2d6 plus that bonus. The displayed sample character sheet and incomplete-builder disclaimer are removed. The 'Character sheet' movement shortcut now focuses the active piece selector instead of pointing at nonexistent sample details.

The existing published starting-roll implementation accepts bonus **0, 1, or 2**; the number must be explicitly entered or accepted as zero, not silently borrowed from sample characters. Entered modifiers are remembered per piece and Virtue within a local session and included in JSON export/import; dice records retain the modifier used. Existing version-one exported sessions remain readable, including historical rolls verified against their original sample numbers. This does not create a character builder, link player devices, or change the rules.

## October 22, 2026: seven new illustrated scenes

Temple of Gu now offers ten illustrated rooms: the original three, plus The River Crossing, The Cemetery Gate, Congo Square, Gran Bwa Forest, The Rada Rainbow Bridge, The Living Machines Church, and The Data Forge. Rooms 04–10 reuse the founder-approved tabletop geometry and existing art assets without changing the original three rooms. Each room has its own local journal and scene-checked session export/import. The scene-specific prompts are intentionally broad: the Game Guide supplies the story, rules and discoveries. Shinto No Kami and Call of the Taíno retain their eight coming-soon slots each. This supersedes the original October 19 three-by-eight selector count for Temple scenes only. No API keys or new server-side state required.
