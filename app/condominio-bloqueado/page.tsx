import Link from "next/link";
import { AlertTriangle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type BlockedCondominiumPageProps = {
  searchParams: Promise<{
    message?: string;
    status?: string;
  }>;
};

export default async function BlockedCondominiumPage({
  searchParams,
}: BlockedCondominiumPageProps) {
  const params = await searchParams;
  const message =
    params.message ??
    "O acesso operacional deste condomínio está temporariamente indisponível.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-elevated">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-amber-50 text-amber-700">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-xl font-semibold text-navy-950">
          Acesso ao condomínio indisponível
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>
        {params.status ? (
          <p className="mt-2 text-xs font-medium uppercase text-slate-400">
            Status: {params.status}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <Link href="/login">Voltar ao login</Link>
          </Button>
          <form action="/api/auth/logout" method="post">
            <Button type="submit" className="w-full">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
