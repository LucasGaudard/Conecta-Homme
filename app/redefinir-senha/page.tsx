import Link from "next/link";
import { Lock } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { CondotechBrand } from "@/components/brand/condotech-brand";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { resetPasswordAction } from "@/lib/password-reset/actions";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    token?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { error, success, token = "" } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md space-y-5">
        <Link href="/" className="mx-auto flex w-max text-navy-950" aria-label="CONDOTECH">
          <CondotechBrand priority size="sm" />
        </Link>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl text-navy-950">
              Redefinir senha
            </CardTitle>
            <p className="text-sm leading-6 text-slate-500">
              Crie uma nova senha para voltar a acessar sua conta.
            </p>
          </CardHeader>
          <CardContent>
            <form action={resetPasswordAction} className="space-y-5">
              <FeedbackAlert error={error} success={success} />
              <input type="hidden" name="token" value={token} />

              <div className="space-y-2">
                <label className="field-label" htmlFor="newPassword">
                  Nova senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="pl-10"
                    autoComplete="new-password"
                    placeholder="Minimo de 6 caracteres"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="field-label" htmlFor="confirmPassword">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="pl-10"
                    autoComplete="new-password"
                    placeholder="Repita a nova senha"
                    required
                  />
                </div>
              </div>

              <SubmitButton className="w-full" pendingLabel="Salvando...">
                Redefinir senha
              </SubmitButton>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-navy-700 transition hover:text-navy-950"
                >
                  Voltar para login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
