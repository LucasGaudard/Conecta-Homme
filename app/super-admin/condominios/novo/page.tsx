import { CondominiumForm } from "@/components/super-admin/condominium-form";
import { requireSuperAdmin } from "@/lib/auth/authorization";

type NewCondominiumPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function NewCondominiumPage({
  searchParams,
}: NewCondominiumPageProps) {
  const params = await searchParams;
  await requireSuperAdmin();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Novo condomínio
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Cadastre um condomínio e, se necessário, crie o admin inicial vinculado.
        </p>
      </div>

      <CondominiumForm error={params.error} success={params.success} />
    </div>
  );
}
