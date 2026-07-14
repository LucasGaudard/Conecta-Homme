import { UserStatus } from "@prisma/client";
import { Power, PowerOff } from "lucide-react";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { changeResidentStatusAction } from "@/lib/residents/actions";

type ResidentStatusFormProps = {
  residentId: string;
  status: UserStatus;
};

export function ResidentStatusForm({ residentId, status }: ResidentStatusFormProps) {
  const nextStatus =
    status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
  const isActivating = nextStatus === UserStatus.ACTIVE;

  return (
    <ConfirmationDialog
      action={async () => {
        "use server";

        const formData = new FormData();
        formData.set("id", residentId);
        formData.set("status", nextStatus);
        await changeResidentStatusAction(formData);
      }}
      title={isActivating ? "Ativar morador?" : "Inativar morador?"}
      description={
        isActivating
          ? "O morador voltará a acessar a área de morador se a unidade estiver ativa."
          : "O morador não conseguirá acessar o sistema, mas o histórico será preservado."
      }
      confirmLabel={isActivating ? "Ativar" : "Inativar"}
    >
      <span className="inline-flex">
        <Button type="button" variant="outline">
          {isActivating ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
          {isActivating ? "Ativar" : "Inativar"}
        </Button>
      </span>
    </ConfirmationDialog>
  );
}
