import Link from "next/link";
import { ArrowLeft, Building2, Mail, Pencil, Phone, User } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { ResidentStatusForm } from "@/components/residents/resident-status-form";
import { Button } from "@/components/ui/button";
import { maskCpf } from "@/lib/units/format";
import { getResidentById } from "@/lib/residents/queries";

type ResidentDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function ResidentDetailsPage({
  params,
  searchParams,
}: ResidentDetailsPageProps) {
  const [{ id }, feedback] = await Promise.all([params, searchParams]);
  const resident = await getResidentById(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
              {resident.name}
            </h2>
            <StatusBadge status={resident.status} type="user" />
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Dados do morador e unidade vinculada no seu condomínio.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/admin/moradores">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/moradores/${resident.id}/editar`}>
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <FeedbackAlert error={feedback.error} success={feedback.success} />

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <SectionCard title="Dados do morador" icon={<User className="h-4 w-4" />}>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="info-tile">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                E-mail
              </dt>
              <dd className="mt-1 break-words text-sm text-navy-950">{resident.email}</dd>
            </div>
            <div className="info-tile">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
                <Phone className="h-3.5 w-3.5" />
                Telefone
              </dt>
              <dd className="mt-1 text-sm text-navy-950">
                {resident.phone ?? "Não informado"}
              </dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Username</dt>
              <dd className="mt-1 text-sm text-navy-950">
                {resident.username ?? "Não informado"}
              </dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Criado em</dt>
              <dd className="mt-1 text-sm text-navy-950">
                {resident.createdAt.toLocaleDateString("pt-BR")}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Unidade vinculada" icon={<Building2 className="h-4 w-4" />}>
          {resident.unit ? (
            <dl className="grid gap-4">
              <div className="info-tile">
                <dt className="text-xs font-medium uppercase text-slate-400">Unidade</dt>
                <dd className="mt-1 text-sm font-medium text-navy-950">
                  <Link
                    className="text-navy-700 underline-offset-4 hover:underline"
                    href={`/admin/unidades/${resident.unit.id}`}
                  >
                    {resident.unit.block}-{resident.unit.apartment}
                  </Link>
                </dd>
              </div>
              <div className="info-tile">
                <dt className="text-xs font-medium uppercase text-slate-400">Responsável</dt>
                <dd className="mt-1 text-sm text-navy-950">{resident.unit.responsibleName}</dd>
              </div>
              <div className="info-tile">
                <dt className="text-xs font-medium uppercase text-slate-400">CPF</dt>
                <dd className="mt-1 text-sm text-navy-950">{maskCpf(resident.unit.cpf)}</dd>
              </div>
              <div className="info-tile">
                <dt className="text-xs font-medium uppercase text-slate-400">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={resident.unit.status} type="unit" />
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-500">Morador sem unidade vinculada.</p>
          )}
        </SectionCard>
      </section>

      <div className="flex justify-end">
        <ResidentStatusForm residentId={resident.id} status={resident.status} />
      </div>
    </div>
  );
}
