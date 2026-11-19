import type { ExpiryInfo } from "./types";

const DAYS_PER_MONTH = 30;
const YELLOW_THRESHOLD_DAYS = 60;
const RED_THRESHOLD_DAYS = 14;
const MS_PER_DAY = 86_400_000;

/** Giorni trascorsi da una data YYYY-MM-DD (calendario locale). */
export function daysSince(isoDate: string, now: Date = new Date()): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  const opened = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - opened) / MS_PER_DAY);
}

export function getExpiryInfo(
  product: { openedOn: string; paoMonths: number },
  now: Date = new Date()
): ExpiryInfo {
  const totalDays = product.paoMonths * DAYS_PER_MONTH;
  const daysLeft = totalDays - daysSince(product.openedOn, now);
  const remainingPct = Math.max(
    0,
    Math.min(100, Math.round((daysLeft / totalDays) * 100))
  );

  if (daysLeft < 0) {
    return {
      level: "red",
      daysLeft,
      label: `Scaduto da ${Math.abs(daysLeft)} g`,
      remainingPct: 0,
    };
  }

  if (daysLeft <= RED_THRESHOLD_DAYS) {
    return {
      level: "red",
      daysLeft,
      label: daysLeft === 0 ? "Scade oggi" : `Scade tra ${daysLeft} g`,
      remainingPct,
    };
  }

  if (daysLeft <= YELLOW_THRESHOLD_DAYS) {
    return {
      level: "yellow",
      daysLeft,
      label: `Scade tra ${daysLeft} g`,
      remainingPct,
    };
  }

  const months = Math.floor(daysLeft / DAYS_PER_MONTH);
  return {
    level: "green",
    daysLeft,
    label: months >= 2 ? `Ancora ${months} mesi` : `Ancora ${daysLeft} g`,
    remainingPct,
  };
}
