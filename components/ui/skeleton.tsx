import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/80", className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="surface-card p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="h-11 w-11 shrink-0 rounded-md" />
        <div className="w-full space-y-3">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="surface-card p-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="table-shell p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-48" />
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-3">
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
            <Skeleton className="h-9" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="surface-card space-y-5 p-5">
      <Skeleton className="h-5 w-48" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="ml-auto h-10 w-full sm:w-44" />
    </div>
  );
}
