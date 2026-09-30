"use client";

/**
 * "Log in with Apixis ID" (Wallet SSO): one Apixis account for every family site. Keeps the page's ?next=.
 * 2026-09-29 (Grok / Deduxis Lead): primary button using the existing `button primary full` tokens.
 */
export function SignInWithApixis({ next, className }: { next?: string; className?: string }) {
  const href = (target: string) => `/auth/apixis/start?next=${encodeURIComponent(target)}`;
  return (
    <p className={className} style={{ textAlign: "center", margin: "12px 0" }}>
      <a
        href={href(next ?? "/dashboard")}
        onClick={(event) => {
          if (next) return;
          const raw = new URLSearchParams(window.location.search).get("next");
          if (raw && raw.startsWith("/") && !raw.startsWith("//")) event.currentTarget.href = href(raw);
        }}
        className="button primary full"
      >
        Log in with Apixis ID
      </a>
      <br />
      <small>One Apixis ID, one Wallet and one agent across every Ixis site.</small>
    </p>
  );
}
