import {
  CalendarClock,
  Check,
  FileText,
  Plus,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../client/utils";

/**
 * Lightweight, code-drawn previews of the product UI. They are decorative
 * (aria-hidden) and use the same design tokens as the real app, so they stay
 * in sync with the theme (including dark mode) without any image assets.
 */

export function WindowFrame({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "border-border bg-card overflow-hidden rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="border-border bg-muted/50 flex items-center gap-3 border-b px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="bg-border size-2.5 rounded-full" />
          <span className="bg-border size-2.5 rounded-full" />
          <span className="bg-border size-2.5 rounded-full" />
        </div>
        <div className="bg-background text-muted-foreground border-border mx-auto w-full max-w-[220px] truncate rounded-md border px-3 py-1 text-center text-[11px]">
          {title}
        </div>
        <div className="w-10" />
      </div>
      {children}
    </div>
  );
}

const priorityStyles = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-success/10 text-success",
} as const;

function PriorityPill({ level }: { level: keyof typeof priorityStyles }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
        priorityStyles[level],
      )}
    >
      {level}
    </span>
  );
}

const tasks = [
  { name: "Respond to customer emails", hours: "1.5 hrs", done: true },
  { name: "Prepare Q3 roadmap review", hours: "2 hrs", done: false },
  { name: "Write launch announcement", hours: "1 hr", done: false },
];

export function TaskListPreview({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2.5 p-4 sm:p-5", className)}>
      <div className="flex gap-2">
        <div className="border-input bg-background text-muted-foreground flex h-9 flex-1 items-center rounded-md border px-3 text-xs">
          Add a task for today…
        </div>
        <div className="bg-primary text-primary-foreground flex h-9 items-center gap-1 rounded-md px-3 text-xs font-medium">
          <Plus className="size-3.5" /> Add
        </div>
      </div>
      {tasks.map((task) => (
        <div
          key={task.name}
          className="border-border flex items-center gap-3 rounded-lg border px-3 py-2.5"
        >
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
              task.done
                ? "bg-primary border-primary text-primary-foreground"
                : "border-input",
            )}
          >
            {task.done && <Check className="size-3" />}
          </span>
          <span
            className={cn(
              "flex-1 truncate text-xs",
              task.done && "text-muted-foreground line-through",
            )}
          >
            {task.name}
          </span>
          <span className="text-muted-foreground border-input rounded-md border px-2 py-0.5 text-[11px] tabular-nums">
            {task.hours}
          </span>
        </div>
      ))}
      <div className="bg-primary text-primary-foreground flex h-9 items-center justify-center gap-2 rounded-md text-xs font-medium">
        <Sparkles className="size-3.5" /> Generate schedule
      </div>
    </div>
  );
}

const schedule = [
  {
    time: "09:00",
    title: "Respond to customer emails",
    priority: "high" as const,
    steps: [
      ["Triage the inbox", "30 min"],
      ["Reply to urgent threads", "1 hr"],
    ],
  },
  {
    time: "10:30",
    title: "Prepare Q3 roadmap review",
    priority: "medium" as const,
    steps: [
      ["Collect metrics from last quarter", "45 min"],
      ["Draft the narrative and slides", "1 hr 15 min"],
    ],
  },
  {
    time: "13:00",
    title: "Write launch announcement",
    priority: "low" as const,
    steps: [["First draft and review", "1 hr"]],
  },
];

export function SchedulePreview({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 sm:p-5", className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-foreground text-sm font-semibold">
          Today&apos;s schedule
        </p>
        <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
          <CalendarClock className="size-3.5" /> 8 hrs planned
        </span>
      </div>
      <div className="relative space-y-3">
        <div className="bg-border absolute bottom-2 left-[46px] top-2 w-px" />
        {schedule.map((block) => (
          <div key={block.title} className="relative flex gap-3">
            <span className="text-muted-foreground w-10 shrink-0 pt-3 text-[11px] tabular-nums">
              {block.time}
            </span>
            <span className="bg-background border-brand absolute left-[42px] top-[18px] size-2 rounded-full border-2" />
            <div className="border-border bg-background ml-3 flex-1 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-medium">{block.title}</p>
                <PriorityPill level={block.priority} />
              </div>
              <ul className="mt-2 space-y-1.5">
                {block.steps.map(([step, duration]) => (
                  <li
                    key={step}
                    className="text-muted-foreground flex items-center justify-between gap-2 text-[11px]"
                  >
                    <span className="truncate">{step}</span>
                    <span className="tabular-nums">{duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FilesPreview({ className }: { className?: string }) {
  const files = [
    ["Q3-roadmap.pdf", "2.4 MB"],
    ["brand-guidelines.pdf", "5.1 MB"],
    ["meeting-notes.txt", "12 KB"],
  ];
  return (
    <div className={cn("space-y-3 p-4 sm:p-5", className)}>
      <div className="border-input text-muted-foreground flex flex-col items-center gap-1.5 rounded-lg border border-dashed py-6 text-xs">
        <UploadCloud className="size-5" />
        <span>
          <span className="text-foreground font-medium">Click to upload</span>{" "}
          or drag and drop
        </span>
      </div>
      {files.map(([name, size]) => (
        <div
          key={name}
          className="border-border flex items-center gap-3 rounded-lg border px-3 py-2.5"
        >
          <span className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
            <FileText className="size-4" />
          </span>
          <span className="flex-1 truncate text-xs font-medium">{name}</span>
          <span className="text-muted-foreground text-[11px]">{size}</span>
        </div>
      ))}
    </div>
  );
}

export function UsagePreview({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-4 sm:p-5", className)}>
      <div className="border-border rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium">Pro plan</p>
          <span className="bg-success/10 text-success rounded-full px-2 py-0.5 text-[10px] font-medium">
            Active
          </span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight">
          $19.99
          <span className="text-muted-foreground text-xs font-normal">
            {" "}
            / month
          </span>
        </p>
      </div>
      <div className="border-border rounded-lg border p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Credits</span>
          <span className="text-muted-foreground tabular-nums">7 of 10</span>
        </div>
        <div className="bg-muted mt-3 h-1.5 overflow-hidden rounded-full">
          <div className="bg-brand h-full w-[70%] rounded-full" />
        </div>
      </div>
    </div>
  );
}
