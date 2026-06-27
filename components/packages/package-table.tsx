import type { Package, Unit, User } from "@prisma/client";
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
};

export function PackageTable({ mode, packages }: PackageTableProps) {
  if (packages.length === 0) {
    return <PackageEmptyState message="Nenhuma encomenda encontrada." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Unidade</th>
            <th className="px-4 py-3 font-medium">Responsavel</th>
            <th className="px-4 py-3 font-medium">Transportadora</th>
            <th className="px-4 py-3 font-medium">Codigo</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Chegada</th>
            <th className="px-4 py-3 font-medium">Entrega</th>
            <th className="px-4 py-3 font-medium">Recebido por</th>
            <th className="px-4 py-3 font-medium">Entregue por</th>
            <th className="px-4 py-3 font-medium">Retirado por</th>
            {mode === "porter" ? <th className="px-4 py-3 font-medium">Acao</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {packages.map((item) => (
            <tr key={item.id} className="text-slate-600">
              <td className="px-4 py-3 font-medium text-navy-950">
                {item.unit ? `${item.unit.block}-${item.unit.apartment}` : "Nao informada"}
              </td>
              <td className="px-4 py-3">{item.unit?.responsibleName ?? "Nao informado"}</td>
              <td className="px-4 py-3">{item.carrier ?? "Nao informado"}</td>
              <td className="px-4 py-3">{item.trackingCode ?? "Nao informado"}</td>
              <td className="px-4 py-3"><PackageStatusBadge status={item.status} /></td>
              <td className="px-4 py-3">{formatPackageDate(item.receivedAt)}</td>
              <td className="px-4 py-3">{formatPackageDate(item.deliveredAt)}</td>
              <td className="px-4 py-3">{item.receivedBy?.name ?? "Nao informado"}</td>
              <td className="px-4 py-3">{item.deliveredBy?.name ?? "Nao informado"}</td>
              <td className="px-4 py-3">{item.pickedUpByName ?? "Nao informado"}</td>
              {mode === "porter" ? (
                <td className="px-4 py-3">
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
  );
}
