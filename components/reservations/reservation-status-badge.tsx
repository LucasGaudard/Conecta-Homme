import type { LeisureSpaceStatus, SpaceReservationStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { formatReservationStatus, formatSpaceStatus } from "@/lib/reservations/format";

type StatusBadgeProps = {
  status: LeisureSpaceStatus | SpaceReservationStatus;
  type: "reservation" | "space";
};

export function ReservationStatusBadge({ status, type }: StatusBadgeProps) {
  const label =
    type === "space"
      ? formatSpaceStatus(status as LeisureSpaceStatus)
      : formatReservationStatus(status as SpaceReservationStatus);
  const tone =
    status === "ACTIVE" || status === "APPROVED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "PENDING"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : status === "REJECTED" || status === "INACTIVE"
          ? "border-slate-200 bg-slate-100 text-slate-600"
          : "border-red-200 bg-red-50 text-red-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone,
      )}
    >
      {label}
    </span>
  );
}
