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
    <>
    <div className="mobile-list">
      {accesses.map((access) => (
        <article key={access.id} className="mobile-card">
          <p className="text-base font-semibold text-navy-950">
            {access.unit
              ? `${access.unit.block}-${access.unit.apartment}`
              : "Nao vinculada"}
          </p>
          <dl className="mobile-field-grid">
            <div className="mobile-field">
              <dt className="mobile-field-label">Tipo</dt>
              <dd className="mobile-field-value">{formatAccessType(access.accessType)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Metodo</dt>
              <dd className="mobile-field-value">{formatAccessMethod(access.accessMethod)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Horario</dt>
              <dd className="mobile-field-value">{formatShortDateTime(access.occurredAt)}</dd>
            </div>
            <div className="mobile-field">
              <dt className="mobile-field-label">Porteiro</dt>
              <dd className="mobile-field-value">{access.porter?.name ?? "Nao informado"}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>

    <div className="table-shell hidden md:block">
      <table className="data-table min-w-[760px]">
        <thead>
          <tr>
            <th className="px-4 py-3 font-medium">Unidade</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Metodo</th>
            <th className="px-4 py-3 font-medium">Horario</th>
            <th className="px-4 py-3 font-medium">Porteiro</th>
          </tr>
        </thead>
        <tbody>
          {accesses.map((access) => (
            <tr key={access.id}>
              <td className="font-medium text-navy-950">
                {access.unit
                  ? `${access.unit.block}-${access.unit.apartment}`
                  : "Nao vinculada"}
              </td>
              <td>{formatAccessType(access.accessType)}</td>
              <td>{formatAccessMethod(access.accessMethod)}</td>
              <td>{formatShortDateTime(access.occurredAt)}</td>
              <td>{access.porter?.name ?? "Nao informado"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
