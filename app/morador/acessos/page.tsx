import { AccessHistory } from "@/components/resident/access-history";
import { getResidentAccesses } from "@/lib/resident/queries";

export const dynamic = "force-dynamic";

export default async function ResidentAccessesPage() {
  const accesses = await getResidentAccesses();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Acessos
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Historico de entradas e saidas da sua unidade.
        </p>
      </div>

      <AccessHistory accesses={accesses} />
    </div>
  );
}
