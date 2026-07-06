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
    "Você foi autorizado a acessar o condomínio.",
    "",
    "Apresente este QR Code ou informe o código:",
    "",
    accessCode,
    "",
    "Unidade:",
    unitLabel,
    "",
    "Validade:",
    validityLabel,
    "",
    "Caso tenha dúvidas, procure a portaria.",
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
    <div className="grid min-w-0 gap-2 lg:grid-cols-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-w-0 w-full whitespace-normal"
        onClick={copyCode}
      >
        {copied ? (
          <Check className="h-4 w-4 shrink-0" />
        ) : (
          <Copy className="h-4 w-4 shrink-0" />
        )}
        <span className="min-w-0 leading-5">
          {copied ? "Código copiado" : "Copiar código"}
        </span>
      </Button>
      <Button asChild variant="outline" size="sm">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 w-full whitespace-normal"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span className="min-w-0 leading-5">WhatsApp</span>
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-w-0 w-full whitespace-normal"
        onClick={downloadQrCode}
      >
        <Download className="h-4 w-4 shrink-0" />
        <span className="min-w-0 leading-5">Baixar QR</span>
      </Button>
    </div>
  );
}
