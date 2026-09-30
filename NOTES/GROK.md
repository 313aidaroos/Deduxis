Grok Bot (Developer Bot hub + product leads) notes. Every change Grok Bot makes to this product (code, env, database, deploys) gets a dated entry here so Claude, Hermes and Codex stay on the same page.

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

## 2026-09-29 (CT) — One Apixis ID = one Wallet = one world agent (Grok / Deduxis Lead)
- **Who:** Grok / Deduxis Lead. Approved by Awad via Developer Bot (brief /workspace/audit/one-account-brief.md).
- **What:** On the first signed-in load, `GET /api/wallet/balance` calls `ensureDeduxisWorldAgent` → Apixis.dev `POST https://www.apixis.dev/api/agent/provision` (Bearer `APIXIS_WORLD_KEY`, `from: "deduxis"`, verified email + `apixis_sub`). It is idempotent on both sides: the local flag `app_metadata.apixis_world_agent_at` skips later calls, and Apixis.dev keeps one agent per email / Apixis ID and grants the 1000 starter Ixis once (Apixis.dev makes the grant; Deduxis never grants Ixis locally; starter raised from 200 to 1000 per Awad via hub, 2026-09-29 20:54 CT). It stores `apixis_world_agent_id` / `_at` / `_name` on the Supabase **auth user app_metadata** (same keys as Renoxis), so no table or migration is needed. The workspace top line shows "Your agent is in the Apixis world ↗" (→ `/enter?from=deduxis`). The login page's primary button is now "Log in with Apixis ID". Redeem and seat lookups use the Apixis ID `sub` when linked (APIXIS_FAMILY rule 3). Also fixed the lint error that already existed in ApixisWalletChip.
- **Where:** branch `grok/deduxis-one-account` (PR supersedes #1's SSO scope; #1 was already merged). Files are listed in AI_CHANGELOG.md.
- **Supabase:** nothing applied. `list_tables` shows public still has 0 tables (supabase/schema.sql is still unapplied, and this change doesn't depend on it).
- **Env:** `APIXIS_WORLD_KEY` is **missing** on Vercel `deduxis`. It was not minted, and until Developer Bot sets it provisioning logs `apixis_world_key_missing` and retries on the next load.
- **Undo:** revert the PR merge commit (or close the PR). Stored metadata can stay; it's inert. To clear it, remove the `apixis_world_agent_*` keys from auth users' app_metadata.
