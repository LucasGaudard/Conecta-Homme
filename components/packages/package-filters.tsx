import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PackageFiltersProps = {
  defaultFrom?: string;
  defaultQuery?: string;
  defaultStatus?: string;
  defaultTo?: string;
  mode: "admin" | "porter";
};

export function PackageFilters({
  defaultFrom = "",
  defaultQuery = "",
  defaultStatus = "ALL",
  defaultTo = "",
  mode,
}: PackageFiltersProps) {
  return (
    <form className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={mode === "admin" ? "grid gap-4 lg:grid-cols-[1fr_180px_160px_160px_auto]" : "grid gap-4 lg:grid-cols-[1fr_auto]"}>
        <label className="space-y-2">
          <span className="text-sm font-medium text-navy-950">
            {mode === "porter" ? "Buscar unidade" : "Unidade ou responsavel"}
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="q"
              defaultValue={defaultQuery}
              className="pl-10"
              placeholder="Bloco, apartamento, responsavel, telefone ou e-mail"
            />
          </div>
        </label>
        {mode === "admin" ? (
          <>
            <label className="space-y-2">
              <span className="text-sm font-medium text-navy-950">Status</span>
              <select
                name="status"
                defaultValue={defaultStatus}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ALL">Todos</option>
                <option value="WAITING_PICKUP">Aguardando</option>
                <option value="DELIVERED">Entregue</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-navy-950">De</span>
              <Input name="from" type="date" defaultValue={defaultFrom} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-navy-950">Ate</span>
              <Input name="to" type="date" defaultValue={defaultTo} />
            </label>
          </>
        ) : null}
        <div className="flex items-end">
          <Button type="submit" className="w-full">Filtrar</Button>
        </div>
      </div>
    </form>
  );
}
