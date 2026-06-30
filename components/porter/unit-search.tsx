import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

type UnitSearchProps = {
  defaultValue?: string;
};

export function UnitSearch({ defaultValue = "" }: UnitSearchProps) {
  return (
    <form className="surface-card p-4">
      <label className="field-label" htmlFor="q">
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
        <SubmitButton pendingLabel="Buscando...">Buscar</SubmitButton>
      </div>
    </form>
  );
}
