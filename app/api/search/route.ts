import { NextRequest, NextResponse } from "next/server";
import { searchCrypto, searchStock } from "@/lib/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 1) return NextResponse.json({ results: [] });

  const [crypto, stocks] = await Promise.allSettled([searchCrypto(q), searchStock(q)]);
  const cryptos = crypto.status === "fulfilled" ? crypto.value : [];
  const equities = stocks.status === "fulfilled" ? stocks.value : [];

  // Interleave: top 4 of each
  const merged = [];
  for (let i = 0; i < 4; i++) {
    if (cryptos[i]) merged.push(cryptos[i]);
    if (equities[i]) merged.push(equities[i]);
  }
  return NextResponse.json({ results: merged });
}
