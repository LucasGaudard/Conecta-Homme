import type { QRCodeToken } from "@prisma/client";
import { QrCode } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { QrCodeDisplay } from "@/components/qrcode/qr-code-display";
import { Button } from "@/components/ui/button";
import { generateResidentQrCodeAction } from "@/lib/qrcode/actions";
import { formatDateTime } from "@/components/resident/resident-format";
import type { Unit } from "@prisma/client";

type QrCodeCardProps = {
  qrCode: QRCodeToken | null;
  unit: Unit;
};

export function QrCodeCard({ qrCode, unit }: QrCodeCardProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="surface-card p-6 text-center">
        {qrCode ? (
          <QrCodeDisplay token={qrCode.token} />
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/80">
            <QrCode className="h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm text-slate-500">Nenhum QR Code ativo.</p>
          </div>
        )}
        <form action={generateResidentQrCodeAction} className="mt-4">
          <Button type="submit" className="w-full">
            {qrCode ? "Reutilizar QR Code" : "Gerar QR Code"}
          </Button>
        </form>
      </div>

      <div className="surface-card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-navy-950">
            Unidade {unit.block}-{unit.apartment}
          </h3>
          <StatusBadge status={unit.status} type="unit" />
          <StatusBadge status={unit.presenceStatus} type="presence" />
        </div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="info-tile">
            <dt className="text-xs font-medium uppercase text-slate-400">Responsavel</dt>
            <dd className="mt-1 text-sm text-navy-950">{unit.responsibleName}</dd>
          </div>
          <div className="info-tile">
            <dt className="text-xs font-medium uppercase text-slate-400">Validade</dt>
            <dd className="mt-1 text-sm text-navy-950">Permanente</dd>
          </div>
          <div className="info-tile sm:col-span-2">
            <dt className="text-xs font-medium uppercase text-slate-400">Token</dt>
            <dd className="mt-1 break-all text-sm text-navy-950">
              {qrCode?.token ?? "Gere o QR Code para exibir o token."}
            </dd>
          </div>
          {qrCode ? (
            <div className="info-tile sm:col-span-2">
              <dt className="text-xs font-medium uppercase text-slate-400">Criado em</dt>
              <dd className="mt-1 text-sm text-navy-950">{formatDateTime(qrCode.createdAt)}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  );
}
