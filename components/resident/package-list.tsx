import type { Package } from "@prisma/client";
import { PackageEmptyState } from "@/components/packages/package-empty-state";
import { PackageStatusBadge } from "@/components/packages/package-status-badge";
import { formatDateTime } from "@/components/resident/resident-format";

type PackageListProps = {
  packages: Package[];
  title?: string;
};

export function PackageList({ packages, title }: PackageListProps) {
  if (packages.length === 0) {
    return <PackageEmptyState message="Nenhuma encomenda encontrada nesta categoria." />;
  }

  return (
    <div className="space-y-4">
      {title ? <h3 className="text-lg font-semibold text-navy-950">{title}</h3> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {packages.map((item) => (
        <article key={item.id} className="surface-card surface-card-hover p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-navy-950">
                {item.description ?? "Encomenda sem descricao"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {item.carrier ?? "Transportadora nao informada"}
              </p>
            </div>
            <PackageStatusBadge status={item.status} />
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase text-slate-400">Codigo</dt>
              <dd className="mt-1 text-slate-600">{item.trackingCode ?? "Nao informado"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-400">Chegada</dt>
              <dd className="mt-1 text-slate-600">{formatDateTime(item.receivedAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-400">Retirada</dt>
              <dd className="mt-1 text-slate-600">{formatDateTime(item.deliveredAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-400">Quem retirou</dt>
              <dd className="mt-1 text-slate-600">{item.pickedUpByName ?? "Nao informado"}</dd>
            </div>
          </dl>
        </article>
      ))}
      </div>
    </div>
  );
}
