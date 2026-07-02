import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { UnitForm } from "@/components/admin/unit-form";
import { Button } from "@/components/ui/button";
import { getUnitById } from "@/lib/units/queries";

type EditUnitPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditUnitPage({
  params,
  searchParams,
}: EditUnitPageProps) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const unit = await getUnitById(id);

  if (!unit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            Editar unidade {unit.block}-{unit.apartment}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Atualize dados administrativos, status da unidade e presenca.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/admin/unidades/${unit.id}`}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <UnitForm mode="edit" unit={unit} error={error} />
    </div>
  );
}
