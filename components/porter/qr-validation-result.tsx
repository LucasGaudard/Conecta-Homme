import { CheckCircle2, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { registerQrAccessAction } from "@/lib/qrcode/actions";
import type { getQrValidationResult } from "@/lib/qrcode/queries";

type QrValidationResultProps = {
  result: Awaited<ReturnType<typeof getQrValidationResult>>;
};

export function QrValidationResult({ result }: QrValidationResultProps) {
  if (!result) {
    return null;
  }

  if (!result.allowed || !("unit" in result) || !result.unit) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
        <div className="flex items-center gap-2 font-semibold">
          <XCircle className="h-5 w-5" />
          {result.reason}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <div className="flex items-center gap-2 font-semibold text-emerald-700">
        <CheckCircle2 className="h-5 w-5" />
        Acesso autorizado
      </div>
      <div className="grid gap-3 rounded-lg border border-emerald-100 bg-white p-4 shadow-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Tipo</p>
          <p className="mt-1 text-sm text-navy-950">
            {result.qrCode.type === "RESIDENT" ? "Morador" : "Visitante"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Unidade</p>
          <p className="mt-1 text-sm text-navy-950">
            {result.unit.block}-{result.unit.apartment}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Responsavel</p>
          <p className="mt-1 text-sm text-navy-950">{result.unit.responsibleName}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Presenca</p>
          <div className="mt-1">
            <StatusBadge status={result.unit.presenceStatus} type="presence" />
          </div>
        </div>
        {result.visitor ? (
          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase text-slate-400">Visitante</p>
            <p className="mt-1 text-sm text-navy-950">{result.visitor.name}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <form action={registerQrAccessAction} className="flex-1">
          <input type="hidden" name="token" value={result.token} />
          <Button type="submit" name="accessType" value="ENTRY" className="w-full">
            Registrar entrada
          </Button>
        </form>
        <form action={registerQrAccessAction} className="flex-1">
          <input type="hidden" name="token" value={result.token} />
          <Button type="submit" name="accessType" value="EXIT" variant="outline" className="w-full bg-white">
            Registrar saida
          </Button>
        </form>
      </div>
    </div>
  );
}
