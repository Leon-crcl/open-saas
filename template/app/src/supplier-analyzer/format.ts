export function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDays(days: number): string {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export type ScoreTone = "success" | "warning" | "destructive";

/** Maps a 0-100 score to a semantic color tone. */
export function getScoreTone(score: number): ScoreTone {
  if (score >= 70) return "success";
  if (score >= 40) return "warning";
  return "destructive";
}
