import { Camera, Image as ImageIcon } from "lucide-react";
import { AvatarInitial } from "@/components/ui/avatar";

type AccountAvatarCardProps = {
  name: string;
};

export function AccountAvatarCard({ name }: AccountAvatarCardProps) {
  return (
    <section className="surface-card p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative">
          <AvatarInitial
            name={name}
            className="h-20 w-20 border-navy-100 bg-navy-950 text-2xl text-white"
          />
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-navy-950 shadow-sm">
            <Camera className="h-4 w-4" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-slate-400" />
            <h3 className="text-base font-semibold text-navy-950">
              Foto de perfil
            </h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            A estrutura visual do avatar ja esta preparada. Nesta etapa, o
            perfil utiliza iniciais do nome enquanto o upload de imagem fica
            reservado para uma evolucao futura.
          </p>
        </div>
      </div>
    </section>
  );
}
