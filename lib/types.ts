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

export type Season = {
  id: string;
  name: string;        // "Saison Hiver 2026"
  startsAt: string;
  endsAt: string;
  theme: string;       // narrative
};

export type Friend = {
  id: string;
  name: string;
  avatar: string;
  countryCode: string;
  city: string;
  clubName: string;
  weekPoints: number;
  weekMinutes: number;
  tier: Tier;
  status: "online" | "training" | "offline";
};

export type HealthSource = {
  id: "apple_health" | "google_fit" | "strava" | "garmin" | "fitbit";
  label: string;
  connected: boolean;
  lastSyncMin?: number; // minutes ago
  minutesContribWeek?: number;
};

export type CheckinSpot = {
  id: string;
  label: string;       // "Entrée principale", "Salle des cours"
  type: "ENTRY" | "ROOM" | "EQUIPMENT";
  active: boolean;
};

export type AutoRule = {
  id: string;
  name: string;
  description: string;
  category: "BONUS" | "LEAGUE" | "NUDGE" | "RECOVERY";
  enabled: boolean;
  trigger: string;     // human readable
  action: string;      // human readable
  firedThisMonth: number;
  impact?: string;     // measured outcome
};

export type Sponsor = {
  id: string;
  name: string;
  logo: string;        // initials
  color: string;       // hex
  tagline?: string;
};

export type Cause = {
  id: string;
  name: string;
  short: string;       // "MSF", "WWF"
  field: string;       // "Humanitaire", "Environnement"
  emoji: string;
};

export type ChallengeStatus = "live" | "won" | "ongoing-won" | "missed";

export type SponsoredChallenge = {
  id: string;
  city: string;
  region: string;      // "Genève", "Île-de-France", etc.
  sponsorId: string;
  causeId: string;
  targetMinutes: number;
  currentMinutes: number;
  donationAmount: number;
  donationCurrency: string;
  startsAt: string;
  endsAt: string;
  status: ChallengeStatus;
  participatingClubs: number;
  participatingMembers: number;
  narrative: string;   // call to arms
};

export type TerritoryRival = {
  clubName: string;
  brand: string;
  city: string;
  arrondissement?: string;
  weekPoints: number;
  trend: number;       // +/- rank change
  members: number;
  logo: string;
  x?: number;          // map position 0-800
  y?: number;          // map position 0-500
  color?: string;      // brand color hex
  zone?: string;       // SVG path for territory polygon
};

export type Territory = {
  id: string;
  city: string;
  zone: string;        // "11e arrondissement"
  myClubRank: number;
  totalClubsInZone: number;
  myClubPoints: number;
  leader: TerritoryRival;
  rivals: TerritoryRival[];
};

export type ClubDuel = {
  id: string;
  rivalClubName: string;
  rivalBrand: string;
  rivalLogo: string;
  startsAt: string;
  endsAt: string;
  durationDays: number;
  myMinutes: number;
  rivalMinutes: number;
  status: "pending" | "live" | "won" | "lost" | "draw";
  stake: string;
  myMembers: number;
  rivalMembers: number;
};
