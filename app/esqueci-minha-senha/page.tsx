import Link from "next/link";
import { Building2, Mail } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { requestPasswordResetAction } from "@/lib/password-reset/actions";

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { error, success } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md space-y-5">
        <Link href="/" className="mx-auto flex w-max items-center gap-3 text-base font-semibold text-navy-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-950 text-white shadow-soft">
            <Building2 className="h-5 w-5" />
          </span>
          Conecta Homme
        </Link>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl text-navy-950">
              Recuperar senha
            </CardTitle>
            <p className="text-sm leading-6 text-slate-500">
              Informe o e-mail cadastrado. Se existir uma conta, enviaremos as
              instrucoes de redefinicao.
            </p>
          </CardHeader>
          <CardContent>
            <form action={requestPasswordResetAction} className="space-y-5">
              <FeedbackAlert error={error} success={success} />

              <div className="space-y-2">
                <label className="field-label" htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-10"
                    placeholder="seuemail@exemplo.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <SubmitButton className="w-full" pendingLabel="Enviando...">
                Enviar instrucoes
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
