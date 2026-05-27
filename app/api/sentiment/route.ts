import { NextResponse } from "next/server";
import { getMarketSentiment } from "@/lib/sentiment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const s = await getMarketSentiment();
    return NextResponse.json(s);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
