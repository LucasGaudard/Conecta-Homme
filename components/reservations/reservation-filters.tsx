import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatUnitLabel } from "@/lib/reservations/format";

type ReservationFiltersProps = {
  defaultFrom?: string;
  defaultQuery?: string;
  defaultSpaceId?: string;
  defaultStatus?: string;
  defaultTo?: string;
  defaultUnitId?: string;
  spaces: { id: string; name: string }[];
  units: { apartment: string; block: string; id: string; responsibleName: string }[];
};

export function ReservationFilters({
  defaultFrom = "",
  defaultQuery = "",
  defaultSpaceId = "",
  defaultStatus = "ALL",
  defaultTo = "",
  defaultUnitId = "",
  spaces,
  units,
}: ReservationFiltersProps) {
  const activeFilters = [
    defaultQuery.trim().length > 0,
    defaultSpaceId.length > 0,
    defaultStatus !== "ALL",
    defaultUnitId.length > 0,
    defaultFrom.length > 0,
    defaultTo.length > 0,
  ].filter(Boolean).length;

  return (
    <form className="surface-card space-y-4 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-navy-950">
          Filtros {activeFilters > 0 ? `(${activeFilters} ativo(s))` : ""}
        </p>
        {activeFilters > 0 ? (
          <Button asChild variant="outline" size="sm">
            <Link href="?">Limpar filtros</Link>
          </Button>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_180px_180px_180px_150px_150px_auto]">
        <label className="space-y-2">
          <span className="field-label">Buscar</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input name="q" defaultValue={defaultQuery} className="pl-10" placeholder="Espaco, unidade ou responsavel" />
          </div>
        </label>
        <label className="space-y-2">
          <span className="field-label">Espaco</span>
          <select name="spaceId" defaultValue={defaultSpaceId} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15">
            <option value="">Todos</option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>{space.name}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Status</span>
          <select name="status" defaultValue={defaultStatus} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15">
            <option value="ALL">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="APPROVED">Aprovada</option>
            <option value="REJECTED">Recusada</option>
            <option value="CANCELED">Cancelada</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Unidade</span>
          <select name="unitId" defaultValue={defaultUnitId} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15">
            <option value="">Todas</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {formatUnitLabel(unit)} - {unit.responsibleName}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="field-label">De</span>
          <Input name="from" type="date" defaultValue={defaultFrom} />
        </label>
        <label className="space-y-2">
          <span className="field-label">Ate</span>
          <Input name="to" type="date" defaultValue={defaultTo} />
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
