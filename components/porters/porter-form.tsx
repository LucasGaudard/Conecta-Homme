import type { User } from "@prisma/client";
import { Save } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  createPorterAction,
  updatePorterAction,
} from "@/lib/porters/actions";

type PorterFormProps = {
  error?: string;
  mode: "create" | "edit";
  porter?: Pick<User, "email" | "id" | "name" | "phone" | "porterShiftDescription">;
};

const labelClass = "field-label";

export function PorterForm({ error, mode, porter }: PorterFormProps) {
  const action =
    mode === "edit" && porter
      ? updatePorterAction.bind(null, porter.id)
      : createPorterAction;

  return (
    <form action={action} className="surface-card space-y-5 p-5">
      <FeedbackAlert error={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className={labelClass}>Nome</span>
          <Input name="name" defaultValue={porter?.name ?? ""} required />
        </label>
        <label className="space-y-2">
          <span className={labelClass}>E-mail</span>
          <Input
            name="email"
            type="email"
            defaultValue={porter?.email ?? ""}
            required
          />
        </label>
        <label className="space-y-2">
          <span className={labelClass}>Telefone</span>
          <Input name="phone" defaultValue={porter?.phone ?? ""} placeholder="Opcional" />
        </label>
        {mode === "create" ? (
          <label className="space-y-2">
            <span className={labelClass}>Senha inicial</span>
            <Input name="password" type="password" minLength={6} required />
          </label>
        ) : null}
        <label className="space-y-2 sm:col-span-2">
          <span className={labelClass}>Turno ou horário</span>
          <Input
            name="porterShiftDescription"
            defaultValue={porter?.porterShiftDescription ?? ""}
            placeholder="Ex.: Manhã - 06h às 14h"
          />
        </label>
      </div>
      <div className="flex justify-end">
        <SubmitButton pendingLabel="Salvando...">
          <Save className="h-4 w-4" />
          {mode === "create" ? "Cadastrar porteiro" : "Salvar alterações"}
        </SubmitButton>
      </div>
    </form>
  );
}
