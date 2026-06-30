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
    <div className="table-shell">
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
  );
}
