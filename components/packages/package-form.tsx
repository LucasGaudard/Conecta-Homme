import type { Unit } from "@prisma/client";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPackageAction } from "@/lib/packages/actions";

type PackageFormProps = {
  query: string;
  units: Unit[];
};

export function PackageForm({ query, units }: PackageFormProps) {
  return (
    <form action={createPackageAction} className="surface-card space-y-5 p-5">
      <input type="hidden" name="query" value={query} />
      <div>
        <h3 className="text-base font-semibold text-navy-950">Cadastrar encomenda</h3>
        <p className="mt-1 text-sm text-slate-500">
          Busque a unidade e registre a encomenda recebida na portaria.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="field-label">Unidade</span>
          <select
            name="unitId"
            required
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          >
            <option value="">Selecione uma unidade</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.block}-{unit.apartment} - {unit.responsibleName}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Transportadora</span>
          <Input name="carrier" placeholder="Opcional" />
        </label>
        <label className="space-y-2">
          <span className="field-label">Codigo de rastreio</span>
          <Input name="trackingCode" placeholder="Opcional" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="field-label">Descricao</span>
          <Input name="description" placeholder="Opcional" />
        </label>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={units.length === 0}>
          <PackagePlus className="h-4 w-4" />
          Cadastrar encomenda
        </Button>
      </div>
    </form>
  );
}
