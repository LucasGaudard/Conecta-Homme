import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { QrCodeCard } from "@/components/qrcode/qr-code-card";
import { getResidentQrCodeData } from "@/lib/qrcode/queries";

type ResidentQrCodePageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ResidentQrCodePage({
  searchParams,
}: ResidentQrCodePageProps) {
  const [{ error, success }, data] = await Promise.all([
    searchParams,
    getResidentQrCodeData(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Meu QR Code
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          QR Code permanente da sua unidade para validacao pela portaria.
        </p>
      </div>

      <FeedbackAlert error={error} success={success} />
      <QrCodeCard qrCode={data.qrCode} unit={data.unit} />
    </div>
  );
}
