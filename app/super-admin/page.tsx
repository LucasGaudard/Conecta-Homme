import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSuperAdmin } from "@/lib/auth/authorization";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  const user = await requireSuperAdmin();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal text-navy-950">
          Super Admin
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Área de gestão da plataforma Conecta Homme.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base text-navy-950">
            Acesso de plataforma
          </CardTitle>
          <ShieldCheck className="h-5 w-5 text-navy-700" />
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm font-medium text-navy-950">{user.name}</p>
          <p className="text-sm leading-6 text-slate-500">
            Este perfil não pertence a um condomínio específico e será usado para
            gerenciar a operação SaaS nas próximas etapas da V2.0.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
