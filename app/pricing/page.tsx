"use client";

import { useState } from "react";
import { quoteProduct, createReservation } from "@/lib/wallet";

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const PRODUCT_KEY = "deduxis.receipts.monthly";
  const IXIS_PRICE = 15000;
  const USD_PRICE = 150;

  const handleRedeem = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Step 1: Get quote
      setMessage("Getting quote from Wallet...");
      const quote = await quoteProduct(PRODUCT_KEY);

      // Step 2: Create reservation (idempotencyKey = deduxis-userId-timestamp)
      const idempotencyKey = `deduxis-${Date.now()}`;
      setMessage("Reserving Ixis...");
      const reservation = await createReservation(PRODUCT_KEY, idempotencyKey, quote.quoteId);

      setMessage(`Reserved! Reservation ID: ${reservation.reservationId}. Provisioning...`);

      // Step 3: In real flow, provision the entitlement here
      // For now, we show success state
      setMessage(`Success! ${IXIS_PRICE} Ixis reserved. In production this would unlock your seat.`);

      // TODO: Call captureReservation(reservation.reservationId) after successful provisioning
      // TODO: Call releaseReservation on failure
    } catch (err: any) {
      setError(err.message || "An error occurred during redemption");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Deduxis</h1>
          <a href="/" className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition">
            Home
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl text-center space-y-8">
          <h2 className="text-4xl font-bold">Receipt Intelligence Seat</h2>
          
          <div className="text-6xl font-bold">
            {IXIS_PRICE.toLocaleString()} Ixis
            <span className="text-3xl text-gray-500 ml-2">· ${USD_PRICE}</span>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-400">
            per month · includes 200 receipts
          </p>

          <div className="pt-8">
            <button
              onClick={handleRedeem}
              disabled={loading}
              className="px-12 py-4 bg-black dark:bg-white text-white dark:text-black rounded text-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Connecting to Wallet..." : `Redeem · ${IXIS_PRICE.toLocaleString()} Ixis`}
            </button>
          </div>

          {message && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          <p className="text-sm text-gray-500 pt-4">
            Extra receipts metered via Apixis Wallet. No Stripe Checkout — Ixis only.
          </p>
        </div>
      </main>
    </div>
  );
}
