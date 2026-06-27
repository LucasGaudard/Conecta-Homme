import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReportFilters } from "@/lib/reports/validation";

type ReportFiltersProps = {
  filters: ReportFilters;
};

export function ReportFilters({ filters }: ReportFiltersProps) {
  return (
    <form className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[1fr_150px_150px_160px_160px_170px_170px_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-navy-950">Unidade</span>
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
          <span className="text-sm font-medium text-navy-950">De</span>
          <Input name="from" type="date" defaultValue={filters.from} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-navy-950">Ate</span>
          <Input name="to" type="date" defaultValue={filters.to} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-navy-950">Tipo acesso</span>
          <select name="accessType" defaultValue={filters.accessType ?? "ALL"} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm">
            <option value="ALL">Todos</option>
            <option value="ENTRY">Entrada</option>
            <option value="EXIT">Saida</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-navy-950">Metodo</span>
          <select name="accessMethod" defaultValue={filters.accessMethod ?? "ALL"} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm">
            <option value="ALL">Todos</option>
            <option value="MANUAL">Manual</option>
            <option value="QR_CODE">QR Code</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-navy-950">Encomendas</span>
          <select name="packageStatus" defaultValue={filters.packageStatus ?? "ALL"} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm">
            <option value="ALL">Todas</option>
            <option value="WAITING_PICKUP">Aguardando</option>
            <option value="DELIVERED">Entregues</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-navy-950">Visitantes</span>
          <select name="visitorStatus" defaultValue={filters.visitorStatus ?? "ALL"} className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm">
            <option value="ALL">Todos</option>
            <option value="AUTHORIZED">Autorizados</option>
            <option value="EXPIRED">Expirados</option>
            <option value="USED">Utilizados</option>
            <option value="CANCELED">Cancelados</option>
          </select>
        </label>
        <div className="flex items-end">
          <Button type="submit" className="w-full">Filtrar</Button>
        </div>
      </div>
    </form>
  );
}
