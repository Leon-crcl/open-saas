import { cn } from "../client/utils";
import { getScoreTone, type ScoreTone } from "./format";

const toneClasses: Record<ScoreTone, { bar: string; text: string }> = {
  success: { bar: "bg-success", text: "text-success" },
  warning: { bar: "bg-warning", text: "text-warning" },
  destructive: { bar: "bg-destructive", text: "text-destructive" },
};

export function ScoreBar({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const tone = toneClasses[getScoreTone(score)];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-label="Score"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-300", tone.bar)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={cn(
          "w-10 text-right text-sm font-semibold tabular-nums",
          tone.text,
        )}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
}
