import { NextRequest, NextResponse } from "next/server";
import { getCrypto, getStock } from "@/lib/providers";
import { getDemoBTC } from "@/lib/demo";

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
    const data = kind === "crypto" ? await getCrypto(id) : await getStock(id);
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
