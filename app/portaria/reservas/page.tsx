import { ReservationTable } from "@/components/reservations/reservation-table";
import { getPorterTodayReservations } from "@/lib/reservations/queries";

type PorterReservationsPageProps = {
  searchParams: Promise<{
    reservationsDir?: string;
    reservationsPage?: string;
    reservationsPageSize?: string;
    reservationsSort?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PorterReservationsPage({
  searchParams,
}: PorterReservationsPageProps) {
  const params = await searchParams;
  const reservations = await getPorterTodayReservations();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Reservas do dia
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Visualize reservas aprovadas para hoje com unidade, responsavel, espaco e horario.
        </p>
      </div>

      <ReservationTable mode="porter" reservations={reservations} searchParams={params} />
    </div>
  );
}
