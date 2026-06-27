import { Inbox } from "lucide-react";

type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
      <Inbox className="h-5 w-5 text-slate-400" />
      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
}
