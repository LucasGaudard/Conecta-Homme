import type { UserStatus } from "@prisma/client";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PorterActions } from "@/components/porters/porter-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/units/format";

type PorterRow = {
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  phone: string | null;
  status: UserStatus;
};

type PorterTableProps = {
  porters: PorterRow[];
};

export function PorterTable({ porters }: PorterTableProps) {
  if (porters.length === 0) {
    return <EmptyState message="Nenhum porteiro cadastrado até o momento." />;
  }

  return (
    <div className="space-y-4">
      <div className="surface-card p-4">
        <p className="text-sm font-medium text-navy-950">
          {porters.length} porteiro(s)
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Acessos de portaria vinculados ao seu condomínio.
        </p>
      </div>

      <div className="mobile-list">
        {porters.map((porter) => (
          <article key={porter.id} className="mobile-card">
            <div className="mobile-card-header">
              <div className="min-w-0">
                <p className="text-base font-semibold text-navy-950">{porter.name}</p>
                <p className="mt-1 break-words text-sm text-slate-500">{porter.email}</p>
              </div>
              <PorterActions porterId={porter.id} status={porter.status} />
            </div>
            <div className="mt-3">
              <StatusBadge status={porter.status} type="user" />
            </div>
            <dl className="mobile-field-grid">
              <div className="mobile-field">
                <dt className="mobile-field-label">Telefone</dt>
                <dd className="mobile-field-value">{porter.phone ?? "Não informado"}</dd>
              </div>
              <div className="mobile-field">
                <dt className="mobile-field-label">Criado em</dt>
                <dd className="mobile-field-value">{formatDateTime(porter.createdAt)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="table-shell hidden md:block">
        <table className="data-table min-w-[820px]">
          <thead>
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Telefone</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Criado em</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {porters.map((porter) => (
              <tr key={porter.id}>
                <td className="font-medium text-navy-950">{porter.name}</td>
                <td>{porter.email}</td>
                <td>{porter.phone ?? "Não informado"}</td>
                <td>
                  <StatusBadge status={porter.status} type="user" />
                </td>
                <td>{formatDateTime(porter.createdAt)}</td>
                <td>
                  <PorterActions porterId={porter.id} status={porter.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
