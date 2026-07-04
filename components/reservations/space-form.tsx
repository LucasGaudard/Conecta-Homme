import type { LeisureSpace } from "@prisma/client";
import { MapPin, Save } from "lucide-react";
import { createLeisureSpaceAction, updateLeisureSpaceAction } from "@/lib/reservations/actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

type SpaceFormProps = {
  compact?: boolean;
  space?: LeisureSpace;
};

const fieldClass = "space-y-2";
const labelClass = "field-label";
const textareaClass =
  "min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15";

export function SpaceForm({ compact = false, space }: SpaceFormProps) {
  const action = space ? updateLeisureSpaceAction.bind(null, space.id) : createLeisureSpaceAction;

  return (
    <form action={action} className={compact ? "space-y-4" : "surface-card space-y-5 p-5"}>
      {!compact ? (
        <div>
          <h3 className="text-base font-semibold text-navy-950">Cadastrar espaco</h3>
          <p className="mt-1 text-sm text-slate-500">
            Crie areas reservaveis como salao de festas, churrasqueira ou quadra.
          </p>
        </div>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={fieldClass}>
          <span className={labelClass}>Nome</span>
          <Input name="name" defaultValue={space?.name} required placeholder="Salao de festas" />
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>Localizacao</span>
          <Input name="location" defaultValue={space?.location ?? ""} placeholder="Terreo, bloco A" />
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>Capacidade</span>
          <Input name="capacity" type="number" min="1" defaultValue={space?.capacity ?? ""} placeholder="40" />
        </label>
        {space ? (
          <label className={fieldClass}>
            <span className={labelClass}>Status</span>
            <select
              name="status"
              defaultValue={space.status}
              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </label>
        ) : null}
        <label className={`${fieldClass} sm:col-span-2`}>
          <span className={labelClass}>Descricao</span>
          <textarea name="description" defaultValue={space?.description ?? ""} className={textareaClass} placeholder="Resumo do espaco e estrutura disponivel." />
        </label>
        <label className={`${fieldClass} sm:col-span-2`}>
          <span className={labelClass}>Regras</span>
          <textarea name="rules" defaultValue={space?.rules ?? ""} className={textareaClass} placeholder="Regras de uso, limites e orientacoes." />
        </label>
      </div>
      <div className="flex justify-end">
        <SubmitButton className="w-full sm:w-auto" pendingLabel="Salvando...">
          {space ? <Save className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
          {space ? "Salvar espaco" : "Cadastrar espaco"}
        </SubmitButton>
      </div>
    </form>
  );
}
