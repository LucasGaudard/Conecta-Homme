import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResidentForm } from "@/components/residents/resident-form";
import { Button } from "@/components/ui/button";
import { getResidentById } from "@/lib/residents/queries";

type EditResidentPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditResidentPage({
  params,
  searchParams,
}: EditResidentPageProps) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const resident = await getResidentById(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            Editar morador
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Atualize dados de contato sem alterar o vínculo com a unidade.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/admin/moradores/${resident.id}`}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <ResidentForm resident={resident} error={error} />
    </div>
  );
}
