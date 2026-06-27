import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UnitSearchProps = {
  defaultValue?: string;
};

export function UnitSearch({ defaultValue = "" }: UnitSearchProps) {
  return (
    <form className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="text-sm font-medium text-navy-950" htmlFor="q">
        Busca rapida de unidade
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="q"
            name="q"
            defaultValue={defaultValue}
            className="pl-10"
            placeholder="Bloco, apartamento, responsavel, telefone ou e-mail"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </div>
    </form>
  );
}
