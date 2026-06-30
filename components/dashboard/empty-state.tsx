import { Inbox } from "lucide-react";

type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-4 py-7 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm">
        <Inbox className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}
