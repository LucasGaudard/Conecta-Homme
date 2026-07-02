"use client";

import { Check, Copy, Download, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type QrShareActionsProps = {
  accessCode: string;
  downloadId: string;
  unitLabel: string;
  validityLabel: string;
  visitorName?: string | null;
};

function getWhatsAppText({
  accessCode,
  unitLabel,
  validityLabel,
}: Omit<QrShareActionsProps, "downloadId" | "visitorName">) {
  return [
    "Ola!",
    "",
    "Voce foi autorizado a acessar o condominio.",
    "",
    "Apresente este QR Code ou informe o codigo:",
    "",
    accessCode,
    "",
    "Unidade:",
    unitLabel,
    "",
    "Validade:",
    validityLabel,
    "",
    "Caso tenha duvidas, procure a portaria.",
  ].join("\n");
}

export function QrShareActions({
  accessCode,
  downloadId,
  unitLabel,
  validityLabel,
}: QrShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const whatsappHref = useMemo(() => {
    const text = getWhatsAppText({ accessCode, unitLabel, validityLabel });

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [accessCode, unitLabel, validityLabel]);

  async function copyCode() {
    await navigator.clipboard.writeText(accessCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  function downloadQrCode() {
    const svg = document.getElementById(downloadId);

    if (!svg) {
      return;
    }

    const content = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-code-${accessCode}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Button type="button" variant="outline" size="sm" onClick={copyCode}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Codigo copiado" : "Copiar codigo"}
      </Button>
      <Button asChild variant="outline" size="sm">
        <a href={whatsappHref} target="_blank" rel="noreferrer">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={downloadQrCode}>
        <Download className="h-4 w-4" />
        Baixar QR
      </Button>
    </div>
  );
}
