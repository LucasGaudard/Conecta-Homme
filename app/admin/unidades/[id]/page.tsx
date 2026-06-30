import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  History,
  Mail,
  Package,
  Pencil,
  Phone,
  UserCheck,
  Users,
} from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { InfoCard } from "@/components/admin/info-card";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { RecentList } from "@/components/dashboard/recent-list";
import { Button } from "@/components/ui/button";
import {
  formatDateTime,
  maskCpf,
} from "@/lib/units/format";
import { getUnitById } from "@/lib/units/queries";

type UnitDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function UnitDetailPage({
  params,
  searchParams,
}: UnitDetailPageProps) {
  const [{ id }, { error, success }] = await Promise.all([params, searchParams]);
  const unit = await getUnitById(id);

  if (!unit) {
    notFound();
  }

  const accessItems = unit.accessLogs.map((access) => ({
    description: [
      access.user?.name ?? access.visitor?.name ?? "Pessoa nao identificada",
      access.porter?.name ? `Portaria: ${access.porter.name}` : null,
      access.accessMethod === "QR_CODE" ? "QR Code" : "Manual",
    ]
      .filter(Boolean)
      .join(" - "),
    id: access.id,
    meta: formatDateTime(access.occurredAt),
    title: access.accessType === "ENTRY" ? "Entrada registrada" : "Saida registrada",
  }));
  const packageItems = unit.packages.map((item) => ({
    description: [
      item.carrier ? `Transportadora: ${item.carrier}` : null,
      item.trackingCode ? `Codigo: ${item.trackingCode}` : null,
      `Status: ${item.status === "WAITING_PICKUP" ? "Aguardando retirada" : "Entregue"}`,
    ]
      .filter(Boolean)
      .join(" - "),
    id: item.id,
    meta: formatDateTime(item.createdAt),
    title: item.description ?? "Encomenda sem descricao",
  }));
  const visitorItems = unit.visitAuthorizations.map((authorization) => ({
    description: [
      `Autorizado por ${authorization.authorizedBy.name}`,
      `Status: ${authorization.status}`,
    ].join(" - "),
    id: authorization.id,
    meta: formatDateTime(authorization.createdAt),
    title: authorization.visitor.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
              Unidade {unit.block}-{unit.apartment}
            </h2>
            <StatusBadge status={unit.status} type="unit" />
            <StatusBadge status={unit.presenceStatus} type="presence" />
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Painel completo da unidade com dados administrativos, moradores
            vinculados e atividades recentes.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/unidades">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/unidades/${unit.id}/editar`}>
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <FeedbackAlert error={error} success={success} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          title="Moradores"
          value={unit._count.users}
          description="Usuarios residentes vinculados."
          icon={Users}
        />
        <InfoCard
          title="Visitantes recentes"
          value={unit.visitAuthorizations.length}
          description="Ultimas autorizacoes exibidas."
          icon={UserCheck}
        />
        <InfoCard
          title="Encomendas pendentes"
          value={unit._count.packages}
          description="Aguardando retirada."
          icon={Package}
        />
        <InfoCard
          title="Acessos recentes"
          value={unit.accessLogs.length}
          description="Ultimos registros exibidos."
          icon={History}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <SectionCard title="Dados principais" icon={<Building2 className="h-4 w-4" />}>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Bloco</dt>
              <dd className="mt-1 text-sm font-medium text-navy-950">{unit.block}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Apartamento</dt>
              <dd className="mt-1 text-sm font-medium text-navy-950">{unit.apartment}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Responsavel</dt>
              <dd className="mt-1 text-sm text-navy-950">{unit.responsibleName}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">CPF</dt>
              <dd className="mt-1 text-sm text-navy-950">{maskCpf(unit.cpf)}</dd>
            </div>
            <div className="info-tile">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
                <Phone className="h-3.5 w-3.5" />
                Telefone
              </dt>
              <dd className="mt-1 text-sm text-navy-950">{unit.phone ?? "Nao informado"}</dd>
            </div>
            <div className="info-tile">
              <dt className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                E-mail
              </dt>
              <dd className="mt-1 break-words text-sm text-navy-950">{unit.email ?? "Nao informado"}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Moradores vinculados" icon={<Users className="h-4 w-4" />}>
          {unit.users.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhum morador vinculado.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {unit.users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-950">{user.name}</p>
                    <p className="truncate text-sm text-slate-500">{user.email}</p>
                    {user.username ? (
                      <p className="truncate text-xs text-slate-400">@{user.username}</p>
                    ) : null}
                  </div>
                  <StatusBadge status={user.status} type="user" />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <RecentList
          title="Visitantes recentes"
          emptyMessage="Nenhum visitante autorizado para esta unidade."
          items={visitorItems}
          icon={<UserCheck className="h-4 w-4" />}
        />
        <RecentList
          title="Encomendas recentes"
          emptyMessage="Nenhuma encomenda registrada para esta unidade."
          items={packageItems}
          icon={<Package className="h-4 w-4" />}
        />
        <RecentList
          title="Ultimos acessos"
          emptyMessage="Nenhum acesso registrado para esta unidade."
          items={accessItems}
          icon={<History className="h-4 w-4" />}
        />
      </section>
    </div>
  );
}
