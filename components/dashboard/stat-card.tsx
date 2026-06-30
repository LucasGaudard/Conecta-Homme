import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  description: string;
  icon: LucideIcon;
  title: string;
  value: number | string;
};

export function StatCard({ description, icon: Icon, title, value }: StatCardProps) {
  return (
    <Card className="surface-card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-navy-100 bg-navy-50 text-navy-900">
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-normal text-navy-950">
          {value}
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}
