"use client";

/* eslint-disable @next/next/no-img-element */

import type { Unit } from "@prisma/client";
import { ImagePlus, PackagePlus, X } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { createPackageAction } from "@/lib/packages/actions";

type PackageFormProps = {
  query: string;
  units: Unit[];
};

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxPhotoSize = 5 * 1024 * 1024;

export function PackageForm({ query, units }: PackageFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function clearPhoto() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setPhotoError(null);
    setPhotoName(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setPhotoError(null);
    setPhotoName(null);

    if (!file) {
      return;
    }

    if (!acceptedImageTypes.includes(file.type)) {
      setPhotoError("Envie uma foto em JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > maxPhotoSize) {
      setPhotoError("A foto deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    setPhotoName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <form action={createPackageAction} className="surface-card space-y-5 p-5">
      <input type="hidden" name="query" value={query} />
      <div>
        <h3 className="text-base font-semibold text-navy-950">Cadastrar encomenda</h3>
        <p className="mt-1 text-sm text-slate-500">
          Busque a unidade e registre a encomenda recebida na portaria.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 sm:col-span-2">
          <span className="field-label">Unidade</span>
          <select
            name="unitId"
            required
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
          >
            <option value="">Selecione uma unidade</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.block}-{unit.apartment} - {unit.responsibleName}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Transportadora</span>
          <Input name="carrier" placeholder="Opcional" />
        </label>
        <label className="space-y-2">
          <span className="field-label">Código de rastreio</span>
          <Input name="trackingCode" placeholder="Opcional" />
        </label>
        <label className="space-y-2">
          <span className="field-label">Código de retirada</span>
          <Input name="pickupCode" placeholder="Opcional" />
        </label>
        <label className="space-y-2 sm:col-span-2">
          <span className="field-label">Descrição</span>
          <Input name="description" placeholder="Opcional" />
        </label>
        <div className="space-y-3 sm:col-span-2">
          <div className="space-y-2">
            <span className="field-label">Foto da encomenda</span>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center transition hover:border-slate-400 hover:bg-slate-50">
              <ImagePlus className="h-8 w-8 text-slate-400" />
              <span className="mt-2 text-sm font-medium text-navy-950">
                Selecione ou tire uma foto
              </span>
              <span className="mt-1 text-xs text-slate-500">
                JPG, PNG ou WEBP até 5 MB.
              </span>
              <input
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                name="packagePhoto"
                onChange={handlePhotoChange}
                type="file"
              />
            </label>
          </div>

          {photoError ? <p className="text-sm text-red-600">{photoError}</p> : null}

          {previewUrl ? (
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
              <img
                alt="Prévia da foto da encomenda"
                className="h-32 w-full rounded-md object-cover sm:w-40"
                src={previewUrl}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy-950">
                  {photoName}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  A foto será enviada ao salvar a encomenda.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={clearPhoto}
              >
                <X className="h-4 w-4" />
                Remover
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end">
        <SubmitButton
          disabled={units.length === 0}
          className="w-full sm:w-auto"
          pendingLabel="Enviando..."
        >
          <PackagePlus className="h-4 w-4" />
          Cadastrar encomenda
        </SubmitButton>
      </div>
    </form>
  );
}
