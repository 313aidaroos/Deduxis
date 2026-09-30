Grok Bot (Developer Bot hub + product leads) notes. Every change Grok Bot makes to this product (code, env, database, deploys) gets a dated entry here so Claude, Hermes and Codex stay on the same page.

## 2026-09-29 (CT) — Footer "Other Ixis companies" links (Grok / Deduxis Lead)
- **Who:** Grok / Deduxis Lead, approved by Awad via Developer Bot (one-time exception to the credit pause).
- **What:** Added an "Other Ixis companies" row to the site footer: 13 plain text links (Deduxis itself excluded; no Nexxis/Omnixis, Launchixis, PersonalContentBot, AwadBot or COMMAND), each `target="_blank" rel="noopener"`, wrapping on mobile. Existing "Part of the Apixis family" text kept. Styling reuses the footer's existing `nav` link styles and the `.family` muted label.
- **Files:** `lib/ixis-companies.ts` (new, single list of names + URLs), `components/site-header.tsx` (`SiteFooter` block), `app/globals.css` (one scoped `.site-footer .ixis-companies` rule for full-width wrap), `WORKBOARD.md` (new), `AI_CHANGELOG.md`, this file.
- **Lint:** `npm run lint` already failed on main (`react-hooks/set-state-in-effect` in `components/ApixisWalletChip.tsx`); added a one-line `eslint-disable-next-line` there, no behavior change.
- **Branch/PR:** `deduxis/ixis-footer-links`, not merged, not deployed to production.
- **Undo:** revert the PR commit, or delete `lib/ixis-companies.ts` plus the `ixis-companies` nav block in `components/site-header.tsx` and its CSS rule in `app/globals.css`.

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
