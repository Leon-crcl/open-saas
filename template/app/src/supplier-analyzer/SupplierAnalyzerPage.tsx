import { Plus, Truck } from "lucide-react";
import type { Supplier } from "wasp/entities";
import { useEffect, useMemo, useState } from "react";
import {
  deleteSupplier,
  getSupplierWorkspace,
  saveSupplierSettings,
  useQuery,
} from "wasp/client/operations";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { EmptyState } from "../client/components/layout/EmptyState";
import { PageHeader } from "../client/components/layout/PageHeader";
import { Alert, AlertDescription } from "../client/components/ui/alert";
import { Button } from "../client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../client/components/ui/dialog";
import { Skeleton } from "../client/components/ui/skeleton";
import { toast } from "../client/hooks/use-toast";
import { ComparisonPanel, MAX_COMPARED_SUPPLIERS } from "./ComparisonPanel";
import { RankingList } from "./RankingList";
import { supplierSettingsInputSchema } from "./schemas";
import {
  calculateSupplierScores,
  DEFAULT_WEIGHTS,
  type ScoringWeights,
} from "./scoring";
import { SummaryCards } from "./SummaryCards";
import { SupplierFormDialog } from "./SupplierFormDialog";
import type { ScoredSupplier } from "./types";
import { WeightsPanel } from "./WeightsPanel";

export function SupplierAnalyzerPage() {
  const { data: workspace, isLoading, error } = useQuery(getSupplierWorkspace);

  // Weights and currency are edited as a draft: the ranking updates live while
  // the user adjusts them, and they are only persisted on "Save settings".
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);
  const [currency, setCurrency] = useState("EUR");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<ScoredSupplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<ScoredSupplier | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const saved = workspace?.settings;
  useEffect(() => {
    if (!saved) return;
    setWeights({
      price: saved.weightPrice,
      quality: saved.weightQuality,
      delivery: saved.weightDelivery,
      risk: saved.weightRisk,
    });
    setCurrency(saved.currency);
  }, [
    saved?.weightPrice,
    saved?.weightQuality,
    saved?.weightDelivery,
    saved?.weightRisk,
    saved?.currency,
  ]);

  const isSettingsDirty =
    !!saved &&
    (saved.weightPrice !== weights.price ||
      saved.weightQuality !== weights.quality ||
      saved.weightDelivery !== weights.delivery ||
      saved.weightRisk !== weights.risk ||
      saved.currency !== currency);

  const rankedSuppliers: ScoredSupplier[] = useMemo(() => {
    if (!workspace) return [];
    const scores = calculateSupplierScores(
      workspace.suppliers.map((s: Supplier) => ({
        id: s.id,
        price: s.price,
        quality: s.quality,
        deliveryDays: s.deliveryDays,
        risk: s.risk,
      })),
      weights,
    );
    const byId = new Map<string, Supplier>(
      workspace.suppliers.map((s: Supplier) => [s.id, s]),
    );
    return scores.map((score) => ({ ...byId.get(score.id)!, ...score }));
  }, [workspace, weights]);

  // Without an explicit selection, the top three suppliers are compared.
  const comparedSuppliers = useMemo(() => {
    const selected = rankedSuppliers.filter((s) => selectedIds.has(s.id));
    return selected.length >= 2 ? selected : rankedSuppliers.slice(0, 3);
  }, [rankedSuppliers, selectedIds]);

  const supplierCount = workspace?.suppliers.length ?? 0;
  const supplierLimit = workspace?.supplierLimit ?? 0;
  const isAtLimit = !!workspace && supplierCount >= supplierLimit;

  function openCreateDialog() {
    setEditingSupplier(null);
    setIsFormOpen(true);
  }

  function openEditDialog(supplier: ScoredSupplier) {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size >= MAX_COMPARED_SUPPLIERS) {
        toast({
          title: `You can compare up to ${MAX_COMPARED_SUPPLIERS} suppliers`,
        });
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSaveSettings() {
    const parsed = supplierSettingsInputSchema.safeParse({
      currency,
      weightPrice: weights.price,
      weightQuality: weights.quality,
      weightDelivery: weights.delivery,
      weightRisk: weights.risk,
    });
    if (!parsed.success) {
      toast({ title: "Invalid settings", variant: "destructive" });
      return;
    }
    setIsSavingSettings(true);
    try {
      await saveSupplierSettings(parsed.data);
      toast({ title: "Settings saved" });
    } catch (err) {
      toast({
        title: "Could not save settings",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSavingSettings(false);
    }
  }

  async function handleConfirmDelete() {
    if (!supplierToDelete) return;
    try {
      await deleteSupplier({ id: supplierToDelete.id });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(supplierToDelete.id);
        return next;
      });
      toast({ title: "Supplier deleted" });
    } catch (err) {
      toast({
        title: "Could not delete supplier",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSupplierToDelete(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Supplier Analyzer"
        description={
          workspace
            ? `Compare suppliers on price, quality, delivery time and risk. ${supplierCount} of ${supplierLimit} suppliers used.`
            : "Compare suppliers on price, quality, delivery time and risk."
        }
        actions={
          <Button onClick={openCreateDialog} disabled={!workspace || isAtLimit}>
            <Plus /> Add supplier
          </Button>
        }
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Could not load your suppliers: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {isAtLimit && (
        <Alert variant="warning">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>
              You have reached the limit of {supplierLimit} suppliers on your
              current plan.
            </span>
            <Button asChild size="sm" variant="outline">
              <WaspRouterLink to={routes.PricingPageRoute.to}>
                Upgrade plan
              </WaspRouterLink>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <LoadingState />
      ) : workspace && rankedSuppliers.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No suppliers yet"
          description="Add your first supplier with its price, quality, delivery time and risk. Add a second one to start comparing."
          action={
            <Button onClick={openCreateDialog}>
              <Plus /> Add supplier
            </Button>
          }
        />
      ) : workspace ? (
        <>
          <SummaryCards suppliers={rankedSuppliers} currency={currency} />
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
            <RankingList
              suppliers={rankedSuppliers}
              currency={currency}
              selectedIds={selectedIds}
              onToggleSelected={toggleSelected}
              onEdit={openEditDialog}
              onDelete={setSupplierToDelete}
            />
            <WeightsPanel
              weights={weights}
              onWeightsChange={setWeights}
              currency={currency}
              onCurrencyChange={setCurrency}
              isDirty={isSettingsDirty}
              isSaving={isSavingSettings}
              onSave={handleSaveSettings}
              onReset={() => setWeights(DEFAULT_WEIGHTS)}
            />
          </div>
          <ComparisonPanel suppliers={comparedSuppliers} currency={currency} />
        </>
      ) : null}

      <SupplierFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        supplier={editingSupplier}
        currency={currency}
      />

      <Dialog
        open={!!supplierToDelete}
        onOpenChange={(open) => !open && setSupplierToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete supplier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{supplierToDelete?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupplierToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading suppliers">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
