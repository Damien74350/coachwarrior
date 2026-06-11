import { NextResponse } from "next/server";
import {
  getWorldLeaderboard,
  getClubLeaderboard,
  getWeeklyLeaderboard,
  MY_CLUB,
} from "../../../lib/mock";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") || "world";
  const period = searchParams.get("period") || "week";
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));
  const clubId = searchParams.get("clubId") || MY_CLUB.id;

  let users;
  if (scope === "club") users = getClubLeaderboard(clubId, limit);
  else if (period === "week") users = getWeeklyLeaderboard(limit);
  else users = getWorldLeaderboard(limit);

  return NextResponse.json({ scope, period, count: users.length, users });
}
