import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { PackageFilters } from "@/components/packages/package-filters";
import { PackageForm } from "@/components/packages/package-form";
import { PackageTable } from "@/components/packages/package-table";
import {
  getPorterPackages,
  searchUnitsForPackage,
} from "@/lib/packages/queries";

type PorterPackagesPageProps = {
  searchParams: Promise<{
    error?: string;
    packagesDir?: string;
    packagesPage?: string;
    packagesPageSize?: string;
    packagesSort?: string;
    q?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PorterPackagesPage({
  searchParams,
}: PorterPackagesPageProps) {
  const params = await searchParams;
  const { error, q = "", success } = params;
  const [units, packages] = await Promise.all([
    searchUnitsForPackage(q),
    getPorterPackages(),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Encomendas
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Busque uma unidade, registre encomendas recebidas e marque retiradas.
        </p>
      </div>

      <FeedbackAlert error={error} success={success} />
      <PackageFilters mode="porter" defaultQuery={q} />
      <PackageForm query={q} units={units} />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">
            Encomendas recentes
          </h3>
          <p className="text-sm text-slate-500">
            Ultimos registros cadastrados pela portaria.
          </p>
        </div>
        <PackageTable mode="porter" packages={packages} searchParams={params} />
      </section>
    </div>
  );
}
