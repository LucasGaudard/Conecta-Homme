import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { accountRoleLabels } from "@/lib/account/format";
import {
  auditActionLabels,
  auditActions,
  auditModuleLabels,
  auditModules,
} from "@/lib/audit/constants";
import type { AuditFiltersInput } from "@/lib/audit/validation";

type AuditFiltersProps = {
  filters: AuditFiltersInput;
};

export function AuditFilters({ filters }: AuditFiltersProps) {
  const activeFilters = [
    filters.user,
    filters.role,
    filters.action,
    filters.module,
    filters.from,
    filters.to,
  ].filter(Boolean).length;

  return (
    <form className="surface-card space-y-4 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-navy-950">
          Filtros {activeFilters > 0 ? `(${activeFilters} ativo(s))` : ""}
        </p>
        {activeFilters > 0 ? (
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/auditoria">Limpar filtros</Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_160px_170px_170px_150px_150px_auto]">
        <label className="space-y-2">
          <span className="field-label">Usuario</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="user"
              defaultValue={filters.user ?? ""}
              className="pl-10"
              placeholder="Nome ou e-mail"
            />
          </div>
        </label>

        <label className="space-y-2">
          <span className="field-label">Perfil</span>
          <select
            name="role"
            defaultValue={filters.role ?? "ALL"}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          >
            <option value="ALL">Todos</option>
            {Object.entries(accountRoleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="field-label">Acao</span>
          <select
            name="action"
            defaultValue={filters.action ?? "ALL"}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          >
            <option value="ALL">Todas</option>
            {auditActions.map((action) => (
              <option key={action} value={action}>
                {auditActionLabels[action]}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="field-label">Modulo</span>
          <select
            name="module"
            defaultValue={filters.module ?? "ALL"}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          >
            <option value="ALL">Todos</option>
            {auditModules.map((module) => (
              <option key={module} value={module}>
                {auditModuleLabels[module]}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="field-label">De</span>
          <Input name="from" type="date" defaultValue={filters.from ?? ""} />
        </label>

        <label className="space-y-2">
          <span className="field-label">Ate</span>
          <Input name="to" type="date" defaultValue={filters.to ?? ""} />
        </label>

        <div className="flex items-end md:col-span-2 xl:col-span-1">
          <SubmitButton className="w-full" pendingLabel="Filtrando...">
            Filtrar
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
