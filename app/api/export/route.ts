// Change note (Claude, Sep 2026): CSV: neutralizes spreadsheet formulas; no crash on numeric strings. See docs/LAUNCH_NOTES.md.
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    const { data: receipts, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('user_id', user.id)
      .order('receipt_date', { ascending: false });

    if (error) throw error;

    if (format === 'csv') {
      const csv = generateCSV(receipts);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="deduxis-receipts-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (format === 'quickbooks') {
      const qbCSV = generateQuickBooksCSV(receipts);
      return new NextResponse(qbCSV, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="deduxis-quickbooks-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : String(error)) || 'Failed to export receipts' },
      { status: 500 }
    );
  }
}

type Receipt = {
  receipt_date: string;
  merchant: string;
  category: string;
  total_amount: number | string;
  tax_amount: number | string | null;
  payment_method: string | null;
  notes: string | null;
};

// Postgres numeric can arrive as a string.
function money(value: number | string | null): string {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : '';
}

function generateCSV(receipts: Receipt[]): string {
  const headers = ['Date', 'Merchant', 'Category', 'Total', 'Tax', 'Payment Method', 'Notes'];
  const rows = receipts.map(r => [
    r.receipt_date,
    escapeCsv(r.merchant),
    escapeCsv(r.category),
    `$${money(r.total_amount)}`,
    r.tax_amount ? `$${money(r.tax_amount)}` : '',
    escapeCsv(r.payment_method || ''),
    escapeCsv(r.notes || ''),
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateQuickBooksCSV(receipts: Receipt[]): string {
  // QuickBooks IIF format approximation (simplified CSV)
  const headers = ['Date', 'Vendor', 'Account', 'Amount', 'Memo'];
  const rows = receipts.map(r => [
    r.receipt_date,
    escapeCsv(r.merchant),
    escapeCsv(r.category),
    money(r.total_amount),
    escapeCsv(`${r.category} - ${r.merchant}${r.notes ? ' - ' + r.notes : ''}`),
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function escapeCsv(value: string): string {
  if (!value) return '';
  // Neutralize spreadsheet formulas (=, +, -, @) from receipt text.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  const escaped = safe.replace(/"/g, '""');
  return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
    ? `"${escaped}"`
    : escaped;
}
