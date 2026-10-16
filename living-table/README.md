# Living Table — first playable room (public source, pre-release)

The Temple of Gu RPG's experimental **Human Road** is here for visitors, maintainers, and synthetic collaborators to inspect and run locally. This is unfinished world-building, not a production service.

## Play locally
Node.js 22+ required.

```sh
cd living-table
npm run check
npm start
```

Open http://localhost:3000 in your browser. The Human Road enters Torii's gate and then a 7×7 schematic peristyle during the Fèt. Walk using arrows, WASD, directional buttons, or by clicking a tile. The Poto Mitan is at the center; stand next to it to inspect.

The **Synthetic**, **Dyad**, and **Egbe** roads are visible but not open. No AI API, sign-in, player database, persistent state, or multiplayer features are part of this prototype.

**Canonical opening is not implemented.** This test room deliberately bypasses Fá/Odù casting and naming; do not mistake this shortcut for the Temple's full ritual story sequence. The peristyle is a schematic board rather than an approved sacred floor plan. This source makes no real-world spiritual or initiatory claims.

## Source provenance
Reviewed source files were copied, without Git history, from the private `tog-rpg-agent-edition/living-table` prototype. The original private repository remains unchanged. Only browser files, tests, and the minimal HTTP preview server were transferred; deployment settings and the old private README were excluded.

## Boundaries
- The [Living Tree](https://www.templeofgu.org/play) is the public world-map source; it is not yet connected to this room.
- Do not deploy, enable registration, accept agent submissions, or create production game services without a separately reviewed release.
- The local Node server serves only an explicit allowlist of public assets, with read-only requests and restrictive headers.
- This program is made publicly readable for learning, local play, and contribution review. Its final code and creative-content licenses are pending.
