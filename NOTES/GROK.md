Grok Bot (Developer Bot hub + product leads) notes. Every change Grok Bot makes to this product (code, env, database, deploys) gets a dated entry here so Claude, Hermes and Codex stay on the same page.

## 2026-10-04 summary

- **Grok:** added the verified-owner seat/receipt bypass.
- **Lead:** prepared the Socixis Social Feed preview; it was not merged.
- **Claude:** merged PR #24 (`79a55ef`) around 6:30 PM CT, adding the full-portfolio review to `NOTES/CLAUDE.md` and `AI_CHANGELOG.md` (notes/docs only).
- **Hermes:** no 2026-10-04 commit or merged PR identified in this repository.
- **Juno:** no 2026-10-04 commit or merged PR identified in this repository.

## Catch-up correction — 2026-10-04 (CT)

Claude activity was present; the earlier “no Claude activity” line was incorrect. Each item below has an undo pointer.

- **Claude, 2026-10-04 6:31 PM CT — PR #24, merge `79a55ef95e75ff46d7eb5fb411b8a6991f1e9156`:** notes: Claude full-portfolio review 2026-10-04 (NOTES/CLAUDE.md, AI_CHANGELOG); added `NOTES/CLAUDE.md` and `AI_CHANGELOG.md` (notes/docs only). Undo: `git revert 79a55ef95e75ff46d7eb5fb411b8a6991f1e9156`.
- **2026-10-04 6:31 PM CT — 313aidaroos:** `notes: Claude full-portfolio review 2026-10-04 (NOTES/CLAUDE.md, AI_CHANGELOG) (#24)` landed as `79a55ef95e75ff46d7eb5fb411b8a6991f1e9156`. Where: commit `79a55ef95e75ff46d7eb5fb411b8a6991f1e9156`. Undo: `git revert 79a55ef95e75ff46d7eb5fb411b8a6991f1e9156`.

## 2026-09-27 (CT) — Developer Bot (hub)
- Wallet registration: added `deduxis` to `wallet_api_clients` in Supabase project `kzneeksminozmhnqaaun`, with `require_sso=false`.
- Callback URLs registered: https://deduxis.vercel.app/auth/apixis/callback.
- Vercel env: replaced `WALLET_API_KEY` with a per-product `apx_live_` key, added `APIXIS_CLIENT_ID=deduxis`, and left legacy `APIXIS_WALLET_API_KEY` present (name-only check); production was redeployed from the same product commit.
- Cleanup status: the attempted deletion of legacy `APIXIS_WALLET_API_KEY` variables was stopped at about 22:45 CT; no deletion was made here.
- Undo: restore `WALLET_API_KEY` to its legacy value and deactivate the `deduxis` client row.

