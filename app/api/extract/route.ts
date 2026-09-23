import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { guard } from '@/lib/guard';

const EXTRACTION_SYSTEM = `You are a receipt data extraction assistant. Extract structured data from receipt images.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "merchant": "Business name",
  "date": "YYYY-MM-DD or as shown if unclear",
  "total": "$XX.XX",
  "tax": "$X.XX" (if visible, otherwise omit),
  "payment_method": "Last 4 digits only if card shown (e.g., 'Card ending 1234'), or 'Cash', or omit if unclear",
  "line_items": [
    {"description": "Item name", "amount": "$X.XX"}
  ],
  "category": "Suggested US Schedule C business category (e.g., 'Office Supplies', 'Meals', 'Travel', 'Utilities', 'Auto Expenses', 'Advertising') or 'Personal' if clearly non-business"
}

Rules:
- NEVER include full card numbers, only last 4 digits
- If a field is unclear or missing, omit it
- Suggest a business category based on merchant/items
- Keep line items concise
- Return valid JSON only`;

export async function POST(req: NextRequest) {
  // Extraction is the paid Receipt Intelligence feature: seat holders only.
  const access = await guard({ seat: true, route: 'extract', max: 60 });
  if (!access.ok) return access.response;
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Receipt extraction is not available right now." },
        { status: 503 }
      );
    }

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Extract base64 data
    const base64Data = image.split(',')[1] || image;
    const mediaType = image.match(/data:([^;]+);/)?.[1] || 'image/jpeg';

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      system: EXTRACTION_SYSTEM,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: 'Extract the receipt data as JSON.',
            },
          ],
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from vision model');
    }

    // Parse the JSON response
    const extracted = JSON.parse(textContent.text.trim());

    return NextResponse.json(extracted);
  } catch (error) {
    console.error('Extract API error:', error);
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : String(error)) || 'An error occurred during extraction' },
      { status: 500 }
    );
  }
}
