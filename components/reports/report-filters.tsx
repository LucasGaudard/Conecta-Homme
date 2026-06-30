import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ReportFilters } from "@/lib/reports/validation";

type ReportFiltersProps = {
  filters: ReportFilters;
};

export function ReportFilters({ filters }: ReportFiltersProps) {
  return (
    <form className="surface-card p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1fr_150px_150px_160px_160px_170px_170px_auto]">
        <label className="space-y-2">
          <span className="field-label">Unidade</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="q"
              defaultValue={filters.q}
              className="pl-10"
              placeholder="Bloco, apto ou responsavel"
            />
          </div>
        </label>
        <label className="space-y-2">
          <span className="field-label">De</span>
          <Input name="from" type="date" defaultValue={filters.from} />
        </label>
        <label className="space-y-2">
          <span className="field-label">Ate</span>
          <Input name="to" type="date" defaultValue={filters.to} />
        </label>
        <label className="space-y-2">
          <span className="field-label">Tipo acesso</span>
          <select name="accessType" defaultValue={filters.accessType ?? "ALL"} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15">
            <option value="ALL">Todos</option>
            <option value="ENTRY">Entrada</option>
            <option value="EXIT">Saida</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Metodo</span>
          <select name="accessMethod" defaultValue={filters.accessMethod ?? "ALL"} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15">
            <option value="ALL">Todos</option>
            <option value="MANUAL">Manual</option>
            <option value="QR_CODE">QR Code</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Encomendas</span>
          <select name="packageStatus" defaultValue={filters.packageStatus ?? "ALL"} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15">
            <option value="ALL">Todas</option>
            <option value="WAITING_PICKUP">Aguardando</option>
            <option value="DELIVERED">Entregues</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Visitantes</span>
          <select name="visitorStatus" defaultValue={filters.visitorStatus ?? "ALL"} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15">
            <option value="ALL">Todos</option>
            <option value="AUTHORIZED">Autorizados</option>
            <option value="EXPIRED">Expirados</option>
            <option value="USED">Utilizados</option>
            <option value="CANCELED">Cancelados</option>
          </select>
        </label>
        <div className="flex items-end md:col-span-2 lg:col-span-4 xl:col-span-1">
          <SubmitButton className="w-full" pendingLabel="Filtrando...">
            Filtrar
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
