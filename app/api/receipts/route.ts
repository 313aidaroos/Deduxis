import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      merchant, 
      date, 
      total, 
      tax,
      payment_method,
      line_items,
      category,
      notes,
      image_data,
      extracted_data 
    } = await req.json();

    // Upload image to Supabase Storage
    const fileName = `${user.id}/${Date.now()}.jpg`;
    const imageBuffer = Buffer.from(image_data.split(',')[1], 'base64');
    
    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Parse total amount (remove $ and commas)
    const totalAmount = parseFloat(total.replace(/[$,]/g, ''));
    const taxAmount = tax ? parseFloat(tax.replace(/[$,]/g, '')) : null;

    // Insert receipt record
    const { data: receipt, error: insertError } = await supabase
      .from('receipts')
      .insert({
        user_id: user.id,
        merchant,
        receipt_date: date,
        total_amount: totalAmount,
        tax_amount: taxAmount,
        payment_method,
        category,
        notes,
        image_path: fileName,
        extracted_data: extracted_data || { line_items },
      })
      .select()
      .single();

    if (insertError) {
      // Clean up uploaded image on insert failure
      await supabase.storage.from('receipts').remove([fileName]);
      throw new Error(`Save failed: ${insertError.message}`);
    }

    // Save category override if user changed it
    if (category) {
      await supabase
        .from('category_overrides')
        .upsert({
          user_id: user.id,
          merchant,
          category,
          updated_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({ success: true, receipt });
  } catch (error: any) {
    console.error('Save receipt error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save receipt' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: receipts, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('user_id', user.id)
      .order('receipt_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ receipts });
  } catch (error: any) {
    console.error('Fetch receipts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch receipts' },
      { status: 500 }
    );
  }
}
