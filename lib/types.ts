export type Tier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "LEGEND";

export type User = {
  id: string;
  name: string;
  avatar: string; // emoji or initials
  clubId: string;
  clubName: string;
  country: string;
  countryCode: string;
  city: string;
  tier: Tier;
  totalMinutes: number;
  totalPoints: number;
  weekMinutes: number;
  weekPoints: number;
  streak: number; // days
  joinedAt: string;
  badges: string[];
};

export type Session = {
  id: string;
  userId: string;
  date: string; // ISO
  courseId: string | null;
  courseName: string;
  coachId: string | null;
  coachName: string;
  durationMin: number;
  pointsBase: number;
  pointsBonus: number;
  type: "GROUP" | "SOLO" | "PT" | "CARDIO" | "STRENGTH" | "YOGA" | "BOXING";
};

export type Club = {
  id: string;
  name: string;
  brand: string; // chain / group
  region: string;
  country: string;
  city: string;
  members: number;
  activeMembers: number;
  retentionRate: number; // 0..1
  weeklySessions: number;
  avgWeeklyMinutesPerMember: number;
  rating: number;
  logo: string;
};

export type League = {
  id: string;
  name: string;
  scope: "CLUB" | "GROUP" | "REGIONAL" | "NATIONAL" | "INTERNATIONAL";
  participants: number; // clubs or users
  participantType: "CLUB" | "USER";
  endsAt: string;
  prizePool?: string;
  standings: LeagueStanding[];
};

export type LeagueStanding = {
  rank: number;
  name: string;
  meta: string; // city / country / member count
  points: number;
  trend: number; // +/- rank change
  avatar?: string;
};

export type Course = {
  id: string;
  name: string;
  coachId: string;
  coachName: string;
  schedule: string;
  capacity: number;
  bookings: number;
  durationMin: number;
  type: Session["type"];
  bonusMultiplier: number; // 1.0 = no bonus, 2.0 = double points
  bonusEndsAt?: string;
};

export type Coach = {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  bio: string;
  rating: number;
  sessions: number;
  followers: number;
  badges: string[];
};

export type ClubKpis = {
  activeMembers: number;
  membersChange: number; // % vs last month
  totalMinutesWeek: number;
  minutesChange: number;
  retentionRate: number;
  retentionChange: number;
  avgPointsPerMember: number;
  pointsChange: number;
  netPromoterScore: number;
};
