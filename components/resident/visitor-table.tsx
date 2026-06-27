import type { Visitor, VisitAuthorization } from "@prisma/client";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cancelVisitorAuthorizationAction } from "@/lib/resident/actions";
import { formatDateTime, formatVisitorStatus } from "@/components/resident/resident-format";

type VisitorAuthorizationRow = VisitAuthorization & {
  visitor: Visitor;
};

type VisitorTableProps = {
  authorizations: VisitorAuthorizationRow[];
  title: string;
};

export function VisitorTable({ authorizations, title }: VisitorTableProps) {
  if (authorizations.length === 0) {
    return <EmptyState message={`Nenhum visitante em ${title.toLowerCase()}.`} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Visitante</th>
            <th className="px-4 py-3 font-medium">Telefone</th>
            <th className="px-4 py-3 font-medium">Inicio</th>
            <th className="px-4 py-3 font-medium">Fim</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Acoes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {authorizations.map((authorization) => {
            const cancel = cancelVisitorAuthorizationAction.bind(null, authorization.id);
            const isCancelable =
              authorization.status === "AUTHORIZED" && authorization.endsAt >= new Date();

            return (
              <tr key={authorization.id} className="text-slate-600">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy-950">{authorization.visitor.name}</p>
                  <p className="text-xs text-slate-400">
                    {authorization.visitor.document ?? "Documento nao informado"}
                  </p>
                </td>
                <td className="px-4 py-3">{authorization.visitor.phone ?? "Nao informado"}</td>
                <td className="px-4 py-3">{formatDateTime(authorization.startsAt)}</td>
                <td className="px-4 py-3">{formatDateTime(authorization.endsAt)}</td>
                <td className="px-4 py-3">{formatVisitorStatus(authorization.status, authorization.endsAt)}</td>
                <td className="px-4 py-3">
                  {isCancelable ? (
                    <form action={cancel}>
                      <Button type="submit" size="sm" variant="outline">
                        <Ban className="h-4 w-4" />
                        Cancelar
                      </Button>
                    </form>
                  ) : (
                    <span className="text-xs text-slate-400">Sem acao</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
