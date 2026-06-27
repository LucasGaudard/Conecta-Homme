import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerManualAccessAction } from "@/lib/porter/actions";

type AccessActionFormProps = {
  query: string;
  unitId: string;
};

export function AccessActionForm({ query, unitId }: AccessActionFormProps) {
  return (
    <form action={registerManualAccessAction} className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
      <input type="hidden" name="unitId" value={unitId} />
      <input type="hidden" name="query" value={query} />
      <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-navy-950">Tipo</span>
          <select
            name="accessType"
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ENTRY">Entrada</option>
            <option value="EXIT">Saida</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-navy-950">Observacao</span>
          <Input name="notes" placeholder="Opcional" />
        </label>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" name="accessType" value="ENTRY" className="flex-1">
          <LogIn className="h-4 w-4" />
          Registrar entrada
        </Button>
        <Button type="submit" name="accessType" value="EXIT" variant="outline" className="flex-1">
          <LogOut className="h-4 w-4" />
          Registrar saida
        </Button>
      </div>
    </form>
  );
}
