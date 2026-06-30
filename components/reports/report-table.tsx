import { PackageStatusBadge } from "@/components/packages/package-status-badge";
import { ReportEmptyState } from "@/components/reports/report-empty-state";
import {
  formatAccessMethod,
  formatAccessType,
  formatReportDate,
  formatVisitorStatus,
} from "@/lib/reports/format";

type ReportTableProps = {
  rows: Array<Record<string, unknown>>;
  type: "access" | "package" | "visitor";
};

function unitLabel(unit: unknown) {
  if (!unit || typeof unit !== "object") {
    return "Nao informada";
  }

  const data = unit as { apartment?: string; block?: string; responsibleName?: string };
  return `${data.block ?? "-"}-${data.apartment ?? "-"} / ${data.responsibleName ?? "Responsavel nao informado"}`;
}

export function ReportTable({ rows, type }: ReportTableProps) {
  if (rows.length === 0) {
    return <ReportEmptyState message="Nenhum registro encontrado para os filtros atuais." />;
  }

  if (type === "access") {
    return (
      <div className="table-shell">
        <table className="data-table min-w-[760px]">
          <thead>
            <tr>
              <th className="px-4 py-3 font-medium">Unidade</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Metodo</th>
              <th className="px-4 py-3 font-medium">Horario</th>
              <th className="px-4 py-3 font-medium">Porteiro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                <td className="font-medium text-navy-950">{unitLabel(row.unit)}</td>
                <td>{formatAccessType(row.accessType as never)}</td>
                <td>{formatAccessMethod(row.accessMethod as never)}</td>
                <td>{formatReportDate(row.occurredAt as Date)}</td>
                <td>{(row.porter as { name?: string } | null)?.name ?? "Nao informado"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "package") {
    return (
      <div className="table-shell">
        <table className="data-table min-w-[980px]">
          <thead>
            <tr>
              <th className="px-4 py-3 font-medium">Unidade</th>
              <th className="px-4 py-3 font-medium">Transportadora</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Chegada</th>
              <th className="px-4 py-3 font-medium">Entrega</th>
              <th className="px-4 py-3 font-medium">Recebido por</th>
              <th className="px-4 py-3 font-medium">Entregue por</th>
              <th className="px-4 py-3 font-medium">Retirado por</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                <td className="font-medium text-navy-950">{unitLabel(row.unit)}</td>
                <td>{String(row.carrier ?? "Nao informado")}</td>
                <td><PackageStatusBadge status={row.status as never} /></td>
                <td>{formatReportDate(row.receivedAt as Date)}</td>
                <td>{formatReportDate(row.deliveredAt as Date | null)}</td>
                <td>{(row.receivedBy as { name?: string } | null)?.name ?? "Nao informado"}</td>
                <td>{(row.deliveredBy as { name?: string } | null)?.name ?? "Nao informado"}</td>
                <td>{String(row.pickedUpByName ?? "Nao informado")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="data-table min-w-[860px]">
        <thead>
          <tr>
            <th className="px-4 py-3 font-medium">Visitante</th>
            <th className="px-4 py-3 font-medium">Unidade</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Inicio</th>
            <th className="px-4 py-3 font-medium">Fim</th>
            <th className="px-4 py-3 font-medium">Autorizado por</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row.id)}>
              <td className="font-medium text-navy-950">{(row.visitor as { name?: string } | null)?.name ?? "Nao informado"}</td>
              <td>{unitLabel(row.unit)}</td>
              <td>{formatVisitorStatus(row.status as never)}</td>
              <td>{formatReportDate(row.startsAt as Date)}</td>
              <td>{formatReportDate(row.endsAt as Date)}</td>
              <td>{(row.authorizedBy as { name?: string } | null)?.name ?? "Nao informado"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
