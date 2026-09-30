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

## 2026-09-30 — Claude (branch claude/awesome-newton-3tygzi)
- Changed: `lib/apixis-login.ts` re-copied from `ApixisWallet/sdk/apixis-login-next.ts` — `verifyOtp({ type: "email" })` (D16: new addresses get a `signup` token that `magiclink` rejects). `lib/apixis-wallet.ts` → SDK v3.1 (adds `marketplaceOrder`/`marketplaceSettle`). `lib/apixis-world*.ts` re-synced with Apixis.dev (15 clients incl. ominix, wattixis; 1,000 starter Ixis, D11).
- Changed: `app/auth/callback/route.ts` verifies `token_hash` as type `email` (first sign-in for a new address failed before).
- Changed: `app/api/redeem/route.ts` bills the Apixis ID `sub` first (`apixisOwner`), verified email only as fallback.
- Changed: `components/ApixisWalletChip.tsx` reads the current path with `useSyncExternalStore` (lint error `react-hooks/set-state-in-effect` made CI red); `app/support/page.tsx` escaped two apostrophes (lint errors).
- Why: family backend pass per Awad's 2026-09-30 decisions (ApixisWallet/AGENTS.md §0c D11–D16; live board: ApixisWallet/docs/FAMILY_STATUS.md). One SDK, one login kit, one world kit — copied from canonical, never patched by hand.
