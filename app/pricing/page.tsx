"use client";
import Link from "next/link";

import { useState, useRef } from "react";
import { ApixisWalletChip } from "@/components/ApixisWalletChip";

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
        setError(`You need ${data.needed.toLocaleString()} Ixis to redeem this seat.`);
        setBuyUrl(data.buyUrl);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to redeem");
      }

      setMessage(`Success! Receipt ID: ${data.receiptId}. Your seat is now active.`);
      attemptIdRef.current = null; // Reset for next purchase
    } catch (err) {
      setError((err instanceof Error ? err.message : String(err)) || "An error occurred during redemption");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 border-b border-gray-200 dark:border-gray-800 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">Deduxis</Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/#what-we-do" className="hover:text-gray-600 dark:hover:text-gray-400 transition">What we do</Link>
              <Link href="/#how-it-works" className="hover:text-gray-600 dark:hover:text-gray-400 transition">How it works</Link>
              <Link href="/#vision" className="hover:text-gray-600 dark:hover:text-gray-400 transition">Our vision</Link>
              <Link href="/#faq" className="hover:text-gray-600 dark:hover:text-gray-400 transition">FAQs</Link>
              <Link href="/pricing" className="hover:text-gray-600 dark:hover:text-gray-400 transition">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/chat" className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition">Ask Cixy</Link>
            <Link href="/login" className="px-4 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-90 transition">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl text-center space-y-8">
          <div>
            <div className="text-sm uppercase tracking-[3px] text-gray-500 mb-3">Receipt Intelligence</div>
            <h1 className="text-5xl font-bold">Monthly Seat</h1>
            <p>Your Apixis Wallet: <ApixisWalletChip /></p>
          </div>
          
          <div className="text-6xl font-bold">
            {IXIS_PRICE.toLocaleString()} Ixis
            <span className="text-3xl text-gray-500 ml-2">· ${USD_PRICE}</span>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-400">per month · includes 200 receipts</p>

          <div className="pt-4">
            <button
              onClick={handleRedeem}
              disabled={loading}
              className="px-12 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : `Redeem · ${IXIS_PRICE.toLocaleString()} Ixis`}
            </button>
          </div>

          {message && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded space-y-3">
              <p>{error}</p>
              {buyUrl && (
                <a
                  href={buyUrl}
                  className="inline-block px-6 py-2 bg-red-800 dark:bg-red-200 text-white dark:text-red-900 rounded hover:opacity-90 transition"
                >
                  Buy Ixis
                </a>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500 pt-4">
            Extra receipts metered via Apixis Wallet. No card charges — Ixis only.
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-6 text-center text-sm text-gray-500">
        <p>Part of the Apixis family · Powered by Ixis</p>
      </footer>
    </div>
  );
}
