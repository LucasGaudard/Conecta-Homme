import type { QRCodeToken } from "@prisma/client";
import { QrCodeDisplay } from "@/components/qrcode/qr-code-display";
import { formatDateTime } from "@/components/resident/resident-format";

type QrTokenResultProps = {
  qrCode?: QRCodeToken | null;
};

export function QrTokenResult({ qrCode }: QrTokenResultProps) {
  if (!qrCode) {
    return <span className="text-xs text-slate-400">QR Code ainda nao gerado.</span>;
  }

  return (
    <div className="space-y-3">
      <QrCodeDisplay token={qrCode.token} />
      <p className="break-all text-xs text-slate-500">Token: {qrCode.token}</p>
      <p className="text-xs font-medium text-amber-700">
        Expira em: {formatDateTime(qrCode.expiresAt)}
      </p>
    </div>
  );
}
