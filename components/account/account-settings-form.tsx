import type { UserRole } from "@prisma/client";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { AccountAvatarCard } from "@/components/account/account-avatar-card";
import { AccountInfoCard } from "@/components/account/account-info-card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateAccountAction } from "@/lib/account/actions";

type AccountSettingsFormProps = {
  error?: string;
  success?: string;
  user: {
    createdAt: Date;
    email: string;
    name: string;
    phone?: string | null;
    role: UserRole;
    username?: string | null;
  };
};

const fieldClass = "space-y-2";
const labelClass = "field-label";

export function AccountSettingsForm({
  error,
  success,
  user,
}: AccountSettingsFormProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
      <div className="space-y-4">
        <AccountAvatarCard name={user.name} />
        <AccountInfoCard
          createdAt={user.createdAt}
          email={user.email}
          role={user.role}
          username={user.username}
        />
      </div>

      <form action={updateAccountAction} className="surface-card space-y-5 p-5">
        <FeedbackAlert error={error} success={success} />
        <div>
          <h3 className="text-base font-semibold text-navy-950">
            Dados pessoais
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Atualize nome, contato e senha usados na sua conta de acesso.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="name">
              Nome
            </label>
            <Input id="name" name="name" defaultValue={user.name} required />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="phone">
              Telefone
            </label>
            <Input id="phone" name="phone" defaultValue={user.phone ?? ""} />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="email">
              E-mail
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="password">
              Nova senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Deixe em branco para manter"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton className="w-full sm:w-auto" pendingLabel="Salvando...">
            Salvar conta
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
