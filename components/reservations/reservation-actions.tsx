import { Check, X, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  approveSpaceReservationAction,
  cancelSpaceReservationByAdminAction,
  cancelSpaceReservationByResidentAction,
  rejectSpaceReservationAction,
} from "@/lib/reservations/actions";

type ReservationActionsProps = {
  id: string;
  mode: "admin" | "resident";
  status: string;
};

export function ReservationActions({ id, mode, status }: ReservationActionsProps) {
  if (mode === "resident") {
    if (status !== "PENDING") {
      return <span className="text-xs text-slate-400">Sem acao</span>;
    }

    return (
      <form action={cancelSpaceReservationByResidentAction}>
        <input type="hidden" name="id" value={id} />
        <Button type="submit" variant="outline" size="sm">
          <Ban className="h-4 w-4" />
          Cancelar
        </Button>
      </form>
    );
  }

  if (status === "CANCELED" || status === "REJECTED") {
    return <span className="text-xs text-slate-400">Concluida</span>;
  }

  return (
    <div className="flex min-w-64 flex-col gap-2">
      {status === "PENDING" ? (
        <div className="flex flex-wrap gap-2">
          <form action={approveSpaceReservationAction}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" size="sm">
              <Check className="h-4 w-4" />
              Aprovar
            </Button>
          </form>
          <form action={rejectSpaceReservationAction} className="flex flex-1 gap-2">
            <input type="hidden" name="id" value={id} />
            <Input name="rejectionReason" required placeholder="Motivo" className="min-w-32" />
            <Button type="submit" variant="outline" size="sm">
              <X className="h-4 w-4" />
              Recusar
            </Button>
          </form>
        </div>
      ) : null}
      {status !== "CANCELED" ? (
        <form action={cancelSpaceReservationByAdminAction}>
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="outline" size="sm">
            <Ban className="h-4 w-4" />
            Cancelar
          </Button>
        </form>
      ) : null}
    </div>
  );
}
