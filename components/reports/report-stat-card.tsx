import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ReportStatCardProps = {
  description: string;
  icon: LucideIcon;
  title: string;
  value: number | string;
};

export function ReportStatCard({
  description,
  icon: Icon,
  title,
  value,
}: ReportStatCardProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="flex items-start gap-4 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-50 text-navy-900">
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
