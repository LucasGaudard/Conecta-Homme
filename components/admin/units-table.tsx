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
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_260px]">
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
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
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
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="text-slate-600">
                  <td className="px-4 py-3 font-medium text-navy-950">{unit.block}</td>
                  <td className="px-4 py-3">{unit.apartment}</td>
                  <td className="px-4 py-3">{unit.responsibleName}</td>
                  <td className="px-4 py-3">{maskCpf(unit.cpf)}</td>
                  <td className="px-4 py-3">{unit.phone ?? "Nao informado"}</td>
                  <td className="px-4 py-3">{unit.email ?? "Nao informado"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={unit.status as UnitStatus} type="unit" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={unit.presenceStatus as PresenceStatus} type="presence" />
                  </td>
                  <td className="px-4 py-3">{unit._count.users}</td>
                  <td className="px-4 py-3">
                    <UnitRowActions unitId={unit.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
