import Link from "next/link";
import { Plus } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { UnitsTable } from "@/components/admin/units-table";
import { Button } from "@/components/ui/button";
import { getUnits } from "@/lib/units/queries";

export const dynamic = "force-dynamic";

type AdminUnitsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function AdminUnitsPage({ searchParams }: AdminUnitsPageProps) {
  const [{ error, success }, units] = await Promise.all([searchParams, getUnits()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            Unidades
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Gerencie casas, apartamentos e moradores vinculados sem remover
            historico operacional.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/unidades/nova">
            <Plus className="h-4 w-4" />
            Nova unidade
          </Link>
        </Button>
      </div>

      <FeedbackAlert error={error} success={success} />
      <UnitsTable units={units} />
    </div>
  );
}
