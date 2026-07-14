"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISSED_KEY = "condotech-install-guidance-dismissed-v2";

function isStandaloneMode() {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function isIOSDevice() {
  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };
  const userAgent = window.navigator.userAgent.toLowerCase();

  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes("macintosh") && navigator.maxTouchPoints > 1) ||
    navigatorWithStandalone.standalone === true
  );
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [mode, setMode] = useState<"manual" | "prompt" | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandaloneMode() || window.localStorage.getItem(DISMISSED_KEY) === "true") {
      return;
    }

    let installPromptReceived = false;
    const fallbackTimeout = window.setTimeout(() => {
      if (!installPromptReceived && !isStandaloneMode()) {
        setIsIOS(isIOSDevice());
        setMode("manual");
        setVisible(true);
      }
    }, 2500);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      installPromptReceived = true;
      window.clearTimeout(fallbackTimeout);
      setInstallEvent(event as BeforeInstallPromptEvent);
      setMode("prompt");
      setVisible(true);
    };

    const handleInstalled = () => {
      setVisible(false);
      setInstallEvent(null);
      setMode(null);
      window.localStorage.setItem(DISMISSED_KEY, "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.clearTimeout(fallbackTimeout);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (!visible || !mode) {
    return null;
  }

  async function installApp() {
    if (!installEvent) return;

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setVisible(false);
    setInstallEvent(null);
    setMode(null);

    if (choice.outcome === "dismissed") {
      window.localStorage.setItem(DISMISSED_KEY, "true");
    }
  }

  function dismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  }

  const description =
    mode === "prompt"
      ? "Abra o CONDOTECH em modo app neste dispositivo."
      : isIOS
        ? "No Safari, toque em Compartilhar e selecione Adicionar à Tela de Início."
        : "Abra o menu do navegador e escolha Instalar app ou Adicionar à tela inicial.";

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-3 shadow-elevated sm:bottom-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-950 text-white">
          <Download className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-navy-950">Instalar aplicativo</p>
          <p className="text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
        {mode === "prompt" ? (
          <Button type="button" size="sm" onClick={installApp}>
            Instalar
          </Button>
        ) : null}
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
