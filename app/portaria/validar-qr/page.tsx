import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { QrValidationForm } from "@/components/porter/qr-validation-form";
import { QrValidationResult } from "@/components/porter/qr-validation-result";
import { getQrValidationResult } from "@/lib/qrcode/queries";

type ValidateQrPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    token?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ValidateQrPage({ searchParams }: ValidateQrPageProps) {
  const { error, success, token = "" } = await searchParams;
  const result = token ? await getQrValidationResult(token) : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Validar QR Code
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Cole o token lido no QR Code para validar o acesso e registrar entrada
          ou saida.
        </p>
      </div>

      <FeedbackAlert error={error} success={success} />
      <QrValidationForm defaultToken={token} />
      <QrValidationResult result={result} />
    </div>
  );
}
