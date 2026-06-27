import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";

export type RecentListItem = {
  id: string;
  description?: string;
  meta?: string;
  title: string;
};

type RecentListProps = {
  emptyMessage: string;
  icon?: ReactNode;
  items: RecentListItem[];
  title: string;
};

export function RecentList({ emptyMessage, icon, items, title }: RecentListProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base text-navy-950">{title}</CardTitle>
        {icon ? <span className="text-navy-700">{icon}</span> : null}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-950">
                      {item.title}
                    </p>
                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  {item.meta ? (
                    <p className="shrink-0 text-xs font-medium text-slate-400">
                      {item.meta}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
