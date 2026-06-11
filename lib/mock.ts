import type {
  User, Session, Club, League, LeagueStanding, Course, Coach, ClubKpis, Tier,
} from "./types";

const FIRST = ["Alex", "Marie", "Lucas", "Sofia", "Theo", "Emma", "Noah", "Léa", "Hugo", "Camille", "Jules", "Chloé", "Ethan", "Inès", "Adam", "Sarah", "Tom", "Zoé", "Liam", "Jade", "Mateo", "Lina", "Gabriel", "Nina", "Raphaël", "Mila", "Arthur", "Anna", "Louis", "Eva"];
const LAST = ["Martin", "Bernard", "Dubois", "Petit", "Robert", "Richard", "Durand", "Moreau", "Laurent", "Simon", "Michel", "Garcia", "Lopez", "Silva", "Rossi", "Cohen", "Khan", "Schmidt", "Müller", "Smith", "Brown", "Lee", "Wong", "Kim", "Tanaka"];
const COUNTRIES = [
  ["France", "🇫🇷"], ["Espagne", "🇪🇸"], ["Italie", "🇮🇹"], ["Allemagne", "🇩🇪"], ["UK", "🇬🇧"],
  ["USA", "🇺🇸"], ["Brésil", "🇧🇷"], ["Japon", "🇯🇵"], ["Canada", "🇨🇦"], ["Australie", "🇦🇺"],
  ["Maroc", "🇲🇦"], ["Belgique", "🇧🇪"], ["Suisse", "🇨🇭"], ["Portugal", "🇵🇹"], ["Mexique", "🇲🇽"],
];
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  France: ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Nantes", "Toulouse"],
  Espagne: ["Madrid", "Barcelone", "Valence"],
  Italie: ["Rome", "Milan", "Naples"],
  Allemagne: ["Berlin", "Munich", "Hambourg"],
  UK: ["Londres", "Manchester"],
  USA: ["New York", "Los Angeles", "Miami", "Chicago"],
  Brésil: ["São Paulo", "Rio"],
  Japon: ["Tokyo", "Osaka"],
  Canada: ["Montréal", "Toronto"],
  Australie: ["Sydney", "Melbourne"],
  Maroc: ["Casablanca", "Rabat"],
  Belgique: ["Bruxelles"],
  Suisse: ["Genève", "Zurich"],
  Portugal: ["Lisbonne"],
  Mexique: ["Mexico"],
};
const BRANDS = ["Iron Republic", "Pulse Athletic", "Vortex Fit", "Olympus Gym", "Phoenix Club", "Nova Sports", "Apex Wellness", "Titan Fitness"];
const COACH_SPECIALTIES = ["HIIT & Cardio", "Force & Powerlifting", "Yoga & Mobilité", "Boxe & Combat", "CrossTraining", "Pilates", "Running coach", "Préparation physique"];

// deterministic pseudo-random
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const R = rng(424242);
const pick = <T,>(arr: T[]): T => arr[Math.floor(R() * arr.length)];
const between = (a: number, b: number) => Math.floor(R() * (b - a + 1)) + a;

function tierFromPoints(points: number): Tier {
  if (points >= 50000) return "LEGEND";
  if (points >= 25000) return "DIAMOND";
  if (points >= 12000) return "PLATINUM";
  if (points >= 5000) return "GOLD";
  if (points >= 1500) return "SILVER";
  return "BRONZE";
}

function makeUser(i: number, clubs: Club[]): User {
  const first = pick(FIRST);
  const last = pick(LAST);
  const club = pick(clubs);
  const [country, flag] = COUNTRIES.find(c => c[0] === club.country) || ["France", "🇫🇷"];
  const totalMinutes = between(120, 18000);
  const totalPoints = Math.round(totalMinutes * (0.9 + R() * 0.5));
  const weekMinutes = between(0, 480);
  const weekPoints = Math.round(weekMinutes * (0.9 + R() * 0.6));
  const streak = between(0, 120);
  return {
    id: `u_${i}`,
    name: `${first} ${last}`,
    avatar: (first[0] + last[0]).toUpperCase(),
    clubId: club.id,
    clubName: club.name,
    country,
    countryCode: flag,
    city: club.city,
    tier: tierFromPoints(totalPoints),
    totalMinutes,
    totalPoints,
    weekMinutes,
    weekPoints,
    streak,
    joinedAt: new Date(Date.now() - between(30, 800) * 86400000).toISOString(),
    badges: pickBadges(streak, totalMinutes),
  };
}

