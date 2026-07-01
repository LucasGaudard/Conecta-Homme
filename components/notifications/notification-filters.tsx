import Link from "next/link";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  notificationStatusLabels,
  notificationTypeLabels,
} from "@/lib/notifications/format";
import type {
  NotificationStatusFilter,
  NotificationTypeFilter,
} from "@/lib/notifications/validation";

type NotificationFiltersProps = {
  route: string;
  status: NotificationStatusFilter;
  type: NotificationTypeFilter;
};

export function NotificationFilters({
  route,
  status,
  type,
}: NotificationFiltersProps) {
  const activeFilters = [status !== "ALL", type !== "ALL"].filter(Boolean).length;

  return (
    <form className="surface-card space-y-4 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy-50 text-navy-900">
            <Filter className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium text-navy-950">
            Filtros {activeFilters > 0 ? `(${activeFilters} ativo(s))` : ""}
          </p>
        </div>
        {activeFilters > 0 ? (
          <Button asChild variant="outline" size="sm">
            <Link href={route}>Limpar filtros</Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <label className="space-y-2">
          <span className="field-label">Tipo</span>
          <select
            name="type"
            defaultValue={type}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          >
            <option value="ALL">Todos</option>
            {Object.entries(notificationTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="field-label">Status</span>
          <select
            name="status"
            defaultValue={status}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          >
            <option value="ALL">Todos</option>
            {Object.entries(notificationStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <SubmitButton className="w-full" pendingLabel="Filtrando...">
            Filtrar
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
