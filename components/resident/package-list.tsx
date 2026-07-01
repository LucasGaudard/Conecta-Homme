import type { Package } from "@prisma/client";
import { PackageEmptyState } from "@/components/packages/package-empty-state";
import { PackageStatusBadge } from "@/components/packages/package-status-badge";
import {
  clampPage,
  getSearchParam,
  normalizePage,
  normalizePageSize,
  normalizeSortDirection,
  pageCount,
  pageSlice,
  tableParamKeys,
  type SearchParamRecord,
} from "@/components/ui/data-table-params";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { SortableHeader } from "@/components/ui/sortable-header";
import { formatDateTime } from "@/components/resident/resident-format";

type PackageListProps = {
  packages: Package[];
  searchParams?: SearchParamRecord;
  tableKey?: string;
  title?: string;
};

function residentPackageSortValue(item: Package, sort: string) {
  if (sort === "carrier") return item.carrier ?? "";
  if (sort === "status") return item.status;
  if (sort === "trackingCode") return item.trackingCode ?? "";
  if (sort === "deliveredAt") return item.deliveredAt ?? new Date(0);
  return item.receivedAt;
}

export function PackageList({
  packages,
  searchParams,
  tableKey = "residentPackages",
  title,
}: PackageListProps) {
  if (packages.length === 0) {
    return <PackageEmptyState message="Nenhuma encomenda encontrada nesta categoria." />;
  }

  const keys = tableParamKeys(tableKey);
  const pageSize = normalizePageSize(getSearchParam(searchParams, keys.pageSize));
  const totalPages = pageCount(packages.length, pageSize);
  const page = clampPage(normalizePage(getSearchParam(searchParams, keys.page)), totalPages);
  const sort = getSearchParam(searchParams, keys.sort) ?? "receivedAt";
  const direction = normalizeSortDirection(getSearchParam(searchParams, keys.direction));
  const sortedPackages = [...packages].sort((a, b) => {
    const first = residentPackageSortValue(a, sort);
    const second = residentPackageSortValue(b, sort);
    const result =
      first instanceof Date && second instanceof Date
        ? first.getTime() - second.getTime()
        : String(first).localeCompare(String(second), "pt-BR", { numeric: true });
    return direction === "asc" ? result : -result;
  });
  const visiblePackages = pageSlice(sortedPackages, page, pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {title ? <h3 className="text-lg font-semibold text-navy-950">{title}</h3> : null}
        <p className="text-sm text-slate-500">{packages.length} registro(s)</p>
      </div>
      <div className="surface-card hidden p-3 md:block">
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>Ordenar:</span>
          <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="receivedAt" sortParam={keys.sort}>Chegada</SortableHeader>
          <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="carrier" sortParam={keys.sort}>Transportadora</SortableHeader>
          <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="status" sortParam={keys.sort}>Status</SortableHeader>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visiblePackages.map((item) => (
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
      <DataTablePagination page={page} pageParam={keys.page} pageSize={pageSize} pageSizeParam={keys.pageSize} searchParams={searchParams} totalItems={packages.length} totalPages={totalPages} />
    </div>
  );
}
