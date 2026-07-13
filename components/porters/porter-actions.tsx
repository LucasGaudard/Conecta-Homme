"use client";

import Link from "next/link";
import { Pencil, Power, PowerOff } from "lucide-react";
import type { UserStatus } from "@prisma/client";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { changePorterStatusAction } from "@/lib/porters/actions";

type PorterActionsProps = {
  porterId: string;
  status: UserStatus;
};

export function PorterActions({ porterId, status }: PorterActionsProps) {
  const nextStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  const changeStatus = changePorterStatusAction.bind(null, porterId, nextStatus);

  return (
    <div className="flex min-w-max items-center gap-2">
      <Button asChild variant="ghost" size="icon" aria-label="Editar porteiro">
        <Link href={`/admin/porteiros/${porterId}/editar`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <ConfirmationDialog
        action={changeStatus}
        title={status === "ACTIVE" ? "Inativar porteiro?" : "Ativar porteiro?"}
        description={
          status === "ACTIVE"
            ? "O porteiro perderá acesso operacional ao condomínio."
            : "O porteiro voltará a acessar a área da portaria."
        }
        confirmLabel={status === "ACTIVE" ? "Inativar" : "Ativar"}
      >
        <span className="inline-flex">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label={status === "ACTIVE" ? "Inativar porteiro" : "Ativar porteiro"}
          >
            {status === "ACTIVE" ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
          </Button>
        </span>
      </ConfirmationDialog>
    </div>
  );
}
