"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Flame, LayoutDashboard, Trophy, User, Building2, Users, BookOpen, Award, BarChart3, Bot, Heart } from "lucide-react";

const USER_LINKS = [
  { href: "/user", label: "Dashboard", icon: LayoutDashboard },
  { href: "/challenges", label: "Défis sponsos", icon: Heart },
  { href: "/user/leaderboard", label: "Classements", icon: Trophy },
  { href: "/user/sessions", label: "Mes séances", icon: Flame },
  { href: "/user/profile", label: "Profil", icon: User },
];

const CLUB_LINKS = [
  { href: "/club", label: "Dashboard", icon: LayoutDashboard },
  { href: "/challenges", label: "Défis sponsos", icon: Heart },
  { href: "/club/automations", label: "Autopilot", icon: Bot },
  { href: "/club/leagues", label: "Ligues", icon: Trophy },
  { href: "/club/members", label: "Membres", icon: Users },
  { href: "/club/courses", label: "Cours & Bonus", icon: BookOpen },
  { href: "/club/coaches", label: "Coachs", icon: Award },
  { href: "/club/analytics", label: "Analytics", icon: BarChart3 },
];

export function TopNav() {
  const pathname = usePathname() || "/";
  const isClub = pathname.startsWith("/club");
  const isUser = pathname.startsWith("/user");
  const links = isClub ? CLUB_LINKS : isUser ? USER_LINKS : [];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-thin">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/user" && href !== "/club" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition ${
                    active
                      ? "bg-war/15 text-war ring-1 ring-war/30"
                      : "text-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/user"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                isUser ? "bg-war text-white" : "bg-white/5 text-muted hover:text-white"
              }`}
            >
              <User size={14} /> Côté membre
            </Link>
            <Link
              href="/club"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                isClub ? "bg-war text-white" : "bg-white/5 text-muted hover:text-white"
              }`}
            >
              <Building2 size={14} /> Côté club
            </Link>
          </div>
        </div>

        {links.length > 0 && (
          <nav className="md:hidden flex items-center gap-1 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/user" && href !== "/club" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition ${
                    active
                      ? "bg-war/15 text-war ring-1 ring-war/30"
                      : "text-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
