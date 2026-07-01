import type { QRCodeToken, Visitor, VisitAuthorization } from "@prisma/client";
import { Ban, QrCode } from "lucide-react";
import { QrTokenResult } from "@/components/qrcode/qr-token-result";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SubmitButton } from "@/components/ui/submit-button";
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
import { cancelVisitorAuthorizationAction } from "@/lib/resident/actions";
import { generateVisitorQrCodeAction } from "@/lib/qrcode/actions";
import { formatDateTime, formatVisitorStatus } from "@/components/resident/resident-format";

type VisitorAuthorizationRow = VisitAuthorization & {
  visitor: Visitor;
};

type VisitorTableProps = {
  authorizations: VisitorAuthorizationRow[];
  qrCodes?: QRCodeToken[];
  searchParams?: SearchParamRecord;
  tableKey?: string;
  title: string;
};

function visitorSortValue(item: VisitorAuthorizationRow, sort: string) {
  if (sort === "name") return item.visitor.name;
  if (sort === "phone") return item.visitor.phone ?? "";
  if (sort === "status") return item.status;
  if (sort === "endsAt") return item.endsAt;
  return item.startsAt;
}

export function VisitorTable({
  authorizations,
  qrCodes = [],
  searchParams,
  tableKey = "visitors",
  title,
}: VisitorTableProps) {
  if (authorizations.length === 0) {
    return <EmptyState message={`Nenhum visitante em ${title.toLowerCase()}.`} />;
  }

  const keys = tableParamKeys(tableKey);
  const pageSize = normalizePageSize(getSearchParam(searchParams, keys.pageSize));
  const totalPages = pageCount(authorizations.length, pageSize);
  const page = clampPage(normalizePage(getSearchParam(searchParams, keys.page)), totalPages);
  const sort = getSearchParam(searchParams, keys.sort) ?? "startsAt";
  const direction = normalizeSortDirection(getSearchParam(searchParams, keys.direction));
  const sortedAuthorizations = [...authorizations].sort((a, b) => {
    const first = visitorSortValue(a, sort);
    const second = visitorSortValue(b, sort);
    const result =
      first instanceof Date && second instanceof Date
        ? first.getTime() - second.getTime()
        : String(first).localeCompare(String(second), "pt-BR", { numeric: true });

    return direction === "asc" ? result : -result;
  });
  const visibleAuthorizations = pageSlice(sortedAuthorizations, page, pageSize);

  return (
    <div className="space-y-4">
    <div className="surface-card p-4">
      <p className="text-sm font-medium text-navy-950">
        {authorizations.length} visitante(s)
      </p>
    </div>
    <div className="mobile-list">
      {visibleAuthorizations.map((authorization) => {
        const cancel = cancelVisitorAuthorizationAction.bind(null, authorization.id);
        const generateQr = generateVisitorQrCodeAction.bind(null, authorization.id);
        const isCancelable =
          authorization.status === "AUTHORIZED" && authorization.endsAt >= new Date();
        const qrCode = qrCodes.find(
          (item) =>
            item.visitAuthorizationId === authorization.id &&
            (!item.expiresAt || item.expiresAt >= new Date()),
        );

        return (
          <article key={authorization.id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="min-w-0">
                <p className="text-base font-semibold text-navy-950">
                  {authorization.visitor.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {authorization.visitor.document ?? "Documento nao informado"}
                </p>
              </div>
              <div className="text-right">
                {formatVisitorStatus(authorization.status, authorization.endsAt)}
              </div>
            </div>
            <dl className="mobile-field-grid">
              <div className="mobile-field">
                <dt className="mobile-field-label">Telefone</dt>
                <dd className="mobile-field-value">{authorization.visitor.phone ?? "Nao informado"}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Inicio</dt>
                <dd className="mobile-field-value">{formatDateTime(authorization.startsAt)}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Fim</dt>
                <dd className="mobile-field-value">{formatDateTime(authorization.endsAt)}</dd>
              </div>
            </dl>
            <div className="mt-4 space-y-3">
              {isCancelable ? (
                <>
                  <QrTokenResult qrCode={qrCode} />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <form action={generateQr}>
                      <SubmitButton size="sm" variant="outline" className="h-10 w-full" pendingLabel="Gerando...">
                        <QrCode className="h-4 w-4" />
                        {qrCode ? "Reutilizar QR" : "Gerar QR"}
                      </SubmitButton>
                    </form>
                    <form action={cancel}>
                      <SubmitButton size="sm" variant="outline" className="h-10 w-full" pendingLabel="Cancelando...">
                        <Ban className="h-4 w-4" />
                        Cancelar
                      </SubmitButton>
                    </form>
                  </div>
                </>
              ) : (
                <span className="text-sm text-slate-400">QR Code indisponivel. Sem acao.</span>
              )}
            </div>
          </article>
        );
      })}
    </div>

    <div className="table-shell hidden md:block">
      <table className="data-table min-w-[760px]">
        <thead>
          <tr>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="name" sortParam={keys.sort}>Visitante</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="phone" sortParam={keys.sort}>Telefone</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="startsAt" sortParam={keys.sort}>Inicio</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="endsAt" sortParam={keys.sort}>Fim</SortableHeader></th>
            <th className="px-4 py-3 font-medium"><SortableHeader activeSort={sort} direction={direction} directionParam={keys.direction} pageParam={keys.page} searchParams={searchParams} sortKey="status" sortParam={keys.sort}>Status</SortableHeader></th>
            <th className="px-4 py-3 font-medium">QR Code</th>
            <th className="px-4 py-3 font-medium">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {visibleAuthorizations.map((authorization) => {
            const cancel = cancelVisitorAuthorizationAction.bind(null, authorization.id);
            const generateQr = generateVisitorQrCodeAction.bind(null, authorization.id);
            const isCancelable =
              authorization.status === "AUTHORIZED" && authorization.endsAt >= new Date();
            const qrCode = qrCodes.find(
              (item) =>
                item.visitAuthorizationId === authorization.id &&
                (!item.expiresAt || item.expiresAt >= new Date()),
            );

            return (
              <tr key={authorization.id}>
                <td>
                  <p className="font-medium text-navy-950">{authorization.visitor.name}</p>
                  <p className="text-xs text-slate-400">
                    {authorization.visitor.document ?? "Documento nao informado"}
                  </p>
                </td>
                <td>{authorization.visitor.phone ?? "Nao informado"}</td>
                <td>{formatDateTime(authorization.startsAt)}</td>
                <td>{formatDateTime(authorization.endsAt)}</td>
                <td>{formatVisitorStatus(authorization.status, authorization.endsAt)}</td>
                <td>
                  {isCancelable ? (
                    <div className="space-y-3">
                      <QrTokenResult qrCode={qrCode} />
                      <form action={generateQr}>
                        <SubmitButton size="sm" variant="outline" pendingLabel="Gerando...">
                          <QrCode className="h-4 w-4" />
                          {qrCode ? "Reutilizar QR" : "Gerar QR"}
                        </SubmitButton>
                      </form>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Indisponivel</span>
                  )}
                </td>
                <td>
                  {isCancelable ? (
                    <form action={cancel}>
                      <SubmitButton size="sm" variant="outline" pendingLabel="Cancelando...">
                        <Ban className="h-4 w-4" />
                        Cancelar
                      </SubmitButton>
                    </form>
                  ) : (
                    <span className="text-xs text-slate-400">Sem acao</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <DataTablePagination page={page} pageParam={keys.page} pageSize={pageSize} pageSizeParam={keys.pageSize} searchParams={searchParams} totalItems={authorizations.length} totalPages={totalPages} />
    </div>
  );
}
