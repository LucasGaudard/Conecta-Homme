import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ResidentStatCardProps = {
  description: string;
  icon: LucideIcon;
  title: string;
  value: number | string;
};

export function ResidentStatCard({
  description,
  icon: Icon,
  title,
  value,
}: ResidentStatCardProps) {
  return (
    <Card className="surface-card-hover">
      <CardContent className="flex items-start gap-4 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-navy-100 bg-navy-50 text-navy-900">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-navy-950">{value}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
