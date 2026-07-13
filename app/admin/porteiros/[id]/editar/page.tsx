import { PorterForm } from "@/components/porters/porter-form";
import { getPorterById } from "@/lib/porters/queries";

type EditPorterPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditPorterPage({
  params,
  searchParams,
}: EditPorterPageProps) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const porter = await getPorterById(id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Editar porteiro
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Atualize dados, status ou redefina a senha operacional da portaria.
        </p>
      </div>

      <PorterForm error={error} mode="edit" porter={porter} />
    </div>
  );
}
