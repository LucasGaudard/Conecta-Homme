import { UserPlus } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createVisitorAuthorizationAction } from "@/lib/resident/actions";

type VisitorFormProps = {
  error?: string;
  success?: string;
};

const fieldClass = "space-y-2";
const labelClass = "text-sm font-medium text-navy-950";

export function VisitorForm({ error, success }: VisitorFormProps) {
  return (
    <form action={createVisitorAuthorizationAction} className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-navy-950">Cadastrar visitante</h3>
        <p className="mt-1 text-sm text-slate-500">
          Autorize um visitante para sua propria unidade. QR Code sera adicionado em etapa futura.
        </p>
      </div>
      <FeedbackAlert error={error} success={success} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="name">Nome</label>
          <Input id="name" name="name" required placeholder="Nome do visitante" />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="document">Documento</label>
          <Input id="document" name="document" placeholder="Opcional" />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="phone">Telefone</label>
          <Input id="phone" name="phone" placeholder="Opcional" />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="date">Data</label>
          <Input id="date" name="date" type="date" required />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="startTime">Hora inicial</label>
          <Input id="startTime" name="startTime" type="time" required />
        </div>
        <div className={fieldClass}>
          <label className={labelClass} htmlFor="endTime">Hora final</label>
          <Input id="endTime" name="endTime" type="time" required />
        </div>
        <div className={`${fieldClass} md:col-span-2`}>
          <label className={labelClass} htmlFor="notes">Observacao</label>
          <Input id="notes" name="notes" placeholder="Opcional" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">
          <UserPlus className="h-4 w-4" />
          Autorizar visitante
        </Button>
      </div>
    </form>
  );
}
