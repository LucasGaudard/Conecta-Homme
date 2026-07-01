type DashboardShellProps = {
  children: React.ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
};

export function DashboardShell({
  children,
  description,
  eyebrow,
  title,
}: DashboardShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-semibold tracking-normal text-navy-950 sm:text-3xl">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
