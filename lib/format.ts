export function fmtMoney(n: number | null | undefined, currency = "USD", maxDigits = 2): string {
  if (n === null || n === undefined || !isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000_000_000) return `${(n / 1e12).toFixed(2)}T $`;
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1e9).toFixed(2)}B $`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1e6).toFixed(2)}M $`;
  if (Math.abs(n) >= 1_000) return `${(n / 1e3).toFixed(2)}K $`;
  if (Math.abs(n) < 0.01 && n !== 0) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(n);
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDigits,
  }).format(n);
}

export function fmtNum(n: number | null | undefined, digits = 2): string {
  if (n === null || n === undefined || !isFinite(n)) return "—";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
}

export function fmtPct(n: number | null | undefined, digits = 2): string {
  if (n === null || n === undefined || !isFinite(n)) return "—";
  const s = n >= 0 ? "+" : "";
  return `${s}${n.toFixed(digits)}%`;
}

export function fmtCompact(n: number | null | undefined): string {
  if (n === null || n === undefined || !isFinite(n)) return "—";
  return new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 2 }).format(n);
}

export function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "2-digit" });
}
