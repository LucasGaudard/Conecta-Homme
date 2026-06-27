"use client";

import Link from "next/link";
import { Eye, Pencil, PowerOff } from "lucide-react";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { inactivateUnitAction } from "@/lib/units/actions";

type UnitRowActionsProps = {
  unitId: string;
};

export function UnitRowActions({ unitId }: UnitRowActionsProps) {
  const inactivate = inactivateUnitAction.bind(null, unitId);

  return (
    <div className="flex min-w-max items-center gap-2">
      <Button asChild variant="ghost" size="icon" aria-label="Visualizar unidade">
        <Link href={`/admin/unidades/${unitId}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" aria-label="Editar unidade">
        <Link href={`/admin/unidades/${unitId}/editar`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <ConfirmationDialog
        action={inactivate}
        title="Inativar unidade?"
        description="Ao inativar esta unidade, todos os moradores vinculados tambem serao inativados."
        confirmLabel="Inativar"
      >
        <span className="inline-flex">
          <Button variant="ghost" size="icon" type="button" aria-label="Inativar unidade">
          <PowerOff className="h-4 w-4" />
          </Button>
        </span>
      </ConfirmationDialog>
    </div>
  );
}
