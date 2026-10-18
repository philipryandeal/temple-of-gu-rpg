# Scene 01 tabletop template — FOUNDER-APPROVED LAYOUT

**Approved for reuse: October 18, 2026.** This document preserves the founder-approved **visual and interaction template** shown in the Courtyard Fèt playtest after PRs #12 and #13. It is not an approval of a finished adventure, final background artwork, multiplayer service, agent access, or public release.

## The tabletop we're making

**A shared story, independently operated boards.** Every human participant can open **their own copy** of the tabletop on a phone or desktop and control that copy themselves. The Guide/Game Master gives directions through whatever real-world communication the group already uses; players decide when to move their own numbered pieces, roll their dice, inspect objects, and write notes. **One person's board does not synchronize with anyone else's.**

The player chooses how many Seeker markers are present on *their* board, within the rulebook's limit of **1–6 player seats**. This selectable player-count control is **a future requirement, not present in Scene 01**: the present demo shows six sample tokens. The Guide is separate from those six seats. This decision does not change equal human/SI character options or the original published rules. No account, other-player connection, centralized ledger, hosted campaign state, voice feature, or paid API should be presumed necessary for the player's personal tabletop.

## Lock the template, not the story

**Keep the founder-approved layout when changing scenes:**
- One slim header reading `Scene 01: The Courtyard Fèt` on the original page, with a modest serif title and exactly three familiar controls: **Reset table**, **Export session**, **Import session**. For a different scene, replace the scene number and title, not the header arrangement. Return to **Four Roads** from the footer.
- Large **16:9 illustrated playing surface** given most of the desktop's horizontal space; actual artwork is a replaceable layer under **separate** draggable/selectable numbered Seeker tokens and clickable locations. No visible mandatory movement grid.
- The **right-hand sidebar** holds scene information, the Seeker selection/partial character sheet, published 2d6 + Virtue dice, Guide reveal for the demo, and optional prepared exploration prompts.
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
