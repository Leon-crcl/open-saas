import type { Supplier } from "wasp/entities";
import type { SupplierScore } from "./scoring";

/** A supplier together with its calculated score and rank. */
export type ScoredSupplier = Supplier & Pick<SupplierScore, "total" | "scores" | "rank">;
