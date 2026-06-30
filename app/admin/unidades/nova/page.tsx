import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UnitForm } from "@/components/admin/unit-form";
import { Button } from "@/components/ui/button";

type NewUnitPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewUnitPage({ searchParams }: NewUnitPageProps) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            Cadastrar unidade
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Cadastre a unidade e crie o primeiro morador vinculado em uma unica
            operacao.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/admin/unidades">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <UnitForm mode="create" error={error} />
    </div>
  );
}
