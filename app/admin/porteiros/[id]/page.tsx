import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { StatusBadge } from "@/components/admin/status-badge";
import { PorterPasswordResetForm } from "@/components/porters/porter-password-reset-form";
import { PorterStatusForm } from "@/components/porters/porter-status-form";
import { Button } from "@/components/ui/button";
import { getPorterById } from "@/lib/porters/queries";

type PorterDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function PorterDetailsPage({
  params,
  searchParams,
}: PorterDetailsPageProps) {
  const [{ id }, feedback] = await Promise.all([params, searchParams]);
  const porter = await getPorterById(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            {porter.name}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Dados operacionais do porteiro vinculado a este condomínio.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/admin/porteiros">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/porteiros/${porter.id}/editar`}>
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <FeedbackAlert error={feedback.error} success={feedback.success} />

      <section className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <p className="field-label">E-mail</p>
          <p className="mt-1 text-sm text-navy-950">{porter.email}</p>
        </div>
        <div>
          <p className="field-label">Telefone</p>
          <p className="mt-1 text-sm text-navy-950">{porter.phone ?? "Não informado"}</p>
        </div>
        <div>
          <p className="field-label">Turno ou horário</p>
          <p className="mt-1 text-sm text-navy-950">
            {porter.porterShiftDescription ?? "Não informado"}
          </p>
        </div>
        <div>
          <p className="field-label">Status</p>
          <div className="mt-1">
            <StatusBadge status={porter.status} type="user" />
          </div>
        </div>
        <div>
          <p className="field-label">Criado em</p>
          <p className="mt-1 text-sm text-navy-950">
            {porter.createdAt.toLocaleDateString("pt-BR")}
          </p>
        </div>
      </section>

      <div className="flex justify-end">
        <PorterStatusForm porterId={porter.id} status={porter.status} />
      </div>

      <PorterPasswordResetForm porterId={porter.id} />
    </div>
  );
}
