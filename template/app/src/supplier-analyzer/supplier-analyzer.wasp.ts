import { action, page, query, route, type Spec } from "@wasp.sh/spec";

import { SupplierAnalyzerPage } from "./SupplierAnalyzerPage" with { type: "ref" };
import {
  createSupplier,
  deleteSupplier,
  getSupplierWorkspace,
  saveSupplierSettings,
  updateSupplier,
} from "./operations" with { type: "ref" };

export const supplierAnalyzerSpec: Spec = [
  route(
    "SupplierAnalyzerRoute",
    "/supplier-analyzer",
    page(SupplierAnalyzerPage, { authRequired: true }),
  ),

  query(getSupplierWorkspace, {
    entities: ["User", "Supplier", "SupplierSettings"],
  }),
  action(createSupplier, { entities: ["User", "Supplier"] }),
  action(updateSupplier, { entities: ["User", "Supplier"] }),
  action(deleteSupplier, { entities: ["User", "Supplier"] }),
  action(saveSupplierSettings, { entities: ["User", "SupplierSettings"] }),
];
