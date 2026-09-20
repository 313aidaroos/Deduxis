# Deduxis — Receipt Intelligence

Capture receipts, extract line items, categorize deductions, export for tax time.

## Stack

- Next.js 15 + TypeScript + Tailwind
- Supabase (auth + storage)
- Anthropic Claude (Cixy chat + receipt extraction)
- Special Elite font (Apixis family standard)

## Local Setup

1. Clone and install:
```bash
git clone https://github.com/313aidaroos/Deduxis.git
cd Deduxis
npm install
```

2. Set up environment:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Anthropic credentials
```

3. Run dev server:
```bash
npm run dev
```

Visit http://localhost:3000

## Pricing

- **Receipt Intelligence seat**: 15,000 Ixis/month ($150)
  - Includes 200 receipts/month
  - Extra receipts metered via Apixis Wallet

## Features

- Magic link authentication (Supabase)
- Cixy chat: expense/deduction expert (Muslim identity, "not a CPA" disclaimers)
- Receipt upload and vision extraction (coming soon)
- Category recommendations (US Schedule C business categories)
- CSV + QuickBooks exports (coming soon)

## Family

Part of the Apixis family. Powered by Ixis.
