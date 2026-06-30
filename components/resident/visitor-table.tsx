import type { QRCodeToken, Visitor, VisitAuthorization } from "@prisma/client";
import { Ban, QrCode } from "lucide-react";
import { QrTokenResult } from "@/components/qrcode/qr-token-result";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cancelVisitorAuthorizationAction } from "@/lib/resident/actions";
import { generateVisitorQrCodeAction } from "@/lib/qrcode/actions";
import { formatDateTime, formatVisitorStatus } from "@/components/resident/resident-format";

type VisitorAuthorizationRow = VisitAuthorization & {
  visitor: Visitor;
};

type VisitorTableProps = {
  authorizations: VisitorAuthorizationRow[];
  qrCodes?: QRCodeToken[];
  title: string;
};

export function VisitorTable({ authorizations, qrCodes = [], title }: VisitorTableProps) {
  if (authorizations.length === 0) {
    return <EmptyState message={`Nenhum visitante em ${title.toLowerCase()}.`} />;
  }

  return (
    <div className="table-shell">
      <table className="data-table min-w-[760px]">
        <thead>
          <tr>
            <th className="px-4 py-3 font-medium">Visitante</th>
            <th className="px-4 py-3 font-medium">Telefone</th>
            <th className="px-4 py-3 font-medium">Inicio</th>
            <th className="px-4 py-3 font-medium">Fim</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">QR Code</th>
            <th className="px-4 py-3 font-medium">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {authorizations.map((authorization) => {
            const cancel = cancelVisitorAuthorizationAction.bind(null, authorization.id);
            const generateQr = generateVisitorQrCodeAction.bind(null, authorization.id);
            const isCancelable =
              authorization.status === "AUTHORIZED" && authorization.endsAt >= new Date();
            const qrCode = qrCodes.find(
              (item) =>
                item.visitAuthorizationId === authorization.id &&
                (!item.expiresAt || item.expiresAt >= new Date()),
            );

            return (
              <tr key={authorization.id}>
                <td>
                  <p className="font-medium text-navy-950">{authorization.visitor.name}</p>
                  <p className="text-xs text-slate-400">
                    {authorization.visitor.document ?? "Documento nao informado"}
                  </p>
                </td>
                <td>{authorization.visitor.phone ?? "Nao informado"}</td>
                <td>{formatDateTime(authorization.startsAt)}</td>
                <td>{formatDateTime(authorization.endsAt)}</td>
                <td>{formatVisitorStatus(authorization.status, authorization.endsAt)}</td>
                <td>
                  {isCancelable ? (
                    <div className="space-y-3">
                      <QrTokenResult qrCode={qrCode} />
                      <form action={generateQr}>
                        <Button type="submit" size="sm" variant="outline">
                          <QrCode className="h-4 w-4" />
                          {qrCode ? "Reutilizar QR" : "Gerar QR"}
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Indisponivel</span>
                  )}
                </td>
                <td>
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
