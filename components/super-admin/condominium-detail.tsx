import type { AuditLog, Condominium, User, UserRole } from "@prisma/client";
import Link from "next/link";
import { Building2, Clock, Pencil, Users } from "lucide-react";
import { SectionCard } from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { CondominiumStatusBadge } from "@/components/super-admin/condominium-status-badge";
import {
  formatCondominiumDate,
  formatNullable,
} from "@/lib/super-admin/format";

type SafeUser = Pick<User, "email" | "id" | "name" | "phone" | "role" | "status">;

type CondominiumDetailProps = {
  auditLogs: AuditLog[];
  condominium: Condominium;
  unitCount: number;
  users: {
    admins: SafeUser[];
    porters: SafeUser[];
    residents: SafeUser[];
  };
};

const roleLabels: Record<Exclude<UserRole, "SUPER_ADMIN">, string> = {
  ADMIN: "Admins",
  PORTER: "Porteiros",
  RESIDENT: "Moradores",
};

function UserList({ items, role }: { items: SafeUser[]; role: Exclude<UserRole, "SUPER_ADMIN"> }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">Nenhum registro encontrado.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-md border border-slate-200/70 bg-slate-50/70 p-3">
          <p className="text-sm font-medium text-navy-950">{item.name}</p>
          <p className="mt-1 text-xs text-slate-500">{item.email}</p>
          <p className="mt-1 text-xs text-slate-400">
            {roleLabels[role]} · {item.status}
            {item.phone ? ` · ${item.phone}` : ""}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CondominiumDetail({
  auditLogs,
  condominium,
  unitCount,
  users,
}: CondominiumDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            {condominium.name}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Dados seguros disponíveis para a gestão da plataforma.
          </p>
        </div>
        <Button asChild>
          <Link href={`/super-admin/condominios/${condominium.id}/editar`}>
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Dados gerais" icon={<Building2 className="h-5 w-5" />}>
          <dl className="grid gap-3 text-sm">
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Status</dt>
              <dd className="mt-1"><CondominiumStatusBadge status={condominium.status} /></dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Slug</dt>
              <dd className="mt-1 text-slate-700">{condominium.slug}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Documento</dt>
              <dd className="mt-1 text-slate-700">{formatNullable(condominium.document)}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Telefone</dt>
              <dd className="mt-1 text-slate-700">{formatNullable(condominium.phone)}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">E-mail</dt>
              <dd className="mt-1 text-slate-700">{formatNullable(condominium.email)}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Plano e operação" icon={<Clock className="h-5 w-5" />}>
          <dl className="grid gap-3 text-sm">
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Plano</dt>
              <dd className="mt-1 text-slate-700">{formatNullable(condominium.planCode)}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">E-mail de cobrança</dt>
              <dd className="mt-1 text-slate-700">{formatNullable(condominium.billingEmail)}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Trial até</dt>
              <dd className="mt-1 text-slate-700">{formatCondominiumDate(condominium.trialEndsAt)}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Horário da portaria</dt>
              <dd className="mt-1 text-slate-700">{formatNullable(condominium.porterHours)}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Criado em</dt>
              <dd className="mt-1 text-slate-700">{formatCondominiumDate(condominium.createdAt)}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Resumo vinculado" icon={<Users className="h-5 w-5" />}>
          <dl className="grid gap-3 text-sm">
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Admins</dt>
              <dd className="mt-1 text-2xl font-semibold text-navy-950">{users.admins.length}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Porteiros</dt>
              <dd className="mt-1 text-2xl font-semibold text-navy-950">{users.porters.length}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Moradores</dt>
              <dd className="mt-1 text-2xl font-semibold text-navy-950">{users.residents.length}</dd>
            </div>
            <div className="info-tile">
              <dt className="text-xs font-medium uppercase text-slate-400">Unidades vinculadas</dt>
              <dd className="mt-1 text-2xl font-semibold text-navy-950">{unitCount}</dd>
            </div>
          </dl>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Admins vinculados">
          <UserList items={users.admins} role="ADMIN" />
        </SectionCard>
        <SectionCard title="Porteiros vinculados">
          <UserList items={users.porters} role="PORTER" />
        </SectionCard>
        <SectionCard title="Moradores vinculados">
          <UserList items={users.residents} role="RESIDENT" />
        </SectionCard>
      </div>

      <SectionCard title="Últimas atividades">
        {auditLogs.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhuma atividade segura encontrada para este condomínio.
          </p>
        ) : (
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <article key={log.id} className="rounded-md border border-slate-200/70 bg-slate-50/70 p-3">
                <p className="text-sm font-medium text-navy-950">{log.description}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {log.module} · {log.action} · {formatCondominiumDate(log.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
