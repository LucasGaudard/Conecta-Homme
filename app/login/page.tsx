import Link from "next/link";
import { Building2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
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
            moradores. Autenticacao real sera adicionada em etapa futura.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10">
        <Card className="w-full max-w-md border-slate-200 shadow-soft">
          <CardHeader>
            <CardTitle className="text-2xl text-navy-950">Entrar</CardTitle>
            <p className="text-sm text-slate-500">
              Acesso visual para demonstracao da primeira etapa.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-navy-950" htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="email" type="email" placeholder="usuario@condominio.com" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-navy-950" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="password" type="password" placeholder="Digite sua senha" className="pl-10" />
                </div>
              </div>

              <Button className="w-full" size="lg" type="button">
                Acessar
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
