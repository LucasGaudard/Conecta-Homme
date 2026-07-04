import type { LeisureSpace } from "@prisma/client";
import { CalendarPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { requestSpaceReservationAction } from "@/lib/reservations/actions";

type ReservationRequestFormProps = {
  spaces: LeisureSpace[];
};

const fieldClass = "space-y-2";
const labelClass = "field-label";
const textareaClass =
  "min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15";

export function ReservationRequestForm({ spaces }: ReservationRequestFormProps) {
  return (
    <form action={requestSpaceReservationAction} className="surface-card space-y-5 p-5">
      <div>
        <h3 className="text-base font-semibold text-navy-950">Solicitar reserva</h3>
        <p className="mt-1 text-sm text-slate-500">
          Escolha um espaco, data e horario. A solicitacao fica pendente ate analise do admin.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className={`${fieldClass} sm:col-span-2`}>
          <span className={labelClass}>Espaco</span>
          <select
            name="spaceId"
            required
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          >
            <option value="">Selecione</option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name}
              </option>
            ))}
          </select>
        </label>
        <label className={fieldClass}>
          <span className={labelClass}>Data</span>
          <Input name="date" type="date" required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={fieldClass}>
            <span className={labelClass}>Inicio</span>
            <Input name="startTime" type="time" required />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>Fim</span>
            <Input name="endTime" type="time" required />
          </label>
        </div>
        <label className={`${fieldClass} sm:col-span-2 lg:col-span-4`}>
          <span className={labelClass}>Observacao</span>
          <textarea name="notes" className={textareaClass} placeholder="Opcional" />
        </label>
      </div>
      <div className="flex justify-end">
        <SubmitButton disabled={spaces.length === 0} className="w-full sm:w-auto" pendingLabel="Solicitando...">
          <CalendarPlus className="h-4 w-4" />
          Solicitar reserva
        </SubmitButton>
      </div>
    </form>
  );
}
