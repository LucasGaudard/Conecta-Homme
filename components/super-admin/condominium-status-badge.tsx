import type { CondominiumStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { formatCondominiumStatus } from "@/lib/super-admin/format";

type CondominiumStatusBadgeProps = {
  status: CondominiumStatus;
};

const statusClasses: Record<CondominiumStatus, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  INACTIVE: "border-slate-200 bg-slate-100 text-slate-600",
  SUSPENDED: "border-amber-200 bg-amber-50 text-amber-700",
};

export function CondominiumStatusBadge({ status }: CondominiumStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        statusClasses[status],
      )}
    >
      {formatCondominiumStatus(status)}
    </span>
  );
}