function pickBadges(streak: number, minutes: number): string[] {
  const badges: string[] = [];
  if (streak >= 30) badges.push("🔥 Streak 30+");
  if (streak >= 100) badges.push("👑 Streak Légende");
  if (minutes >= 5000) badges.push("⚡ 5000 min");
  if (minutes >= 10000) badges.push("🛡️ 10k Warrior");
  if (minutes >= 50) badges.push("🌱 Premier pas");
  if (R() > 0.6) badges.push("🥇 MVP du mois");
  if (R() > 0.7) badges.push("💪 Iron Discipline");
  return badges.slice(0, 4);
}

function makeClub(i: number): Club {
  const [country] = pick(COUNTRIES);
  const cities = CITIES_BY_COUNTRY[country] || ["—"];
  const city = pick(cities);
  const brand = pick(BRANDS);
  const region = regionForCountry(country);
  const members = between(180, 2400);
  const activeMembers = Math.round(members * (0.55 + R() * 0.35));
  return {
    id: `c_${i}`,
    name: `${brand} ${city}`,
    brand,
    region,
    country,
    city,
    members,
    activeMembers,
    retentionRate: 0.55 + R() * 0.4,
    weeklySessions: between(800, 9000),
    avgWeeklyMinutesPerMember: between(80, 280),
    rating: 3.8 + R() * 1.2,
    logo: brand.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
  };
}

function regionForCountry(country: string): string {
  if (["France", "Espagne", "Italie", "Allemagne", "UK", "Belgique", "Suisse", "Portugal"].includes(country)) return "Europe";
  if (["USA", "Canada", "Mexique"].includes(country)) return "Amérique du Nord";
  if (["Brésil"].includes(country)) return "Amérique du Sud";
  if (["Japon"].includes(country)) return "Asie";
  if (["Australie"].includes(country)) return "Océanie";
  if (["Maroc"].includes(country)) return "Afrique";
  return "International";
}

// Build the world
export const CLUBS: Club[] = Array.from({ length: 36 }, (_, i) => makeClub(i + 1));
export const USERS: User[] = Array.from({ length: 240 }, (_, i) => makeUser(i + 1, CLUBS));

// The "current" user (demo identity) — a top contender
export const ME: User = (() => {
  const club = CLUBS[0];
  return {
    id: "me",
    name: "Damien R.",
    avatar: "DR",
    clubId: club.id,
    clubName: club.name,
    country: club.country,
    countryCode: "🇫🇷",
    city: club.city,
    tier: "PLATINUM",
    totalMinutes: 14820,
    totalPoints: 16240,
    weekMinutes: 386,
    weekPoints: 412,
    streak: 47,
    joinedAt: new Date(Date.now() - 380 * 86400000).toISOString(),
    badges: ["🔥 Streak 30+", "⚡ 5000 min", "🛡️ 10k Warrior", "🥇 MVP du mois"],
  };
})();

// The "current" club admin sees
export const MY_CLUB: Club = CLUBS[0];

export const COACHES: Coach[] = [
  { id: "co_1", name: "Marc Dubois", avatar: "MD", specialty: "HIIT & Cardio", bio: "10 ans d'expérience, ex-athlète national.", rating: 4.9, sessions: 1240, followers: 820, badges: ["🏆 Coach du mois", "⚡ 1000+ séances"] },
  { id: "co_2", name: "Sofia Martin", avatar: "SM", specialty: "Yoga & Mobilité", bio: "Yoga vinyasa, mobilité fonctionnelle.", rating: 4.8, sessions: 980, followers: 1140, badges: ["🌟 Top rated"] },
  { id: "co_3", name: "Karim Bensalem", avatar: "KB", specialty: "Boxe & Combat", bio: "Ancien boxeur pro, coach mental.", rating: 4.95, sessions: 1530, followers: 1620, badges: ["🥇 Légende WARfit", "💪 Iron Discipline"] },
  { id: "co_4", name: "Laura Costa", avatar: "LC", specialty: "Force & Powerlifting", bio: "Préparation physique avancée.", rating: 4.7, sessions: 620, followers: 540, badges: ["🦾 Strong club"] },
  { id: "co_5", name: "Antoine Leroy", avatar: "AL", specialty: "CrossTraining", bio: "Programmation WOD, performance & technique.", rating: 4.85, sessions: 870, followers: 730, badges: [] },
  { id: "co_6", name: "Nina Petrova", avatar: "NP", specialty: "Pilates", bio: "Renforcement profond, posture.", rating: 4.75, sessions: 510, followers: 380, badges: [] },
];

