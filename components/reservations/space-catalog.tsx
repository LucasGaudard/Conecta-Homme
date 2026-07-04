import type { LeisureSpace } from "@prisma/client";
import { Users } from "lucide-react";

type SpaceCatalogProps = {
  spaces: LeisureSpace[];
};

export function SpaceCatalog({ spaces }: SpaceCatalogProps) {
  if (spaces.length === 0) {
    return (
      <div className="surface-card p-6 text-sm text-slate-500">
        Nenhum espaco ativo esta disponivel para reserva no momento.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {spaces.map((space) => (
        <article key={space.id} className="surface-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-navy-950">{space.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{space.location ?? "Localizacao nao informada"}</p>
            </div>
            {space.capacity ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                <Users className="h-3.5 w-3.5" />
                {space.capacity}
              </span>
            ) : null}
          </div>
          {space.description ? (
            <p className="mt-4 text-sm leading-6 text-slate-600">{space.description}</p>
          ) : null}
          {space.rules ? (
            <p className="mt-3 text-xs leading-5 text-slate-500">{space.rules}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
