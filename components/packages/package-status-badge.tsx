import type { PackageStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { formatPackageStatus } from "@/lib/packages/format";

type PackageStatusBadgeProps = {
  status: PackageStatus;
};

export function PackageStatusBadge({ status }: PackageStatusBadgeProps) {
  const waiting = status === "WAITING_PICKUP";

  return (
    <span
      className={cn(
        "inline-flex min-w-max rounded-full px-2.5 py-1 text-xs font-medium",
        waiting ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700",
      )}
    >
      {formatPackageStatus(status)}
    </span>
  );
}
