import { RotateCcw } from "lucide-react";
import { Button } from "../client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { Label } from "../client/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../client/components/ui/select";
import { SUPPORTED_CURRENCIES } from "./schemas";
import {
  CRITERIA,
  DEFAULT_WEIGHTS,
  normalizeWeights,
  type Criterion,
  type ScoringWeights,
} from "./scoring";

const criterionLabels: Record<Criterion, { label: string; hint: string }> = {
  price: { label: "Price", hint: "Cheaper scores higher" },
  quality: { label: "Quality", hint: "Higher quality scores higher" },
  delivery: { label: "Delivery time", hint: "Faster scores higher" },
  risk: { label: "Risk", hint: "Lower risk scores higher" },
};

export function WeightsPanel({
  weights,
  onWeightsChange,
  currency,
  onCurrencyChange,
  isDirty,
  isSaving,
  onSave,
  onReset,
}: {
  weights: ScoringWeights;
  onWeightsChange: (weights: ScoringWeights) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}) {
  const normalized = normalizeWeights(weights);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Scoring weights</CardTitle>
        <CardDescription>
          Decide what matters most. The ranking updates as you adjust.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {CRITERIA.map((criterion) => {
          const id = `weight-${criterion}`;
          const { label, hint } = criterionLabels[criterion];
          return (
            <div key={criterion} className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor={id}>{label}</Label>
                <span className="text-foreground text-sm font-semibold tabular-nums">
                  {Math.round(normalized[criterion] * 100)}%
                </span>
              </div>
              <input
                id={id}
                type="range"
                min={0}
                max={100}
                step={5}
                value={weights[criterion]}
                onChange={(e) =>
                  onWeightsChange({ ...weights, [criterion]: Number(e.target.value) })
                }
                className="accent-brand h-1.5 w-full cursor-pointer"
              />
              <p className="text-muted-foreground text-xs">{hint}</p>
            </div>
          );
        })}

        <div className="border-border space-y-2 border-t pt-5">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onSave} disabled={!isDirty || isSaving} className="flex-1">
            {isSaving ? "Saving..." : "Save settings"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            title="Reset to default weights"
            aria-label="Reset to default weights"
            disabled={
              CRITERIA.every((c) => weights[c] === DEFAULT_WEIGHTS[c])
            }
          >
            <RotateCcw />
          </Button>
        </div>
        {isDirty && (
          <p className="text-muted-foreground -mt-3 text-xs">
            You have unsaved changes.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
