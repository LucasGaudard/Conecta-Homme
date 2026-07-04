import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { ReservationFilters } from "@/components/reservations/reservation-filters";
import { ReservationTable } from "@/components/reservations/reservation-table";
import {
  getAdminReservationFilters,
  getAdminReservations,
} from "@/lib/reservations/queries";

type AdminReservationsPageProps = {
  searchParams: Promise<{
    error?: string;
    from?: string;
    q?: string;
    reservationsDir?: string;
    reservationsPage?: string;
    reservationsPageSize?: string;
    reservationsSort?: string;
    spaceId?: string;
    status?: string;
    success?: string;
    to?: string;
    unitId?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage({
  searchParams,
}: AdminReservationsPageProps) {
  const params = await searchParams;
  const [filterOptions, reservations] = await Promise.all([
    getAdminReservationFilters(),
    getAdminReservations(params),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Reservas
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Analise solicitacoes, evite conflitos de horario e acompanhe todas as reservas.
        </p>
      </div>

      <FeedbackAlert error={params.error} success={params.success} />
      <ReservationFilters
        defaultFrom={params.from}
        defaultQuery={params.q}
        defaultSpaceId={params.spaceId}
        defaultStatus={params.status ?? "ALL"}
        defaultTo={params.to}
        defaultUnitId={params.unitId}
        spaces={filterOptions.spaces}
        units={filterOptions.units}
      />
      <ReservationTable mode="admin" reservations={reservations} searchParams={params} />
    </div>
  );
}
