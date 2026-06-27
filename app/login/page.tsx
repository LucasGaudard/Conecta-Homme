import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { roleHomePath } from "@/lib/auth/constants";
import { getCurrentSession } from "@/lib/auth/current-user";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect(roleHomePath[session.role]);
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-navy-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-navy-950">
            <Building2 className="h-5 w-5" />
          </span>
          Conecta Homme
        </Link>

        <div className="max-w-lg space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-100">
            Condominio conectado
          </p>
          <h1 className="text-4xl font-semibold tracking-normal">
            Uma entrada unica para administrar rotinas do condominio.
          </h1>
          <p className="leading-7 text-blue-100">
            Interface preparada para os perfis de administracao, portaria e
            moradores com acesso seguro por perfil.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10">
        <Card className="w-full max-w-md border-slate-200 shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl text-navy-950">Entrar</CardTitle>
            <p className="text-sm text-slate-500">
              Use seu e-mail ou usuario para acessar.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