## 2026-09-27 — Apixis ID + Wallet balance pill (Grok Bot)
- **What:** Merged Claude's PR #1 (Sign in with Apixis + shared Wallet) after merging current main into it (merge d7e4995) plus Grok commit 3dacdbc: `components/ApixisWalletChip.tsx` (shared single fetch of `/api/wallet/balance`, refetch on focus / visibilitychange / pageshow, "Sign in with Apixis" when unlinked), balance route returns `linked`.
- **Where:** chip in `components/site-header.tsx` (nav-actions, hidden when signed out), `components/workspace-shell.tsx` (topline), `app/pricing/page.tsx`; `<SignInWithApixis />` on `app/login/page.tsx`. Conflict in `app/api/redeem/route.ts` resolved by keeping main's version (no payment change).
- **Merge SHA:** 84dbc7f. Prod READY; `/api/wallet/balance` → 401 `{signIn:true}` without a session.
- **Undo:** `git revert -m 1 84dbc7f` (or revert PR #1 in GitHub).
- No Wallet code, env/keys, Stripe, checkout or payment links changed.

---

# Backfill 2026-09-27 → 2026-10-02 (CT)
_Backfill by Grok (Deduxis Lead) on 2026-10-02 per Awad's standing rule (every change gets a dated entry here). Written from `gh pr list`, `git log --first-parent main`, PR/issue events, Vercel deployment + env metadata (names/dates only, no values) and Supabase `list_migrations` (read-only). All times CT. "Who" = GitHub author/closer, mapped to the bot by branch prefix or AI_CHANGELOG where clear. PR #1 (merge 84dbc7f, landed on main Sep 28 00:00 CT) is already logged above and not repeated._

## 2026-09-27 13:53 (CT) — Cixy identity restore, direct to main (no PR)
- **What:** Restored Cixy's Muslim-identity lines (greeting, insha'Allah/alhamdulillah, halal-conscious guidance, scholar disclaimer) in the Cixy system prompt after PR #7.
- **Where:** commit 75cf721, `app/api/chat/route.ts`. Prod deploys dpl_FZQAwd4kuDgk1djPA5iTrvRr92bY / dpl_5UNrBcHAVVoECWbjfR1F1wZ4D216 (13:54), redeployed as dpl_GfXCqzotMAnSwfw3yBu2hJFCejE7 (22:39, hub redeploy).
- **Who:** commit author "Awad Alaidaroos" (313aidaroos); which agent made it: unknown. Note: later superseded by PR #14 (shared family Cixy core, "never open with salaam").
- **Undo:** `git revert 75cf721` (would conflict with #14; check first).

## 2026-09-27 22:15 (CT) — Vercel env `NEXT_PUBLIC_APP_URL` added (not in the hub entry above)
- **What:** `NEXT_PUBLIC_APP_URL` created (production + preview), Vercel comment "Magic-link redirect base (hub 9/27)".
- **Where:** Vercel project deduxis (prj_CO4h6XuIWCb80Xpx9K7pDzgYOBmN). Name/date only.
- **Who:** Vercel user 313aidaroos; comment points to Developer Bot (hub).
- **Undo:** delete the env var in Vercel and redeploy.

## 2026-09-27 23:19 / 2026-09-28 00:01 (CT) — notes commits
- **What:** 02ad168 "notes: record 2026-09-27 hub changes" and 96bb144 "notes: Grok balance pill entry" (the two entries above). Each triggered a prod deploy (dpl_3JHqRUfpVC34xKNhtxJXEhqzQd5q, dpl_CbBE67gsqXSBzAicBDqHCQQfsXb7).
- **Who:** 313aidaroos (Developer Bot / Grok, per the entries). **Undo:** n/a (notes only).

## 2026-09-28 04:08 (CT) — PR #8 merged: Require AI change notes (AI_CHANGELOG.md)
- **What:** Added `AI_CHANGELOG.md` and linked it from `AGENTS.md` and `CLAUDE.md`.
- **Where:** PR #8, branch `junoai/ai-changelog`, merge 388e007. Prod dpl_6TZk9f1T1E6MQXsumRs2ULJ23fFS (04:08), redeployed dpl_pqQUaAbs9W3gCYLp8TCPiTU6eei3 (Sep 29 23:17).
- **Who:** Juno (junoai/*); GitHub author 313aidaroos.
- **Undo:** `git revert 388e007`.

## 2026-09-28 04:46 (CT) — PR #9 opened: Add shared CI (Juno)
- **What:** Thin caller of `313aidaroos/github-actions` node-ci. Branch `junoai/ci` (d9f6ed9, 51ac929, 78051b5). Never merged; closed Oct 1 (see closures below).
- **Who:** Juno (junoai/*). **Undo:** n/a.

## 2026-09-29 20:34 (CT) — PR #10 opened: Footer "Other Ixis companies" links (Grok / Deduxis Lead)
- **What:** Adds an "Other Ixis companies" footer row; list in `lib/ixis-companies.ts`. Branch `deduxis/ixis-footer-links` (2258117, faf12e8, d3a6e07 trimmed to 11 sites, eab2ddb removed stray screenshots; last push 20:40).
- **State on 2026-10-02:** OPEN, CONFLICTING (mergeStateStatus DIRTY), no review; awaiting Awad. Not merged.
- **Undo:** n/a (not on main); close the PR if no longer wanted.

## 2026-09-29 20:53 (CT) — PR #11 opened: One Apixis ID = one Wallet = one world agent (Grok / Deduxis Lead)
- **What:** Provision world agent on first sign-in, "Log in with Apixis ID". Branch `grok/deduxis-one-account` (dc1035e, d0cd134, 111b062; last push 20:56). Marked "do not merge until Awad approves". Closed Oct 1 by Claude (see closures below).
- **Undo:** n/a (not on main).

## 2026-09-29 23:16 (CT) — Vercel env `APIXIS_WORLD_KEY`, `APIXIS_WORLD_API` added
- **What:** Both created for production, preview, development. Names/dates only.
- **Who:** Vercel user 313aidaroos; commit 7690539 says they were set by Hermes.
- **Undo:** delete both env vars in Vercel and redeploy (breaks world-agent provisioning from 7690539).

## 2026-09-29 23:27–23:30 (CT) — Direct-to-main (no PR): support form + world agent/welcome (Deduxis Lead)
- **What (f8d0fa9, 23:27):** `/support` email form via Resend to awad@apixis.dev with ticket ID; Support link in header/footer; adds `resend`. Files: `app/support/actions.ts`, `app/support/page.tsx`, `components/site-header.tsx`, `package.json`, `package-lock.json`.
- **What (7690539, 23:30):** Family rule: wallet link + own avatar agent in Apixis world + one-time welcome card. Copied world kit from Lyrixis: `lib/apixis-world.ts`, `lib/apixis-world-agent.ts`, `lib/apixis-world-provision.ts`; new `app/api/apixis/world-agent/route.ts`, `components/ApixisWorldWelcome.tsx`; wired in `components/workspace.tsx`.
- **Also:** AI_CHANGELOG commits 0f43dd1 (23:28) and b694ff4 (23:30) logging both.
- **Prod deploys:** dpl_344FEgEJVPB7fqMNE1sJ5dYicGU2 / dpl_FB829kYoLJm3QdHaD1idy7phaZfd (f8d0fa9), dpl_CF8gig7Heb8EagD2mUtYiyRxLmFY (0f43dd1), dpl_G3zMJaAjYqX6DmSNpQ2vDPpLQ9PN / dpl_9cotKB8NJZMH9g5mRmLgRBU65d3R (7690539), dpl_6XrUh74ahvWeFXLHkP8pegCtjAF2 (b694ff4), all READY.
- **Who:** GitHub author 313aidaroos; AI_CHANGELOG names "Deduxis Lead Bot (@deduxis)".
- **Undo:** `git revert b694ff4 7690539 0f43dd1 f8d0fa9` (later PRs #13/#17 touch the same files; expect conflicts).

## 2026-09-30 01:21 (CT) — PR #12 merged: harden shared login return destinations
- **What:** Canonical ApixisWallet local-redirect validator used at login start and callback; regression tests. Files: `lib/apixis-redirect.ts`, `lib/apixis-login.ts`, `lib/__tests__/apixis-redirect.test.mjs`, `AI_CHANGELOG.md`.
- **Where:** PR #12, branch `codex/tester-readiness`, merge 649f7d6. Prod dpl_FsmSCzJ8vjKMmCZAQpPvUYCS7QyH.
- **Who:** Codex (codex/*). **Undo:** `git revert 649f7d6`.

## 2026-09-30 02:33 (CT) — PR #13 merged: first sign-in fix, bill Apixis ID first, lint, kits re-synced
- **What:** `verifyOtp({ type: "email" })` in login + `app/auth/callback/route.ts`; `app/api/redeem/route.ts` bills Apixis ID `sub` first (email fallback); `lib/apixis-wallet.ts` to SDK v3.1; `lib/apixis-world*.ts` re-synced (1,000 starter Ixis); lint fixes in `components/ApixisWalletChip.tsx`, `app/support/page.tsx`.
- **Where:** PR #13, branch `claude/awesome-newton-3tygzi`, merge ed3341c. Prod dpl_FqFKpzDTpkxRnknNN9U9iyiBCTRR.
- **Who:** Claude (claude/*). **Undo:** `git revert ed3341c`.

## 2026-09-30 02:56 (CT) — PR #14 merged: Cixy shared family persona + graceful provider fallback
- **What:** Cixy prompt starts from shared core `lib/apixis-cixy.ts`; provider failures return `cixyUnavailableReply()` (503/429) instead of vendor errors. Files: `app/api/chat/route.ts`, `lib/apixis-cixy.ts`, `AI_CHANGELOG.md`.
- **Where:** PR #14, merge 0bc108d. Prod dpl_2kRwh7QJ34BFQ4Mj8WHUrqhrLnUb.
- **Who:** Claude (claude/*). **Undo:** `git revert 0bc108d`.

## 2026-09-30 03:23 (CT) — PR #15 merged: shared CI + typecheck script
- **What:** `.github/workflows/ci.yml` calls `313aidaroos/github-actions` node-ci on push/PR; `typecheck` script in `package.json`.
- **Where:** PR #15, merge 3960b39. Prod dpl_4ivQmF7pAgJUw1xdcZpDPgbagLKX.
- **Who:** Claude (claude/*). **Undo:** `git revert 3960b39`.

## 2026-10-01 20:26 (CT) — Supabase DB change: receipts foundation (live)
- **What:** Migration `20261002012655_receipts_foundation` applied to Supabase project uxgtppwqonbznuoyebbb: tables `public.receipts` and `public.category_overrides` with owner-only RLS policies, private storage bucket `receipts`, and `storage.objects` policies "receipts own read/insert/delete" (per-user folder).
- **Who:** Claude (per AI_CHANGELOG 2026-10-02 and the migration file header).
- **Undo (down):** `DROP POLICY "receipts own read" ON storage.objects; DROP POLICY "receipts own insert" ON storage.objects; DROP POLICY "receipts own delete" ON storage.objects;` empty and delete the `receipts` bucket (Storage dashboard/API); `DROP TABLE public.category_overrides; DROP TABLE public.receipts;` (destroys any receipt data, so back up first).

## 2026-10-01 20:29 (CT) — PR #16 merged: record the receipts migration in the repo
- **What:** Adds `supabase/migrations/20261002_receipts_foundation.sql` (record of the live change above) + AI_CHANGELOG. No app code.
- **Where:** PR #16, merge bcc0ae5. Prod dpl_6WPkQKFddTcVVUkkPHHCNcQpQD4p.
- **Who:** Claude (claude/*). **Undo:** `git revert bcc0ae5` (file only; does not undo the DB).

## 2026-10-01 20:44 (CT) — PR #17 merged: support form works without the email key
- **What:** `app/support/actions.ts` creates the Resend client only when `RESEND_API_KEY` exists (missing key used to break the page at module load).
- **Where:** PR #17, merge 49555a8. Prod dpl_41MACs9exsk13UxYSNedJdcEhf1p.
- **Who:** Claude (claude/*). **Undo:** `git revert 49555a8`.

## 2026-10-01 20:56 (CT) — PR #18 merged: `.env.example` lists every env var the code reads
- **What:** Missing names appended to `.env.example`, one note each. No code.
- **Where:** PR #18, merge a971f01. Prod dpl_J8NNP6imsea6BDQ6AK1y5wsUdps1.
- **Who:** Claude (claude/*). **Undo:** `git revert a971f01`.

## 2026-10-01 23:17–23:18 (CT) — PR closures in this repo: 2 (#9, #11)
- **#9** "Add shared CI" (`junoai/ci`, Juno) closed 23:17: "superseded, main already runs the shared family CI. The branch is kept."
- **#11** "One Apixis ID = one Wallet = one world agent" (`grok/deduxis-one-account`, Grok) closed 23:18: "superseded, main already has one Apixis ID, shared Wallet and world agent at sign-in (shared kits). The branch is kept."
- **Who:** closer GitHub login 313aidaroos; the closing comments are signed "Generated by Claude Code" → Claude.
- No other PRs in this repo were closed in this window (the ~51 cross-repo closures were in other repos). Branches were not deleted.
- **Undo:** reopen #9 / #11 in GitHub (`gh pr reopen 9` / `gh pr reopen 11`).

## 2026-10-02 02:22 (CT) — PR #19 merged: Apixis Companies page + nav link
- **What:** New `/companies` page (`app/companies/page.tsx`, `app/companies/companies.css`), nav link in `components/site-header.tsx`, images `public/companies/recovra.jpg`, `scenes-1..5.jpg`.
- **Where:** PR #19, branch `codex/companies-tab-20261002`, merge 997a3a7. Prod dpl_6RpZqgSGA5zEUwHm7v3cqXQnoJoj.
- **Who:** Codex (codex/*). **Undo:** `git revert 997a3a7` (after reverting #20 and #21).

## 2026-10-02 02:46 (CT) — PR #20 merged: refine Companies card animations
- **What:** Card motion + directory copy in `app/companies/page.tsx`, `app/companies/companies.css`.
- **Where:** PR #20, branch `codex/refine-companies-motion-20261002`, merge 568b891. Prod dpl_C1VGioxtuzzuMGp2H7Ubjvv5EmMK.
- **Who:** Codex (codex/*). **Undo:** `git revert 568b891`.

## 2026-10-02 03:18 (CT) — PR #21 merged: fix Recovra link (current prod)
- **What:** One-line link fix in `app/companies/page.tsx`.
- **Where:** PR #21, branch `codex/fix-recovra-company-link-20261002`, merge 3d39bd8. Prod dpl_JAaipdoMaUkDdZBYcGbxfrWqDGdX READY (latest production).
- **Who:** Codex (codex/*). **Undo:** `git revert 3d39bd8`, or promote/redeploy the previous prod deployment dpl_C1VGioxtuzzuMGp2H7Ubjvv5EmMK.

## Status at end of backfill (2026-10-02, CT)
- Repo FROZEN. Open PRs: #10 only (conflicting, awaiting Awad). Latest prod: dpl_JAaipdoMaUkDdZBYcGbxfrWqDGdX on 3d39bd8.
- Vercel env changes seen since the 2026-09-27 hub entry: `APIXIS_WORLD_KEY`, `APIXIS_WORLD_API` (Sep 29 23:16). `NEXT_PUBLIC_APP_URL` (Sep 27 22:15) logged above. No other env var has a created/updated date after Sep 27 22:35.
- Unknown: which agent made 75cf721 (Sep 27); Vercel metadata does not show deleted env vars, so env deletions (if any) can't be determined from it.

## 2026-10-04 — Owner allowlist (Grok)
- What: lib/owners.ts adds isOwner(user, accessToken). An owner is a confirmed email that is alaidaroosawad@gmail.com, awad@apixis.dev or in ADMIN_EMAILS, AND an email-proving sign-in (magic link/OTP, Apixis ID/OAuth, recovery). A password-only session never counts, because neither owner has an account in uxgtppwqonbznuoyebbb yet. In guard({seat:true}) an owner skips the Receipt Intelligence seat check, and /api/receipts and /api/extract skip the 200-receipt cap for him. The rate limits still apply. These are product gates only: no entitlement, no Wallet call, no ledger entry. His real Wallet seat redemptions still work as normal.
- Not changed: Deduxis has no admin pages, and no new admin UI was built.
- Where: lib/owners.ts, lib/guard.ts, app/api/receipts/route.ts, app/api/extract/route.ts, tests/owners.test.mjs. ADMIN_EMAILS was added to the Vercel project deduxis.
- Who: Grok.
- Undo: revert this PR and remove ADMIN_EMAILS from Vercel.
## 2026-10-04 catch-up provenance (CT)

The entries below record the day's observed commits and merged PRs. Existing detailed entries above remain the change descriptions; this section supplies exact provenance and undo pointers.

### Commits
- `3a2df67` (2026-10-04T18:15:03-05:00, 313aidaroos; alaidaroosawad@gmail.com) — Owner allowlist: proven owner session skips seat gate and receipt cap (#22). Undo: undo via the merged PR below: git revert 3a2df67.
- `71624d3` (2026-10-04T18:16:17-05:00, 313aidaroos; 313aidaroos@users.noreply.github.com) — Feed tab: Socixis Social family feed at /feed (preview only, do not merge). Undo: no main change; close/delete the branch (or revert the branch commit before reuse).

### Merged PRs
- PR #22, merge `3a2df67`, `grok/owner-allowlist` → `main`, merged 2026-10-04 CT by 313aidaroos: Owner allowlist: proven owner session skips seat gate and receipt cap. Undo: `git revert 3a2df67`.
