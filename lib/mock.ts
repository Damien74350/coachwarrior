import type {
  User, Session, Club, League, LeagueStanding, Course, Coach, ClubKpis, Tier,
  Season, Friend, HealthSource, CheckinSpot, AutoRule,
  Sponsor, Cause, SponsoredChallenge, TerritoryRival, Territory, ClubDuel,
  GroupHQ, CityPin, GroupChallenge, BattlePassTier, BattlePassMission, BossRaid,
  InternalLeague, MyLeagueStanding, PricingTier,
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

// ────────────────────────────────────────────────────────────
// SEASONS — classements actifs remis à zéro à chaque saison.
// Le tout-temps existe en archive, pas en vue par défaut.
// ────────────────────────────────────────────────────────────

const SEASON_END = new Date(Date.now() + 22 * 86400000);
const SEASON_START = new Date(SEASON_END.getTime() - 90 * 86400000);

export const CURRENT_SEASON: Season = {
  id: "s_winter_2026",
  name: "Saison Hiver 2026",
  startsAt: SEASON_START.toISOString(),
  endsAt: SEASON_END.toISOString(),
  theme: "L'hiver révèle les guerriers. Tous repartent à zéro.",
};

export const PAST_SEASONS: Season[] = [
  { id: "s_autumn_2025", name: "Saison Automne 2025", startsAt: "2025-09-22", endsAt: "2025-12-20", theme: "—" },
  { id: "s_summer_2025", name: "Saison Été 2025", startsAt: "2025-06-21", endsAt: "2025-09-21", theme: "—" },
];

// ────────────────────────────────────────────────────────────
// FRIENDS — cercle proche, défaut du leaderboard membre.
// Les classements locaux sont la home ; le mondial est optionnel.
// ────────────────────────────────────────────────────────────

export const FRIENDS: Friend[] = [
  { id: "f_1", name: "Karim B.",   avatar: "KB", countryCode: "🇲🇦", city: "Casablanca", clubName: "Iron Republic Casa",  weekPoints: 624, weekMinutes: 540, tier: "LEGEND",   status: "training" },
  { id: "f_2", name: "Sofia M.",   avatar: "SM", countryCode: "🇪🇸", city: "Madrid",     clubName: "Pulse Athletic MAD", weekPoints: 587, weekMinutes: 510, tier: "DIAMOND",  status: "online"   },
  { id: "f_3", name: "Liam S.",    avatar: "LS", countryCode: "🇬🇧", city: "Londres",    clubName: "Vortex Fit LDN",      weekPoints: 398, weekMinutes: 360, tier: "PLATINUM", status: "offline"  },
  { id: "f_4", name: "Yuki T.",    avatar: "YT", countryCode: "🇯🇵", city: "Tokyo",      clubName: "Olympus Gym TYO",    weekPoints: 376, weekMinutes: 340, tier: "GOLD",     status: "online"   },
  { id: "f_5", name: "Inès L.",    avatar: "IL", countryCode: "🇫🇷", city: ME.city,      clubName: ME.clubName,            weekPoints: 318, weekMinutes: 290, tier: "GOLD",     status: "online"   },
  { id: "f_6", name: "Mateo P.",   avatar: "MP", countryCode: "🇧🇷", city: "São Paulo",  clubName: "Phoenix Club SAO",   weekPoints: 244, weekMinutes: 220, tier: "SILVER",   status: "offline"  },
  { id: "f_7", name: "Chloé D.",   avatar: "CD", countryCode: "🇫🇷", city: ME.city,      clubName: ME.clubName,            weekPoints: 198, weekMinutes: 180, tier: "SILVER",   status: "offline"  },
];

// Quartier = même ville. C'est l'échelle qui motive vraiment.
export function getNeighborhoodLeaderboard(limit = 30): User[] {
  const list = [...USERS, ME].filter(u => u.city === ME.city);
  return list.sort((a, b) => b.weekPoints - a.weekPoints).slice(0, limit);
}

// Classement amis = cercle social. Toujours petit, toujours motivant.
export function getFriendsLeaderboard(): User[] {
  const synthetic: User[] = FRIENDS.map(f => ({
    id: f.id,
    name: f.name,
    avatar: f.avatar,
    clubId: "",
    clubName: f.clubName,
    country: "",
    countryCode: f.countryCode,
    city: f.city,
    tier: f.tier,
    totalMinutes: 0,
    totalPoints: 0,
    weekMinutes: f.weekMinutes,
    weekPoints: f.weekPoints,
    streak: 0,
    joinedAt: "",
    badges: [],
  }));
  return [...synthetic, ME].sort((a, b) => b.weekPoints - a.weekPoints);
}

// ────────────────────────────────────────────────────────────
// HEALTH SOURCES — pour éliminer la saisie manuelle.
// ────────────────────────────────────────────────────────────

export const HEALTH_SOURCES: HealthSource[] = [
  { id: "apple_health", label: "Apple Health",  connected: true,  lastSyncMin: 3,    minutesContribWeek: 142 },
  { id: "google_fit",   label: "Google Fit",    connected: false                                              },
  { id: "strava",       label: "Strava",        connected: true,  lastSyncMin: 18,   minutesContribWeek: 88   },
  { id: "garmin",       label: "Garmin Connect",connected: false                                              },
  { id: "fitbit",       label: "Fitbit",        connected: false                                              },
];

// Check-in spots du club — QR / NFC.
export const CHECKIN_SPOTS: CheckinSpot[] = [
  { id: "sp_1", label: "Entrée principale",    type: "ENTRY", active: true  },
  { id: "sp_2", label: "Salle des cours",      type: "ROOM",  active: true  },
  { id: "sp_3", label: "Plateau de musculation",type: "ROOM", active: true  },
  { id: "sp_4", label: "Studio yoga",          type: "ROOM",  active: false },
];

// ────────────────────────────────────────────────────────────
// AUTOPILOT — réduit le travail du gérant à zéro par défaut.
// ────────────────────────────────────────────────────────────

export const AUTO_RULES: AutoRule[] = [
  {
    id: "ar_bonus_fill",
    name: "Auto-bonus créneaux creux",
    description: "Active automatiquement un ×2 sur les cours dont le remplissage est sous 50% à J-2.",
    category: "BONUS",
    enabled: true,
    trigger: "Cours à J-2 avec < 50% de places réservées",
    action: "Active ×2 et push notif aux 200 membres les plus actifs",
    firedThisMonth: 14,
    impact: "+38% de remplissage moyen sur ces cours",
  },
  {
    id: "ar_bonus_offpeak",
    name: "Boost permanent heures creuses",
    description: "Tous les cours entre 14h et 16h reçoivent un ×1.5 d'office.",
    category: "BONUS",
    enabled: true,
    trigger: "Cours programmé entre 14h et 16h",
    action: "Multiplier le score base ×1.5",
    firedThisMonth: 42,
    impact: "+22% d'affluence sur les après-midi",
  },
  {
    id: "ar_league_monthly",
    name: "Ligue mensuelle auto-générée",
    description: "Crée la ligue interne du club le 1er de chaque mois, 30 jours.",
    category: "LEAGUE",
    enabled: true,
    trigger: "Le 1er du mois à 00:00",
    action: "Lance une nouvelle ligue interne avec prize template",
    firedThisMonth: 1,
    impact: "Taux de participation 64% des membres actifs",
  },
  {
    id: "ar_league_streak",
    name: "Streak Survivor mensuel",
    description: "Lance la ligue 'Streak Survivor' (qui tient la plus longue streak) chaque mois.",
    category: "LEAGUE",
    enabled: false,
    trigger: "Le 1er du mois",
    action: "Crée la ligue Streak Survivor pour 30 jours",
    firedThisMonth: 0,
  },
  {
    id: "ar_at_risk",
    name: "Sauvetage membres à risque",
    description: "Envoie un push perso aux membres qui n'ont pas check-in depuis 14j.",
    category: "NUDGE",
    enabled: true,
    trigger: "Pas de check-in depuis 14 jours",
    action: "Push 'Tu nous manques' + bonus ×3 perso de 7j",
    firedThisMonth: 87,
    impact: "31% de réactivation, +14pts de rétention",
  },
  {
    id: "ar_streak_save",
    name: "Sauve-streak",
    description: "Quand un membre risque de perdre sa streak (rien fait depuis 18h), notification rappel.",
    category: "NUDGE",
    enabled: true,
    trigger: "Streak ≥ 7j et aucune activité depuis 18h",
    action: "Push 'Ta streak de {N} jours est en danger'",
    firedThisMonth: 312,
    impact: "78% reprennent l'entraînement dans la soirée",
  },
  {
    id: "ar_birthday",
    name: "Anniversaire athlète",
    description: "Bonus ×2 toute la journée d'anniversaire du membre.",
    category: "NUDGE",
    enabled: true,
    trigger: "Date d'anniversaire du membre",
    action: "Bonus ×2 personnel toute la journée + message coach",
    firedThisMonth: 9,
    impact: "Visite +91% le jour J",
  },
  {
    id: "ar_recovery",
    name: "Suggestion récupération",
    description: "Au-delà de 4 jours d'affilée, propose une séance yoga / mobilité (bonus).",
    category: "RECOVERY",
    enabled: true,
    trigger: "4+ jours d'entraînement consécutifs",
    action: "Push suggestion cours mobilité avec bonus ×2",
    firedThisMonth: 56,
    impact: "Réduit l'abandon post-burnout de 40%",
  },
];

// Suggestions de l'autopilot pour la home club.
export type AutoSuggestion = {
  id: string;
  title: string;
  reason: string;
  cta: string;
  severity: "info" | "warn" | "win";
};
export const AUTO_SUGGESTIONS: AutoSuggestion[] = [
  { id: "sg_1", title: "Boxing Warrior — créneau samedi 19h", reason: "82% rempli en moyenne, mais la semaine prochaine est à 33%. Active un ×2.", cta: "Activer le bonus", severity: "warn" },
  { id: "sg_2", title: "12 membres à risque cette semaine", reason: "Pas de check-in depuis 10+ jours. Le bot peut envoyer un push perso.", cta: "Lancer la campagne", severity: "warn" },
  { id: "sg_3", title: "Lance la ligue 'Battle des coachs'", reason: "Tes coachs Karim & Marc ont les meilleurs ratings. Une battle ferait monter le NPS.", cta: "Créer la ligue (1 clic)", severity: "info" },
  { id: "sg_4", title: "Inès L. va atteindre Diamant", reason: "Plus que 80 pts. Envoie-lui un message du club pour fêter ça.", cta: "Envoyer le message", severity: "win" },
];

export function autopilotStats() {
  const enabled = AUTO_RULES.filter(r => r.enabled).length;
  const monthly = AUTO_RULES.reduce((s, r) => s + (r.enabled ? r.firedThisMonth : 0), 0);
  return { enabled, total: AUTO_RULES.length, monthly };
}

// ────────────────────────────────────────────────────────────
// TERRITOIRE — l'identité club passe AVANT l'identité perso.
// On affiche d'abord "qui on est", puis "qui nous menace".
// ────────────────────────────────────────────────────────────

export const MY_TERRITORY: Territory = {
  id: "ter_paris_11",
  city: "Paris",
  zone: "11e arrondissement",
  myClubRank: 2,
  totalClubsInZone: 6,
  myClubPoints: 184_320,
  leader: {
    clubName: "Basic-Fit République", brand: "Basic-Fit", city: "Paris", arrondissement: "11e",
    weekPoints: 186_540, trend: +1, members: 1_820, logo: "BF",
    x: 220, y: 180, color: "#fb923c", zone: "M 0 0 L 380 0 L 360 230 L 80 220 L 0 200 Z",
  },
  rivals: [
    { clubName: "Basic-Fit République",     brand: "Basic-Fit",     city: "Paris", arrondissement: "11e", weekPoints: 186_540, trend: +1, members: 1_820, logo: "BF",
      x: 220, y: 180, color: "#fb923c", zone: "M 0 0 L 380 0 L 360 230 L 80 220 L 0 200 Z" },
    { clubName: "Iron Republic Paris 11e",  brand: "Iron Republic", city: "Paris", arrondissement: "11e", weekPoints: 184_320, trend: 0,  members: 1_140, logo: "IR",
      x: 480, y: 190, color: "#f43f5e", zone: "M 380 0 L 800 0 L 800 240 L 580 250 L 360 230 Z" },
    { clubName: "Fitness Park Nation",      brand: "Fitness Park",  city: "Paris", arrondissement: "11e", weekPoints: 142_870, trend: -1, members: 1_310, logo: "FP",
      x: 650, y: 360, color: "#10b981", zone: "M 800 240 L 800 500 L 540 500 L 520 340 L 580 250 Z" },
    { clubName: "On Air Voltaire",          brand: "On Air",        city: "Paris", arrondissement: "11e", weekPoints: 96_410,  trend: 0,  members: 740,   logo: "OA",
      x: 380, y: 380, color: "#a78bfa", zone: "M 80 220 L 360 230 L 580 250 L 520 340 L 540 500 L 220 500 L 100 380 Z" },
    { clubName: "Neoness Bastille",         brand: "Neoness",       city: "Paris", arrondissement: "11e", weekPoints: 84_220,  trend: +1, members: 690,   logo: "NS",
      x: 150, y: 380, color: "#22d3ee", zone: "M 0 200 L 80 220 L 100 380 L 220 500 L 0 500 Z" },
    { clubName: "Keep Cool Charonne",       brand: "Keep Cool",     city: "Paris", arrondissement: "11e", weekPoints: 71_080,  trend: -1, members: 580,   logo: "KC",
      x: 720, y: 220, color: "#eab308" },
  ],
};

export const CLUB_DUELS: ClubDuel[] = [
  {
    id: "d_1",
    rivalClubName: "Basic-Fit République", rivalBrand: "Basic-Fit", rivalLogo: "BF",
    startsAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    endsAt: new Date(Date.now() + 4 * 86400000).toISOString(),
    durationDays: 7,
    myMinutes: 92_410, rivalMinutes: 94_870,
    status: "live",
    stake: "Trophée hebdo + ×2 bonus 7j sur tous les cours du gagnant",
    myMembers: 1_140, rivalMembers: 1_820,
  },
  {
    id: "d_2",
    rivalClubName: "Fitness Park Nation", rivalBrand: "Fitness Park", rivalLogo: "FP",
    startsAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    endsAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    durationDays: 7,
    myMinutes: 88_220, rivalMinutes: 71_410,
    status: "won",
    stake: "Bragging rights",
    myMembers: 1_140, rivalMembers: 1_310,
  },
];

// ────────────────────────────────────────────────────────────
// DÉFIS SPONSORISÉS — la 3e couche : effort = don à une cause.
// Une ville pool ses minutes ; si l'objectif est atteint,
// le sponsor verse à l'association. C'est l'essence du concept.
// ────────────────────────────────────────────────────────────

export const SPONSORS: Sponsor[] = [
  { id: "sp_rolex",    name: "Fondation Rolex",       logo: "RX", color: "#a37e2c", tagline: "L'horlogerie soutient l'effort." },
  { id: "sp_decath",   name: "Decathlon Foundation",  logo: "DC", color: "#0082c3", tagline: "Le sport, accessible à tous." },
  { id: "sp_lvmh",     name: "LVMH Care",             logo: "LV", color: "#1a1a1a", tagline: "L'élégance au service de la cause." },
  { id: "sp_coca",     name: "Coca-Cola Foundation",  logo: "CC", color: "#e8112d", tagline: "Bouger ensemble." },
  { id: "sp_bnp",      name: "BNP Paribas Solidarité",logo: "BP", color: "#00a651", tagline: "La banque qui rend." },
  { id: "sp_ck",       name: "Calvin Klein Sport",    logo: "CK", color: "#000000", tagline: "Move with purpose." },
];

export const CAUSES: Cause[] = [
  { id: "ca_msf",     name: "Médecins Sans Frontières", short: "MSF",          field: "Humanitaire",  emoji: "🩺" },
  { id: "ca_wwf",     name: "WWF",                       short: "WWF",          field: "Environnement",emoji: "🌍" },
  { id: "ca_unicef",  name: "UNICEF",                    short: "UNICEF",       field: "Enfance",      emoji: "👧" },
  { id: "ca_resto",   name: "Restos du Cœur",            short: "Restos du Cœur",field: "Solidarité",  emoji: "🍲" },
  { id: "ca_secours", name: "Secours Populaire",         short: "Secours Pop.", field: "Solidarité",   emoji: "🤝" },
  { id: "ca_sea",     name: "Sea Shepherd",              short: "Sea Shepherd", field: "Océans",       emoji: "🌊" },
];

const CH_END = new Date(Date.now() + 6 * 86400000);
const CH_START = new Date(Date.now() - 24 * 86400000);

export const CHALLENGES: SponsoredChallenge[] = [
  {
    id: "ch_geneva_rolex",
    city: "Genève",
    region: "Genève",
    sponsorId: "sp_rolex",
    causeId: "ca_msf",
    targetMinutes: 430_000,
    currentMinutes: 312_540,
    donationAmount: 20_000,
    donationCurrency: "CHF",
    startsAt: CH_START.toISOString(),
    endsAt: CH_END.toISOString(),
    status: "live",
    participatingClubs: 14,
    participatingMembers: 4_820,
    narrative: "Genève contre le silence des zones de guerre. Chaque minute d'effort rapproche d'un mois de soins sur le terrain.",
  },
  {
    id: "ch_paris_decath",
    city: "Paris",
    region: "Île-de-France",
    sponsorId: "sp_decath",
    causeId: "ca_resto",
    targetMinutes: 1_200_000,
    currentMinutes: 894_300,
    donationAmount: 50_000,
    donationCurrency: "€",
    startsAt: CH_START.toISOString(),
    endsAt: CH_END.toISOString(),
    status: "live",
    participatingClubs: 42,
    participatingMembers: 18_400,
    narrative: "Paris transforme sa sueur en repas chauds. 50 000 € = 14 500 repas distribués cet hiver.",
  },
  {
    id: "ch_lyon_bnp",
    city: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    sponsorId: "sp_bnp",
    causeId: "ca_unicef",
    targetMinutes: 680_000,
    currentMinutes: 712_410,
    donationAmount: 30_000,
    donationCurrency: "€",
    startsAt: CH_START.toISOString(),
    endsAt: CH_END.toISOString(),
    status: "ongoing-won",
    participatingClubs: 19,
    participatingMembers: 7_240,
    narrative: "Lyon a déjà débloqué les 30 000 €. Tout effort supplémentaire est offert — pour aller plus loin.",
  },
  {
    id: "ch_madrid_lvmh",
    city: "Madrid",
    region: "Comunidad de Madrid",
    sponsorId: "sp_lvmh",
    causeId: "ca_sea",
    targetMinutes: 540_000,
    currentMinutes: 121_080,
    donationAmount: 25_000,
    donationCurrency: "€",
    startsAt: CH_START.toISOString(),
    endsAt: CH_END.toISOString(),
    status: "live",
    participatingClubs: 11,
    participatingMembers: 3_120,
    narrative: "Madrid pour les océans. 25 000 € = une mission anti-braconnage pendant 3 mois.",
  },
  {
    id: "ch_tokyo_coca",
    city: "Tokyo",
    region: "Kanto",
    sponsorId: "sp_coca",
    causeId: "ca_wwf",
    targetMinutes: 920_000,
    currentMinutes: 638_220,
    donationAmount: 4_000_000,
    donationCurrency: "¥",
    startsAt: CH_START.toISOString(),
    endsAt: CH_END.toISOString(),
    status: "live",
    participatingClubs: 28,
    participatingMembers: 11_300,
    narrative: "Tokyo court pour la forêt. 4M ¥ = 50 ha de reforestation au Mont Fuji.",
  },
];

// Défis remportés le mois dernier (preuve sociale).
export const PAST_CHALLENGES: SponsoredChallenge[] = [
  {
    id: "pc_1", city: "Genève", region: "Genève",
    sponsorId: "sp_rolex", causeId: "ca_msf",
    targetMinutes: 380_000, currentMinutes: 412_140,
    donationAmount: 18_000, donationCurrency: "CHF",
    startsAt: "2026-05-01", endsAt: "2026-05-31",
    status: "won", participatingClubs: 12, participatingMembers: 4_120,
    narrative: "—",
  },
  {
    id: "pc_2", city: "Paris", region: "Île-de-France",
    sponsorId: "sp_decath", causeId: "ca_secours",
    targetMinutes: 1_100_000, currentMinutes: 1_184_200,
    donationAmount: 45_000, donationCurrency: "€",
    startsAt: "2026-05-01", endsAt: "2026-05-31",
    status: "won", participatingClubs: 38, participatingMembers: 16_240,
    narrative: "—",
  },
  {
    id: "pc_3", city: "Berlin", region: "Berlin",
    sponsorId: "sp_lvmh", causeId: "ca_wwf",
    targetMinutes: 720_000, currentMinutes: 698_400,
    donationAmount: 22_000, donationCurrency: "€",
    startsAt: "2026-05-01", endsAt: "2026-05-31",
    status: "missed", participatingClubs: 16, participatingMembers: 5_240,
    narrative: "—",
  },
];

export function findSponsor(id: string): Sponsor | undefined { return SPONSORS.find(s => s.id === id); }
export function findCause(id: string): Cause | undefined { return CAUSES.find(c => c.id === id); }
export function findChallenge(id: string): SponsoredChallenge | undefined { return CHALLENGES.find(c => c.id === id); }

// Mon défi local (Paris).
export const MY_CHALLENGE = CHALLENGES.find(c => c.city === "Paris")!;

export function totalDonationsThisMonth(): { eur: number; chf: number; jpy: number; count: number } {
  const won = [...CHALLENGES.filter(c => c.status === "ongoing-won"), ...PAST_CHALLENGES.filter(c => c.status === "won")];
  let eur = 0, chf = 0, jpy = 0;
  won.forEach(c => {
    if (c.donationCurrency === "€") eur += c.donationAmount;
    else if (c.donationCurrency === "CHF") chf += c.donationAmount;
    else if (c.donationCurrency === "¥") jpy += c.donationAmount;
  });
  return { eur, chf, jpy, count: won.length };
}

// ────────────────────────────────────────────────────────────
// HQ DASHBOARD — pour les sièges de chaîne. Inter-groupe rivalry.
// Basic-Fit France vs Fitness Park France vs Iron Republic France.
// ────────────────────────────────────────────────────────────

export const GROUPS_HQ: GroupHQ[] = [
  { id: "g_kc", brand: "Keep Cool",     color: "#eab308", ceoName: "François Mancel",  ceoTitle: "PDG Keep Cool France",       ceoAvatar: "FM",
    clubsCount: 380, membersCount: 940_000, monthMinutes: 88_240_000, warCoinsBudget: 250_000, warCoinsSpent: 180_400, rankNational: 1, trend: +1,
    trophies: [{ name: "Champion National 2025", year: 2025, emoji: "🏆" }, { name: "Boss Raid Hero", year: 2025, emoji: "👑" }] },
  { id: "g_fp", brand: "Fitness Park",  color: "#10b981", ceoName: "Sandra Borel",     ceoTitle: "DG Fitness Park France",     ceoAvatar: "SB",
    clubsCount: 220, membersCount: 1_400_000, monthMinutes: 124_180_000, warCoinsBudget: 320_000, warCoinsSpent: 210_500, rankNational: 2, trend: 0,
    trophies: [{ name: "Champion Régional Ouest", year: 2025, emoji: "🥇" }] },
  { id: "g_bf", brand: "Basic-Fit",     color: "#fb923c", ceoName: "Marc Vellard",     ceoTitle: "Directeur France Basic-Fit", ceoAvatar: "MV",
    clubsCount: 180, membersCount: 820_000, monthMinutes: 64_320_000, warCoinsBudget: 280_000, warCoinsSpent: 245_800, rankNational: 3, trend: +2,
    trophies: [{ name: "Saison Été MVP", year: 2025, emoji: "🥈" }] },
  { id: "g_oa", brand: "On Air",        color: "#a78bfa", ceoName: "Lila Ferrand",     ceoTitle: "CEO On Air",                 ceoAvatar: "LF",
    clubsCount: 65, membersCount: 280_000, monthMinutes: 28_980_000, warCoinsBudget: 140_000, warCoinsSpent: 92_100, rankNational: 4, trend: -1,
    trophies: [] },
  { id: "g_ne", brand: "Neoness",       color: "#22d3ee", ceoName: "Théo Albani",      ceoTitle: "Directeur Général Neoness",  ceoAvatar: "TA",
    clubsCount: 45, membersCount: 220_000, monthMinutes: 19_340_000, warCoinsBudget: 100_000, warCoinsSpent: 64_300, rankNational: 5, trend: 0,
    trophies: [] },
  { id: "g_ir", brand: "Iron Republic", color: "#f43f5e", ceoName: "Damien Roux",      ceoTitle: "Co-founder Iron Republic",   ceoAvatar: "DR",
    clubsCount: 42, membersCount: 95_000, monthMinutes: 14_240_000, warCoinsBudget: 80_000, warCoinsSpent: 71_200, rankNational: 6, trend: +1,
    trophies: [{ name: "Boutique de l'année", year: 2025, emoji: "💎" }] },
];

export const MY_GROUP = GROUPS_HQ.find(g => g.brand === "Iron Republic")!;

// Carte de France — positions des grandes villes
export const FRANCE_CITY_PINS: CityPin[] = [
  { city: "Paris", x: 320, y: 200,
    brands: [
      { brand: "Basic-Fit",     clubs: 24, minutes: 2_840_000, color: "#fb923c" },
      { brand: "Fitness Park",  clubs: 18, minutes: 2_120_000, color: "#10b981" },
      { brand: "Keep Cool",     clubs: 32, minutes: 3_280_000, color: "#eab308" },
      { brand: "Iron Republic", clubs: 6,  minutes: 1_640_000, color: "#f43f5e" },
      { brand: "On Air",        clubs: 8,  minutes: 1_120_000, color: "#a78bfa" },
      { brand: "Neoness",       clubs: 6,  minutes: 820_000,   color: "#22d3ee" },
    ],
    dominant: "Keep Cool" },
  { city: "Lyon", x: 380, y: 380,
    brands: [
      { brand: "Fitness Park",  clubs: 14, minutes: 1_680_000, color: "#10b981" },
      { brand: "Keep Cool",     clubs: 18, minutes: 1_840_000, color: "#eab308" },
      { brand: "Basic-Fit",     clubs: 10, minutes: 1_120_000, color: "#fb923c" },
      { brand: "Iron Republic", clubs: 3,  minutes: 720_000,   color: "#f43f5e" },
    ],
    dominant: "Keep Cool" },
  { city: "Marseille", x: 380, y: 520,
    brands: [
      { brand: "Fitness Park",  clubs: 12, minutes: 1_420_000, color: "#10b981" },
      { brand: "Keep Cool",     clubs: 8,  minutes: 880_000,   color: "#eab308" },
      { brand: "Basic-Fit",     clubs: 6,  minutes: 640_000,   color: "#fb923c" },
    ],
    dominant: "Fitness Park" },
  { city: "Bordeaux", x: 180, y: 420,
    brands: [
      { brand: "Keep Cool",     clubs: 12, minutes: 1_080_000, color: "#eab308" },
      { brand: "Fitness Park",  clubs: 8,  minutes: 740_000,   color: "#10b981" },
      { brand: "Neoness",       clubs: 4,  minutes: 320_000,   color: "#22d3ee" },
    ],
    dominant: "Keep Cool" },
  { city: "Lille", x: 320, y: 90,
    brands: [
      { brand: "Basic-Fit",     clubs: 18, minutes: 1_840_000, color: "#fb923c" },
      { brand: "Fitness Park",  clubs: 10, minutes: 980_000,   color: "#10b981" },
      { brand: "Keep Cool",     clubs: 8,  minutes: 720_000,   color: "#eab308" },
    ],
    dominant: "Basic-Fit" },
  { city: "Nantes", x: 170, y: 280,
    brands: [
      { brand: "Fitness Park",  clubs: 10, minutes: 1_120_000, color: "#10b981" },
      { brand: "Keep Cool",     clubs: 12, minutes: 1_080_000, color: "#eab308" },
      { brand: "On Air",        clubs: 4,  minutes: 380_000,   color: "#a78bfa" },
    ],
    dominant: "Fitness Park" },
  { city: "Toulouse", x: 240, y: 510,
    brands: [
      { brand: "Keep Cool",     clubs: 14, minutes: 1_280_000, color: "#eab308" },
      { brand: "Basic-Fit",     clubs: 10, minutes: 980_000,   color: "#fb923c" },
      { brand: "Fitness Park",  clubs: 8,  minutes: 740_000,   color: "#10b981" },
    ],
    dominant: "Keep Cool" },
  { city: "Strasbourg", x: 460, y: 200,
    brands: [
      { brand: "Fitness Park",  clubs: 8,  minutes: 720_000,   color: "#10b981" },
      { brand: "Basic-Fit",     clubs: 6,  minutes: 540_000,   color: "#fb923c" },
    ],
    dominant: "Fitness Park" },
  { city: "Nice", x: 460, y: 510,
    brands: [
      { brand: "Fitness Park",  clubs: 6,  minutes: 580_000,   color: "#10b981" },
      { brand: "Iron Republic", clubs: 2,  minutes: 380_000,   color: "#f43f5e" },
    ],
    dominant: "Fitness Park" },
];

// Défi NATIONAL en cours: Basic-Fit France vs Fitness Park France
export const GROUP_CHALLENGES: GroupChallenge[] = [
  {
    id: "gc_1",
    challenger: "Basic-Fit",
    challenged: "Fitness Park",
    startsAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    endsAt: new Date(Date.now() + 22 * 86400000).toISOString(),
    challengerMinutes: 18_240_000,
    challengedMinutes: 24_180_000,
    targetMinutes: 50_000_000,
    warCoinPot: 480_000,
    status: "live",
    participatingClubs: 400,
    participatingMembers: 2_220_000,
    stake: "Trophée National + 480k war coins + visibilité presse",
    sponsor: { name: "Decathlon", amount: 100_000, currency: "€" },
  },
  {
    id: "gc_2",
    challenger: "Iron Republic",
    challenged: "On Air",
    startsAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    endsAt: new Date(Date.now() + 4 * 86400000).toISOString(),
    challengerMinutes: 4_120_000,
    challengedMinutes: 3_840_000,
    targetMinutes: 8_000_000,
    warCoinPot: 80_000,
    status: "live",
    participatingClubs: 107,
    participatingMembers: 375_000,
    stake: "Boutique vs Mainstream — bragging rights nationaux",
  },
];

// ────────────────────────────────────────────────────────────
// WAR PASS — battle pass mensuel, 50 niveaux
// ────────────────────────────────────────────────────────────

export const MY_BATTLE_PASS = {
  seasonName: "Saison Hiver 2026 · War Pass",
  currentLevel: 23,
  currentXp: 4_320,
  xpToNextLevel: 6_000,
  totalLevels: 50,
  hasPremium: false,
  daysRemaining: 22,
};

const BP_REWARDS = [
  { freeReward: { label: "Welcome pack",       emoji: "🎁", type: "coins" as const },  premiumReward: { label: "Drapeau d'or",        emoji: "🏁", type: "skin" as const   } },
  { freeReward: { label: "200 war coins",      emoji: "🪙", type: "coins" as const },  premiumReward: { label: "Bonus ×2 perso 24h",  emoji: "⚡", type: "bonus" as const  } },
  { freeReward: { label: "Badge Premier pas",  emoji: "🌱", type: "badge" as const },  premiumReward: { label: "500 war coins",       emoji: "🪙", type: "coins" as const  } },
  { freeReward: { label: "Bonus ×1.5 24h",     emoji: "⚡", type: "bonus" as const },  premiumReward: { label: "Badge Pionnier",      emoji: "🥇", type: "badge" as const  } },
  { freeReward: { label: "300 war coins",      emoji: "🪙", type: "coins" as const },  premiumReward: { label: "Drapeau holographique", emoji: "✨", type: "skin" as const } },
  { freeReward: { label: "Badge Spartiate",    emoji: "💪", type: "badge" as const },  premiumReward: { label: "1000 war coins",      emoji: "🪙", type: "coins" as const  } },
  { freeReward: { label: "Bonus ×2 24h",       emoji: "⚡", type: "bonus" as const },  premiumReward: { label: "Skin tier dorure",    emoji: "👑", type: "skin" as const   } },
  { freeReward: { label: "400 war coins",      emoji: "🪙", type: "coins" as const },  premiumReward: { label: "Trophée Hiver",       emoji: "🏆", type: "trophy" as const } },
];

export const BATTLE_PASS_TIERS: BattlePassTier[] = Array.from({ length: 50 }, (_, i) => {
  const level = i + 1;
  const base = BP_REWARDS[i % BP_REWARDS.length];
  return {
    level,
    pointsRequired: 1000 + i * 250,
    freeReward: base.freeReward,
    premiumReward: base.premiumReward,
  };
});

export const BATTLE_PASS_MISSIONS: BattlePassMission[] = [
  // Daily
  { id: "m_1", label: "Check-in au club aujourd'hui",          xp: 200,  done: 1,  target: 1,   type: "daily" },
  { id: "m_2", label: "30 minutes d'activité",                 xp: 300,  done: 24, target: 30,  type: "daily" },
  { id: "m_3", label: "Participer à un cours collectif",       xp: 400,  done: 0,  target: 1,   type: "daily" },
  // Weekly
  { id: "m_4", label: "5 séances cette semaine",                xp: 1000, done: 3,  target: 5,   type: "weekly" },
  { id: "m_5", label: "Contribuer 300 min au défi du club",     xp: 1200, done: 184, target: 300, type: "weekly" },
  { id: "m_6", label: "Inviter un ami sur WARfit",              xp: 800,  done: 0,  target: 1,   type: "weekly" },
  { id: "m_7", label: "Tester 3 cours différents",              xp: 900,  done: 1,  target: 3,   type: "weekly" },
  // Season
  { id: "m_8", label: "Streak 30 jours",                        xp: 5000, done: 23, target: 30,  type: "season" },
  { id: "m_9", label: "Atteindre Diamant",                      xp: 8000, done: 16240, target: 25000, type: "season" },
  { id: "m_10", label: "Gagner un défi de club",                xp: 3000, done: 1,  target: 1,   type: "season" },
];

// ────────────────────────────────────────────────────────────
// BOSS RAID hebdomadaire — événement collaboratif mondial
// ────────────────────────────────────────────────────────────

export const CURRENT_BOSS_RAID: BossRaid = {
  id: "br_1",
  name: "Le Géant du Dimanche",
  description: "Mobilisation mondiale 24h. Tous les clubs WARfit s'unissent pour terrasser le Géant. Si on atteint 10M de minutes avant minuit dimanche, TOUS les membres reçoivent 500 war coins + un badge unique.",
  emoji: "🐉",
  startsAt: new Date(Date.now() - 14 * 3600000).toISOString(),
  endsAt: new Date(Date.now() + 10 * 3600000).toISOString(),
  targetMinutes: 10_000_000,
  currentMinutes: 7_840_000,
  participatingClubs: 612,
  participatingMembers: 184_320,
  rewardIfBeaten: "500 war coins + Badge 'Slayer' légendaire pour TOUS",
  status: "live",
};

// War Coins du membre
export const MY_WAR_COINS = 1_280;

// ────────────────────────────────────────────────────────────
// LIGUES INTERNES — par niveau, dans CHAQUE club.
// Mamie, débutant et athlète n'affrontent QUE leurs pairs.
// La régularité ouvre la promotion. La performance s'ajoute en haut.
// ────────────────────────────────────────────────────────────

export const INTERNAL_LEAGUES: InternalLeague[] = [
  {
    id: "il_1", level: 1, name: "Découverte", emoji: "🌱", color: "#86efac",
    motto: "Tout commence ici.",
    description: "Tu démarres. Ici on récompense uniquement le fait de venir. Aucun jugement, aucune perf.",
    weeklyMinutesMin: 0, weeklyMinutesMax: 100,
    weights: { regularity: 100, diversity: 0, performance: 0, impact: 0 },
    promoteCoachId: "co_2", promoteCourseId: "cs_2", membersInClub: 248,
  },
  {
    id: "il_2", level: 2, name: "Régulier", emoji: "💪", color: "#fdba74",
    motto: "L'habitude est ancrée.",
    description: "Tu viens régulièrement. On t'invite à tester d'autres disciplines pour trouver ta passion.",
    weeklyMinutesMin: 100, weeklyMinutesMax: 200,
    weights: { regularity: 90, diversity: 10, performance: 0, impact: 0 },
    promoteCoachId: "co_5", promoteCourseId: "cs_5", membersInClub: 412,
  },
  {
    id: "il_3", level: 3, name: "Engagé", emoji: "🔥", color: "#fb7185",
    motto: "Le mode de vie a basculé.",
    description: "Tu es chez toi ici. Spécialise-toi. Boxe, force, yoga avancé — choisis ta voie.",
    weeklyMinutesMin: 200, weeklyMinutesMax: 300,
    weights: { regularity: 80, diversity: 15, performance: 5, impact: 0 },
    promoteCoachId: "co_3", promoteCourseId: "cs_3", membersInClub: 286,
  },
  {
    id: "il_4", level: 4, name: "Compétiteur", emoji: "⚔️", color: "#a78bfa",
    motto: "L'effort devient performance.",
    description: "Tu vises l'excellence. Personal Training et programmes avancés t'attendent.",
    weeklyMinutesMin: 300, weeklyMinutesMax: 450,
    weights: { regularity: 70, diversity: 10, performance: 20, impact: 0 },
    promoteCoachId: "co_4", promoteCourseId: "cs_4", membersInClub: 142,
  },
  {
    id: "il_5", level: 5, name: "Élite", emoji: "👑", color: "#fcd34d",
    motto: "Tu es la légende.",
    description: "Top 5% du club. Ambassadeur, athlète de référence, mentor des autres ligues.",
    weeklyMinutesMin: 450,
    weights: { regularity: 60, diversity: 5, performance: 25, impact: 10 },
    promoteCoachId: "co_1", promoteCourseId: "cs_1", membersInClub: 52,
  },
];

export const MY_INTERNAL_LEAGUE: MyLeagueStanding = {
  currentLeagueId: "il_3",        // Engagé
  rank: 14,
  totalInLeague: 286,
  weekPoints: 412,
  daysInLeague: 87,
  progressToNextPct: 68,
  nextLeagueId: "il_4",
  pastLeagueIds: ["il_1", "il_2"],
  promotionPending: false,
};

export function findInternalLeague(id: string): InternalLeague | undefined {
  return INTERNAL_LEAGUES.find(l => l.id === id);
}

// Standings simulés pour chaque ligue
export function getInternalLeagueStandings(leagueId: string, limit = 10) {
  const seedNames = [
    ["Marc D.", "🇫🇷", "MD"], ["Sofia M.", "🇪🇸", "SM"], ["Karim B.", "🇲🇦", "KB"],
    ["Inès L.", "🇫🇷", "IL"], ["Liam S.", "🇬🇧", "LS"], ["Yuki T.", "🇯🇵", "YT"],
    ["Théo R.", "🇫🇷", "TR"], ["Chloé D.", "🇫🇷", "CD"], ["Adam B.", "🇫🇷", "AB"],
    ["Léa V.", "🇫🇷", "LV"], ["Hugo K.", "🇫🇷", "HK"], ["Camille N.", "🇫🇷", "CN"],
    ["Damien R. (toi)", "🇫🇷", "DR"], ["Jules P.", "🇫🇷", "JP"], ["Eva G.", "🇫🇷", "EG"],
  ];
  const league = findInternalLeague(leagueId);
  const baseMax = (league?.weeklyMinutesMax ?? 600);
  const baseMin = league?.weeklyMinutesMin ?? 0;
  return seedNames.slice(0, limit).map((s, i) => ({
    rank: i + 1,
    name: s[0],
    flag: s[1],
    avatar: s[2],
    weekPoints: Math.round(baseMax - (i * (baseMax - baseMin) / limit) * 0.9 + (i % 3) * 12),
    isMe: s[0].includes("toi"),
  }));
}

// ────────────────────────────────────────────────────────────
// PRICING — modèle d'auto-alignement avec la régularité
// ────────────────────────────────────────────────────────────

export const MEMBER_PRICING_TIERS: PricingTier[] = [
  { id: "p_m_0", audience: "member", label: "Streak 0-6 jours", baseEUR: 9.90, effectiveEUR: 9.90, trigger: "Démarrage", badge: "—" },
  { id: "p_m_1", audience: "member", label: "Streak 7-29 jours", baseEUR: 9.90, effectiveEUR: 7.90, trigger: "Habitude installée", badge: "-20%" },
  { id: "p_m_2", audience: "member", label: "Streak 30-89 jours", baseEUR: 9.90, effectiveEUR: 5.90, trigger: "Le mode de vie", badge: "-40%", highlight: true },
  { id: "p_m_3", audience: "member", label: "Streak 90-179 jours", baseEUR: 9.90, effectiveEUR: 3.90, trigger: "Iron Discipline", badge: "-60%" },
  { id: "p_m_4", audience: "member", label: "Streak 180+ jours", baseEUR: 9.90, effectiveEUR: 0, trigger: "Ambassadeur WARfit", badge: "GRATUIT" },
];

export const CLUB_PRICING_TIERS: PricingTier[] = [
  { id: "p_c_1", audience: "club", label: "Boutique (< 500 membres)", baseEUR: 149, effectiveEUR: 99, trigger: "Rétention 90j > 75% + gain défi mois", badge: "-50€" },
  { id: "p_c_2", audience: "club", label: "Standard (500-1500)",      baseEUR: 249, effectiveEUR: 169, trigger: "Rétention 90j > 75% + gain défi mois", badge: "-80€", highlight: true },
  { id: "p_c_3", audience: "club", label: "Premium (1500+)",          baseEUR: 399, effectiveEUR: 269, trigger: "Rétention 90j > 75% + gain défi mois", badge: "-130€" },
];

export const HQ_PRICING_TIERS: PricingTier[] = [
  { id: "p_hq_1", audience: "hq", label: "Boutique chain (< 50 clubs)", baseEUR: 2_490, effectiveEUR: 2_490, trigger: "Iron Republic, Phoenix", badge: "" },
  { id: "p_hq_2", audience: "hq", label: "National chain (50-300 clubs)", baseEUR: 9_900, effectiveEUR: 9_900, trigger: "On Air, Neoness, Iron Republic France", badge: "", highlight: true },
  { id: "p_hq_3", audience: "hq", label: "Mass chain (300+ clubs)", baseEUR: 24_900, effectiveEUR: 24_900, trigger: "Basic-Fit, Fitness Park, Keep Cool", badge: "" },
];

// Streak actuel + remise active
export const MY_PRICING = {
  currentStreak: 47,
  currentTier: MEMBER_PRICING_TIERS[2],   // 30-89 jours → 5,90 €
  basePrice: 9.90,
  effectivePrice: 5.90,
  savedThisYear: 48,                       // €
  daysToNextTier: 43,                       // 90 - 47
  nextTier: MEMBER_PRICING_TIERS[3],
};
