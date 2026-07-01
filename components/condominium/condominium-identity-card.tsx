import type { CondominiumSettings } from "@prisma/client";
import { Building2, Image as ImageIcon, Palette } from "lucide-react";
import {
  formatCondominiumUpdatedAt,
  getCondominiumInitials,
} from "@/lib/condominium/format";

type CondominiumIdentityCardProps = {
  settings: CondominiumSettings;
};

export function CondominiumIdentityCard({
  settings,
}: CondominiumIdentityCardProps) {
  return (
    <section className="surface-card p-5">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-navy-100 bg-navy-950 text-2xl font-semibold text-white shadow-soft">
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logoUrl}
                alt={`Logo ${settings.name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              getCondominiumInitials(settings.name)
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              Identidade visual
            </p>
            <h3 className="mt-1 truncate text-lg font-semibold text-navy-950">
              {settings.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Atualizado em {formatCondominiumUpdatedAt(settings)}
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="info-tile">
            <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
              <ImageIcon className="h-4 w-4" />
              Logo
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              O campo de URL da logo ja deixa a estrutura preparada para imagem
              do condominio, sem upload complexo nesta etapa.
            </p>
          </div>
          <div className="info-tile">
            <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
              <Palette className="h-4 w-4" />
              Padrao visual
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A tela preserva a identidade premium atual com superficie branca,
              azul escuro e estados discretos.
            </p>
          </div>
          <div className="info-tile">
            <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-400">
              <Building2 className="h-4 w-4" />
              Registro unico
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              As configuracoes funcionam como registro unico do condominio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
