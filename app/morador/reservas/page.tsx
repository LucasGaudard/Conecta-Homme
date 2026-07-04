import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { ReservationRequestForm } from "@/components/reservations/reservation-request-form";
import { ReservationTable } from "@/components/reservations/reservation-table";
import { SpaceCatalog } from "@/components/reservations/space-catalog";
import { getResidentReservationPageData } from "@/lib/reservations/queries";

type ResidentReservationsPageProps = {
  searchParams: Promise<{
    error?: string;
    reservationsDir?: string;
    reservationsPage?: string;
    reservationsPageSize?: string;
    reservationsSort?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ResidentReservationsPage({
  searchParams,
}: ResidentReservationsPageProps) {
  const params = await searchParams;
  const { reservations, spaces } = await getResidentReservationPageData();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Reservas
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Consulte espacos disponiveis e solicite reservas para sua unidade.
        </p>
      </div>

      <FeedbackAlert error={params.error} success={params.success} />
      <SpaceCatalog spaces={spaces} />
      <ReservationRequestForm spaces={spaces} />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">Minhas reservas</h3>
          <p className="text-sm text-slate-500">
            Acompanhe solicitacoes pendentes, aprovadas, recusadas e canceladas.
          </p>
        </div>
        <ReservationTable mode="resident" reservations={reservations} searchParams={params} />
      </section>
    </div>
  );
}
