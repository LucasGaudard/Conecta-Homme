import { PackageStatusBadge } from "@/components/packages/package-status-badge";
import { ReportEmptyState } from "@/components/reports/report-empty-state";
import {
  formatAccessMethod,
  formatAccessType,
  formatPackageStatus,
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
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Unidade</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Metodo</th>
              <th className="px-4 py-3 font-medium">Horario</th>
              <th className="px-4 py-3 font-medium">Porteiro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={String(row.id)} className="text-slate-600">
                <td className="px-4 py-3 font-medium text-navy-950">{unitLabel(row.unit)}</td>
                <td className="px-4 py-3">{formatAccessType(row.accessType as never)}</td>
                <td className="px-4 py-3">{formatAccessMethod(row.accessMethod as never)}</td>
                <td className="px-4 py-3">{formatReportDate(row.occurredAt as Date)}</td>
                <td className="px-4 py-3">{(row.porter as { name?: string } | null)?.name ?? "Nao informado"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "package") {
    return (
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
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
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={String(row.id)} className="text-slate-600">
                <td className="px-4 py-3 font-medium text-navy-950">{unitLabel(row.unit)}</td>
                <td className="px-4 py-3">{String(row.carrier ?? "Nao informado")}</td>
                <td className="px-4 py-3"><PackageStatusBadge status={row.status as never} /></td>
                <td className="px-4 py-3">{formatReportDate(row.receivedAt as Date)}</td>
                <td className="px-4 py-3">{formatReportDate(row.deliveredAt as Date | null)}</td>
                <td className="px-4 py-3">{(row.receivedBy as { name?: string } | null)?.name ?? "Nao informado"}</td>
                <td className="px-4 py-3">{(row.deliveredBy as { name?: string } | null)?.name ?? "Nao informado"}</td>
                <td className="px-4 py-3">{String(row.pickedUpByName ?? "Nao informado")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Visitante</th>
            <th className="px-4 py-3 font-medium">Unidade</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Inicio</th>
            <th className="px-4 py-3 font-medium">Fim</th>
            <th className="px-4 py-3 font-medium">Autorizado por</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={String(row.id)} className="text-slate-600">
              <td className="px-4 py-3 font-medium text-navy-950">{(row.visitor as { name?: string } | null)?.name ?? "Nao informado"}</td>
              <td className="px-4 py-3">{unitLabel(row.unit)}</td>
              <td className="px-4 py-3">{formatVisitorStatus(row.status as never)}</td>
              <td className="px-4 py-3">{formatReportDate(row.startsAt as Date)}</td>
              <td className="px-4 py-3">{formatReportDate(row.endsAt as Date)}</td>
              <td className="px-4 py-3">{(row.authorizedBy as { name?: string } | null)?.name ?? "Nao informado"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
