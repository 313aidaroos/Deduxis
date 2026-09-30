"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => undefined;

/**
 * The shared Apixis Wallet inside this site: the person's one Ixis balance as a small pill
 * (links to Buy Ixis on Apixis Wallet, which comes back here), plus "Sign in with Apixis" when the
 * person is signed out or their account is not linked to an Apixis ID yet.
 *
 * One fetch of GET /api/wallet/balance is shared by every chip on the page. It refetches when the
 * tab regains focus / becomes visible and on pageshow (back/forward cache), so the number updates
 * right after a purchase on Apixis Wallet sends the person back. Never shows a made-up number.
 * Updated 2026-09-27 (Grok, balance pill).
 * Updated 2026-09-29 (Grok / Deduxis Lead): "Log in with Apixis ID" wording; `showAgent` adds the
 * "Your agent is in the Apixis world" link once the route reports the agent is provisioned.
 */

type WorldAgent = { ready: boolean; agentId: string | null; enterUrl: string };
type WalletState = { available: number | null; buy: string | null; linked: boolean; signedIn: boolean; loaded: boolean; world: WorldAgent | null };

const INITIAL: WalletState = { available: null, buy: null, linked: false, signedIn: false, loaded: false, world: null };
const FALLBACK_BUY = "https://apixis-wallet.vercel.app/buy?product=deduxis";
let current: WalletState = INITIAL;
let inFlight = false;
let started = false;
const listeners = new Set<() => void>();

function worldOf(raw: unknown): WorldAgent | null {
  if (!raw || typeof raw !== "object") return null;
  const w = raw as Record<string, unknown>;
  const enterUrl = typeof w.enterUrl === "string" && w.enterUrl.startsWith("https://www.apixis.dev/") ? w.enterUrl : null;
  if (!enterUrl) return null;
  return { ready: w.ready === true, agentId: typeof w.agentId === "string" ? w.agentId : null, enterUrl };
}

function load() {
  if (inFlight) return;
  inFlight = true;
  fetch("/api/wallet/balance", { cache: "no-store", credentials: "same-origin" })
    .then(async (response) => ({ status: response.status, data: await response.json().catch(() => null) }))
    .then(({ status, data }) => {
      const d = (data ?? {}) as Record<string, unknown>;
      current = {
        available: typeof d.available === "number" && Number.isFinite(d.available) ? d.available : null,
        buy: typeof d.buy === "string" ? d.buy : current.buy,
        linked: d.linked === true,
        signedIn: status !== 401,
        loaded: true,
        world: worldOf(d.world) ?? current.world,
      };
      listeners.forEach((listener) => listener());
    })
    .catch(() => undefined)
    .finally(() => {
      inFlight = false;
    });
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  load();
  window.addEventListener("focus", load);
  window.addEventListener("pageshow", load);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") load();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

export function useApixisWallet(): WalletState {
  return useSyncExternalStore(subscribe, () => current, () => INITIAL);
}

export function ApixisWalletChip({ className, next, hideSignedOut = false, showAgent = false }: { className?: string; next?: string; hideSignedOut?: boolean; showAgent?: boolean }) {
  const wallet = useApixisWallet();
  // Current path without setState-in-effect (lint rule react-hooks/set-state-in-effect).
  const here = useSyncExternalStore(noopSubscribe, () => window.location.pathname + window.location.search, () => "/");
  const signIn = `/auth/apixis/start?next=${encodeURIComponent(next ?? here)}`;
  const amount = wallet.available === null ? "—" : wallet.available.toLocaleString();
  if (hideSignedOut && (!wallet.loaded || !wallet.signedIn)) return null;
  return (
    <span className={["apx-wallet", className].filter(Boolean).join(" ")} style={{ display: "inline-flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <a
        className="apx-wallet-pill"
        href={wallet.buy ?? FALLBACK_BUY}
        title="Your Apixis Wallet balance · Buy Ixis"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 11px",
          borderRadius: 999,
          border: "1px solid color-mix(in srgb, currentColor 35%, transparent)",
          background: "color-mix(in srgb, currentColor 8%, transparent)",
          color: "inherit",
          fontSize: 12,
          fontWeight: 700,
          lineHeight: 1.4,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span aria-hidden="true">✦</span>
        {amount} Ixis
      </a>
      {wallet.loaded && (!wallet.signedIn || !wallet.linked) && (
        <a className="apx-wallet-signin" href={signIn} style={{ color: "inherit", fontSize: 11, textDecoration: "underline", whiteSpace: "nowrap", opacity: 0.85 }}>
          Log in with Apixis ID
        </a>
      )}
      {showAgent && wallet.signedIn && wallet.world?.ready && (
        <a className="apx-world-agent" href={wallet.world.enterUrl} data-agent-id={wallet.world.agentId ?? undefined} style={{ color: "inherit", fontSize: 11, textDecoration: "underline", whiteSpace: "nowrap" }}>
          Your agent is in the Apixis world ↗
        </a>
      )}
    </span>
  );
}
