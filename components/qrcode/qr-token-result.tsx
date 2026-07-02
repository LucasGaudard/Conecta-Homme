import type { QRCodeToken } from "@prisma/client";
import { QrCodeDisplay } from "@/components/qrcode/qr-code-display";
import { QrShareActions } from "@/components/qrcode/qr-share-actions";
import { formatQrDateTime } from "@/lib/qrcode/format";

type QrTokenResultProps = {
  qrCode?: QRCodeToken | null;
  unitLabel: string;
  visitorName?: string | null;
};

export function QrTokenResult({ qrCode, unitLabel, visitorName }: QrTokenResultProps) {
  if (!qrCode) {
    return <span className="text-xs text-slate-400">QR Code ainda nao gerado.</span>;
  }

  const downloadId = `qr-${qrCode.accessCode}`;
  const validityLabel = formatQrDateTime(qrCode.expiresAt);

  return (
    <div className="space-y-3">
      <QrCodeDisplay id={downloadId} value={qrCode.accessCode} />
      <div className="rounded-md border border-navy-100 bg-navy-50 p-3 text-center">
        <p className="text-xs font-semibold uppercase text-slate-500">Codigo</p>
        <p className="mt-1 text-2xl font-semibold tracking-normal text-navy-950">
          {qrCode.accessCode}
        </p>
      </div>
      <p className="text-xs font-medium text-amber-700">
        Valido ate: {validityLabel}
      </p>
      <QrShareActions
        accessCode={qrCode.accessCode}
        downloadId={downloadId}
        unitLabel={unitLabel}
        validityLabel={validityLabel}
        visitorName={visitorName}
      />
    </div>
  );
}
