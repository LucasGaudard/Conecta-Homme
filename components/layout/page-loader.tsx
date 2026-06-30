import {
  Skeleton,
  SkeletonCard,
  SkeletonForm,
  SkeletonList,
  SkeletonTable,
} from "@/components/ui/skeleton";

type PageLoaderProps = {
  variant?: "dashboard" | "form" | "table";
};

export function PageLoader({ variant = "dashboard" }: PageLoaderProps) {
  return (
    <div className="animate-enter space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      {variant === "form" ? (
        <SkeletonForm />
      ) : variant === "table" ? (
        <>
          <div className="surface-card p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
          <SkeletonTable />
        </>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </section>
          <section className="grid gap-4 xl:grid-cols-3">
            <SkeletonList rows={3} />
            <SkeletonList rows={3} />
            <SkeletonList rows={3} />
          </section>
        </>
      )}
    </div>
  );
}
