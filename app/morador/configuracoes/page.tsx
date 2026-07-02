import { AccountSettingsForm } from "@/components/account/account-settings-form";
import { SettingsForm } from "@/components/resident/settings-form";
import { getAccountSettingsData } from "@/lib/account/queries";
import { getResidentSettings } from "@/lib/resident/queries";

type ResidentSettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ResidentSettingsPage({
  searchParams,
}: ResidentSettingsPageProps) {
  const [{ error, success }, user, { unit }] = await Promise.all([
    searchParams,
    getAccountSettingsData(),
    getResidentSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Configuracoes da conta
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Atualize dados da sua conta de acesso e mantenha os contatos da
          unidade organizados para a portaria.
        </p>
      </div>

      <AccountSettingsForm error={error} success={success} user={user} />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">
            Dados da unidade
          </h3>
          <p className="text-sm text-slate-500">
            Bloco, apartamento e perfil nao podem ser alterados pelo morador.
          </p>
        </div>
        <SettingsForm unit={unit} />
      </section>
    </div>
  );
}
