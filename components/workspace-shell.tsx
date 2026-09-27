"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
export function WorkspaceShell({
  children,
  demo = false,
}: {
  children: React.ReactNode;
  demo?: boolean;
}) {
  const path = usePathname();
  const params = useSearchParams();
  const view = params.get("view") || "receipts";
  const base = demo ? "/demo" : "/dashboard";
  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link className="wordmark" href="/">
          Deduxis<span className="brand-dot">.</span>
        </Link>
        <p className="sidebar-caption">A little more organized</p>
        <nav className="workspace-nav" aria-label="Workspace navigation">
          {[
            ["overview", "Overview", "⌂"],
            ["receipts", "Receipts", "▤"],
            ["categories", "Categories", "▦"],
            ["exports", "Exports", "↗"],
            ["chat", "Ask Cixy", "✧"],
          ].map(([key, label, icon]) => (
            <Link
              key={key}
              href={key === "chat" ? "/chat" : `${base}?view=${key}`}
              className={
                (
                  key === "chat"
                    ? path === "/chat"
                    : path !== "/chat" && view === key
                )
                  ? "active"
                  : ""
              }
              aria-current={
                (
                  key === "chat"
                    ? path === "/chat"
                    : path !== "/chat" && view === key
                )
                  ? "page"
                  : undefined
              }
            >
              <span className="nav-symbol" aria-hidden>
                {icon}
              </span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link href="/pricing">
            <span className="nav-symbol" aria-hidden>
              ▣
            </span>
            Wallet & plan
          </Link>
          <Link
            href={`${base}?view=settings`}
            aria-current={view === "settings" ? "page" : undefined}
          >
            <span className="nav-symbol" aria-hidden>
              ⚙
            </span>
            Settings
          </Link>
          <p className="sidebar-note">
            A place for every receipt.
            <br />
            More space for your business.
          </p>
        </div>
      </aside>
      <main id="main" className="workspace-main">
        <div className="workspace-topline">
          <span>YOUR BUSINESS, IN ORDER</span>
          {demo ? (
            <span className="badge yellow">Demo workspace</span>
          ) : (
            <Link href="/">Back to website ↗</Link>
          )}
        </div>
        {demo && (
          <div className="preview-banner">
            <span>Sample data · Changes stay in this browser tab.</span>
            <Link href="/login">Create your workspace →</Link>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
