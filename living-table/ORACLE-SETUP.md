# Kore Oracle — first integration stage

This is a character-creation **chat foundation** rather than a completed character generator. The official Master Guidebook governs mechanics. The visitor talks with Kore in the Human Road; the game separately validates a Seeker draft with `seeker.mjs`.

The API route is **off by default**. To enable it intentionally, configure these service variables on the existing Railway `living-table-web` service:

- `KORE_CHAT_ENABLED=true`
- `OPENAI_API_KEY` — private OpenAI API credential; **never add to GitHub or browser code**
- `OPENAI_MODEL` — reviewed OpenAI API model identifier; required

Keep the chat disabled until you have selected an API budget and verified abuse protection. This initial server has a basic process-local rate limit (not sufficient for sustained public traffic or multi-replica deployments). Launch at low traffic only after separately reviewing provider spend limits, privacy disclosure, moderation and production-grade throttling. It sends up to ten recent chat turns to OpenAI but does not persist them in an application database.

No API keys are set by the PR. No automatic billing occurs before deliberate activation. There is no player login or saved characters. An assistant message is advisory, not authoritative mechanical state. `KORE_INSTRUCTIONS` is based on the founder-provided Oracle GPT instructions and places published Second Edition rules first.

The publicly supplied Custom GPT link is not an API endpoint and is not invoked by this implementation.
