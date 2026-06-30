import type { PresenceStatus, UnitStatus, UserStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { formatPresenceStatus, formatUnitStatus } from "@/lib/units/format";

type StatusBadgeProps =
  | {
      status: UnitStatus | UserStatus;
      type: "unit" | "user";
    }
  | {
      status: PresenceStatus;
      type: "presence";
    };

export function StatusBadge(props: StatusBadgeProps) {
  const label =
    props.type === "presence"
      ? formatPresenceStatus(props.status)
      : formatUnitStatus(props.status);
  const isActive = props.status === "ACTIVE" || props.status === "HOME";
  const isWarning = props.status === "AWAY";

  return (
    <span
      className={cn(
        "inline-flex min-w-max items-center rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm",
        isActive && "border-emerald-200 bg-emerald-50 text-emerald-700",
        isWarning && "border-amber-200 bg-amber-50 text-amber-700",
        !isActive && !isWarning && "border-slate-200 bg-slate-100 text-slate-600",
      )}
    >
      {label}
    </span>
  );
}
