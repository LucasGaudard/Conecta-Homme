import type { AccessLog, User, Visitor } from "@prisma/client";
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
  formatDateTime,
} from "@/components/resident/resident-format";

type AccessHistoryItem = AccessLog & {
  porter: Pick<User, "name"> | null;
  visitor: Pick<Visitor, "name"> | null;
};

type AccessHistoryProps = {
  accesses: AccessHistoryItem[];
  searchParams?: SearchParamRecord;
};

function historySortValue(access: AccessHistoryItem, sort: string) {
  if (sort === "method") return access.accessMethod;
  if (sort === "porter") return access.porter?.name ?? "";
  if (sort === "type") return access.accessType;
  return access.occurredAt;
}

export function AccessHistory({ accesses, searchParams }: AccessHistoryProps) {
  if (accesses.length === 0) {
    return <EmptyState message="Nenhum acesso registrado para sua unidade." />;
  }

  const keys = tableParamKeys("accessHistory");
  const pageSize = normalizePageSize(getSearchParam(searchParams, keys.pageSize));
  const totalPages = pageCount(accesses.length, pageSize);
  const page = clampPage(normalizePage(getSearchParam(searchParams, keys.page)), totalPages);
  const sort = getSearchParam(searchParams, keys.sort) ?? "occurredAt";
  const direction = normalizeSortDirection(getSearchParam(searchParams, keys.direction));
  const sortedAccesses = [...accesses].sort((a, b) => {
    const first = historySortValue(a, sort);
    const second = historySortValue(b, sort);
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
        {accesses.length} acesso(s) encontrados
      </p>
    </div>
    <div className="mobile-list">
      {visibleAccesses.map((access) => (
        <article key={access.id} className="mobile-card">
          <p className="text-base font-semibold text-navy-950">
            {formatAccessType(access.accessType)}
          </p>
          <dl className="mobile-field-grid">
            <div className="mobile-field">
              <dt className="mobile-field-label">Horario</dt>
              <dd className="mobile-field-value">{formatDateTime(access.occurredAt)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Metodo</dt>
              <dd className="mobile-field-value">{formatAccessMethod(access.accessMethod)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Porteiro</dt>
              <dd className="mobile-field-value">{access.porter?.name ?? "Nao informado"}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Observacao</dt>
              <dd className="mobile-field-value">{access.notes ?? "Sem observacao"}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>

    <div className="table-shell hidden md:block">
      <table className="data-table min-w-[720px]">
        <thead>
          <tr>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="type" sortParam={keys.sort}>Tipo</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="occurredAt" sortParam={keys.sort}>Horario</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="method" sortParam={keys.sort}>Metodo</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="porter" sortParam={keys.sort}>Porteiro</SortableHeader></th>
            <th className="px-4 py-3 font-medium">Observacao</th>
          </tr>
        </thead>
        <tbody>
          {visibleAccesses.map((access) => (
            <tr key={access.id}>
              <td className="font-medium text-navy-950">
                {formatAccessType(access.accessType)}
              </td>
              <td>{formatDateTime(access.occurredAt)}</td>
              <td>{formatAccessMethod(access.accessMethod)}</td>
              <td>{access.porter?.name ?? "Nao informado"}</td>
              <td>{access.notes ?? "Sem observacao"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <DataTablePagination page={page} pageParam={keys.page} pageSize={pageSize} pageSizeParam={keys.pageSize} searchParams={searchParams} totalItems={accesses.length} totalPages={totalPages} />
    </div>
  );
}
