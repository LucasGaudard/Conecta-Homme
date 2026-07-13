import type { UserStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { createPorterAction, updatePorterAction } from "@/lib/porters/actions";
import { formatUnitStatus } from "@/lib/units/format";

type PorterFormProps =
  | {
      error?: string;
      mode: "create";
      porter?: never;
    }
  | {
      error?: string;
      mode: "edit";
      porter: {
        email: string;
        id: string;
        name: string;
        phone: string | null;
        status: UserStatus;
      };
    };

const fieldClass = "space-y-2";
const labelClass = "field-label";

export function PorterForm({ error, mode, porter }: PorterFormProps) {
  const action = mode === "create" ? createPorterAction : updatePorterAction.bind(null, porter.id);

  return (
    <form action={action} className="surface-card space-y-5 p-5">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <div>
        <h3 className="text-base font-semibold text-navy-950">
          {mode === "create" ? "Novo porteiro" : "Editar porteiro"}
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Cadastre o acesso da portaria vinculado apenas ao seu condomínio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={fieldClass}>
          <span className={labelClass}>Nome</span>
          <Input name="name" defaultValue={porter?.name} required />
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>Telefone</span>
          <Input name="phone" defaultValue={porter?.phone ?? ""} />
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>E-mail</span>
          <Input name="email" type="email" defaultValue={porter?.email} required />
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>
            {mode === "create" ? "Senha inicial" : "Redefinir senha"}
          </span>
          <Input
            name="password"
            type="password"
            minLength={6}
            required={mode === "create"}
            placeholder={mode === "create" ? "Mínimo de 6 caracteres" : "Deixe em branco para manter"}
          />
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>Status</span>
          <select
            name="status"
            defaultValue={porter?.status ?? "ACTIVE"}
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          >
            {(["ACTIVE", "INACTIVE"] satisfies UserStatus[]).map((status) => (
              <option key={status} value={status}>
                {formatUnitStatus(status)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex justify-end">
        <SubmitButton
          className="w-full sm:w-auto"
          pendingLabel={mode === "create" ? "Cadastrando..." : "Salvando..."}
        >
          {mode === "create" ? "Cadastrar porteiro" : "Salvar alterações"}
        </SubmitButton>
      </div>
    </form>
  );
}
