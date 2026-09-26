// Change note (Claude, Sep 2026): New. `guard({seat, route, max})`: sign-in, seat check (returns the seat for the receipt cap) and rate limit in one call. See docs/LAUNCH_NOTES.md.
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { entitlements, type Entitlement } from "@/lib/apixis-wallet";

export const SEAT_PRODUCT = "deduxis.receipts.monthly";

type Guarded = { ok: true; user: User; seat: Entitlement | null } | { ok: false; response: NextResponse };

// Per-instance limiter for AI calls (serverless instances don't share memory: a speed bump,
// not a quota).
const buckets = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number, now = Date.now()) {
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear();
  return recent.length > max;
}

/** Signed-in user, optionally with an active Receipt Intelligence seat, within the rate limit. */
export async function guard(opts: { seat?: boolean; route: string; max: number; windowMs?: number }): Promise<Guarded> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return { ok: false, response: NextResponse.json({ error: "Sign in to continue." }, { status: 401 }) };
  }
  let seat: Entitlement | null = null;
  if (opts.seat) {
    const owned = await entitlements(user.email, "deduxis");
    seat = owned.find((e) => e.product_key === SEAT_PRODUCT && e.status === "active") ?? null;
    if (!seat) {
      return {
        ok: false,
        response: NextResponse.json({ error: "No active seat. Redeem a seat at /pricing." }, { status: 403 }),
      };
    }
  }
  if (limited(`${opts.route}:${user.id}`, opts.max, opts.windowMs ?? 60 * 60 * 1000)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Too many requests. Please wait a bit." }, { status: 429 }),
    };
  }
  return { ok: true, user, seat };
}
