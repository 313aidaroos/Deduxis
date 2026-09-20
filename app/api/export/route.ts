import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
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
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export receipts' },
      { status: 500 }
    );
  }
}

function generateCSV(receipts: any[]): string {
  const headers = ['Date', 'Merchant', 'Category', 'Total', 'Tax', 'Payment Method', 'Notes'];
  const rows = receipts.map(r => [
    r.receipt_date,
    escapeCsv(r.merchant),
    escapeCsv(r.category),
    `$${r.total_amount.toFixed(2)}`,
    r.tax_amount ? `$${r.tax_amount.toFixed(2)}` : '',
    escapeCsv(r.payment_method || ''),
    escapeCsv(r.notes || ''),
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateQuickBooksCSV(receipts: any[]): string {
  // QuickBooks IIF format approximation (simplified CSV)
  const headers = ['Date', 'Vendor', 'Account', 'Amount', 'Memo'];
  const rows = receipts.map(r => [
    r.receipt_date,
    escapeCsv(r.merchant),
    escapeCsv(r.category),
    r.total_amount.toFixed(2),
    escapeCsv(`${r.category} - ${r.merchant}${r.notes ? ' - ' + r.notes : ''}`),
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function escapeCsv(value: string): string {
  if (!value) return '';
  const escaped = value.replace(/"/g, '""');
  return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
    ? `"${escaped}"`
    : escaped;
}
