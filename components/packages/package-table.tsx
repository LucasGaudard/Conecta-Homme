import type { Package, Unit, User } from "@prisma/client";
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
import { PackageDeliveryForm } from "@/components/packages/package-delivery-form";
import { PackageEmptyState } from "@/components/packages/package-empty-state";
import { PackageStatusBadge } from "@/components/packages/package-status-badge";
import { formatPackageDate } from "@/lib/packages/format";

type PackageRow = Package & {
  deliveredBy?: Pick<User, "name"> | null;
  receivedBy?: Pick<User, "name"> | null;
  unit?: Pick<Unit, "apartment" | "block" | "responsibleName">;
};

type PackageTableProps = {
  mode: "admin" | "porter";
  packages: PackageRow[];
  searchParams?: SearchParamRecord;
  tableKey?: string;
};

type PackageSortKey = "carrier" | "receivedAt" | "responsibleName" | "status" | "unit";

function packageSortValue(item: PackageRow, sort: string) {
  const key = sort as PackageSortKey;

  if (key === "carrier") return item.carrier ?? "";
  if (key === "responsibleName") return item.unit?.responsibleName ?? "";
  if (key === "status") return item.status;
  if (key === "unit") return item.unit ? `${item.unit.block}-${item.unit.apartment}` : "";
  return item.receivedAt;
}

function sortPackages(items: PackageRow[], sort: string, direction: "asc" | "desc") {
  return [...items].sort((a, b) => {
    const first = packageSortValue(a, sort);
    const second = packageSortValue(b, sort);
    const result =
      first instanceof Date && second instanceof Date
        ? first.getTime() - second.getTime()
        : String(first).localeCompare(String(second), "pt-BR", { numeric: true });

    return direction === "asc" ? result : -result;
  });
}

export function PackageTable({
  mode,
  packages,
  searchParams,
  tableKey = "packages",
}: PackageTableProps) {
  if (packages.length === 0) {
    return <PackageEmptyState message="Nenhuma encomenda encontrada." />;
  }

  const keys = tableParamKeys(tableKey);
  const pageSize = normalizePageSize(getSearchParam(searchParams, keys.pageSize));
  const totalPages = pageCount(packages.length, pageSize);
  const page = clampPage(normalizePage(getSearchParam(searchParams, keys.page)), totalPages);
  const sort = getSearchParam(searchParams, keys.sort) ?? "receivedAt";
  const direction = normalizeSortDirection(getSearchParam(searchParams, keys.direction));
  const sortedPackages = sortPackages(packages, sort, direction);
  const visiblePackages = pageSlice(sortedPackages, page, pageSize);

  return (
    <div className="space-y-4">
    <div className="surface-card flex flex-col gap-1 p-4">
      <p className="text-sm font-medium text-navy-950">
        {packages.length} encomenda(s)
      </p>
      <p className="text-xs text-slate-500">
        Ordenado por {sort === "receivedAt" ? "data de chegada" : sort}.
      </p>
    </div>
    <div className="mobile-list">
      {visiblePackages.map((item) => (
        <article key={item.id} className="mobile-card">
          <div className="mobile-card-header">
            <div className="min-w-0">
              <p className="text-base font-semibold text-navy-950">
                {item.unit ? `${item.unit.block}-${item.unit.apartment}` : "Nao informada"}
              </p>
              <p className="mt-1 break-words text-sm text-slate-500">
                {item.unit?.responsibleName ?? "Nao informado"}
              </p>
            </div>
            <PackageStatusBadge status={item.status} />
          </div>
          <dl className="mobile-field-grid">
            <div className="mobile-field">
              <dt className="mobile-field-label">Transportadora</dt>
              <dd className="mobile-field-value">{item.carrier ?? "Nao informado"}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Codigo</dt>
              <dd className="mobile-field-value">{item.trackingCode ?? "Nao informado"}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Chegada</dt>
              <dd className="mobile-field-value">{formatPackageDate(item.receivedAt)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Entrega</dt>
              <dd className="mobile-field-value">{formatPackageDate(item.deliveredAt)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Recebido por</dt>
              <dd className="mobile-field-value">{item.receivedBy?.name ?? "Nao informado"}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Entregue por</dt>
              <dd className="mobile-field-value">{item.deliveredBy?.name ?? "Nao informado"}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Retirado por</dt>
              <dd className="mobile-field-value">{item.pickedUpByName ?? "Nao informado"}</dd>
            </div>
          </dl>
          {mode === "porter" ? (
            <div className="mt-4">
              {item.status === "WAITING_PICKUP" ? (
                <PackageDeliveryForm packageId={item.id} />
              ) : (
                <span className="text-sm text-slate-400">Entregue</span>
              )}
            </div>
          ) : null}
        </article>
      ))}
    </div>

    <div className="table-shell hidden md:block">
      <table className="data-table min-w-[1120px]">
        <thead>
          <tr>
            <th className="px-4 py-3 font-medium">
              <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="unit" sortParam={keys.sort}>
                Unidade
              </SortableHeader>
            </th>
            <th className="px-4 py-3 font-medium">
              <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="responsibleName" sortParam={keys.sort}>
                Responsavel
              </SortableHeader>
            </th>
            <th className="px-4 py-3 font-medium">
              <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="carrier" sortParam={keys.sort}>
                Transportadora
              </SortableHeader>
            </th>
            <th className="px-4 py-3 font-medium">Codigo</th>
            <th className="px-4 py-3 font-medium">
              <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="status" sortParam={keys.sort}>
                Status
              </SortableHeader>
            </th>
            <th className="px-4 py-3 font-medium">
              <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="receivedAt" sortParam={keys.sort}>
                Chegada
              </SortableHeader>
            </th>
            <th className="px-4 py-3 font-medium">Entrega</th>
            <th className="px-4 py-3 font-medium">Recebido por</th>
            <th className="px-4 py-3 font-medium">Entregue por</th>
            <th className="px-4 py-3 font-medium">Retirado por</th>
            {mode === "porter" ? <th className="px-4 py-3 font-medium">Acao</th> : null}
          </tr>
        </thead>
        <tbody>
          {visiblePackages.map((item) => (
            <tr key={item.id}>
              <td className="font-medium text-navy-950">
                {item.unit ? `${item.unit.block}-${item.unit.apartment}` : "Nao informada"}
              </td>
              <td>{item.unit?.responsibleName ?? "Nao informado"}</td>
              <td>{item.carrier ?? "Nao informado"}</td>
              <td>{item.trackingCode ?? "Nao informado"}</td>
              <td><PackageStatusBadge status={item.status} /></td>
              <td>{formatPackageDate(item.receivedAt)}</td>
              <td>{formatPackageDate(item.deliveredAt)}</td>
              <td>{item.receivedBy?.name ?? "Nao informado"}</td>
              <td>{item.deliveredBy?.name ?? "Nao informado"}</td>
              <td>{item.pickedUpByName ?? "Nao informado"}</td>
              {mode === "porter" ? (
                <td>
                  {item.status === "WAITING_PICKUP" ? (
                    <PackageDeliveryForm packageId={item.id} />
                  ) : (
                    <span className="text-xs text-slate-400">Entregue</span>
                  )}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <DataTablePagination
      page={page}
      pageParam={keys.page}
      pageSize={pageSize}
      pageSizeParam={keys.pageSize}
      searchParams={searchParams}
      totalItems={packages.length}
      totalPages={totalPages}
    />
    </div>
  );
}
