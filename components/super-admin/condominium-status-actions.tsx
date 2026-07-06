import type { CondominiumStatus } from "@prisma/client";
import { CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { changeCondominiumStatusAction } from "@/lib/super-admin/actions";

type CondominiumStatusActionsProps = {
  id: string;
  name: string;
  status: CondominiumStatus;
};

async function changeStatus(id: string, status: CondominiumStatus) {
  "use server";

  const formData = new FormData();
  formData.set("id", id);
  formData.set("status", status);
  await changeCondominiumStatusAction(formData);
}

export function CondominiumStatusActions({
  id,
  name,
  status,
}: CondominiumStatusActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "ACTIVE" ? (
        <ConfirmationDialog
          action={changeStatus.bind(null, id, "ACTIVE")}
          title="Ativar condomínio"
          description={`Deseja ativar ${name}? Usuários tenant poderão acessar novamente se estiverem ativos.`}
          confirmLabel="Ativar"
        >
          <Button type="button" variant="outline" size="sm">
            <CheckCircle2 className="h-4 w-4" />
            Ativar
          </Button>
        </ConfirmationDialog>
      ) : null}
      {status !== "SUSPENDED" ? (
        <ConfirmationDialog
          action={changeStatus.bind(null, id, "SUSPENDED")}
          title="Suspender condomínio"
          description={`Deseja suspender ${name}? O acesso operacional dos usuários tenant será bloqueado.`}
          confirmLabel="Suspender"
        >
          <Button type="button" variant="outline" size="sm">
            <PauseCircle className="h-4 w-4" />
            Suspender
          </Button>
        </ConfirmationDialog>
      ) : null}
      {status !== "INACTIVE" ? (
        <ConfirmationDialog
          action={changeStatus.bind(null, id, "INACTIVE")}
          title="Inativar condomínio"
          description={`Deseja inativar ${name}? O acesso operacional dos usuários tenant será bloqueado.`}
          confirmLabel="Inativar"
        >
          <Button type="button" variant="outline" size="sm">
            <XCircle className="h-4 w-4" />
            Inativar
          </Button>
        </ConfirmationDialog>
      ) : null}
    </div>
  );
}
