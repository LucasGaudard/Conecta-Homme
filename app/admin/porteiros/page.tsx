import Link from "next/link";
import { Plus } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { PorterTable } from "@/components/porters/porter-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { getPorters } from "@/lib/porters/queries";

type AdminPortersPageProps = {
  searchParams: Promise<{
    error?: string;
    q?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPortersPage({
  searchParams,
}: AdminPortersPageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const porters = await getPorters(q);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            Porteiros
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Gerencie os acessos da portaria deste condomínio sem remover
            histórico operacional.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/porteiros/novo">
            <Plus className="h-4 w-4" />
            Novo porteiro
          </Link>
        </Button>
      </div>

      <FeedbackAlert error={params.error} success={params.success} />

      <form className="surface-card grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome, e-mail, telefone ou turno"
        />
        <SubmitButton pendingLabel="Buscando...">Buscar</SubmitButton>
      </form>

      <PorterTable porters={porters} />
    </div>
  );
}
