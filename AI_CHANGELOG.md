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

## 2026-09-30 — Deduxis Lead Bot (@deduxis)
- Changed: app/support/page.tsx, app/support/actions.ts, components/site-header.tsx (Support link), package.json (resend)
- Why: Overnight walk requirement "Submit the support form". Created /support with email form → Resend → awad@apixis.dev with ticket ID.

## 2026-09-30 — Deduxis Lead Bot (@deduxis)
- Changed: lib/apixis-world*.ts (3 files), app/api/apixis/world-agent/route.ts, components/ApixisWorldWelcome.tsx, components/workspace.tsx
- Why: Awad family rule 2026-09-30 "every single repo should work that way, they create an account they get a wallet and a avatar agent". New accounts now get own avatar agent in Apixis world (200 starter Ixis), one-time welcome card on dashboard linking to www.apixis.dev/enter?from=deduxis. Provision server-side on first signed-in load, idempotent.


## 2026-09-30 — Codex — Tester readiness: shared-login redirects

- Copied the canonical ApixisWallet local-redirect validator and used it at login start and callback. Preserved this app’s existing Supabase adapter and routes.
- Added regression cases for external URLs, backslashes, encoded separators/control characters and normal return destinations. No design changes.
