"use client";

import type { PresenceStatus, Unit, UnitStatus } from "@prisma/client";
import { useMemo, useState } from "react";
import { FilterSelect } from "@/components/admin/filter-select";
import { SearchInput } from "@/components/admin/search-input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { UnitRowActions } from "@/components/admin/row-actions";
import { maskCpf } from "@/lib/units/format";

type UnitTableRow = Unit & {
  _count: {
    users: number;
  };
};

type UnitsTableProps = {
  units: UnitTableRow[];
};

export function UnitsTable({ units }: UnitsTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [presenceStatus, setPresenceStatus] = useState("ALL");
  const filteredUnits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return units.filter((unit) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          unit.block,
          unit.apartment,
          unit.responsibleName,
          unit.phone,
          unit.email,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));
      const matchesStatus = status === "ALL" || unit.status === status;
      const matchesPresence =
        presenceStatus === "ALL" || unit.presenceStatus === presenceStatus;

      return matchesQuery && matchesStatus && matchesPresence;
    });
  }, [presenceStatus, query, status, units]);

  if (units.length === 0) {
    return <EmptyState message="Nenhuma unidade cadastrada ate o momento." />;
  }

  return (
    <div className="space-y-4">
      <div className="surface-card p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_220px_260px]">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar por bloco, apartamento, responsavel, telefone ou e-mail"
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { label: "Todos", value: "ALL" },
              { label: "Ativo", value: "ACTIVE" },
              { label: "Inativo", value: "INACTIVE" },
            ]}
          />
          <FilterSelect
            label="Presenca"
            value={presenceStatus}
            onChange={setPresenceStatus}
            options={[
              { label: "Todas", value: "ALL" },
              { label: "Em casa", value: "HOME" },
              { label: "Ausente", value: "AWAY" },
              { label: "Nao perturbe", value: "DO_NOT_DISTURB" },
            ]}
          />
        </div>
      </div>

      {filteredUnits.length === 0 ? (
        <EmptyState message="Nenhuma unidade encontrada com os filtros atuais." />
      ) : (
        <>
        <div className="mobile-list">
          {filteredUnits.map((unit) => (
            <article key={unit.id} className="mobile-card">
              <div className="mobile-card-header">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-navy-950">
                    Unidade {unit.block}-{unit.apartment}
                  </p>
                  <p className="mt-1 break-words text-sm text-slate-500">
                    {unit.responsibleName}
                  </p>
                </div>
                <UnitRowActions unitId={unit.id} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={unit.status as UnitStatus} type="unit" />
                <StatusBadge status={unit.presenceStatus as PresenceStatus} type="presence" />
              </div>
              <dl className="mobile-field-grid">
                <div className="mobile-field">
                  <dt className="mobile-field-label">CPF</dt>
                  <dd className="mobile-field-value">{maskCpf(unit.cpf)}</dd>
                </div>
                <div className="mobile-field">
                  <dt className="mobile-field-label">Telefone</dt>
                  <dd className="mobile-field-value">{unit.phone ?? "Nao informado"}</dd>
                </div>
                <div className="mobile-field">
                  <dt className="mobile-field-label">E-mail</dt>
                  <dd className="mobile-field-value">{unit.email ?? "Nao informado"}</dd>
                </div>
                <div className="mobile-field">
                  <dt className="mobile-field-label">Moradores</dt>
                  <dd className="mobile-field-value">{unit._count.users}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="table-shell hidden md:block">
          <table className="data-table min-w-[980px]">
            <thead>
              <tr>
                <th className="px-4 py-3 font-medium">Bloco</th>
                <th className="px-4 py-3 font-medium">Apartamento</th>
                <th className="px-4 py-3 font-medium">Responsavel</th>
                <th className="px-4 py-3 font-medium">CPF</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Presenca</th>
                <th className="px-4 py-3 font-medium">Moradores</th>
                <th className="px-4 py-3 font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnits.map((unit) => (
                <tr key={unit.id}>
                  <td className="font-medium text-navy-950">{unit.block}</td>
                  <td>{unit.apartment}</td>
                  <td>{unit.responsibleName}</td>
                  <td>{maskCpf(unit.cpf)}</td>
                  <td>{unit.phone ?? "Nao informado"}</td>
                  <td>{unit.email ?? "Nao informado"}</td>
                  <td>
                    <StatusBadge status={unit.status as UnitStatus} type="unit" />
                  </td>
                  <td>
                    <StatusBadge status={unit.presenceStatus as PresenceStatus} type="presence" />
                  </td>
                  <td>{unit._count.users}</td>
                  <td>
                    <UnitRowActions unitId={unit.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
