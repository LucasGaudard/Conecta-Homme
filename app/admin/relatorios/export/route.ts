import { reportFiltersSchema } from "@/lib/reports/validation";
import {
  formatAccessMethod,
  formatAccessType,
  formatPackageStatus,
  formatReportDate,
  formatVisitorStatus,
} from "@/lib/reports/format";
import { getAdminReportsData } from "@/lib/reports/queries";
import { requireAdminExport } from "@/lib/export/admin";
import { csvResponse, timestampedFilename, toCsv } from "@/lib/export/csv";

export async function GET(request: Request) {
  await requireAdminExport();

  const { searchParams } = new URL(request.url);
  const parsed = reportFiltersSchema.safeParse({
    accessMethod: searchParams.get("accessMethod") ?? undefined,
    accessType: searchParams.get("accessType") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    packageStatus: searchParams.get("packageStatus") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    visitorStatus: searchParams.get("visitorStatus") ?? undefined,
  });
  const data = await getAdminReportsData(parsed.success ? parsed.data : {});
  const sections = [
    "Resumo",
    toCsv(
      [
        { indicador: "Total de unidades", valor: data.summary.totalUnits },
        { indicador: "Unidades ativas", valor: data.summary.activeUnits },
        { indicador: "Moradores ativos", valor: data.summary.activeResidents },
        { indicador: "Porteiros ativos", valor: data.summary.activePorters },
        { indicador: "Visitantes autorizados", valor: data.summary.authorizedVisitors },
        { indicador: "Encomendas aguardando", valor: data.summary.waitingPackages },
        { indicador: "Acessos no periodo", valor: data.summary.accessLogsInPeriod },
        {
          indicador: "Encomendas entregues no filtro",
          valor: data.packageTotals.deliveredPackagesTotal,
        },
      ],
      [
        { header: "Indicador", value: (item) => item.indicador },
        { header: "Valor", value: (item) => item.valor },
      ],
      { bom: false },
    ),
    "",
    "Acessos",
    toCsv(data.accessLogs, [
      {
        header: "Unidade",
        value: (item) =>
          item.unit ? `${item.unit.block}-${item.unit.apartment}` : "Nao informada",
      },
      {
        header: "Responsavel",
        value: (item) => item.unit?.responsibleName ?? "Nao informado",
      },
      { header: "Tipo", value: (item) => formatAccessType(item.accessType) },
      { header: "Metodo", value: (item) => formatAccessMethod(item.accessMethod) },
      { header: "Data", value: (item) => formatReportDate(item.occurredAt) },
      { header: "Portaria", value: (item) => item.porter?.name },
      { header: "Observacoes", value: (item) => item.notes },
    ], { bom: false }),
    "",
    "Encomendas",
    toCsv(data.packages, [
      {
        header: "Unidade",
        value: (item) =>
          item.unit ? `${item.unit.block}-${item.unit.apartment}` : "Nao informada",
      },
      {
        header: "Responsavel",
        value: (item) => item.unit?.responsibleName ?? "Nao informado",
      },
      { header: "Status", value: (item) => formatPackageStatus(item.status) },
      { header: "Transportadora", value: (item) => item.carrier },
      { header: "Codigo", value: (item) => item.trackingCode },
      { header: "Recebida em", value: (item) => formatReportDate(item.receivedAt) },
      { header: "Entregue em", value: (item) => formatReportDate(item.deliveredAt) },
      { header: "Recebido por", value: (item) => item.receivedBy?.name },
      { header: "Entregue por", value: (item) => item.deliveredBy?.name },
    ], { bom: false }),
    "",
    "Visitantes",
    toCsv(data.visitors, [
      {
        header: "Unidade",
        value: (item) =>
          item.unit ? `${item.unit.block}-${item.unit.apartment}` : "Nao informada",
      },
      {
        header: "Responsavel",
        value: (item) => item.unit?.responsibleName ?? "Nao informado",
      },
      { header: "Visitante", value: (item) => item.visitor.name },
      { header: "Status", value: (item) => formatVisitorStatus(item.status) },
      { header: "Autorizado por", value: (item) => item.authorizedBy.name },
      { header: "Criado em", value: (item) => formatReportDate(item.createdAt) },
    ], { bom: false }),
  ].join("\r\n");

  return csvResponse(`\uFEFF${sections}`, timestampedFilename("relatorios"));
}
