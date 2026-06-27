import { PackageList } from "@/components/resident/package-list";
import { getResidentPackages } from "@/lib/resident/queries";

export const dynamic = "force-dynamic";

export default async function ResidentPackagesPage() {
  const packages = await getResidentPackages();
  const waiting = packages.filter((item) => item.status === "WAITING_PICKUP");
  const delivered = packages.filter((item) => item.status === "DELIVERED");

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

      <section className="space-y-4">
        <PackageList title="Aguardando retirada" packages={waiting} />
      </section>
      <section className="space-y-4">
        <PackageList title="Entregues" packages={delivered} />
      </section>
    </div>
  );
}
