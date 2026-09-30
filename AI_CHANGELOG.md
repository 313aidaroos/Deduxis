# AI Change Log

## Rules for AI models, bots, and agents

If you are an AI (Claude, ChatGPT, Grok, Gemini, Copilot, Cursor, JunoAI, or any other model, bot, or agent) and you add, modify, or delete anything in this repository, you **must** append a dated entry to this file describing what you changed and why — one entry per work session, no exceptions. This log is how the repository owner tracks what every AI did. Human commits do not need entries.

Entry format:

## YYYY-MM-DD — <your name/model>
- Changed: <files or area>
- Why: <reason>

---

## 2026-09-28 — JunoAI
- Changed: created this file
- Why: owner's standing rule — every AI that touches this repo must log its changes here

## 2026-09-29 — Grok (Deduxis Lead, approved by Awad via Developer Bot)
- Changed: lib/world-agent.ts + lib/world-agent-server.ts (new), lib/apixis-world.ts + lib/apixis-world-provision.ts (copies of Apixis.dev sdk/), app/api/wallet/balance/route.ts (provision on first signed-in load, returns `world`), components/ApixisWalletChip.tsx ("Log in with Apixis ID", `showAgent` link, lint fix), components/workspace-shell.tsx (`showAgent`), components/SignInWithApixis.tsx + app/login/page.tsx ("Log in with Apixis ID" primary button), app/api/redeem/route.ts + lib/guard.ts (owner = Apixis ID sub when linked), tests/world-agent.test.mjs, package.json `test` script, .env.example, docs/APIXIS_FAMILY.md, NOTES/GROK.md, WORKBOARD.md.
- Why: Awad's "one Apixis ID = one Wallet = one world agent" task. Each Apixis ID gets exactly one Apixis world agent (idempotent Apixis.dev provision, id stored in Supabase auth app_metadata), the shared Wallet balance pill stays in the header, and sign-in is "Log in with Apixis ID". No Stripe, Wallet internals or env values touched.
