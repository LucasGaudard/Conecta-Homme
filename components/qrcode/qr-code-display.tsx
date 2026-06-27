"use client";

import { QRCodeSVG } from "qrcode.react";

type QrCodeDisplayProps = {
  token: string;
};

export function QrCodeDisplay({ token }: QrCodeDisplayProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-4">
      <QRCodeSVG value={token} size={196} level="M" />
    </div>
  );
}
