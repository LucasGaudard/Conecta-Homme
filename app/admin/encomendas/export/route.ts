import { csvResponse, timestampedFilename, toCsv } from "@/lib/export/csv";
import { requireAdminExport } from "@/lib/export/admin";
import { formatPackageDate, formatPackageStatus } from "@/lib/packages/format";
import { getAdminPackages } from "@/lib/packages/queries";

export async function GET(request: Request) {
  await requireAdminExport();

  const { searchParams } = new URL(request.url);
  const packages = await getAdminPackages({
    from: searchParams.get("from") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });
  const csv = toCsv(packages, [
    {
      header: "Unidade",
      value: (item) =>
        item.unit ? `${item.unit.block}-${item.unit.apartment}` : "Nao informada",
    },
    {
      header: "Responsavel",
      value: (item) => item.unit?.responsibleName ?? "Nao informado",
    },
    { header: "Transportadora", value: (item) => item.carrier },
    { header: "Codigo", value: (item) => item.trackingCode },
    { header: "Descricao", value: (item) => item.description },
    { header: "Status", value: (item) => formatPackageStatus(item.status) },
    { header: "Recebida em", value: (item) => formatPackageDate(item.receivedAt) },
    { header: "Entregue em", value: (item) => formatPackageDate(item.deliveredAt) },
    { header: "Recebido por", value: (item) => item.receivedBy?.name },
    { header: "Entregue por", value: (item) => item.deliveredBy?.name },
    { header: "Retirado por", value: (item) => item.pickedUpByName },
  ]);

  return csvResponse(csv, timestampedFilename("encomendas"));
}
