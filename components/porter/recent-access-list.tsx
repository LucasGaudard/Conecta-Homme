import type { AccessLog, Unit, User, Visitor } from "@prisma/client";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  formatAccessMethod,
  formatAccessType,
  formatShortDateTime,
} from "@/components/porter/porter-format";

type RecentAccess = AccessLog & {
  porter: Pick<User, "name"> | null;
  unit: Pick<Unit, "apartment" | "block" | "responsibleName"> | null;
  user: Pick<User, "name"> | null;
  visitor: Pick<Visitor, "name"> | null;
};

type RecentAccessListProps = {
  accesses: RecentAccess[];
};

export function RecentAccessList({ accesses }: RecentAccessListProps) {
  if (accesses.length === 0) {
    return <EmptyState message="Nenhum acesso registrado ate o momento." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Unidade</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Metodo</th>
            <th className="px-4 py-3 font-medium">Horario</th>
            <th className="px-4 py-3 font-medium">Porteiro</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {accesses.map((access) => (
            <tr key={access.id} className="text-slate-600">
              <td className="px-4 py-3 font-medium text-navy-950">
                {access.unit
                  ? `${access.unit.block}-${access.unit.apartment}`
                  : "Nao vinculada"}
              </td>
              <td className="px-4 py-3">{formatAccessType(access.accessType)}</td>
              <td className="px-4 py-3">{formatAccessMethod(access.accessMethod)}</td>
              <td className="px-4 py-3">{formatShortDateTime(access.occurredAt)}</td>
              <td className="px-4 py-3">{access.porter?.name ?? "Nao informado"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
