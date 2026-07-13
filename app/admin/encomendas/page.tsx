import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { ExportButtons } from "@/components/export/export-buttons";
import { PackageFilters } from "@/components/packages/package-filters";
import { PackageForm } from "@/components/packages/package-form";
import { PackageTable } from "@/components/packages/package-table";
import { getAdminPackages, searchUnitsForPackage } from "@/lib/packages/queries";

type AdminPackagesPageProps = {
  searchParams: Promise<{
    error?: string;
    from?: string;
    packagesDir?: string;
    packagesPage?: string;
    packagesPageSize?: string;
    packagesSort?: string;
    q?: string;
    status?: string;
    success?: string;
    to?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage({
  searchParams,
}: AdminPackagesPageProps) {
  const filters = await searchParams;
  const [packages, units] = await Promise.all([
    getAdminPackages(filters),
    searchUnitsForPackage(filters.q ?? "", "ADMIN"),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Encomendas
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Visão administrativa das encomendas do condomínio. Cadastre novas
          encomendas e registre entregas para unidades do seu condomínio.
        </p>
      </div>

      <FeedbackAlert error={filters.error} success={filters.success} />
      <PackageFilters
        mode="admin"
        defaultQuery={filters.q}
        defaultStatus={filters.status ?? "ALL"}
        defaultFrom={filters.from}
        defaultTo={filters.to}
      />
      <PackageForm query={filters.q ?? ""} units={units} />
      <div className="flex justify-end">
        <ExportButtons
          basePath="/admin/encomendas/export"
          searchParams={filters}
        />
      </div>
      <PackageTable mode="admin" packages={packages} searchParams={filters} />
    </div>
  );
}
