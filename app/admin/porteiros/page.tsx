import Link from "next/link";
import { ShieldPlus } from "lucide-react";
import { FeedbackAlert } from "@/components/admin/feedback-alert";
import { PorterTable } from "@/components/porters/porter-table";
import { Button } from "@/components/ui/button";
import { getPorters } from "@/lib/porters/queries";

type AdminPortersPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPortersPage({
  searchParams,
}: AdminPortersPageProps) {
  const [{ error, success }, porters] = await Promise.all([
    searchParams,
    getPorters(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
            Porteiros
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Gerencie os usuários de portaria do seu condomínio.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/porteiros/novo">
            <ShieldPlus className="h-4 w-4" />
            Novo porteiro
          </Link>
        </Button>
      </div>

      <FeedbackAlert error={error} success={success} />
      <PorterTable porters={porters} />
    </div>
  );
}
