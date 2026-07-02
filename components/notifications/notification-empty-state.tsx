import { BellOff } from "lucide-react";

type NotificationEmptyStateProps = {
  message?: string;
};

export function NotificationEmptyState({
  message = "Nenhuma notificacao encontrada.",
}: NotificationEmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm">
        <BellOff className="h-5 w-5" />
      </span>
      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">{message}</p>
    </div>
  );
}
