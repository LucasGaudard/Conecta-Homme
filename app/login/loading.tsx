import { Skeleton, SkeletonForm } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-navy-950 px-10 py-12 lg:block" />
      <section className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full max-w-md space-y-5">
          <div className="mx-auto flex w-max items-center gap-3 lg:hidden">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-5 w-36" />
          </div>
          <SkeletonForm />
        </div>
      </section>
    </main>
  );
}
