# Scene 01 tabletop template — FOUNDER-APPROVED LAYOUT

**Approved for reuse: October 18, 2026.** This document preserves the founder-approved **visual and interaction template** shown in the Courtyard Fèt playtest after PRs #12 and #13. It is not an approval of a finished adventure, final background artwork, multiplayer service, agent access, or public release.

## The tabletop we're making

**A shared story, independently operated boards.** Every human participant can open **their own copy** of the tabletop on a phone or desktop and control that copy themselves. The Guide/Game Master gives directions through whatever real-world communication the group already uses; players decide when to move their own numbered pieces, roll their dice, inspect objects, and write notes. **One person's board does not synchronize with anyone else's.**

The player chooses how many Seeker markers are present on *their* board, within the rulebook's limit of **1–6 player seats**. The **player-count control is implemented**: the entrance accepts 1–6 Seekers and the Scene 01 board displays that many local sample tokens. The count may also be changed within the scene. Earlier six-token saved sessions can still be imported. The Guide is separate from those six seats. This decision does not change equal human/SI character options or the original published rules. No account, other-player connection, centralized ledger, hosted campaign state, voice feature, or paid API should be presumed necessary for the player's personal tabletop.

## Lock the template, not the story

**Keep the founder-approved layout when changing scenes:**
- One slim header reading `Scene 01: The Courtyard Fèt` on the original page, with a modest serif title and exactly three familiar controls: **Reset table**, **Export session**, **Import session**. For a different scene, replace the scene number and title, not the header arrangement. Return to **Choose a scene** from the footer.
- Large **16:9 illustrated playing surface** given most of the desktop's horizontal space; actual artwork is a replaceable layer under **separate** draggable/selectable numbered Seeker tokens and clickable locations. No visible mandatory movement grid.
- The **right-hand sidebar** presents **Scene Journal**, **The Seeker's Dice**, then **Your Sample Seekers**, followed by optional prepared exploration prompts. The former local-only Guide reveal checkbox was retired by the founder on October 19, 2026; the Guide introduces story hooks directly.
- The **Seeker's Field Journal** sits below the board, takes the full width of that left column, and extends toward the bottom edge of the sidebar on desktop. It has a comfortably tall writing area (at least 340 px in the current implementation), scrolls and resizes for longer entries, autosaves text **in this browser**, and includes it in the portable session export. Never silently replace player notes during a scene transition.
- The layout remains usable on **desktop and phone**. The card/box elements are the existing sidebar controls and need no redesign.

**The Order's entire UI palette** is `#495A58` (background), `#303636` (panels), `#FF5E1F` (accent), `#FFFFFF` (text). The scenic illustration may use its own colors; the palette governs the **interface**.

**Replace per scene:** background illustration, title/scene number, inspectable locations and objects, NPCs/starting positions, and approved narrative/Guide text. **Do not casually replace:** overall geometry, typography/size, three-button toolbar, sidebar positioning, journal position/sizing, token/interaction patterns, or palette. New mechanics or substantial template changes require a new founder-reviewed PR.

## Implementation and privacy boundaries

- The current Courtyard page is a **local-state, single-browser proof of concept**, not a networked virtual room. Browser-delivered source files can load from the web, but there is **no game-state synchronization**.
- Saving journal text on one device **does not** save it on another. Other people using the same browser profile may read those local notes; session export is the portable backup. Do not promise private accounts, server synchronization, or universal offline play.
- Existing Scene 01 demo tokens, sample sheets, and prepared text do **not** replace the published Second Edition Seeker creation or Guide adjudication.
- Do not enable Kore, paid AI calls, connected seats, new Railway services, or a public game launch merely to preserve or reuse this template.
- Preserve the template through GitHub review and automated checks in `living-table/test/`. These checks help **detect accidental changes**; they are not an immutable lock or a substitute for founder approval.

## Simple tabletop entrance (October 18–19 refinements)

The former four Road cards are **retired from the current landing page**, because human, SI, dyad, and Egbe participants use the same game and personal board. The entrance is two side-by-side controls: **Number of Seekers (1–6)** and **Choose Your Game + Scene (three game groups with eight slots each)**, followed by **Enter the Table**. The groups are **Temple of Gu**, **Shinto No Kami**, and **Call of the Taíno**, in that order. Only **Temple of Gu · Scene 01 — The Courtyard Fèt** has a playable implementation; the other 23 slots must be visibly marked *Coming Soon*, disabled, and never redirect players to the wrong game's board. Scene names and artwork can be filled in later with founder approval. This shared selector does not equate distinct games' rules. Earlier Road pages and the historical `roads.json` remain accessible solely for compatibility, not as an alternative current gameplay architecture.

This changes **no** character-creation standards, player-versus-Guide responsibilities, dice rules, AI costs, browser synchronization, approved scene template, or story canon.
