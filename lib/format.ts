export function fmtMoney(n: number | null | undefined, currency = "USD", maxDigits = 2): string {
  if (n === null || n === undefined || !isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000_000_000) return `${(n / 1e12).toFixed(2)}T $`;
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1e9).toFixed(2)}B $`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1e6).toFixed(2)}M $`;
  if (Math.abs(n) >= 1_000) return `${(n / 1e3).toFixed(2)}K $`;
  const safeMax = Math.max(0, Math.min(20, maxDigits));
  const safeMin = Math.min(safeMax, 2);
  try {
    if (Math.abs(n) < 0.01 && n !== 0) {
      const subMax = Math.max(2, Math.min(8, safeMax || 8));
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: subMax,
      }).format(n);
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: safeMin,
      maximumFractionDigits: safeMax,
    }).format(n);
  } catch {
    // Fallback if the currency code is invalid (e.g. Yahoo's "GBp").
    const formatted = new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: safeMax,
      minimumFractionDigits: safeMin,
    }).format(n);
    return `${formatted} ${currency}`;
  }
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
