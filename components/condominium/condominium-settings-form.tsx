import type { CondominiumSettings } from "@prisma/client";
import { Building2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { CondominiumIdentityCard } from "@/components/condominium/condominium-identity-card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateCondominiumSettingsAction } from "@/lib/condominium/actions";

type CondominiumSettingsFormProps = {
  error?: string;
  settings: CondominiumSettings;
  success?: string;
};

const fieldClass = "space-y-2";
const labelClass = "field-label";

export function CondominiumSettingsForm({
  error,
  settings,
  success,
}: CondominiumSettingsFormProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.35fr]">
      <CondominiumIdentityCard settings={settings} />

      <form
        action={updateCondominiumSettingsAction}
        className="surface-card space-y-5 p-5"
      >
        <FeedbackAlert error={error} success={success} />
        <div>
          <h3 className="text-base font-semibold text-navy-950">
            Dados gerais
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Configure as informacoes institucionais usadas como base
            administrativa do condominio.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={`${fieldClass} sm:col-span-2`}>
            <span className={labelClass}>Nome do condominio</span>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="name"
                defaultValue={settings.name}
                className="pl-10"
                required
              />
            </div>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Telefone</span>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="phone"
                defaultValue={settings.phone ?? ""}
                className="pl-10"
                placeholder="(00) 00000-0000"
              />
            </div>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>E-mail</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="email"
                type="email"
                defaultValue={settings.email ?? ""}
                className="pl-10"
                placeholder="contato@condominio.com"
              />
            </div>
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className={labelClass}>Endereco</span>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <textarea
                name="address"
                defaultValue={settings.address ?? ""}
                className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 pl-10 text-sm text-navy-950 shadow-sm transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
                placeholder="Rua, numero, bairro, cidade e UF"
              />
            </div>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>Horario da portaria</span>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="porterHours"
                defaultValue={settings.porterHours ?? ""}
                className="pl-10"
                placeholder="24 horas"
              />
            </div>
          </label>

          <label className={fieldClass}>
            <span className={labelClass}>URL da logo</span>
            <Input
              name="logoUrl"
              defaultValue={settings.logoUrl ?? ""}
              placeholder="https://..."
            />
          </label>
        </div>

        <div className="flex justify-end">
          <SubmitButton className="w-full sm:w-auto" pendingLabel="Salvando...">
            Salvar condominio
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
