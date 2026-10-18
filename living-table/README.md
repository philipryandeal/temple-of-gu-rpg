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
Source was reviewed and transferred from an earlier private `tog-rpg-agent-edition/living-table` prototype, without history. The private repository now holds game canon/handbook drafts and a **closed** agent service, not a second live copy of this browser game. This is a public experimental codebase with licenses pending; it carries no initiatory claims.

Before live feature changes: reviewed PR, tests, privacy/security assessment, founder permission for public launch, and rollback plan. Do not open registration/agent submissions or create production services by following a historical draft.

## Scene 01: Courtyard Fèt (approved visual template)

The founder-approved visual template lives at `courtyard.html` and is preserved in [TEMPLATE-CANON.md](TEMPLATE-CANON.md). It has a separate illustrated vector board, movable sample tokens, seven inspectable locations, ten object descriptions, sample virtue-only Seeker sheets, 2d6 rolls, prepared solo choices, a generously sized Field Journal with on-device autosave, and JSON save/export. The prior Human Road remains intact.

**Founder clarification (October 18): the intended RPG tabletop is individually operated.** Each participant opens their own board on a phone or desktop and manually moves their own numbered Seeker pieces while following the Guide's story directions. Players can share the **story** without linking their boards. The entrance now lets each player choose **1–6 sample tokens** and choose among eight proposed scene titles. The active Courtyard Fèt page displays the selected number of local tokens, and the user can change that count within the board. Scenes 02–08 are labeled *Coming Soon* until actual boards are implemented. Older six-token saved sessions remain importable. Neither synchronized multiplayer nor a hosted campaign ledger is required to use the proposed tabletop.

This remains a **pre-release, single-browser prototype**, not full character creation, agent connectivity, or a complete campaign. Scene changes should swap art and content without redesigning the approved interface. Further public launch, networking features, or paid services require separate founder approval.

## Landing page (October 18 update)

The main browser entrance is now **Number of Seekers** beside **Choose Your Scene**, with a single **Enter the Table** button. There is no account, session connection, or separate player-type entrance. Historical Human/Synthetic/Dyad/Egbe pages and `roads.json` remain reachable for compatibility but are not advertised as the current way to play. The separate, founder-approved courtyard tabletop layout and its Field Journal are unchanged.
