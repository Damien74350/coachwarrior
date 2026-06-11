import { NextResponse } from "next/server";
import {
  MY_CLUB,
  CLUB_KPIS,
  COURSES,
  COACHES,
  LEAGUES,
  weeklyMinutesSeries,
  membersGrowthSeries,
} from "../../../lib/mock";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    club: MY_CLUB,
    kpis: CLUB_KPIS,
    courses: COURSES,
    coaches: COACHES,
    leagues: LEAGUES,
    series: {
      weeklyMinutes: weeklyMinutesSeries(),
      membersGrowth: membersGrowthSeries(),
    },
  });
}
