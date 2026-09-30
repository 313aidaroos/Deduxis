/**
 * One Apixis ID = one Apixis world agent (Grok / Deduxis Lead, 2026-09-29). Ported from
 * Renoxis lib/renoxis/world-agent.ts (same app_metadata keys, same Apixis.dev contract).
 *
 * On first sign-in (any verified account without the flag) the server asks Apixis.dev
 * POST /api/agent/provision to create or reuse this person's world agent (default Apixis body,
 * 1000 starter Ixis once, granted by Apixis.dev itself; Deduxis never grants Ixis locally). The result is recorded on the Supabase auth user
 * (app_metadata.apixis_world_agent_at / _id / _name), so later loads skip the call. Apixis.dev is
 * idempotent by verified email / Apixis ID, so a retry never creates a second agent or grant.
 * No database table needed. Pure logic (unit-tested); wiring in lib/world-agent-server.ts.
 */
export const WORLD_CLIENT = "deduxis";

/** Mirrors ApixisWorldAgentResult in lib/apixis-world-provision.ts (kept local so tests need no Next). */
export type ProvisionResult =
  | { ok: true; created: boolean; agent: { id: string; name: string } | null }
  | { ok: false; error: string; status?: number };

export type WorldAgentUser = {
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
};

export type WorldAgentView = {
  ready: boolean;
  agentId: string | null;
  agentAt: string | null;
};

function meta(user: WorldAgentUser): Record<string, unknown> {
  return (user.app_metadata ?? {}) as Record<string, unknown>;
}

function str(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

/** Email proven: confirmed in Supabase, or the account came from Apixis ID (Wallet-verified). */
export function hasVerifiedEmail(user: WorldAgentUser): boolean {
  return Boolean(user.email && (user.email_confirmed_at || str(meta(user).apixis_sub)));
}

export function worldAgentView(user: WorldAgentUser): WorldAgentView {
  const m = meta(user);
  const agentAt = str(m.apixis_world_agent_at);
  return { ready: Boolean(agentAt), agentId: str(m.apixis_world_agent_id), agentAt };
}

export function needsProvision(user: WorldAgentUser): boolean {
  return !str(meta(user).apixis_world_agent_at) && hasVerifiedEmail(user);
}

export type EnsureDeps = {
  provision: (input: { client: string; email: string; apixisSub: string | null; displayName: string | null }) => Promise<ProvisionResult>;
  saveAppMetadata: (userId: string, appMetadata: Record<string, unknown>) => Promise<void>;
  now?: () => Date;
};

/** Provision once and record it. Never throws; a failure leaves the flag unset so the next load retries. */
export async function ensureWorldAgent(user: WorldAgentUser, deps: EnsureDeps): Promise<WorldAgentView> {
  if (!needsProvision(user)) return worldAgentView(user);
  try {
    const m = meta(user);
    const result = await deps.provision({
      client: WORLD_CLIENT,
      email: String(user.email),
      apixisSub: str(m.apixis_sub),
      displayName: str(user.user_metadata?.full_name) ?? str(user.user_metadata?.name),
    });
    if (!result.ok) {
      console.error("Apixis world agent provision failed:", result.error, result.status ?? "");
      return worldAgentView(user);
    }
    const next = {
      ...m,
      apixis_world_agent_at: (deps.now?.() ?? new Date()).toISOString(),
      apixis_world_agent_id: result.agent?.id ?? null,
      apixis_world_agent_name: result.agent?.name ?? null,
    };
    await deps.saveAppMetadata(user.id, next);
    return worldAgentView({ ...user, app_metadata: next });
  } catch (err) {
    console.error("Apixis world agent provision error:", (err as Error)?.message ?? "");
    return worldAgentView(user);
  }
}
