import type { PresenceStatus, Unit, UnitStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { createUnitAction, updateUnitAction } from "@/lib/units/actions";
import { formatPresenceStatus, formatUnitStatus } from "@/lib/units/format";

type UnitFormProps =
  | {
      error?: string;
      mode: "create";
      unit?: never;
    }
  | {
      error?: string;
      mode: "edit";
      unit: Unit;
    };

const fieldClass = "space-y-2";
const labelClass = "field-label";

export function UnitForm({ error, mode, unit }: UnitFormProps) {
  const action = mode === "edit" ? updateUnitAction.bind(null, unit.id) : createUnitAction;

  return (
    <form action={action} className="space-y-6">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <section className="surface-card p-5">
        <h3 className="text-base font-semibold text-navy-950">Dados da unidade</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {mode === "create" ? (
            <>
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="block">Bloco</label>
                <Input id="block" name="block" required placeholder="A" />
              </div>
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="apartment">Apartamento</label>
                <Input id="apartment" name="apartment" required placeholder="201" />
              </div>
            </>
          ) : null}
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="responsibleName">Responsavel</label>
            <Input
              id="responsibleName"
              name="responsibleName"
              required
              defaultValue={unit?.responsibleName}
              placeholder="Nome do responsavel"
            />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="cpf">CPF</label>
            <Input id="cpf" name="cpf" defaultValue={unit?.cpf ?? ""} placeholder="Opcional" />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="phone">Telefone</label>
            <Input id="phone" name="phone" defaultValue={unit?.phone ?? ""} placeholder="Opcional" />
          </div>
          <div className={fieldClass}>
            <label className={labelClass} htmlFor="email">E-mail da unidade</label>
            <Input id="email" name="email" type="email" defaultValue={unit?.email ?? ""} placeholder="Opcional" />
          </div>
          {mode === "edit" ? (
            <>
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={unit.status}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
                >
                  {(["ACTIVE", "INACTIVE"] satisfies UnitStatus[]).map((status) => (
                    <option key={status} value={status}>{formatUnitStatus(status)}</option>
                  ))}
                </select>
              </div>
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="presenceStatus">Status de presenca</label>
                <select
                  id="presenceStatus"
                  name="presenceStatus"
                  defaultValue={unit.presenceStatus}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
                >
                  {(["HOME", "AWAY", "DO_NOT_DISTURB"] satisfies PresenceStatus[]).map((status) => (
                    <option key={status} value={status}>{formatPresenceStatus(status)}</option>
                  ))}
                </select>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {mode === "create" ? (
        <section className="surface-card p-5">
          <h3 className="text-base font-semibold text-navy-950">Morador inicial</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className={fieldClass}>
              <label className={labelClass} htmlFor="residentName">Nome</label>
              <Input id="residentName" name="residentName" required placeholder="Nome do morador" />
            </div>
            <div className={fieldClass}>
              <label className={labelClass} htmlFor="residentEmail">E-mail</label>
              <Input id="residentEmail" name="residentEmail" type="email" required placeholder="morador@email.com" />
            </div>
            <div className={fieldClass}>
              <label className={labelClass} htmlFor="residentUsername">Username</label>
              <Input id="residentUsername" name="residentUsername" placeholder="Opcional" />
            </div>
            <div className={fieldClass}>
              <label className={labelClass} htmlFor="residentPassword">Senha inicial</label>
              <Input id="residentPassword" name="residentPassword" type="password" required minLength={6} />
            </div>
          </div>
        </section>
      ) : null}

      <div className="flex justify-end gap-3">
        <SubmitButton
          className="w-full sm:w-auto"
          pendingLabel={mode === "create" ? "Cadastrando..." : "Salvando..."}
        >
          {mode === "create" ? "Cadastrar unidade" : "Salvar alteracoes"}
        </SubmitButton>
      </div>
    </form>
  );
}
