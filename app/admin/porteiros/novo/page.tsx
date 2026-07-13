import { PorterForm } from "@/components/porters/porter-form";

type NewPorterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function NewPorterPage({ searchParams }: NewPorterPageProps) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Novo porteiro
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Cadastre um acesso de portaria vinculado ao seu condomínio.
        </p>
      </div>

      <PorterForm error={error} mode="create" />
    </div>
  );
}
