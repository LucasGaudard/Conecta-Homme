import type { AccessLog, User, Visitor } from "@prisma/client";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  formatAccessMethod,
  formatAccessType,
  formatDateTime,
} from "@/components/resident/resident-format";

type AccessHistoryItem = AccessLog & {
  porter: Pick<User, "name"> | null;
  visitor: Pick<Visitor, "name"> | null;
};

type AccessHistoryProps = {
  accesses: AccessHistoryItem[];
};

export function AccessHistory({ accesses }: AccessHistoryProps) {
  if (accesses.length === 0) {
    return <EmptyState message="Nenhum acesso registrado para sua unidade." />;
  }

  return (
    <>
    <div className="mobile-list">
      {accesses.map((access) => (
        <article key={access.id} className="mobile-card">
          <p className="text-base font-semibold text-navy-950">
            {formatAccessType(access.accessType)}
          </p>
          <dl className="mobile-field-grid">
            <div className="mobile-field">
              <dt className="mobile-field-label">Horario</dt>
              <dd className="mobile-field-value">{formatDateTime(access.occurredAt)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Metodo</dt>
              <dd className="mobile-field-value">{formatAccessMethod(access.accessMethod)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Porteiro</dt>
              <dd className="mobile-field-value">{access.porter?.name ?? "Nao informado"}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Observacao</dt>
              <dd className="mobile-field-value">{access.notes ?? "Sem observacao"}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>

    <div className="table-shell hidden md:block">
      <table className="data-table min-w-[720px]">
        <thead>
          <tr>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Horario</th>
            <th className="px-4 py-3 font-medium">Metodo</th>
            <th className="px-4 py-3 font-medium">Porteiro</th>
            <th className="px-4 py-3 font-medium">Observacao</th>
          </tr>
        </thead>
        <tbody>
          {accesses.map((access) => (
            <tr key={access.id}>
              <td className="font-medium text-navy-950">
                {formatAccessType(access.accessType)}
              </td>
              <td>{formatDateTime(access.occurredAt)}</td>
              <td>{formatAccessMethod(access.accessMethod)}</td>
              <td>{access.porter?.name ?? "Nao informado"}</td>
              <td>{access.notes ?? "Sem observacao"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
