# Guide assistant — integration plan (not yet online)

**Source of truth:** the published [Temple of Gu Master Guidebook](../guidebook/README.md), especially Book Five. The role is called **Guide**, not a generic fantasy Game Master.

## Two independent systems

1. **Rule engine (deterministic):** validates Seeker sheets, rolls 2d6 + Virtue, interprets 10+ / 7–9 / 6 or less, and (later) maintains six-box Balance, Imbalance, Ebo, Mysteries and Breakthroughs.
2. **AI Guide (narrative assistant):** explains character creation, presents scenes and Lessons, narrates validated outcomes, and asks the Seeker what they do. It must not secretly decide or modify mechanical results.

## Oracle GPT migration

The existing Temple of Gu Oracle custom GPT cannot be embedded or invoked directly by its public ChatGPT link. Its creator should provide the **actual GPT instructions**, any reference files, and examples of resulting Seeker sheets. Then we can author an API-backed Guide using those materials and the original rulebook.

## Production security requirements

- API key **only** in Railway server environment variables; never in browser source or GitHub.
- Do not add an unrestricted public AI endpoint. Before enabling chat, implement request caps, prompt/input limits, timeouts, bot-abuse defenses and cost ceilings.
- Keep private user answers ephemeral initially; do not assume consent to store intimate information, notes, initiatory claims, or recordings.
- Structured JSON output must be schema-checked against the game rules. AI suggestions cannot rewrite the official mechanics.
- Distinguish **2d6 Lesson rolling** from the not-yet-built **Fá/Odù entrance casting**.
- A roleplayed Guide cannot confer real-world spiritual initiation or claim verified contact with spiritual entities.

## Next integration PR

Once Philip supplies the GPT instructions, add a limited chat route and character-creation interface, with test fixtures for valid/invalid Seeker output. No API secrets or unreviewed private documents belong in public source.

This file is an implementation plan, **not a deployed Guide chatbot**.
