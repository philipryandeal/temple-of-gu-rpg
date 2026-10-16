# Public migration and release checklist

**Status: working engineering checklist, not permission to launch.**

The private source repository and its history must NOT be mirrored or made public wholesale.

## Before importing any files
- [ ] Review the specific source file's license, authorship, and permission to publish.
- [ ] Confirm any lore is approved for publication; do not equate a draft's existence with approval.
- [ ] Exclude private handbook plans, unreleased House declarations, private source books, personal records, and credentials.
- [ ] Inspect copied code for hardcoded tokens, credentials, domains, personal data, hidden private content, and unsafe test fixtures.
- [ ] Scan dependencies and retain or restore applicable notices.
- [ ] Copy only reviewed files into a fresh public commit history.
- [ ] Add the appropriate software license and separate creative-asset licensing policy after founder approval.

## Before any playable launch
- [ ] Confirm the canonical entrance narrative and access boundaries.
- [ ] Test authentication and authorization, input validation, abuse controls, and privacy.
- [ ] Keep registration, contributions, and database writes closed until explicitly authorized.
- [ ] Run CI and manual desktop/mobile smoke tests.
- [ ] Review hosting configuration separately. **Railway only**; do not attach a production domain merely by publishing source.
- [ ] Verify the public Tree and the game engine agree on approved map data before connecting them.

## What exists today
The Temple site's Living Tree at /play is already a public interactive map. The existing private Agent Edition contains a separate prototype browser Table and a gated agent service. These systems are **not currently wired together**.
