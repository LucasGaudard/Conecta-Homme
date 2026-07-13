import Link from "next/link";
import type { User } from "@prisma/client";
import { Eye, Pencil } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";

type PorterTableProps = {
  porters: Array<
    Pick<
      User,
      "createdAt" | "email" | "id" | "name" | "phone" | "porterShiftDescription" | "status"
    >
  >;
};

export function PorterTable({ porters }: PorterTableProps) {
  if (porters.length === 0) {
    return (
      <div className="surface-card p-8 text-center">
        <h3 className="text-base font-semibold text-navy-950">Nenhum porteiro encontrado</h3>
        <p className="mt-2 text-sm text-slate-500">
          Cadastre o primeiro porteiro deste condomínio.
        </p>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="data-table min-w-[900px]">
        <thead>
          <tr>
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">Contato</th>
            <th className="px-4 py-3 font-medium">Turno</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Criado em</th>
            <th className="px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {porters.map((porter) => (
            <tr key={porter.id}>
              <td className="font-medium text-navy-950">{porter.name}</td>
              <td>
                <div className="space-y-1">
                  <p>{porter.email}</p>
                  <p className="text-xs text-slate-500">{porter.phone ?? "Telefone não informado"}</p>
                </div>
              </td>
              <td>{porter.porterShiftDescription ?? "Não informado"}</td>
              <td><StatusBadge status={porter.status} type="user" /></td>
              <td>{porter.createdAt.toLocaleDateString("pt-BR")}</td>
              <td>
                <div className="flex min-w-max items-center gap-2">
                  <Button asChild variant="ghost" size="icon" aria-label="Visualizar porteiro">
                    <Link href={`/admin/porteiros/${porter.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon" aria-label="Editar porteiro">
                    <Link href={`/admin/porteiros/${porter.id}/editar`}>
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
  );
}
