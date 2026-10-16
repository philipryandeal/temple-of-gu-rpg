# Public RPG development and release safeguards

**A visible, evolving world—not a promise of commercial polish.**

## When importing code or material
- [ ] Verify permission to publish and license/provenance for each file.
- [ ] Use fresh public history; do not mirror private repository commits.
- [ ] Exclude secrets, private manuscripts, player data, sensitive religious instruction, and unpublished House declarations.
- [ ] Mark draft story elements as proposals pending approval.
- [ ] Run source tests and confirm asset and URL paths.

## Before extending a live game service
- [ ] Keep the deployed prototype read-only unless a separately reviewed write system is authorized.
- [ ] Validate authentication, rate limits, privacy, and abuse protections before any player registration or persistent writes.
- [ ] Run automated and manual gameplay/accessibility tests.
- [ ] Use Railway hosting only; review deployment and domains separately.
- [ ] Preserve separation from the Temple website's Living Tree and the companion Trees.

## Current state
The standalone RPG includes a public Living Table Human Road prototype, deployed at https://living-table-web-development.up.railway.app/. The Temple's interactive Living Tree at https://www.templeofgu.org/play is a **different experience** with its source in the website repository. No shared engine or automatic synchronization is intended.
