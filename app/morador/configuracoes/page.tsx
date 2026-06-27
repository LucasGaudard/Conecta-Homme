import { SettingsForm } from "@/components/resident/settings-form";
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
  const [{ error, success }, { unit }] = await Promise.all([
    searchParams,
    getResidentSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Configuracoes
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Atualize dados de contato e senha. Bloco, apartamento e perfil nao
          podem ser alterados pelo morador.
        </p>
      </div>

      <SettingsForm unit={unit} error={error} success={success} />
    </div>
  );
}
