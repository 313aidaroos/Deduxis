import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redeem, buyIxisUrl, WalletError } from '@/lib/apixis-wallet';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { idempotencyKey } = await req.json();
    
    if (!idempotencyKey) {
      return NextResponse.json({ error: 'Missing idempotencyKey' }, { status: 400 });
    }

    const result = await redeem({
      ownerEmail: user.email,
      productKey: 'deduxis.receipts.monthly',
      idempotencyKey,
      provision: async (reservation) => {
        // TODO: Create subscription/entitlement record in Deduxis DB
        // For now, the Wallet entitlement is the source of truth
        return { reservationId: reservation.reservationId };
      },
    });

    if (!result.ok) {
      // 402: Not enough Ixis
      const buyUrl = buyIxisUrl('deduxis', `${req.nextUrl.origin}/pricing`);
      return NextResponse.json({
        error: 'Not enough Ixis',
        insufficient: true,
        needed: result.needed,
        buyUrl,
      }, { status: 402 });
    }

    return NextResponse.json({
      success: true,
      receiptId: result.receiptId,
    });
  } catch (error: any) {
    console.error('Redeem error:', error);
    
    if (error instanceof WalletError) {
      return NextResponse.json(
        { error: error.message, status: error.status },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to redeem' },
      { status: 500 }
    );
  }
}
