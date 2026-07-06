import { CondominiumForm } from "@/components/super-admin/condominium-form";
import { getCondominiumById } from "@/lib/super-admin/queries";

type EditCondominiumPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditCondominiumPage({
  params,
  searchParams,
}: EditCondominiumPageProps) {
  const [{ id }, feedback] = await Promise.all([params, searchParams]);
  const { condominium } = await getCondominiumById(id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Editar condomínio
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Atualize dados operacionais, status e informações de plano.
        </p>
      </div>

      <CondominiumForm
        condominium={condominium}
        error={feedback.error}
        success={feedback.success}
      />
    </div>
  );
}
