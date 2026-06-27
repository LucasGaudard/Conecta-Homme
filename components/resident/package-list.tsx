import type { Package } from "@prisma/client";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatDateTime, formatPackageStatus } from "@/components/resident/resident-format";

type PackageListProps = {
  packages: Package[];
};

export function PackageList({ packages }: PackageListProps) {
  if (packages.length === 0) {
    return <EmptyState message="Nenhuma encomenda registrada para sua unidade." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {packages.map((item) => (
        <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-navy-950">
                {item.description ?? "Encomenda sem descricao"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {item.carrier ?? "Transportadora nao informada"}
              </p>
            </div>
            <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-navy-900">
              {formatPackageStatus(item.status)}
            </span>
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
          </dl>
        </article>
      ))}
    </div>
  );
}
