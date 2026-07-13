import { UserStatus } from "@prisma/client";
import { Power, PowerOff } from "lucide-react";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { changePorterStatusAction } from "@/lib/porters/actions";

type PorterStatusFormProps = {
  porterId: string;
  status: UserStatus;
};

export function PorterStatusForm({ porterId, status }: PorterStatusFormProps) {
  const nextStatus =
    status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
  const action = changePorterStatusAction;
  const isActivating = nextStatus === UserStatus.ACTIVE;

  return (
    <ConfirmationDialog
      action={async () => {
        "use server";

        const formData = new FormData();
        formData.set("id", porterId);
        formData.set("status", nextStatus);
        await action(formData);
      }}
      title={isActivating ? "Ativar porteiro?" : "Inativar porteiro?"}
      description={
        isActivating
          ? "O porteiro voltará a acessar a portaria deste condomínio."
          : "O porteiro não conseguirá acessar o sistema, mas o histórico será preservado."
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
