// Server only (service-role key + APIXIS_WORLD_KEY). Wires lib/world-agent.ts to Supabase auth
// app_metadata and Apixis.dev POST /api/agent/provision. Grok / Deduxis Lead, 2026-09-29
// (same shape as Renoxis lib/renoxis/world-agent-server.ts).
import { createClient, type User } from "@supabase/supabase-js";
import { provisionApixisWorldAgent } from "@/lib/apixis-world-provision";
import { ensureWorldAgent, type WorldAgentView } from "@/lib/world-agent";

async function saveUserAppMetadata(userId: string, appMetadata: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not set");
  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await admin.auth.admin.updateUserById(userId, { app_metadata: appMetadata });
  if (error) throw error;
}

export function ensureDeduxisWorldAgent(user: User): Promise<WorldAgentView> {
  return ensureWorldAgent(user, {
    provision: (input) => provisionApixisWorldAgent({ ...input, emailVerified: true, timeoutMs: 6000 }),
    saveAppMetadata: saveUserAppMetadata,
  });
}
