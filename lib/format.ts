export function compact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "k";
  return n.toString();
}

export function minutesToHm(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, "0")}`;
}

export function pct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function relativeDate(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const day = 86_400_000;
  if (diff < 0) {
    const future = -diff;
    if (future < day) return "aujourd'hui";
    const days = Math.round(future / day);
    return `dans ${days}j`;
  }
  if (diff < 60_000) return "à l'instant";
  if (diff < 3_600_000) return Math.floor(diff / 60_000) + "min";
  if (diff < day) return Math.floor(diff / 3_600_000) + "h";
  if (diff < 7 * day) return Math.floor(diff / day) + "j";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function tierLabel(tier: string): string {
  const map: Record<string, string> = {
    BRONZE: "Bronze",
    SILVER: "Argent",
    GOLD: "Or",
    PLATINUM: "Platine",
    DIAMOND: "Diamant",
    LEGEND: "Légende",
  };
  return map[tier] || tier;
}

export function tierColor(tier: string): string {
  const map: Record<string, string> = {
    BRONZE: "text-[#cd7f32]",
    SILVER: "text-zinc-300",
    GOLD: "text-gold",
    PLATINUM: "text-cyan",
    DIAMOND: "text-cyan",
    LEGEND: "text-flame",
  };
  return map[tier] || "text-muted";
}

export function tierBg(tier: string): string {
  const map: Record<string, string> = {
    BRONZE: "bg-[#cd7f32]/15 text-[#cd7f32] ring-[#cd7f32]/30",
    SILVER: "bg-zinc-400/15 text-zinc-200 ring-zinc-400/30",
    GOLD: "bg-gold/15 text-gold ring-gold/30",
    PLATINUM: "bg-cyan/15 text-cyan ring-cyan/30",
    DIAMOND: "bg-cyan/20 text-cyan ring-cyan/40",
    LEGEND: "bg-flame/15 text-flame ring-flame/40",
  };
  return map[tier] || "bg-muted/15 text-muted ring-muted/30";
}
