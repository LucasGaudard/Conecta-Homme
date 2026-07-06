import type { Condominium } from "@prisma/client";
import { Building2, Save, UserPlus } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  createCondominiumAction,
  updateCondominiumAction,
} from "@/lib/super-admin/actions";

type CondominiumFormProps = {
  condominium?: Condominium;
  error?: string;
  success?: string;
};

const fieldClass = "space-y-2";
const labelClass = "field-label";
const textareaClass =
  "min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15";

function getDateInputValue(date?: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function CondominiumForm({
  condominium,
  error,
  success,
}: CondominiumFormProps) {
  const editing = Boolean(condominium);
  const action = condominium
    ? updateCondominiumAction.bind(null, condominium.id)
    : createCondominiumAction;

  return (
    <form action={action} className="space-y-6">
      <FeedbackAlert error={error} success={success} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base text-navy-950">
            Dados do condomínio
          </CardTitle>
          <Building2 className="h-5 w-5 text-navy-700" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className={fieldClass}>
            <span className={labelClass}>Nome</span>
            <Input name="name" required defaultValue={condominium?.name ?? ""} />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>Slug</span>
            <Input name="slug" required defaultValue={condominium?.slug ?? ""} placeholder="condominio-demo" />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>Documento</span>
            <Input name="document" defaultValue={condominium?.document ?? ""} />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>Telefone</span>
            <Input name="phone" defaultValue={condominium?.phone ?? ""} />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>E-mail</span>
            <Input name="email" type="email" defaultValue={condominium?.email ?? ""} />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>E-mail de cobrança</span>
            <Input name="billingEmail" type="email" defaultValue={condominium?.billingEmail ?? ""} />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>Horário da portaria</span>
            <Input name="porterHours" defaultValue={condominium?.porterHours ?? ""} />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>Plano</span>
            <Input name="planCode" defaultValue={condominium?.planCode ?? ""} placeholder="starter" />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>URL da logo</span>
            <Input name="logoUrl" type="url" defaultValue={condominium?.logoUrl ?? ""} />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>Fim do trial</span>
            <Input name="trialEndsAt" type="date" defaultValue={getDateInputValue(condominium?.trialEndsAt)} />
          </label>
          {editing ? (
            <label className={fieldClass}>
              <span className={labelClass}>Status</span>
              <select
                name="status"
                defaultValue={condominium?.status ?? "ACTIVE"}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
              >
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
                <option value="SUSPENDED">Suspenso</option>
              </select>
            </label>
          ) : null}
          <label className={`${fieldClass} sm:col-span-2`}>
            <span className={labelClass}>Endereço</span>
            <textarea name="address" defaultValue={condominium?.address ?? ""} className={textareaClass} />
          </label>
        </CardContent>
      </Card>

      {!editing ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base text-navy-950">
              Admin inicial opcional
            </CardTitle>
            <UserPlus className="h-5 w-5 text-navy-700" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <label className={fieldClass}>
              <span className={labelClass}>Nome</span>
              <Input name="adminName" />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>E-mail</span>
              <Input name="adminEmail" type="email" />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Telefone</span>
              <Input name="adminPhone" />
            </label>
            <label className={fieldClass}>
              <span className={labelClass}>Senha inicial</span>
              <Input name="adminPassword" type="password" autoComplete="new-password" />
            </label>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton className="w-full sm:w-auto" pendingLabel="Salvando...">
          {editing ? <Save className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
          {editing ? "Salvar condomínio" : "Criar condomínio"}
        </SubmitButton>
      </div>
    </form>
  );
}
