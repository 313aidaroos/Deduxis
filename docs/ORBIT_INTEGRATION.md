# Apixis Orbit — Deduxis integration handoff

**Status: NOT CONNECTED**. This PR is a safe scoped implementation brief and capability manifest, with no production API or user behavior changed.

## What exists today
`README.md` documents authenticated receipt upload, private RLS storage, AI extraction, Schedule C category suggestions, CSV export and an existing Wallet seat model.

## Proposed scope
- Capability: `deduxis.receipts.summary.read` (`read`, planned).
Return short summaries of that account's actual processed receipts and unresolved review items, without exposing raw receipt images or tax secrets.

## Concrete work to implement next
1. Use the existing account-scoped records and private storage/RLS, not shared public links.
2. Return merchant/date/amount only when required, prefer aggregate counts and redacted totals.
3. Distinguish extracted estimate from verified ledger values; no automatic tax filing or formal advice.
4. Preserve existing Wallet seat entitlement and usage limits.
5. Test receipt ownership, PII redaction and processing failures.

## Universal Orbit gates
1. The Orbit host uses the **existing Apixis identity** and wallet; this repo does not create another credit ledger, agent registry, checkout or auth provider.
2. Any future adapter needs a dedicated signed service credential, expiry + replay prevention, binding from Apixis ID subject to the **local account or tenant**, and per-resource authorization. The Orbit hub must not impersonate users by supplying emails.
3. Data must be genuine and have a source timestamp and `demo` flag; errors and absent integrations fail closed. User-facing text must distinguish draft, submitted, paid, and verified states.
4. Only read/draft initially. No autonomous outbound messaging, spending, contracts, orders, investments, publishing or settlement.
5. Require unit/integration tests for wrong owner, missing creds, no-data response, retried requests and source freshness.
6. Never activate an Orbit capability in Core until product-specific code, tests and owner production configuration are verified.

**This PR provides integration preparation only, not runtime wiring.** See https://github.com/313aidaroos/Apixis.dev/pull/86 for the draft Orbit Core.
