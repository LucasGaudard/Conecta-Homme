import type { ReactNode } from "react";
import { Clock3 } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ActivityFeedItem = {
  description?: string;
  icon?: ReactNode;
  id: string;
  meta?: string;
  title: string;
};

type ActivityFeedProps = {
  emptyMessage: string;
  items: ActivityFeedItem[];
  title: string;
};

export function ActivityFeed({ emptyMessage, items, title }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-200/70 p-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-navy-100 bg-navy-50 text-navy-900">
                    {item.icon ?? <Clock3 className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-medium text-navy-950">{item.title}</p>
                      {item.meta ? (
                        <p className="text-xs font-medium text-slate-400">{item.meta}</p>
                      ) : null}
                    </div>
                    {item.description ? (
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {item.description}
                      </p>
                    ) : null}
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
