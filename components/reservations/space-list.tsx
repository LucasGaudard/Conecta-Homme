import type { LeisureSpace } from "@prisma/client";
import { Ban } from "lucide-react";
import { SectionCard } from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { inactivateLeisureSpaceAction } from "@/lib/reservations/actions";
import { ReservationStatusBadge } from "@/components/reservations/reservation-status-badge";
import { SpaceForm } from "@/components/reservations/space-form";

type SpaceWithCount = LeisureSpace & {
  _count?: { reservations: number };
};

type SpaceListProps = {
  spaces: SpaceWithCount[];
};

export function SpaceList({ spaces }: SpaceListProps) {
  if (spaces.length === 0) {
    return (
      <div className="surface-card p-8 text-center">
        <p className="text-sm font-medium text-navy-950">Nenhum espaco cadastrado.</p>
        <p className="mt-1 text-sm text-slate-500">
          Cadastre o primeiro espaco para liberar solicitacoes de reserva.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {spaces.map((space) => (
        <SectionCard key={space.id} title={space.name}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 text-sm text-slate-500">
              <p>{space.location ?? "Localizacao nao informada"}</p>
              <p>
                {space.capacity ? `${space.capacity} pessoa(s)` : "Capacidade nao informada"} ·{" "}
                {space._count?.reservations ?? 0} reserva(s)
              </p>
            </div>
            <ReservationStatusBadge status={space.status} type="space" />
          </div>
          <SpaceForm compact space={space} />
          {space.status === "ACTIVE" ? (
            <form action={inactivateLeisureSpaceAction.bind(null, space.id)} className="mt-3 flex justify-end">
              <Button type="submit" variant="outline" size="sm">
                <Ban className="h-4 w-4" />
                Inativar
              </Button>
            </form>
          ) : null}
        </SectionCard>
      ))}
    </div>
  );
}
