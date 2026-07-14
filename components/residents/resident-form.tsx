import type { User } from "@prisma/client";
import { Save } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateResidentAction } from "@/lib/residents/actions";

type ResidentFormProps = {
  error?: string;
  resident: Pick<User, "email" | "id" | "name" | "phone" | "username">;
};

export function ResidentForm({ error, resident }: ResidentFormProps) {
  const action = updateResidentAction.bind(null, resident.id);

  return (
    <form action={action} className="surface-card space-y-5 p-5">
      <FeedbackAlert error={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="field-label">Nome</span>
          <Input name="name" defaultValue={resident.name} required />
        </label>
        <label className="space-y-2">
          <span className="field-label">E-mail</span>
          <Input name="email" type="email" defaultValue={resident.email} required />
        </label>
        <label className="space-y-2">
          <span className="field-label">Telefone</span>
          <Input name="phone" defaultValue={resident.phone ?? ""} placeholder="Opcional" />
        </label>
        <label className="space-y-2">
          <span className="field-label">Username</span>
          <Input name="username" defaultValue={resident.username ?? ""} placeholder="Opcional" />
        </label>
      </div>
      <div className="flex justify-end">
        <SubmitButton pendingLabel="Salvando...">
          <Save className="h-4 w-4" />
          Salvar alterações
        </SubmitButton>
      </div>
    </form>
  );
}
