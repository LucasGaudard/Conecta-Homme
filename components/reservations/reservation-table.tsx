import type { LeisureSpace, SpaceReservation, Unit, User } from "@prisma/client";
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
import { ReservationActions } from "@/components/reservations/reservation-actions";
import { ReservationStatusBadge } from "@/components/reservations/reservation-status-badge";
import {
  formatReservationDateTime,
  formatReservationTimeRange,
  formatUnitLabel,
} from "@/lib/reservations/format";

type ReservationRow = SpaceReservation & {
  approvedBy?: Pick<User, "name"> | null;
  requestedBy?: Pick<User, "name"> & { phone?: string | null } | null;
  space: LeisureSpace;
  unit?: Pick<Unit, "apartment" | "block" | "responsibleName"> | null;
};

type ReservationTableProps = {
  mode: "admin" | "porter" | "resident";
  reservations: ReservationRow[];
  searchParams?: SearchParamRecord;
  tableKey?: string;
};

type SortKey = "createdAt" | "space" | "startAt" | "status" | "unit";

function reservationSortValue(item: ReservationRow, sort: string) {
  const key = sort as SortKey;

  if (key === "space") return item.space.name;
  if (key === "status") return item.status;
  if (key === "unit") return formatUnitLabel(item.unit);
  if (key === "createdAt") return item.createdAt;
  return item.startAt;
}

function sortReservations(items: ReservationRow[], sort: string, direction: "asc" | "desc") {
  return [...items].sort((a, b) => {
    const first = reservationSortValue(a, sort);
    const second = reservationSortValue(b, sort);
    const result =
      first instanceof Date && second instanceof Date
        ? first.getTime() - second.getTime()
        : String(first).localeCompare(String(second), "pt-BR", { numeric: true });

    return direction === "asc" ? result : -result;
  });
}

export function ReservationTable({
  mode,
  reservations,
  searchParams,
  tableKey = "reservations",
}: ReservationTableProps) {
  if (reservations.length === 0) {
    return (
      <div className="surface-card p-8 text-center">
        <p className="text-sm font-medium text-navy-950">Nenhuma reserva encontrada.</p>
        <p className="mt-1 text-sm text-slate-500">
          As reservas aparecerao aqui quando houver solicitacoes no periodo.
        </p>
      </div>
    );
  }

  const keys = tableParamKeys(tableKey);
  const pageSize = normalizePageSize(getSearchParam(searchParams, keys.pageSize));
  const totalPages = pageCount(reservations.length, pageSize);
  const page = clampPage(normalizePage(getSearchParam(searchParams, keys.page)), totalPages);
  const sort = getSearchParam(searchParams, keys.sort) ?? "startAt";
  const direction = normalizeSortDirection(getSearchParam(searchParams, keys.direction));
  const sortedReservations = sortReservations(reservations, sort, direction);
  const visibleReservations = pageSlice(sortedReservations, page, pageSize);

  return (
    <div className="space-y-4">
      <div className="surface-card flex flex-col gap-1 p-4">
        <p className="text-sm font-medium text-navy-950">
          {reservations.length} reserva(s)
        </p>
        <p className="text-xs text-slate-500">
          Ordenado por {sort === "startAt" ? "data da reserva" : sort}.
        </p>
      </div>

      <div className="mobile-list">
        {visibleReservations.map((item) => (
          <article key={item.id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="min-w-0">
                <p className="text-base font-semibold text-navy-950">{item.space.name}</p>
                <p className="mt-1 text-sm text-slate-500">{formatReservationTimeRange(item.startAt, item.endAt)}</p>
              </div>
              <ReservationStatusBadge status={item.status} type="reservation" />
            </div>
            <dl className="mobile-field-grid">
              <div className="mobile-field">
                <dt className="mobile-field-label">Unidade</dt>
                <dd className="mobile-field-value">{formatUnitLabel(item.unit)}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Responsavel</dt>
                <dd className="mobile-field-value">{item.requestedBy?.name ?? item.unit?.responsibleName ?? "Nao informado"}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Solicitada em</dt>
                <dd className="mobile-field-value">{formatReservationDateTime(item.createdAt)}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Aprovada por</dt>
                <dd className="mobile-field-value">{item.approvedBy?.name ?? "Nao informado"}</dd>
              </div>
              <div className="mobile-field sm:col-span-2">
                <dt className="mobile-field-label">Observacao</dt>
                <dd className="mobile-field-value">{item.rejectionReason ?? item.notes ?? "Nao informado"}</dd>
              </div>
            </dl>
            {mode !== "porter" ? (
              <div className="mt-4">
                <ReservationActions id={item.id} mode={mode} status={item.status} />
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
                <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="space" sortParam={keys.sort}>
                  Espaco
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="unit" sortParam={keys.sort}>
                  Unidade
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">Responsavel</th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="startAt" sortParam={keys.sort}>
                  Horario
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">
                <SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="status" sortParam={keys.sort}>
                  Status
                </SortableHeader>
              </th>
              <th className="px-4 py-3 font-medium">Observacao</th>
              <th className="px-4 py-3 font-medium">Aprovada por</th>
              {mode !== "porter" ? <th className="px-4 py-3 font-medium">Acao</th> : null}
            </tr>
          </thead>
          <tbody>
            {visibleReservations.map((item) => (
              <tr key={item.id}>
                <td className="font-medium text-navy-950">{item.space.name}</td>
                <td>{formatUnitLabel(item.unit)}</td>
                <td>{item.requestedBy?.name ?? item.unit?.responsibleName ?? "Nao informado"}</td>
                <td>{formatReservationTimeRange(item.startAt, item.endAt)}</td>
                <td><ReservationStatusBadge status={item.status} type="reservation" /></td>
                <td>{item.rejectionReason ?? item.notes ?? "Nao informado"}</td>
                <td>{item.approvedBy?.name ?? "Nao informado"}</td>
                {mode !== "porter" ? (
                  <td>
                    <ReservationActions id={item.id} mode={mode} status={item.status} />
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
        totalItems={reservations.length}
        totalPages={totalPages}
      />
    </div>
  );
}