export const COURSES: Course[] = [
  { id: "cs_1", name: "HIIT Inferno", coachId: "co_1", coachName: "Marc Dubois", schedule: "Lun/Mer/Ven · 18:30", capacity: 24, bookings: 22, durationMin: 45, type: "CARDIO", bonusMultiplier: 2.0, bonusEndsAt: new Date(Date.now() + 5 * 86400000).toISOString() },
  { id: "cs_2", name: "Yoga Flow Matin", coachId: "co_2", coachName: "Sofia Martin", schedule: "Mar/Jeu · 07:30", capacity: 20, bookings: 16, durationMin: 60, type: "YOGA", bonusMultiplier: 1.5, bonusEndsAt: new Date(Date.now() + 10 * 86400000).toISOString() },
  { id: "cs_3", name: "Boxing Warrior", coachId: "co_3", coachName: "Karim Bensalem", schedule: "Mar/Jeu/Sam · 19:00", capacity: 18, bookings: 18, durationMin: 60, type: "BOXING", bonusMultiplier: 2.5, bonusEndsAt: new Date(Date.now() + 3 * 86400000).toISOString() },
  { id: "cs_4", name: "Powerlift 101", coachId: "co_4", coachName: "Laura Costa", schedule: "Lun/Jeu · 17:00", capacity: 12, bookings: 10, durationMin: 75, type: "STRENGTH", bonusMultiplier: 1.0 },
  { id: "cs_5", name: "WOD Cross", coachId: "co_5", coachName: "Antoine Leroy", schedule: "Tous les jours · 12:30", capacity: 16, bookings: 14, durationMin: 60, type: "GROUP", bonusMultiplier: 1.5 },
  { id: "cs_6", name: "Pilates Core", coachId: "co_6", coachName: "Nina Petrova", schedule: "Mer/Ven · 10:00", capacity: 15, bookings: 12, durationMin: 50, type: "GROUP", bonusMultiplier: 1.0 },
  { id: "cs_7", name: "Endurance Run", coachId: "co_1", coachName: "Marc Dubois", schedule: "Sam · 09:00", capacity: 30, bookings: 21, durationMin: 90, type: "CARDIO", bonusMultiplier: 1.25 },
];

// Sessions feed for current user
export const MY_SESSIONS: Session[] = (() => {
  const types: Session["type"][] = ["CARDIO", "STRENGTH", "BOXING", "YOGA", "GROUP", "GROUP", "CARDIO"];
  return Array.from({ length: 18 }, (_, i) => {
    const daysAgo = i === 0 ? 0 : i + Math.floor(R() * 2);
    const course = COURSES[i % COURSES.length];
    const dur = course.durationMin;
    const base = dur;
    const bonus = Math.round(dur * (course.bonusMultiplier - 1));
    return {
      id: `s_${i}`,
      userId: "me",
      date: new Date(Date.now() - daysAgo * 86400000 - Math.floor(R() * 8) * 3600000).toISOString(),
      courseId: course.id,
      courseName: course.name,
      coachId: course.coachId,
      coachName: course.coachName,
      durationMin: dur,
      pointsBase: base,
      pointsBonus: bonus,
      type: types[i % types.length],
    };
  });
})();

export function getWorldLeaderboard(limit = 50): User[] {
  return [...USERS, ME].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, limit);
}

export function getClubLeaderboard(clubId: string, limit = 30): User[] {
  const list = USERS.filter(u => u.clubId === clubId);
  if (clubId === MY_CLUB.id) list.push(ME);
  return list.sort((a, b) => b.weekPoints - a.weekPoints).slice(0, limit);
}

export function getWeeklyLeaderboard(limit = 50): User[] {
  return [...USERS, ME].sort((a, b) => b.weekPoints - a.weekPoints).slice(0, limit);
}

function standingsFromUsers(users: User[], pointKey: "totalPoints" | "weekPoints"): LeagueStanding[] {
  return users.slice(0, 10).map((u, i) => ({
    rank: i + 1,
    name: u.name,
    meta: `${u.countryCode} ${u.city} · ${u.clubName}`,
    points: u[pointKey],
    trend: Math.round((Math.random() - 0.5) * 6),
    avatar: u.avatar,
  }));
}

