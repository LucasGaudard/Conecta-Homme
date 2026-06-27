import { FileSearch } from "lucide-react";

type ReportEmptyStateProps = {
  message: string;
};

export function ReportEmptyState({ message }: ReportEmptyStateProps) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
      <FileSearch className="h-6 w-6 text-slate-400" />
      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
}
