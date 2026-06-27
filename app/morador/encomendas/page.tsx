import { PackageList } from "@/components/resident/package-list";
import { getResidentPackages } from "@/lib/resident/queries";

export const dynamic = "force-dynamic";

export default async function ResidentPackagesPage() {
  const packages = await getResidentPackages();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Encomendas
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Consulte encomendas registradas para sua unidade. Esta tela e apenas
          de consulta.
        </p>
      </div>

      <PackageList packages={packages} />
    </div>
  );
}
