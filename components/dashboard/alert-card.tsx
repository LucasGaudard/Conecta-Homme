import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AlertItem = {
  description: string;
  id: string;
  title: string;
  tone?: "danger" | "info" | "warning";
};

type AlertCardProps = {
  emptyMessage: string;
  icon?: LucideIcon;
  items: AlertItem[];
  title: string;
};

const toneClasses = {
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-navy-100 bg-navy-50 text-navy-900",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

export function AlertCard({
  emptyMessage,
  icon: Icon = AlertTriangle,
  items,
  title,
}: AlertCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            {emptyMessage}
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "rounded-lg border p-3",
                  toneClasses[item.tone ?? "warning"],
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-5 opacity-80">{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
