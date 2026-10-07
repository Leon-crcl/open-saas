/**
 * Pure supplier scoring logic. It has no database or framework dependencies,
 * so the server and the client share the exact same implementation (the page
 * re-scores live while the user drags a weight slider).
 *
 * Every criterion is converted to a 0-100 score where higher is always better:
 * - quality: used as is (already 0-100, higher is better)
 * - risk: inverted, `100 - risk` (already 0-100, lower is better)
 * - price and delivery time: have no natural scale, so they are scored
 *   relative to the compared suppliers (cheapest / fastest = 100, most
 *   expensive / slowest = 0). If all suppliers are equal, all get 100.
 *
 * The total score is the weighted average of the four criterion scores.
 */

export interface ScoringWeights {
  price: number;
  quality: number;
  delivery: number;
  risk: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  price: 35,
  quality: 30,
  delivery: 20,
  risk: 15,
};

export const CRITERIA = ["price", "quality", "delivery", "risk"] as const;
export type Criterion = (typeof CRITERIA)[number];

export interface ScorableSupplier {
  id: string;
  price: number;
  quality: number;
  deliveryDays: number;
  risk: number;
}

export type CriterionScores = Record<Criterion, number>;

export interface SupplierScore {
  id: string;
  /** Weighted total, 0-100, rounded to one decimal. */
  total: number;
  /** Per-criterion score, 0-100, higher is better. */
  scores: CriterionScores;
  /** Rank by total score, 1 = best. Suppliers with equal totals share a rank. */
  rank: number;
}

/** Scales weights so they sum to 1. All-zero weights fall back to equal weights. */
export function normalizeWeights(weights: ScoringWeights): ScoringWeights {
  const sum = weights.price + weights.quality + weights.delivery + weights.risk;
  if (sum <= 0) {
    return { price: 0.25, quality: 0.25, delivery: 0.25, risk: 0.25 };
  }
  return {
    price: weights.price / sum,
    quality: weights.quality / sum,
    delivery: weights.delivery / sum,
    risk: weights.risk / sum,
  };
}

/** Lower is better: min -> 100, max -> 0. Equal values all get 100. */
function scoreLowerIsBetter(value: number, min: number, max: number): number {
  if (max === min) return 100;
  return ((max - value) / (max - min)) * 100;
}

const roundTo1 = (value: number) => Math.round(value * 10) / 10;

/**
 * Scores the given suppliers. The result is sorted by total score (best
 * first); ties keep the input order.
 */
export function calculateSupplierScores(
  suppliers: ScorableSupplier[],
  weights: ScoringWeights,
): SupplierScore[] {
  if (suppliers.length === 0) return [];

  const prices = suppliers.map((s) => s.price);
  const days = suppliers.map((s) => s.deliveryDays);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDays = Math.min(...days);
  const maxDays = Math.max(...days);
  const w = normalizeWeights(weights);

  const scored = suppliers.map((supplier) => {
    const scores: CriterionScores = {
      price: scoreLowerIsBetter(supplier.price, minPrice, maxPrice),
      quality: supplier.quality,
      delivery: scoreLowerIsBetter(supplier.deliveryDays, minDays, maxDays),
      risk: 100 - supplier.risk,
    };
    const total =
      scores.price * w.price +
      scores.quality * w.quality +
      scores.delivery * w.delivery +
      scores.risk * w.risk;
    return {
      id: supplier.id,
      total: roundTo1(total),
      scores: {
        price: roundTo1(scores.price),
        quality: roundTo1(scores.quality),
        delivery: roundTo1(scores.delivery),
        risk: roundTo1(scores.risk),
      },
    };
  });

  // Array.prototype.sort is stable, so ties keep the input order.
  scored.sort((a, b) => b.total - a.total);

  let currentRank = 0;
  return scored.map((entry, index) => {
    if (index === 0 || entry.total !== scored[index - 1].total) {
      currentRank = index + 1;
    }
    return { ...entry, rank: currentRank };
  });
}
