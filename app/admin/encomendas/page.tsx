import { PackageFilters } from "@/components/packages/package-filters";
import { PackageTable } from "@/components/packages/package-table";
import { getAdminPackages } from "@/lib/packages/queries";

type AdminPackagesPageProps = {
  searchParams: Promise<{
    from?: string;
    packagesDir?: string;
    packagesPage?: string;
    packagesPageSize?: string;
    packagesSort?: string;
    q?: string;
    status?: string;
    to?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage({
  searchParams,
}: AdminPackagesPageProps) {
  const filters = await searchParams;
  const packages = await getAdminPackages(filters);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Encomendas
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Visao administrativa de todas as encomendas registradas no condominio.
        </p>
      </div>

      <PackageFilters
        mode="admin"
        defaultQuery={filters.q}
        defaultStatus={filters.status ?? "ALL"}
        defaultFrom={filters.from}
        defaultTo={filters.to}
      />
      <PackageTable mode="admin" packages={packages} searchParams={filters} />
    </div>
  );
}
