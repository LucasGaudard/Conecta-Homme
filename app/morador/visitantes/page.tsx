import { VisitorForm } from "@/components/resident/visitor-form";
import { VisitorTable } from "@/components/resident/visitor-table";
import { getVisitorQrCodesForResident } from "@/lib/qrcode/queries";
import { getResidentVisitors } from "@/lib/resident/queries";

type ResidentVisitorsPageProps = {
  searchParams: Promise<{
    activeVisitorsDir?: string;
    activeVisitorsPage?: string;
    activeVisitorsPageSize?: string;
    activeVisitorsSort?: string;
    canceledVisitorsDir?: string;
    canceledVisitorsPage?: string;
    canceledVisitorsPageSize?: string;
    canceledVisitorsSort?: string;
    error?: string;
    expiredVisitorsDir?: string;
    expiredVisitorsPage?: string;
    expiredVisitorsPageSize?: string;
    expiredVisitorsSort?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ResidentVisitorsPage({
  searchParams,
}: ResidentVisitorsPageProps) {
  const params = await searchParams;
  const { error, success } = params;
  const [authorizations, qrCodes] = await Promise.all([
    getResidentVisitors(),
    getVisitorQrCodesForResident(),
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
        <VisitorTable
          title="Visitantes ativos"
          authorizations={active}
          qrCodes={qrCodes}
          searchParams={params}
          tableKey="activeVisitors"
        />
      </section>
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-navy-950">Visitantes expirados</h3>
        <VisitorTable
          title="Visitantes expirados"
          authorizations={expired}
          qrCodes={qrCodes}
          searchParams={params}
          tableKey="expiredVisitors"
        />
      </section>
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-navy-950">Visitantes cancelados</h3>
        <VisitorTable
          title="Visitantes cancelados"
          authorizations={canceled}
          qrCodes={qrCodes}
          searchParams={params}
          tableKey="canceledVisitors"
        />
      </section>
    </div>
  );
}
