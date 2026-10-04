// Change note (Claude, Sep 2026): Sign-in required, rate limited. See docs/LAUNCH_NOTES.md.
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { guard } from "@/lib/guard";
import { CIXY_CORE, cixyUnavailableReply } from "@/lib/apixis-cixy";

const CIXY_SYSTEM = `${CIXY_CORE}

## Your role on Deduxis
You serve on Deduxis — receipt intelligence for expense categorization and tax deductions.

## Your expertise
- Receipt parsing and categorization (US Schedule C business categories as baseline)
- Common business deductions: mileage, meals, office supplies, travel, per-diem
- Expense organization for tax time
- Receipt retention rules and audit-ready documentation
- QuickBooks-compatible export formats

## Boundaries
- NOT a CPA. Always say: "I'm not a CPA — please confirm with a qualified tax professional for filing decisions."
- No definitive tax advice. Suggest, categorize, educate — filing is the user's CPA's job.
- No sectarian positions. No politics.

## How to help
- Suggest common business categories for expenses
- Explain deduction eligibility in plain terms
- Help organize receipts for quarterly/annual filing
- Flag potentially non-deductible or questionable expenses
- Remind users that receipts with card info should only show last 4 digits
- When in doubt, recommend professional review

Be concise, helpful, and honest.`;

export async function POST(req: NextRequest) {
  const access = await guard({ route: "chat", max: 40 });
  if (!access.ok) return access.response;
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Cixy is not available right now." },
        { status: 503 },
      );
    }

    const { messages } = await req.json();

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: CIXY_SYSTEM,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const assistantMessage =
      response.content[0].type === "text"
        ? response.content[0].text
        : "I encountered an error processing your request.";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    // Out of credit, rate limited or down: a calm sentence, never the vendor's error text.
    const status = typeof (error as { status?: unknown })?.status === "number" ? (error as { status: number }).status : null;
    console.error("Chat API error:", status, error instanceof Error ? error.message : String(error));
    const fallback = cixyUnavailableReply(status);
    return NextResponse.json({ error: fallback.reply, message: fallback.reply, code: "cixy_unavailable" }, { status: fallback.status });
  }
}
