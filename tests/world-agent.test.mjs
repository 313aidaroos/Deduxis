// One Apixis ID = one world agent (Grok / Deduxis Lead, 2026-09-29).
import test from 'node:test';
import assert from 'node:assert/strict';
import { ensureWorldAgent, needsProvision, worldAgentView, hasVerifiedEmail } from '../lib/world-agent.ts';

const base = { id: 'u1', email: 'a@b.co', email_confirmed_at: '2026-09-29T00:00:00Z', app_metadata: { provider: 'email', apixis_sub: 'sub-1' } };

test('verified user without the flag is provisioned once and the id + time are stored', async () => {
  const calls = []; const saved = [];
  const deps = {
    provision: async (input) => { calls.push(input); return { ok: true, created: true, agent: { id: 'agent-9', name: 'Agent' } }; },
    saveAppMetadata: async (id, m) => { saved.push([id, m]); },
    now: () => new Date('2026-09-29T12:00:00Z'),
  };
  const view = await ensureWorldAgent(base, deps);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], { client: 'deduxis', email: 'a@b.co', apixisSub: 'sub-1', displayName: null });
  assert.equal(saved[0][1].apixis_world_agent_id, 'agent-9');
  assert.equal(saved[0][1].apixis_world_agent_at, '2026-09-29T12:00:00.000Z');
  assert.equal(saved[0][1].apixis_sub, 'sub-1', 'keeps existing app_metadata');
  assert.deepEqual(view, { ready: true, agentId: 'agent-9', agentAt: '2026-09-29T12:00:00.000Z' });
  // Second load with the stored flag: no second call.
  await ensureWorldAgent({ ...base, app_metadata: saved[0][1] }, deps);
  assert.equal(calls.length, 1);
});

test('failed provision leaves the flag unset (retry next load) and never throws', async () => {
  let saves = 0;
  const view = await ensureWorldAgent(base, { provision: async () => ({ ok: false, error: 'apixis_world_key_missing' }), saveAppMetadata: async () => { saves++; } });
  assert.equal(saves, 0); assert.equal(view.ready, false);
  const view2 = await ensureWorldAgent(base, { provision: async () => { throw new Error('boom'); }, saveAppMetadata: async () => { saves++; } });
  assert.equal(view2.ready, false);
});

test('no local Ixis grant: the stored metadata only records the agent, never a balance', async () => {
  const saved = [];
  await ensureWorldAgent(base, { provision: async () => ({ ok: true, created: true, agent: { id: 'a1', name: 'A' } }), saveAppMetadata: async (_id, m) => { saved.push(m); } });
  assert.deepEqual(Object.keys(saved[0]).filter((k) => /balance|grant|starter|^ixis/i.test(k)), []);
});

test('unverified emails are not provisioned', () => {
  const u = { id: 'u2', email: 'x@y.co', email_confirmed_at: null, app_metadata: {} };
  assert.equal(hasVerifiedEmail(u), false);
  assert.equal(needsProvision(u), false);
  assert.equal(worldAgentView(u).ready, false);
});
