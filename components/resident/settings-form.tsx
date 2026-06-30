import type { Unit } from "@prisma/client";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateResidentSettingsAction } from "@/lib/resident/actions";

type SettingsFormProps = {
  error?: string;
  success?: string;
  unit: Unit;
};

const fieldClass = "space-y-2";
const labelClass = "field-label";

export function SettingsForm({ error, success, unit }: SettingsFormProps) {
  return (
    <form action={updateResidentSettingsAction} className="surface-card space-y-5 p-5">
      <FeedbackAlert error={error} success={success} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="block">Bloco</label>
          <Input id="block" value={unit.block} disabled />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="apartment">Apartamento</label>
          <Input id="apartment" value={unit.apartment} disabled />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="responsibleName">Nome responsavel</label>
          <Input id="responsibleName" name="responsibleName" defaultValue={unit.responsibleName} required />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="phone">Telefone</label>
          <Input id="phone" name="phone" defaultValue={unit.phone ?? ""} />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" defaultValue={unit.email ?? ""} />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="password">Nova senha</label>
          <Input id="password" name="password" type="password" placeholder="Deixe em branco para manter" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Salvar configuracoes</Button>
      </div>
    </form>
  );
}
