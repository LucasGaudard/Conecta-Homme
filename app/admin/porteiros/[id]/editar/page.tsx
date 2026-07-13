import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PorterForm } from "@/components/porters/porter-form";
import { Button } from "@/components/ui/button";
import { getPorterById } from "@/lib/porters/queries";

type EditPorterPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditPorterPage({
  params,
  searchParams,
}: EditPorterPageProps) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const porter = await getPorterById(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            Editar porteiro
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Atualize dados de contato e turno sem alterar o vínculo do porteiro.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/admin/porteiros/${porter.id}`}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <PorterForm mode="edit" porter={porter} error={error} />
    </div>
  );
}
