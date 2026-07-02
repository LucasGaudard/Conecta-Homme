"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";

type ConfirmationDialogProps = {
  action: () => void | Promise<void>;
  children: React.ReactNode;
  confirmLabel?: string;
  description: string;
  title: string;
};

export function ConfirmationDialog({
  action,
  children,
  confirmLabel = "Confirmar",
  description,
  title,
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="contents"
      >
        {children}
      </span>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/45 px-4">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-navy-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <form action={action}>
                <SubmitButton pendingLabel="Confirmando...">
                  {confirmLabel}
                </SubmitButton>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
