import { AccountSettingsForm } from "@/components/account/account-settings-form";
import { getAccountSettingsData } from "@/lib/account/queries";

type AdminAccountSettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminAccountSettingsPage({
  searchParams,
}: AdminAccountSettingsPageProps) {
  const [{ error, success }, user] = await Promise.all([
    searchParams,
    getAccountSettingsData(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Configuracoes da conta
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Gerencie dados pessoais, contato, senha e identificacao do seu acesso
          administrativo.
        </p>
      </div>

      <AccountSettingsForm error={error} success={success} user={user} />
    </div>
  );
}
