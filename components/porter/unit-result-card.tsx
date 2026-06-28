import type { AccessLog, Package, PresenceStatus, Unit, UnitStatus, User, Visitor, VisitAuthorization } from "@prisma/client";
import { AlertTriangle, History, PackageIcon, UserCheck } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { AccessActionForm } from "@/components/porter/access-action-form";
import {
  formatAccessMethod,
  formatAccessType,
  formatPorterPresenceStatus,
  formatShortDateTime,
} from "@/components/porter/porter-format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type UnitResult = Unit & {
  accessLogs: Array<
    AccessLog & {
      porter: Pick<User, "name"> | null;
      user: Pick<User, "name"> | null;
      visitor: Pick<Visitor, "name"> | null;
    }
  >;
  packages: Package[];
  users: Array<Pick<User, "name" | "status">>;
  visitAuthorizations: Array<
    VisitAuthorization & {
      visitor: Pick<Visitor, "name" | "phone">;
    }
  >;
};

type UnitResultCardProps = {
  query: string;
  unit: UnitResult;
};

function PresenceAlert({ status }: { status: PresenceStatus }) {
  const isHome = status === "HOME";
  const isBlocked = status === "DO_NOT_DISTURB";

  return (
    <div
      className={cn(
        "rounded-md border px-4 py-3 text-sm font-medium",
        isHome && "border-emerald-200 bg-emerald-50 text-emerald-700",
        status === "AWAY" && "border-slate-200 bg-slate-50 text-slate-600",
        isBlocked && "border-red-200 bg-red-50 text-red-700",
      )}
    >
      <div className="flex items-center gap-2">
        {isBlocked ? <AlertTriangle className="h-4 w-4" /> : null}
        {formatPorterPresenceStatus(status)}
      </div>
    </div>
  );
}

export function UnitResultCard({ query, unit }: UnitResultCardProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-xl text-navy-950">
              Unidade {unit.block}-{unit.apartment}
            </CardTitle>
            <p className="mt-1 text-sm text-slate-500">{unit.responsibleName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={unit.status as UnitStatus} type="unit" />
            <StatusBadge status={unit.presenceStatus} type="presence" />
          </div>
        </div>
        <PresenceAlert status={unit.presenceStatus} />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase text-slate-400">Telefone</p>
            <p className="mt-1 text-sm text-navy-950">{unit.phone ?? "Nao informado"}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase text-slate-400">E-mail</p>
            <p className="mt-1 break-words text-sm text-navy-950">{unit.email ?? "Nao informado"}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase text-slate-400">Moradores</p>
            <p className="mt-1 text-sm text-navy-950">{unit.users.length}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase text-slate-400">Encomendas</p>
            <p className="mt-1 text-sm text-navy-950">{unit.packages.length} pendente(s)</p>
          </div>
        </div>

        <AccessActionForm unitId={unit.id} query={query} />

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-md border border-slate-200 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-950">
              <UserCheck className="h-4 w-4" />
              Visitantes recentes
            </h3>
            {unit.visitAuthorizations.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Nenhum visitante autorizado.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {unit.visitAuthorizations.map((authorization) => (
                  <li key={authorization.id} className="text-sm">
                    <p className="font-medium text-navy-950">{authorization.visitor.name}</p>
                    <p className="text-slate-500">
                      {authorization.visitor.phone ?? "Telefone nao informado"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-md border border-slate-200 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-950">
              <PackageIcon className="h-4 w-4" />
              Encomendas pendentes
            </h3>
            {unit.packages.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Nenhuma encomenda pendente.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {unit.packages.map((item) => (
                  <li key={item.id} className="text-sm">
                    <p className="font-medium text-navy-950">{item.description ?? "Encomenda"}</p>
                    <p className="text-slate-500">{item.carrier ?? "Transportadora nao informada"}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-md border border-slate-200 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-950">
              <History className="h-4 w-4" />
              Ultimos acessos
            </h3>
            {unit.accessLogs.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Nenhum acesso registrado.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {unit.accessLogs.map((access) => (
                  <li key={access.id} className="text-sm">
                    <p className="font-medium text-navy-950">
                      {formatAccessType(access.accessType)} - {formatAccessMethod(access.accessMethod)}
                    </p>
                    <p className="text-slate-500">
                      {formatShortDateTime(access.occurredAt)}
                      {access.porter?.name ? ` por ${access.porter.name}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
