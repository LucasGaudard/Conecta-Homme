import Link from "next/link";
import type { Condominium } from "@prisma/client";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CondominiumStatusActions } from "@/components/super-admin/condominium-status-actions";
import { CondominiumStatusBadge } from "@/components/super-admin/condominium-status-badge";
import {
  formatCondominiumDate,
  formatNullable,
} from "@/lib/super-admin/format";

type CondominiumRow = Condominium & {
  _count?: {
    users: number;
  };
};

type CondominiumTableProps = {
  condominiums: CondominiumRow[];
};

export function CondominiumTable({ condominiums }: CondominiumTableProps) {
  if (condominiums.length === 0) {
    return (
      <div className="surface-card p-8 text-center">
        <p className="text-sm font-medium text-navy-950">
          Nenhum condomínio cadastrado.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Crie o primeiro condomínio para iniciar a operação SaaS.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="surface-card flex flex-col gap-1 p-4">
        <p className="text-sm font-medium text-navy-950">
          {condominiums.length} condomínio(s)
        </p>
        <p className="text-xs text-slate-500">
          Gestão operacional da plataforma.
        </p>
      </div>

      <div className="mobile-list">
        {condominiums.map((item) => (
          <article key={item.id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="min-w-0">
                <p className="text-base font-semibold text-navy-950">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">{item.slug}</p>
              </div>
              <CondominiumStatusBadge status={item.status} />
            </div>
            <dl className="mobile-field-grid">
              <div className="mobile-field">
                <dt className="mobile-field-label">Telefone</dt>
                <dd className="mobile-field-value">{formatNullable(item.phone)}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">E-mail</dt>
                <dd className="mobile-field-value">{formatNullable(item.email)}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Plano</dt>
                <dd className="mobile-field-value">{formatNullable(item.planCode)}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Criado em</dt>
                <dd className="mobile-field-value">{formatCondominiumDate(item.createdAt)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/super-admin/condominios/${item.id}`}>
                  <Eye className="h-4 w-4" />
                  Visualizar
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/super-admin/condominios/${item.id}/editar`}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <CondominiumStatusActions id={item.id} name={item.name} status={item.status} />
            </div>
          </article>
        ))}
      </div>

      <div className="table-shell hidden md:block">
        <table className="data-table min-w-[1120px]">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Telefone</th>
              <th>E-mail</th>
              <th>Plano</th>
              <th>Criado em</th>
              <th>Usuários</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {condominiums.map((item) => (
              <tr key={item.id}>
                <td className="font-medium text-navy-950">{item.name}</td>
                <td>{item.slug}</td>
                <td><CondominiumStatusBadge status={item.status} /></td>
                <td>{formatNullable(item.phone)}</td>
                <td>{formatNullable(item.email)}</td>
                <td>{formatNullable(item.planCode)}</td>
                <td>{formatCondominiumDate(item.createdAt)}</td>
                <td>{item._count?.users ?? 0}</td>
                <td>
                  <div className="flex min-w-72 flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/super-admin/condominios/${item.id}`}>
                        <Eye className="h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/super-admin/condominios/${item.id}/editar`}>
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <CondominiumStatusActions id={item.id} name={item.name} status={item.status} />
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
