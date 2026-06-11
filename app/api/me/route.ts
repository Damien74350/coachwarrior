import { NextResponse } from "next/server";
import { ME, MY_SESSIONS } from "../../../lib/mock";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({ user: ME, sessions: MY_SESSIONS });
}
