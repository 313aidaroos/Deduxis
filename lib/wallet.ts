const WALLET_BASE = 'https://apixis-wallet.vercel.app';

export interface Quote {
  quoteId: string;
  productKey: string;
  app: string;
  name: string;
  xp: number;
  usdEquivalent: number;
  expiresAt: string;
  payable: string;
}

export interface Reservation {
  reservationId: string;
  status: 'held' | 'captured' | 'released';
  productKey: string;
  xp: number;
}

export async function quoteProduct(productKey: string): Promise<Quote> {
  const res = await fetch(`${WALLET_BASE}/api/v1/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productKey }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Quote failed: ${res.status}`);
  }

  return res.json();
}

export async function createReservation(
  productKey: string,
  idempotencyKey: string,
  quoteId?: string
): Promise<Reservation> {
  const res = await fetch(`${WALLET_BASE}/api/v1/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productKey,
      idempotencyKey,
      ...(quoteId && { quoteId }),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Reservation failed: ${res.status}`);
  }

  return res.json();
}

export async function captureReservation(reservationId: string): Promise<void> {
  const res = await fetch(`${WALLET_BASE}/api/v1/reservations/${reservationId}/capture`, {
    method: 'POST',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Capture failed: ${res.status}`);
  }
}

export async function releaseReservation(reservationId: string): Promise<void> {
  const res = await fetch(`${WALLET_BASE}/api/v1/reservations/${reservationId}/release`, {
    method: 'POST',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Release failed: ${res.status}`);
  }
}
