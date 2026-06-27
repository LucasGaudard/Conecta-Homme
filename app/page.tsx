import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-navy-50 px-4 py-2 text-sm font-medium text-navy-900">
            <ShieldCheck className="h-4 w-4" />
            Gestao condominial integrada
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-navy-950 sm:text-5xl">
              Conecta Homme
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Base inicial do sistema para moradores, portaria, visitantes,
              encomendas, controle de acesso e relatorios.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">
                Acessar sistema
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/admin">Ver dashboard admin</Link>
            </Button>
          </div>
        </div>

        <Card className="border-navy-100 shadow-soft">
          <CardContent className="grid gap-4 p-6">
            {["Admin", "Portaria", "Morador"].map((profile) => (
              <div
                key={profile}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-950 text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-navy-950">{profile}</p>
                    <p className="text-sm text-slate-500">
                      Area reservada preparada
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
