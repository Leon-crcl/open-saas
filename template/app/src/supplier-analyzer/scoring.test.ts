import { describe, expect, it } from "vitest";
import {
  calculateSupplierScores,
  DEFAULT_WEIGHTS,
  normalizeWeights,
  type ScorableSupplier,
} from "./scoring";

const supplier = (
  id: string,
  price: number,
  quality: number,
  deliveryDays: number,
  risk: number,
): ScorableSupplier => ({ id, price, quality, deliveryDays, risk });

describe("normalizeWeights", () => {
  it("scales weights so they sum to 1", () => {
    const w = normalizeWeights({ price: 50, quality: 50, delivery: 0, risk: 0 });
    expect(w).toEqual({ price: 0.5, quality: 0.5, delivery: 0, risk: 0 });
  });

  it("falls back to equal weights when all weights are zero", () => {
    const w = normalizeWeights({ price: 0, quality: 0, delivery: 0, risk: 0 });
    expect(w.price + w.quality + w.delivery + w.risk).toBeCloseTo(1);
    expect(w.price).toBe(0.25);
  });
});

describe("calculateSupplierScores", () => {
  it("returns an empty list for no suppliers", () => {
    expect(calculateSupplierScores([], DEFAULT_WEIGHTS)).toEqual([]);
  });

  it("scores price and delivery relative to the compared suppliers", () => {
    const [best, worst] = calculateSupplierScores(
      [supplier("slow", 20, 80, 30, 20), supplier("fast", 10, 80, 10, 20)],
      DEFAULT_WEIGHTS,
    );
    expect(best.id).toBe("fast");
    expect(best.scores.price).toBe(100);
    expect(best.scores.delivery).toBe(100);
    expect(worst.scores.price).toBe(0);
    expect(worst.scores.delivery).toBe(0);
  });

  it("uses quality as is and inverts risk", () => {
    const [result] = calculateSupplierScores(
      [supplier("a", 10, 85, 5, 30)],
      DEFAULT_WEIGHTS,
    );
    expect(result.scores.quality).toBe(85);
    expect(result.scores.risk).toBe(70);
  });

  it("gives 100 for price and delivery when all suppliers are equal (no division by zero)", () => {
    const results = calculateSupplierScores(
      [supplier("a", 10, 50, 7, 50), supplier("b", 10, 50, 7, 50)],
      DEFAULT_WEIGHTS,
    );
    for (const r of results) {
      expect(r.scores.price).toBe(100);
      expect(r.scores.delivery).toBe(100);
      expect(Number.isFinite(r.total)).toBe(true);
    }
  });

  it("computes the weighted total", () => {
    // price 100, quality 80, delivery 100, risk 90 with weights 35/30/20/15
    // = 35 + 24 + 20 + 13.5 = 92.5
    const [best] = calculateSupplierScores(
      [supplier("a", 5, 80, 2, 10), supplier("b", 9, 40, 9, 60)],
      DEFAULT_WEIGHTS,
    );
    expect(best.id).toBe("a");
    expect(best.total).toBe(92.5);
  });

  it("changes the ranking when the weights change", () => {
    const suppliers = [
      supplier("cheap", 1, 40, 10, 50),
      supplier("quality", 10, 95, 10, 10),
    ];
    const priceFirst = calculateSupplierScores(suppliers, {
      price: 100,
      quality: 0,
      delivery: 0,
      risk: 0,
    });
    const qualityFirst = calculateSupplierScores(suppliers, {
      price: 0,
      quality: 100,
      delivery: 0,
      risk: 0,
    });
    expect(priceFirst[0].id).toBe("cheap");
    expect(qualityFirst[0].id).toBe("quality");
  });

  it("assigns shared ranks to equal totals and keeps input order", () => {
    const results = calculateSupplierScores(
      [
        supplier("first", 10, 50, 7, 50),
        supplier("second", 10, 50, 7, 50),
        supplier("worse", 20, 10, 14, 90),
      ],
      DEFAULT_WEIGHTS,
    );
    expect(results.map((r) => r.id)).toEqual(["first", "second", "worse"]);
    expect(results.map((r) => r.rank)).toEqual([1, 1, 3]);
  });
});
