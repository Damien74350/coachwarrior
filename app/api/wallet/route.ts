import { NextRequest, NextResponse } from "next/server";
import { getWallet } from "@/lib/wallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")?.trim();
  if (!address) return NextResponse.json({ error: "address requis" }, { status: 400 });
  try {
    const w = await getWallet(address);
    return NextResponse.json(w);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
