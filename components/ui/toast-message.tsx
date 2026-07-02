"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastMessageProps = {
  description?: string;
  title: string;
  type: "error" | "success";
};

export function ToastMessage({ description, title, type }: ToastMessageProps) {
  const [visible, setVisible] = useState(true);
  const Icon = type === "error" ? AlertCircle : CheckCircle2;

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 5200);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm animate-toast-in rounded-lg border bg-white p-4 shadow-elevated sm:right-6 sm:top-6",
        type === "error" ? "border-red-200" : "border-emerald-200",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700",
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-navy-950">{title}</p>
          {description ? (
            <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          aria-label="Fechar aviso"
          onClick={() => setVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
