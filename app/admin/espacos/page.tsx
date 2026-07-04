import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { SpaceForm } from "@/components/reservations/space-form";
import { SpaceList } from "@/components/reservations/space-list";
import { getAdminLeisureSpaces } from "@/lib/reservations/queries";

type AdminSpacesPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminSpacesPage({ searchParams }: AdminSpacesPageProps) {
  const params = await searchParams;
  const spaces = await getAdminLeisureSpaces();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Espacos do condominio
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Cadastre e mantenha os espacos de lazer disponiveis para solicitacoes de reserva.
        </p>
      </div>

      <FeedbackAlert error={params.error} success={params.success} />
      <SpaceForm />

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-950">Espacos cadastrados</h3>
          <p className="text-sm text-slate-500">
            Edite dados operacionais ou inative espacos que nao devem receber novas reservas.
          </p>
        </div>
        <SpaceList spaces={spaces} />
      </section>
    </div>
  );
}
