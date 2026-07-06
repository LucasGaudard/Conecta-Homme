import Link from "next/link";
import { Building2 } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { Button } from "@/components/ui/button";
import { CondominiumTable } from "@/components/super-admin/condominium-table";
import { getCondominiumsList } from "@/lib/super-admin/queries";

type SuperAdminCondominiumsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function SuperAdminCondominiumsPage({
  searchParams,
}: SuperAdminCondominiumsPageProps) {
  const params = await searchParams;
  const condominiums = await getCondominiumsList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            Condomínios
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Gerencie os condomínios cadastrados na plataforma.
          </p>
        </div>
        <Button asChild>
          <Link href="/super-admin/condominios/novo">
            <Building2 className="h-4 w-4" />
            Novo condomínio
          </Link>
        </Button>
      </div>

      <FeedbackAlert error={params.error} success={params.success} />
      <CondominiumTable condominiums={condominiums} />
    </div>
  );
}
