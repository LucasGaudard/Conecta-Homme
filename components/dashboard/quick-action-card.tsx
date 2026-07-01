import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type QuickActionCardProps = {
  description: string;
  href: string;
  icon: LucideIcon;
  title: string;
};

export function QuickActionCard({
  description,
  href,
  icon: Icon,
  title,
}: QuickActionCardProps) {
  return (
    <Link href={href} className="surface-card surface-card-hover block p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-navy-100 bg-navy-50 text-navy-900">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-navy-950">{title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
