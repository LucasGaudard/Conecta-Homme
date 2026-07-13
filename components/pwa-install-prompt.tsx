"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISSED_KEY = "condotech-install-dismissed";

function isStandaloneMode() {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneMode() || window.localStorage.getItem(DISMISSED_KEY) === "true") {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const handleInstalled = () => {
      setVisible(false);
      setInstallEvent(null);
      window.localStorage.setItem(DISMISSED_KEY, "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!visible || !installEvent) {
    return null;
  }

  async function installApp() {
    if (!installEvent) return;

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setVisible(false);
    setInstallEvent(null);

    if (choice.outcome === "dismissed") {
      window.localStorage.setItem(DISMISSED_KEY, "true");
    }
  }

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-3 shadow-elevated sm:bottom-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-950 text-white">
          <Download className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-navy-950">Instalar aplicativo</p>
          <p className="text-xs leading-5 text-slate-500">
            Abra o CONDOTECH em modo app neste dispositivo.
          </p>
        </div>
        <Button type="button" size="sm" onClick={installApp}>
          Instalar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Fechar sugestao de instalacao"
          onClick={dismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
