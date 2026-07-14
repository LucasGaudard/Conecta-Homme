import Link from "next/link";
import type { Unit, User } from "@prisma/client";
import { Eye, Pencil } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";

type ResidentRow = Pick<User, "email" | "id" | "name" | "phone" | "status" | "username"> & {
  unit: Pick<Unit, "apartment" | "block" | "id" | "responsibleName" | "status"> | null;
};

type ResidentTableProps = {
  residents: ResidentRow[];
};

function unitLabel(unit: ResidentRow["unit"]) {
  return unit ? `${unit.block}-${unit.apartment}` : "Sem unidade";
}

export function ResidentTable({ residents }: ResidentTableProps) {
  if (residents.length === 0) {
    return <EmptyState message="Nenhum morador encontrado." />;
  }

  return (
    <div className="space-y-4">
      <div className="mobile-list">
        {residents.map((resident) => (
          <article key={resident.id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-navy-950">
                  {resident.name}
                </p>
                <p className="mt-1 truncate text-sm text-slate-500">{resident.email}</p>
              </div>
              <StatusBadge status={resident.status} type="user" />
            </div>
            <dl className="mobile-field-grid">
              <div className="mobile-field">
                <dt className="mobile-field-label">Telefone</dt>
                <dd className="mobile-field-value">{resident.phone ?? "Não informado"}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Username</dt>
                <dd className="mobile-field-value">{resident.username ?? "Não informado"}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Unidade</dt>
                <dd className="mobile-field-value">
                  {resident.unit ? (
                    <Link
                      className="font-medium text-navy-700 underline-offset-4 hover:underline"
                      href={`/admin/unidades/${resident.unit.id}`}
                    >
                      {unitLabel(resident.unit)}
                    </Link>
                  ) : (
                    "Sem unidade"
                  )}
                </dd>
              </div>
            </dl>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild variant="outline">
                <Link href={`/admin/moradores/${resident.id}`}>
                  <Eye className="h-4 w-4" />
                  Detalhes
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/admin/moradores/${resident.id}/editar`}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="table-shell hidden md:block">
        <table className="data-table min-w-[980px]">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contato</th>
              <th>Unidade</th>
              <th>Responsável da unidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id}>
                <td className="font-medium text-navy-950">
                  <div>
                    <p>{resident.name}</p>
                    {resident.username ? (
                      <p className="text-xs text-slate-500">@{resident.username}</p>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div className="space-y-1">
                    <p>{resident.email}</p>
                    <p className="text-xs text-slate-500">
                      {resident.phone ?? "Telefone não informado"}
                    </p>
                  </div>
                </td>
                <td>
                  {resident.unit ? (
                    <Link
                      className="font-medium text-navy-700 underline-offset-4 hover:underline"
                      href={`/admin/unidades/${resident.unit.id}`}
                    >
                      {unitLabel(resident.unit)}
                    </Link>
                  ) : (
                    "Sem unidade"
                  )}
                </td>
                <td>{resident.unit?.responsibleName ?? "Não informado"}</td>
                <td><StatusBadge status={resident.status} type="user" /></td>
                <td>
                  <div className="flex min-w-max items-center gap-2">
                    <Button asChild variant="ghost" size="icon" aria-label="Visualizar morador">
                      <Link href={`/admin/moradores/${resident.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" aria-label="Editar morador">
                      <Link href={`/admin/moradores/${resident.id}/editar`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
