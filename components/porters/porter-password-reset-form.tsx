"use client";

import { KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { resetPorterPasswordAction } from "@/lib/porters/actions";

type PorterPasswordResetFormProps = {
  porterId: string;
};

export function PorterPasswordResetForm({ porterId }: PorterPasswordResetFormProps) {
  return (
    <form
      action={resetPorterPasswordAction}
      className="surface-card space-y-4 p-5"
      onSubmit={(event) => {
        if (!window.confirm("Confirmar redefinição da senha temporária deste porteiro?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={porterId} />
      <div>
        <h3 className="text-base font-semibold text-navy-950">Senha temporária</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Defina uma senha temporária e oriente o porteiro a alterar a senha
          nas configurações após o primeiro acesso.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Input
          name="password"
          type="password"
          minLength={6}
          placeholder="Nova senha temporária"
          required
        />
        <SubmitButton pendingLabel="Redefinindo...">
          <KeyRound className="h-4 w-4" />
          Redefinir
        </SubmitButton>
      </div>
    </form>
  );
}
