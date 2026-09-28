"use client";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { ApixisWalletChip } from "@/components/ApixisWalletChip";

import { useState, useRef } from "react";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buyUrl, setBuyUrl] = useState<string | null>(null);
  const attemptIdRef = useRef<string | null>(null);

  const IXIS_PRICE = 15000;
  const USD_PRICE = 150;

  const handleRedeem = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    setBuyUrl(null);

    // Generate attempt ID once per click; retries reuse it
    if (!attemptIdRef.current) {
      attemptIdRef.current = `deduxis-${crypto.randomUUID().slice(0, 8)}`;
    }
    const idempotencyKey = attemptIdRef.current;

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idempotencyKey }),
      });

      const data = await response.json();

      if (response.status === 401 && data.redirect) {
        // Not signed in — redirect to login with next parameter
        window.location.href = data.redirect;
        return;
      }

      if (response.status === 402) {
        setError(
          `You need ${Number(data.needed ?? IXIS_PRICE).toLocaleString()} Ixis to redeem this seat.`,
        );
        setBuyUrl(data.buyUrl);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to redeem");
      }

      setMessage(
        `Success! Receipt ID: ${data.receiptId}. Your seat is now active.`,
      );
      attemptIdRef.current = null; // Reset for next purchase
    } catch (err) {
      setError(
        (err instanceof Error ? err.message : String(err)) ||
          "An error occurred during redemption",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main id="main" className="pricing-page container">
        <div className="page-intro">
          <span className="eyebrow">
            ONE PLAN. A LITTLE MORE PEACE OF MIND.
          </span>
          <h1>A home for your receipts.</h1>
          <p>
            Keep your business records together, from the first photo to the
            final export.
          </p>
        </div>
        <div className="pricing-card">
          <div className="price-main">
            <span className="badge lavender">Receipt Intelligence</span>
            <h2>Everything in order.</h2>
            <div className="price-number">
              {IXIS_PRICE.toLocaleString()} <span>Ixis</span>
            </div>
            <p className="price-note">per month · ${USD_PRICE} equivalent</p>
            <p className="price-note">200 receipts per seat period</p>
            <p className="price-note">Your Apixis Wallet: <ApixisWalletChip /></p>
            <Link href="/demo" className="text-link">
              Explore before you begin →
            </Link>
          </div>
          <div className="price-details">
            <strong>A clearer way to keep records</strong>
            <ul>
              <li>AI receipt extraction</li>
              <li>Review and edit your receipt details</li>
              <li>Search and organize by category</li>
              <li>Standard and accounting CSV exports</li>
              <li>Original receipt images alongside your records</li>
            </ul>
            <button
              className="button primary full"
              onClick={handleRedeem}
              disabled={loading}
            >
              {loading
                ? "Processing…"
                : `Redeem · ${IXIS_PRICE.toLocaleString()} Ixis`}
            </button>
            {message && (
              <div role="status" className="notice success">
                Your seat is active.{" "}
                <Link href="/dashboard">Open your workspace →</Link>
              </div>
            )}
            {error && (
              <div role="alert" className="notice error">
                {error}
                {buyUrl && (
                  <a href={buyUrl} className="text-link">
                    Buy Ixis →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="pricing-fineprint">
          Redeemed with Ixis through Apixis Wallet. The current plan has a
          200-receipt cap per seat period. No automatic overage charges.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
