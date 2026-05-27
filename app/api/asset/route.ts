import { NextRequest, NextResponse } from "next/server";
import { getCrypto, getStock } from "@/lib/providers";
import { getDemoBTC } from "@/lib/demo";
import { getMarketSentiment } from "@/lib/sentiment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const kind = req.nextUrl.searchParams.get("kind");
  const id = req.nextUrl.searchParams.get("id");
  const demo = req.nextUrl.searchParams.get("demo");
  if (demo === "1") {
    return NextResponse.json(getDemoBTC());
  }
  if (!kind || !id) {
    return NextResponse.json({ error: "kind et id requis" }, { status: 400 });
  }
  try {
    const [data, sentiment] = await Promise.all([
      kind === "crypto" ? getCrypto(id) : getStock(id),
      getMarketSentiment().catch(() => undefined),
    ]);
    return NextResponse.json({ ...data, sentiment });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
