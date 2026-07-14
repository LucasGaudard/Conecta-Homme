import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { ResidentTable } from "@/components/residents/resident-table";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { getResidents } from "@/lib/residents/queries";

type AdminResidentsPageProps = {
  searchParams: Promise<{
    error?: string;
    q?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminResidentsPage({
  searchParams,
}: AdminResidentsPageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const residents = await getResidents(q);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Moradores
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Consulte moradores vinculados às unidades do seu condomínio. A criação
          principal continua no cadastro de unidades.
        </p>
      </div>

      <FeedbackAlert error={params.error} success={params.success} />

      <form className="surface-card grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome, e-mail, telefone, bloco ou apartamento"
        />
        <SubmitButton pendingLabel="Buscando...">Buscar</SubmitButton>
      </form>

      <ResidentTable residents={residents} />
    </div>
  );
}
