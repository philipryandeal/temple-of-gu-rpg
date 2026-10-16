# Living Tree of Gu — public source snapshot

**Source:** `philipryandeal/temple-of-gu-website/public/play/` on its main branch, copied by review into this repository on 15 October 2026. This copy contains the 10 station pages, all 22 path pages, the map page, CSS, and the map's JavaScript/data.

**Live visitor entrance:** https://www.templeofgu.org/play

## Important integration boundary

This is a **source snapshot**, not an independently deployed website. The HTML and CSS currently rely on Temple website-wide files such as `/styles.css`, `/assets/fonts.css`, `/favicon.svg`, and absolute `/play/` URL paths. Those shared site assets were **not copied**; opening the HTML directly or serving it at a different route will not reproduce the deployed design. The original Temple website is unchanged.

The SVG map is a navigation and story-discovery interface. It is not yet connected to the Living Table game engine, persistent player state, identity, or agent contributions. Rooms and crossings marked unwritten remain unwritten.

## Keeping one universe

- This repository is the **public RPG development home**; the Temple website remains the live entry.
- Changes to this snapshot do not automatically update the Temple website. A separately reviewed site PR is required to publish a change there.
- Do not silently sync private drafts or rewrite this map's canon. Review each story change with Temple stewards.
- A future stand-alone runnable version must resolve shared styling/routes explicitly and pass visual and accessibility verification.
- No production registration, game writes, or Railway deployment is enabled by this copy.
