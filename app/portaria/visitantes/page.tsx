import { UserCheck } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { getPorterVisitors } from "@/lib/porter/queries";

export const dynamic = "force-dynamic";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function PorterVisitorsPage() {
  const visitors = await getPorterVisitors();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Visitantes
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Consulte visitantes autorizados para as unidades do condomínio.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">
            Visitantes autorizados
          </h3>
          <p className="text-sm text-slate-500">
            {visitors.length} autorização(ões) ativa(s).
          </p>
        </div>

        {visitors.length === 0 ? (
          <EmptyState message="Nenhum visitante autorizado no momento." />
        ) : (
          <div className="grid gap-3">
            {visitors.map((authorization) => (
              <article key={authorization.id} className="surface-card p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-navy-100 bg-navy-50 text-navy-900">
                      <UserCheck className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="truncate text-base font-semibold text-navy-950">
                        {authorization.visitor.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Unidade {authorization.unit.block}-{authorization.unit.apartment}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Responsável: {authorization.unit.responsibleName}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600 sm:min-w-64">
                    <p>
                      <span className="font-medium text-navy-950">Telefone:</span>{" "}
                      {authorization.visitor.phone ?? "Não informado"}
                    </p>
                    <p>
                      <span className="font-medium text-navy-950">Documento:</span>{" "}
                      {authorization.visitor.document ?? "Não informado"}
                    </p>
                    <p>
                      <span className="font-medium text-navy-950">Validade:</span>{" "}
                      {formatDateTime(authorization.startsAt)} até{" "}
                      {formatDateTime(authorization.endsAt)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
