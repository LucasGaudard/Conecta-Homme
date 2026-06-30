"use client";

import { QRCodeSVG } from "qrcode.react";

type QrCodeDisplayProps = {
  token: string;
};

export function QrCodeDisplay({ token }: QrCodeDisplayProps) {
  return (
    <div className="inline-flex max-w-full rounded-lg border border-slate-200 bg-white p-3 shadow-soft sm:p-4">
      <QRCodeSVG value={token} size={196} level="M" className="h-auto max-w-full" />
    </div>
  );
}
