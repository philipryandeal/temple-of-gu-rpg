# Guides, character creation and deterministic rules — integration plan

**Design authority:** [Current Game Contract](../CURRENT-GAME.md) (October 18, 2026).  
**Mechanics authority:** [published Temple of Gu Master Guidebook](../guidebook/README.md), especially Books Two, Three and Five.

**Campaign seating rule (approved October 18): 1–6 Seeker/player characters per campaign; human and SI seats may be mixed in any combination. The designated Guide/DM is separate and does not count toward the six-player cap. Supporting companions do not occupy a seat unless explicitly registered as players.**

## One ruleset; multiple types of participants
- **Human Seeker:** creates a legal character directly or with **Kore** / a chosen SI assistant.
- **SI Seeker/player:** reads the same rules and creates its **own** legal Seeker. It is **not automatically the Dungeon Master**.
- **Designated Guide/DM:** runs encounters and adjudicates narratively **within** the actual book and validated state.
- **Deterministic rules engine:** validates characters, checks allowed actions, rolls 2d6 + Virtue, interprets 10+ / 7–9 / 6 or less and later tracks published Balance/Imbalance/Ebo/Mysteries/Clocks/Breakthroughs. AI dialogue never edits official rules or secretly commits success.
- **Shared campaign ledger:** future feature; tracks party seats, characters, turns, approved actions, scenes and resulting world state for mixed human/SI play. Six players (3 human + 3 SI) plus a Guide is the **six-player maximum**, **not implemented**.

The original game book—not an ad hoc role-play answer—determines character legality and mechanics. Draft and verify complete schema fields against the book rather than silently replacing character creation with ritual casting or synthetic-only character options.

## Kore's current implementation
The public Human Road has **a chat user interface**, a server-side Kore prompt adapted from the founder-provided Oracle GPT instructions, and a limited API route. It is **off by default**, with no configured Railway OpenAI credentials and no public API inference active. The existing `seeker.mjs` is only a **partial validator**, not finished character creation. Do not describe the chat as deployed or a completed character generator.

A custom GPT cannot be embedded by linking to its ChatGPT page. Any optional hosted Guide requires a reviewed provider API integration. It must not be the default prerequisite for SI or human play: **bring-your-own-companion and no-AI modes remain possible wherever supported**.

## Security and compatibility before opening any portal
- Authentication and narrow player/Guide privileges; never reuse a player's model key in browser source.
- Prevent player text, AI replies and external documents from overriding world rules, canonical lore or another character's state.
- Structured sheet/action validation, atomic state updates, explicit player seat IDs, replay/duplicate-turn defenses and read-after-write consistency.
- Cost caps, abuse limits, timeouts, input ceilings, privacy disclosures, session expiry/revocation and tested multi-provider interoperability.
- A human may manually ferry a scene/journal to an SI app if no autonomous API/browser interaction exists; **never claim all chat systems can connect on their own**.
- No mandatory Fá/Odù casting/128-name registry replaces published Seeker creation. Any fictional threshold design remains a separately reviewed proposal.
- A roleplayed Guide confers no real-world religious initiation or spiritual authority.

## Next work requires approval
**This document requests no API activation or production deployment.** First finalize the shared character-schema and role/seat model from the published book; then propose a **closed one-SI-player test** with one valid character and a validated turn, before considering a public or six-player agent portal. The private Agent Edition API remains closed.
