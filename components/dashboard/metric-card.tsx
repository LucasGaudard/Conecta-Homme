import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  description: string;
  icon: LucideIcon;
  tone?: "danger" | "info" | "success" | "warning";
  title: string;
  value: number | string;
};

const toneClasses = {
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-navy-100 bg-navy-50 text-navy-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

export function MetricCard({
  description,
  icon: Icon,
  title,
  tone = "info",
  value,
}: MetricCardProps) {
  return (
    <article className="surface-card surface-card-hover p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-navy-950">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border",
            toneClasses[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  );
}
