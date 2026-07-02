import type { AccessLog, Unit, User, Visitor } from "@prisma/client";
import { EmptyState } from "@/components/dashboard/empty-state";
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
import {
  formatAccessMethod,
  formatAccessType,
  formatShortDateTime,
} from "@/components/porter/porter-format";

type RecentAccess = AccessLog & {
  porter: Pick<User, "name"> | null;
  unit: Pick<Unit, "apartment" | "block" | "responsibleName"> | null;
  user: Pick<User, "name"> | null;
  visitor: Pick<Visitor, "name"> | null;
};

type RecentAccessListProps = {
  accesses: RecentAccess[];
  searchParams?: SearchParamRecord;
  tableKey?: string;
};

function accessSortValue(access: RecentAccess, sort: string) {
  if (sort === "unit") {
    return access.unit ? `${access.unit.block}-${access.unit.apartment}` : "";
  }

  if (sort === "porter") return access.porter?.name ?? "";
  if (sort === "method") return access.accessMethod;
  if (sort === "type") return access.accessType;
  return access.occurredAt;
}

export function RecentAccessList({
  accesses,
  searchParams,
  tableKey = "recentAccess",
}: RecentAccessListProps) {
  if (accesses.length === 0) {
    return <EmptyState message="Nenhum acesso registrado ate o momento." />;
  }

  const keys = tableParamKeys(tableKey);
  const pageSize = normalizePageSize(getSearchParam(searchParams, keys.pageSize));
  const totalPages = pageCount(accesses.length, pageSize);
  const page = clampPage(normalizePage(getSearchParam(searchParams, keys.page)), totalPages);
  const sort = getSearchParam(searchParams, keys.sort) ?? "occurredAt";
  const direction = normalizeSortDirection(getSearchParam(searchParams, keys.direction));
  const sortedAccesses = [...accesses].sort((a, b) => {
    const first = accessSortValue(a, sort);
    const second = accessSortValue(b, sort);
    const result =
      first instanceof Date && second instanceof Date
        ? first.getTime() - second.getTime()
        : String(first).localeCompare(String(second), "pt-BR", { numeric: true });

    return direction === "asc" ? result : -result;
  });
  const visibleAccesses = pageSlice(sortedAccesses, page, pageSize);

  return (
    <div className="space-y-4">
    <div className="surface-card p-4">
      <p className="text-sm font-medium text-navy-950">
        {accesses.length} acesso(s)
      </p>
    </div>
    <div className="mobile-list">
      {visibleAccesses.map((access) => (
        <article key={access.id} className="mobile-card">
          <p className="text-base font-semibold text-navy-950">
            {access.unit
              ? `${access.unit.block}-${access.unit.apartment}`
              : "Nao vinculada"}
          </p>
          <dl className="mobile-field-grid">
            <div className="mobile-field">
              <dt className="mobile-field-label">Tipo</dt>
              <dd className="mobile-field-value">{formatAccessType(access.accessType)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Metodo</dt>
              <dd className="mobile-field-value">{formatAccessMethod(access.accessMethod)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Horario</dt>
              <dd className="mobile-field-value">{formatShortDateTime(access.occurredAt)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Porteiro</dt>
              <dd className="mobile-field-value">{access.porter?.name ?? "Nao informado"}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>

    <div className="table-shell hidden md:block">
      <table className="data-table min-w-[760px]">
        <thead>
          <tr>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="unit" sortParam={keys.sort}>Unidade</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="type" sortParam={keys.sort}>Tipo</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="method" sortParam={keys.sort}>Metodo</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="occurredAt" sortParam={keys.sort}>Horario</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="porter" sortParam={keys.sort}>Porteiro</SortableHeader></th>
          </tr>
        </thead>
        <tbody>
          {visibleAccesses.map((access) => (
            <tr key={access.id}>
              <td className="font-medium text-navy-950">
                {access.unit
                  ? `${access.unit.block}-${access.unit.apartment}`
                  : "Nao vinculada"}
              </td>
              <td>{formatAccessType(access.accessType)}</td>
              <td>{formatAccessMethod(access.accessMethod)}</td>
              <td>{formatShortDateTime(access.occurredAt)}</td>
              <td>{access.porter?.name ?? "Nao informado"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <DataTablePagination page={page} pageParam={keys.page} pageSize={pageSize} pageSizeParam={keys.pageSize} searchParams={searchParams} totalItems={accesses.length} totalPages={totalPages} />
    </div>
  );
}
