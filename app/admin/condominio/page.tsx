import { CondominiumSettingsForm } from "@/components/condominium/condominium-settings-form";
import { getCondominiumSettings } from "@/lib/condominium/queries";

type AdminCondominiumPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminCondominiumPage({
  searchParams,
}: AdminCondominiumPageProps) {
  const [{ error, success }, settings] = await Promise.all([
    searchParams,
    getCondominiumSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Configuracoes do condominio
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Gerencie dados gerais, contato, horario da portaria e identidade
          visual preparada do condominio.
        </p>
      </div>

      <CondominiumSettingsForm
        error={error}
        settings={settings}
        success={success}
      />
    </div>
  );
}
