# Deduxis: launch notes

_Updated 2026-09-25. One notes file per repo: what was changed, file by file, and everything you need to connect. The full family report: https://claude.ai/artifact/QERxA6PMsFK1vdR51Ex2NQ_

## Status

Ready after keys. The seat's 200 receipts per month is enforced.

## Connect (in order)

1. **Apixis Wallet key.** In the ApixisWallet repo run `npm run family-keys` once. It prints one SQL block (paste it in the Wallet's Supabase SQL editor) and one env block per site. Paste this site's block: `WALLET_API_KEY`, `APIXIS_CLIENT_ID`, `APIXIS_WALLET_API_URL`.
2. Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. AI: `ANTHROPIC_API_KEY` (receipt extraction).

Every key this repo reads is listed in `.env.example` (required, optional, and legacy names to leave unset).

## Apixis Wallet

App `deduxis`. Sells `deduxis.receipts.monthly`.

## Database

None pending.

## What changed, file by file

Each changed backend code file also starts with a one-line `Change note (Claude, Sep 2026)` comment saying the same thing.

| File | Change |
|---|---|
| `.env.example` | Added 7 key(s) the code reads that were missing: `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `WALLET_API_KEY`, `APIXIS_WALLET_API_URL`, `NEXT_PUBLIC_APP_URL`, `APIXIS_WALLET_API_KEY`. |
| `.gitignore` | `<a>` → `Link` (lint). No visual change. |
| `app/api/chat/route.ts` | Sign-in required, rate limited. |
| `app/api/export/route.ts` | CSV: neutralizes spreadsheet formulas; no crash on numeric strings. |
| `app/api/extract/route.ts` | Paid AI extraction needs a seat, is rate limited, and stops at the monthly cap. |
| `app/api/receipts/route.ts` | Sign-in required, rate limited, 200 receipts per seat month. |
| `app/api/redeem/route.ts` | Typed; no behavior change. |
| `app/chat/page.tsx` | `<a>` → `Link` (lint). No visual change. |
| `app/dashboard/page.tsx` | `<a>` → `Link` (lint). No visual change. |
| `app/login/page.tsx` | `<a>` → `Link` (lint). No visual change. |
| `app/page.tsx` | `<a>` → `Link` (lint). No visual change. |
| `app/pricing/page.tsx` | `<a>` → `Link` (lint). No visual change. |
| `docs/LAUNCH_NOTES.md` | This file. |
| `lib/guard.ts` | New. `guard({seat, route, max})`: sign-in, seat check (returns the seat) and rate limit in one call. |
| `lib/quota.ts` | New. 200 receipts per 30-day seat period, counted from the seat's renewal date. |

_Changes are backend and plumbing only. Pages, design and UI are not changed except where noted as a build or lint fix with no visual change._
