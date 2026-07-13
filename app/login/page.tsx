import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { CondotechBrand } from "@/components/brand/condotech-brand";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { roleHomePath } from "@/lib/auth/constants";
import { getCurrentUser } from "@/lib/auth/current-user";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (user) {
    redirect(roleHomePath[user.role]);
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-navy-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="w-max" aria-label="CONDOTECH">
          <CondotechBrand className="text-white" priority />
        </Link>

        <div className="max-w-lg space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-blue-100">
            <ShieldCheck className="h-4 w-4" />
            Gestão inteligente do seu condomínio
          </p>
          <h1 className="text-4xl font-semibold tracking-normal">
            Uma entrada única para administrar rotinas do condomínio.
          </h1>
          <p className="leading-7 text-blue-100">
            Interface preparada para os perfis de administração, portaria e
            moradores com acesso seguro por perfil.
          </p>
          <div className="grid gap-3 text-sm text-blue-100">
            {["Administração", "Portaria", "Moradores"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full max-w-md space-y-5">
          <Link href="/" className="mx-auto flex w-max text-navy-950 lg:hidden" aria-label="CONDOTECH">
            <CondotechBrand priority size="sm" />
          </Link>
          <Card className="w-full max-w-md shadow-elevated">
            <CardHeader>
              <CardTitle className="text-2xl text-navy-950">Entrar</CardTitle>
              <p className="text-sm text-slate-500">
                Use seu e-mail ou usuário para acessar.
              </p>
            </CardHeader>
            <CardContent>
              <FeedbackAlert error={params.error} success={params.success} />
              <div className={params.error || params.success ? "mt-5" : ""}>
                <LoginForm />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
