import type { UserRole } from "@prisma/client";
import { CalendarDays, ShieldCheck, UserRound } from "lucide-react";
import { accountRoleLabels, formatAccountDate } from "@/lib/account/format";

type AccountInfoCardProps = {
  createdAt: Date;
  email: string;
  role: UserRole;
  username?: string | null;
};

export function AccountInfoCard({
  createdAt,
  email,
  role,
  username,
}: AccountInfoCardProps) {
  return (
    <section className="surface-card p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-navy-950">
          Informacoes da conta
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Dados estruturais do acesso logado.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="info-tile">
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
            <ShieldCheck className="h-4 w-4" />
            Perfil
          </div>
          <p className="mt-2 text-sm font-semibold text-navy-950">
            {accountRoleLabels[role]}
          </p>
        </div>
        <div className="info-tile">
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
            <CalendarDays className="h-4 w-4" />
            Criada em
          </div>
          <p className="mt-2 text-sm font-semibold text-navy-950">
            {formatAccountDate(createdAt)}
          </p>
        </div>
        <div className="info-tile sm:col-span-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
            <UserRound className="h-4 w-4" />
            Identificacao
          </div>
          <p className="mt-2 break-words text-sm font-semibold text-navy-950">
            {username ? `${username} · ${email}` : email}
          </p>
        </div>
      </div>
    </section>
  );
}