function standingsFromClubs(clubs: Club[]): LeagueStanding[] {
  return clubs.slice(0, 10).map((c, i) => ({
    rank: i + 1,
    name: c.name,
    meta: `${c.city}, ${c.country} · ${c.activeMembers} actifs`,
    points: Math.round(c.activeMembers * c.avgWeeklyMinutesPerMember * (0.9 + Math.random() * 0.4)),
    trend: Math.round((Math.random() - 0.5) * 4),
    avatar: c.logo,
  }));
}

export const LEAGUES: League[] = (() => {
  const sortedUsers = [...USERS, ME].sort((a, b) => b.weekPoints - a.weekPoints);
  const europe = CLUBS.filter(c => c.region === "Europe").sort((a, b) => b.activeMembers * b.avgWeeklyMinutesPerMember - a.activeMembers * a.avgWeeklyMinutesPerMember);
  const ironRep = CLUBS.filter(c => c.brand === "Iron Republic");
  return [
    {
      id: "lg_1",
      name: "Ligue Club — Saison de l'hiver",
      scope: "CLUB",
      participants: USERS.filter(u => u.clubId === MY_CLUB.id).length + 1,
      participantType: "USER",
      endsAt: new Date(Date.now() + 22 * 86400000).toISOString(),
      prizePool: "Pass annuel + 6 séances PT",
      standings: standingsFromUsers(getClubLeaderboard(MY_CLUB.id), "weekPoints"),
    },
    {
      id: "lg_2",
      name: `Ligue Groupe — ${ironRep[0]?.brand ?? "Iron Republic"}`,
      scope: "GROUP",
      participants: ironRep.length,
      participantType: "CLUB",
      endsAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      prizePool: "Trophée + budget animation",
      standings: standingsFromClubs(ironRep),
    },
    {
      id: "lg_3",
      name: "Ligue Régionale — Europe",
      scope: "REGIONAL",
      participants: europe.length,
      participantType: "CLUB",
      endsAt: new Date(Date.now() + 38 * 86400000).toISOString(),
      prizePool: "Visibilité réseau WARfit",
      standings: standingsFromClubs(europe),
    },
    {
      id: "lg_4",
      name: "Ligue Internationale — WARfit Cup",
      scope: "INTERNATIONAL",
      participants: 240,
      participantType: "USER",
      endsAt: new Date(Date.now() + 60 * 86400000).toISOString(),
      prizePool: "Voyage retraite athlètes",
      standings: standingsFromUsers(sortedUsers, "weekPoints"),
    },
  ];
})();

export const CLUB_KPIS: ClubKpis = {
  activeMembers: MY_CLUB.activeMembers,
  membersChange: 8.4,
  totalMinutesWeek: Math.round(MY_CLUB.activeMembers * MY_CLUB.avgWeeklyMinutesPerMember),
  minutesChange: 12.1,
  retentionRate: MY_CLUB.retentionRate,
  retentionChange: 2.7,
  avgPointsPerMember: 318,
  pointsChange: 5.9,
  netPromoterScore: 64,
};

export function weeklyMinutesSeries(): { day: string; minutes: number }[] {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  return days.map((day, i) => ({
    day,
    minutes: Math.round(MY_CLUB.activeMembers * MY_CLUB.avgWeeklyMinutesPerMember / 7 * (0.7 + Math.sin(i * 1.1) * 0.3 + Math.random() * 0.2)),
  }));
}

export function membersGrowthSeries(): { month: string; members: number }[] {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
  let base = Math.round(MY_CLUB.activeMembers * 0.78);
  return months.map((m) => {
    base = Math.round(base * (1 + 0.025 + Math.random() * 0.03));
    return { month: m, members: base };
  });
}

export function courseAttendanceSeries(): { name: string; bookings: number; capacity: number }[] {
  return COURSES.map(c => ({ name: c.name, bookings: c.bookings, capacity: c.capacity }));
}

export function findUser(id: string): User | undefined {
  if (id === "me") return ME;
  return USERS.find(u => u.id === id);
}

export function findLeague(id: string): League | undefined {
  return LEAGUES.find(l => l.id === id);
}

export function findCoach(id: string): Coach | undefined {
  return COACHES.find(c => c.id === id);
}

export function findCourse(id: string): Course | undefined {
  return COURSES.find(c => c.id === id);
}
