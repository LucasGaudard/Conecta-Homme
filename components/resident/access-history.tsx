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
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Horario</th>
            <th className="px-4 py-3 font-medium">Metodo</th>
            <th className="px-4 py-3 font-medium">Porteiro</th>
            <th className="px-4 py-3 font-medium">Observacao</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {accesses.map((access) => (
            <tr key={access.id} className="text-slate-600">
              <td className="px-4 py-3 font-medium text-navy-950">
                {formatAccessType(access.accessType)}
              </td>
              <td className="px-4 py-3">{formatDateTime(access.occurredAt)}</td>
              <td className="px-4 py-3">{formatAccessMethod(access.accessMethod)}</td>
              <td className="px-4 py-3">{access.porter?.name ?? "Nao informado"}</td>
              <td className="px-4 py-3">{access.notes ?? "Sem observacao"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
