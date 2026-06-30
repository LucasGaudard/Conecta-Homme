import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

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
    <form className="surface-card p-4">
      <div className={mode === "admin" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_180px_160px_160px_auto]" : "grid gap-4 sm:grid-cols-[1fr_auto]"}>
        <label className="space-y-2">
          <span className="field-label">
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
              <span className="field-label">Status</span>
              <select
                name="status"
                defaultValue={defaultStatus}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
              >
                <option value="ALL">Todos</option>
                <option value="WAITING_PICKUP">Aguardando</option>
                <option value="DELIVERED">Entregue</option>
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
          </>
        ) : null}
        <div className="flex items-end md:col-span-2 lg:col-span-1">
          <SubmitButton className="w-full" pendingLabel="Filtrando...">
            Filtrar
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
