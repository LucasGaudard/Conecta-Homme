"use client";

import { QRCodeSVG } from "qrcode.react";

type QrCodeDisplayProps = {
  id?: string;
  value: string;
};

export function QrCodeDisplay({ id, value }: QrCodeDisplayProps) {
  return (
    <div className="inline-flex max-w-full rounded-lg border border-slate-200 bg-white p-3 shadow-soft sm:p-4">
      <QRCodeSVG
        id={id}
        value={value}
        size={196}
        level="M"
        className="h-auto max-w-full"
      />
    </div>
  );
}
