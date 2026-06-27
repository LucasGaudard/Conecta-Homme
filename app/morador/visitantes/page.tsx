import { VisitorForm } from "@/components/resident/visitor-form";
import { VisitorTable } from "@/components/resident/visitor-table";
import { getResidentVisitors } from "@/lib/resident/queries";

type ResidentVisitorsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ResidentVisitorsPage({
  searchParams,
}: ResidentVisitorsPageProps) {
  const [{ error, success }, authorizations] = await Promise.all([
    searchParams,
    getResidentVisitors(),
  ]);
  const now = new Date();
  const active = authorizations.filter(
    (item) => item.status === "AUTHORIZED" && item.endsAt >= now,
  );
  const expired = authorizations.filter(
    (item) => item.status === "EXPIRED" || (item.status === "AUTHORIZED" && item.endsAt < now),
  );
  const canceled = authorizations.filter((item) => item.status === "CANCELED");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Visitantes
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Cadastre e acompanhe autorizacoes de visitantes da sua unidade.
        </p>
      </div>

      <VisitorForm error={error} success={success} />

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-navy-950">Visitantes ativos</h3>
        <VisitorTable title="Visitantes ativos" authorizations={active} />
      </section>
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-navy-950">Visitantes expirados</h3>
        <VisitorTable title="Visitantes expirados" authorizations={expired} />
      </section>
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-navy-950">Visitantes cancelados</h3>
        <VisitorTable title="Visitantes cancelados" authorizations={canceled} />
      </section>
    </div>
  );
}
