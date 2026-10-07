import { type Task } from "wasp/entities";

import {
  createTask,
  deleteTask,
  generateGptResponse,
  getAllTasksByUser,
  updateTask,
  useQuery,
} from "wasp/client/operations";
import { Link, routes } from "wasp/client/router";

import {
  ArrowRight,
  CalendarClock,
  ListTodo,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "../client/components/layout/EmptyState";
import { PageHeader } from "../client/components/layout/PageHeader";
import { Badge } from "../client/components/ui/badge";
import { Button } from "../client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { Checkbox } from "../client/components/ui/checkbox";
import { Input } from "../client/components/ui/input";
import { Skeleton } from "../client/components/ui/skeleton";
import { Label } from "../client/components/ui/label";
import { ToastAction } from "../client/components/ui/toast";
import { toast } from "../client/hooks/use-toast";
import { cn } from "../client/utils";
import type {
  GeneratedSchedule,
  Task as ScheduleTask,
  TaskItem,
  TaskPriority,
} from "./schedule";

export function DemoAppPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Scheduler"
        description="Add the tasks you want to get done today, tell us how many hours you have, and let AI turn them into a prioritized schedule."
      />
      <Planner handleCreateTask={createTask} />
    </div>
  );
}

function Planner({
  handleCreateTask,
}: {
  handleCreateTask: typeof createTask;
}) {
  const [description, setDescription] = useState<string>("");
  const [todaysHours, setTodaysHours] = useState<number>(8);
  const [response, setResponse] = useState<GeneratedSchedule | null>({
    tasks: [
      {
        name: "Respond to emails",
        priority: "high" as TaskPriority,
      },
      {
        name: "Learn WASP",
        priority: "low" as TaskPriority,
      },
      {
        name: "Read a book",
        priority: "medium" as TaskPriority,
      },
    ],
    taskItems: [
      {
        description: "Read introduction and chapter 1",
        time: 0.5,
        taskName: "Read a book",
      },
      {
        description: "Read chapter 2 and take notes",
        time: 0.3,
        taskName: "Read a book",
      },
      {
        description: "Read chapter 3 and summarize key points",
        time: 0.2,
        taskName: "Read a book",
      },
      {
        description: "Check and respond to important emails",
        time: 1,
        taskName: "Respond to emails",
      },
      {
        description: "Organize and prioritize remaining emails",
        time: 0.5,
        taskName: "Respond to emails",
      },
      {
        description: "Draft responses to urgent emails",
        time: 0.5,
        taskName: "Respond to emails",
      },
      {
        description: "Watch tutorial video on WASP",
        time: 0.5,
        taskName: "Learn WASP",
      },
      {
        description: "Complete online quiz on the basics of WASP",
        time: 1.5,
        taskName: "Learn WASP",
      },
      {
        description: "Review quiz answers and clarify doubts",
        time: 1,
        taskName: "Learn WASP",
      },
    ],
  });
  const [isPlanGenerating, setIsPlanGenerating] = useState<boolean>(false);

  const { data: tasks, isLoading: isTasksLoading } =
    useQuery(getAllTasksByUser);

  const handleSubmit = async () => {
    try {
      await handleCreateTask({ description });
      setDescription("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast({
        title: "Could not add task",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setIsPlanGenerating(true);
      const response = await generateGptResponse({
        hours: todaysHours,
      });
      if (response) {
        setResponse(response);
      }
    } catch (err) {
      const statusCode =
        err && typeof err === "object" && "statusCode" in err
          ? err.statusCode
          : undefined;
      if (statusCode === 402) {
        toast({
          title: "⚠️ You are out of credits!",
          style: {
            minWidth: "400px",
          },
          action: (
            <ToastAction
              altText="Go to pricing page to buy credits/subscription"
              asChild
            >
              <Link to={routes.PricingPageRoute.to}>
                Go to pricing page <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </ToastAction>
          ),
        });
      } else {
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setIsPlanGenerating(false);
    }
  };

  const hasTasks = !!tasks && tasks.length > 0;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Today's tasks</CardTitle>
          <p className="text-muted-foreground text-sm">
            Add a task and estimate how long it takes.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex gap-2">
            <Input
              type="text"
              id="description"
              className="flex-1"
              placeholder="e.g. Prepare the Q3 roadmap review"
              aria-label="Task description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!description}
            >
              Add task
            </Button>
          </div>

          {isTasksLoading ? (
            <div className="space-y-2" role="status" aria-label="Loading tasks">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : hasTasks ? (
            <ul className="space-y-2">
              {tasks.map((task: Task) => (
                <Todo
                  key={task.id}
                  id={task.id}
                  isDone={task.isDone}
                  description={task.description}
                  time={task.time}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={ListTodo}
              title="No tasks yet"
              description="Add your first task above to begin building today's plan."
            />
          )}

          <div className="border-border space-y-4 border-t pt-5">
            <div className="flex items-center justify-between gap-3">
              <Label
                htmlFor="time"
                className="text-muted-foreground text-sm font-medium"
              >
                Hours available today
              </Label>
              <Input
                type="number"
                id="time"
                step={0.5}
                min={1}
                max={24}
                className="w-24 text-center"
                value={todaysHours}
                onChange={(e) => setTodaysHours(+e.currentTarget.value)}
              />
            </div>
            <Button
              type="button"
              disabled={isPlanGenerating || tasks?.length === 0}
              onClick={() => handleGeneratePlan()}
              size="lg"
              className="w-full"
              data-testid="generate-schedule-button"
            >
              {isPlanGenerating ? (
                <>
                  <Loader2 className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles />
                  Generate schedule
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-base font-semibold">
            Today's schedule
          </h2>
          {response && (
            <Badge variant="outline">{response.tasks?.length ?? 0} tasks</Badge>
          )}
        </div>
        {isPlanGenerating ? (
          <div
            className="space-y-3"
            role="status"
            aria-label="Generating schedule"
          >
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : response ? (
          <Schedule schedule={response} />
        ) : (
          <EmptyState
            icon={CalendarClock}
            title="No schedule yet"
            description="Generate a schedule and it will appear here."
          />
        )}
      </div>
    </div>
  );
}

type TodoProps = Pick<Task, "id" | "isDone" | "description" | "time">;

function Todo({ id, isDone, description, time }: TodoProps) {
  const handleCheckboxChange = async (checked: boolean) => {
    await updateTask({
      id,
      isDone: checked,
    });
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateTask({
      id,
      time: e.currentTarget.value,
    });
  };

  const handleDeleteClick = async () => {
    await deleteTask({ id });
  };

  return (
    <li className="border-border bg-background hover:border-foreground/20 flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors">
      <Checkbox
        checked={isDone}
        onCheckedChange={handleCheckboxChange}
        aria-label={`Mark "${description}" as done`}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <span
        className={cn("text-foreground min-w-0 flex-1 truncate text-sm", {
          "text-muted-foreground line-through": isDone,
        })}
      >
        {description}
      </span>
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          min={0.5}
          step={0.5}
          aria-label="Hours"
          className={cn("h-8 w-16 px-2 text-center text-xs", {
            "pointer-events-none opacity-50": isDone,
          })}
          value={time}
          onChange={handleTimeChange}
        />
        <span className="text-muted-foreground text-xs">hrs</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteClick}
        title="Remove task"
        aria-label="Remove task"
        className="hover:text-destructive size-8"
      >
        <Trash2 />
      </Button>
    </li>
  );
}

function Schedule({ schedule }: { schedule: GeneratedSchedule }) {
  return (
    <div data-testid="schedule">
      <div className="space-y-3">
        {schedule.tasks ? (
          schedule.tasks
            .map((task) => (
              <TaskCard
                key={task.name}
                task={task}
                taskItems={schedule.taskItems}
              />
            ))
            .sort((a, b) => {
              const priorityOrder: TaskPriority[] = ["low", "medium", "high"];
              if (a.props.task.priority && b.props.task.priority) {
                return (
                  priorityOrder.indexOf(b.props.task.priority) -
                  priorityOrder.indexOf(a.props.task.priority)
                );
              } else {
                return 0;
              }
            })
        ) : (
          <div className="text-muted-foreground text-center">
            OpenAI didn't return any Tasks. Try again.
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  taskItems,
}: {
  task: ScheduleTask;
  taskItems: TaskItem[];
}) {
  const taskPriorityToBadgeVariant = {
    high: "destructive",
    medium: "warning",
    low: "success",
  } as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate">{task.name}</span>
          <Badge variant={taskPriorityToBadgeVariant[task.priority]}>
            {task.priority} priority
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {taskItems ? (
          <ul className="divide-border divide-y">
            {taskItems.map((taskItem) => {
              if (taskItem.taskName === task.name) {
                return (
                  <TaskCardItem key={taskItem.description} {...taskItem} />
                );
              }
              return null;
            })}
          </ul>
        ) : (
          <div className="text-muted-foreground text-center">
            OpenAI didn't return any Task Items. Try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TaskCardItem({ description, time }: TaskItem) {
  const [isDone, setIsDone] = useState<boolean>(false);

  const formattedTime = useMemo(() => {
    if (time === 0) return "0min";
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}hr`);
    if (minutes > 0) parts.push(`${minutes}min`);

    return parts.join(" ");
  }, [time]);

  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    setIsDone(checked === true);
  };

  return (
    <li className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex flex-1 items-center gap-3">
        <Checkbox
          checked={isDone}
          onCheckedChange={handleCheckedChange}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <span
          className={cn("text-sm leading-tight", {
            "text-muted-foreground line-through opacity-50": isDone,
          })}
        >
          {description}
        </span>
      </div>
      <span
        className={cn("text-muted-foreground text-xs tabular-nums", {
          "line-through opacity-50": isDone,
        })}
      >
        {formattedTime}
      </span>
    </li>
  );
}
