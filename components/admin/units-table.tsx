"use client";

import type { PresenceStatus, Unit, UnitStatus } from "@prisma/client";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FilterSelect } from "@/components/admin/filter-select";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { UnitRowActions } from "@/components/admin/row-actions";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { maskCpf } from "@/lib/units/format";

type UnitTableRow = Unit & {
  _count: {
    users: number;
  };
};

type UnitsTableProps = {
  units: UnitTableRow[];
};

type SortKey = "apartment" | "block" | "presenceStatus" | "responsibleName" | "status" | "users";
type SortDirection = "asc" | "desc";

const pageSizeOptions = [10, 20, 50];

function sortValue(unit: UnitTableRow, key: SortKey) {
  if (key === "users") {
    return unit._count.users;
  }

  return String(unit[key] ?? "").toLowerCase();
}

export function UnitsTable({ units }: UnitsTableProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [sortKey, setSortKey] = useState<SortKey>("block");
  const [status, setStatus] = useState("ALL");
  const [presenceStatus, setPresenceStatus] = useState("ALL");
  const activeFilters = [
    query.trim().length > 0,
    status !== "ALL",
    presenceStatus !== "ALL",
  ].filter(Boolean).length;

  const updateQuery = useCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, []);

  function updateStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  function updatePresenceStatus(value: string) {
    setPresenceStatus(value);
    setPage(1);
  }

  function updateSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setStatus("ALL");
    setPresenceStatus("ALL");
    setPage(1);
  }

  const filteredUnits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = units.filter((unit) => {
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

    return filtered.sort((a, b) => {
      const first = sortValue(a, sortKey);
      const second = sortValue(b, sortKey);
      const result =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second), "pt-BR", { numeric: true });

      return sortDirection === "asc" ? result : -result;
    });
  }, [presenceStatus, query, sortDirection, sortKey, status, units]);

  const totalPages = Math.max(1, Math.ceil(filteredUnits.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function SortButton({ children, column }: { children: React.ReactNode; column: SortKey }) {
    const active = sortKey === column;
    const Icon = active ? (sortDirection === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

    return (
      <button
        type="button"
        onClick={() => updateSort(column)}
        className="inline-flex items-center gap-1.5 rounded px-1 py-0.5 transition-colors hover:bg-slate-100 hover:text-navy-950"
      >
        {children}
        <Icon className="h-3.5 w-3.5" />
      </button>
    );
  }

  if (units.length === 0) {
    return <EmptyState message="Nenhuma unidade cadastrada ate o momento." />;
  }

  return (
    <div className="space-y-4">
      <div className="surface-card p-4">
        <div className="space-y-4">
          <DataTableToolbar
            activeFilters={activeFilters}
            onClear={clearFilters}
            onSearchChange={updateQuery}
            placeholder="Buscar por bloco, apartamento, responsavel, telefone ou e-mail"
            resultLabel={`${filteredUnits.length} de ${units.length} unidade(s)`}
            searchValue={query}
          />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[220px_260px_auto]">
          <FilterSelect
            label="Status"
            value={status}
            onChange={updateStatus}
            options={[
              { label: "Todos", value: "ALL" },
              { label: "Ativo", value: "ACTIVE" },
              { label: "Inativo", value: "INACTIVE" },
            ]}
          />
          <FilterSelect
            label="Presenca"
            value={presenceStatus}
            onChange={updatePresenceStatus}
            options={[
              { label: "Todas", value: "ALL" },
              { label: "Em casa", value: "HOME" },
              { label: "Ausente", value: "AWAY" },
              { label: "Nao perturbe", value: "DO_NOT_DISTURB" },
            ]}
          />
          <div className="flex items-end">
            <div className="flex w-full flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>Itens por pagina</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-10 rounded-md border border-input bg-white px-3 text-sm text-navy-950 shadow-sm"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        </div>
      </div>

      {filteredUnits.length === 0 ? (
        <EmptyState message="Nenhuma unidade encontrada com os filtros atuais." />
      ) : (
        <>
        <div className="mobile-list">
          {paginatedUnits.map((unit) => (
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
                <th className="px-4 py-3 font-medium"><SortButton column="block">Bloco</SortButton></th>
                <th className="px-4 py-3 font-medium"><SortButton column="apartment">Apartamento</SortButton></th>
                <th className="px-4 py-3 font-medium"><SortButton column="responsibleName">Responsavel</SortButton></th>
                <th className="px-4 py-3 font-medium">CPF</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium"><SortButton column="status">Status</SortButton></th>
                <th className="px-4 py-3 font-medium"><SortButton column="presenceStatus">Presenca</SortButton></th>
                <th className="px-4 py-3 font-medium"><SortButton column="users">Moradores</SortButton></th>
                <th className="px-4 py-3 font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUnits.map((unit) => (
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
        <div className="surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Pagina {currentPage} de {totalPages} · {filteredUnits.length} registro(s)
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-navy-950 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-45"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-navy-950 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-45"
            >
              Proxima
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
