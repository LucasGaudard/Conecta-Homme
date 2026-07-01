import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  hrefWithParams,
  type SearchParamRecord,
  type SortDirection,
} from "@/components/ui/data-table-params";
import { cn } from "@/lib/utils";

type SortableHeaderProps = {
  activeSort?: string;
  children: React.ReactNode;
  direction?: SortDirection;
  pageParam: string;
  searchParams?: SearchParamRecord;
  sortKey: string;
  sortParam: string;
  directionParam: string;
};

export function SortableHeader({
  activeSort,
  children,
  direction = "desc",
  directionParam,
  pageParam,
  searchParams,
  sortKey,
  sortParam,
}: SortableHeaderProps) {
  const active = activeSort === sortKey;
  const nextDirection: SortDirection = active && direction === "asc" ? "desc" : "asc";
  const Icon = active ? (direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <Link
      href={hrefWithParams(searchParams, {
        [directionParam]: nextDirection,
        [pageParam]: 1,
        [sortParam]: sortKey,
      })}
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-1 py-0.5 transition-colors hover:bg-slate-100 hover:text-navy-950",
        active && "text-navy-950",
      )}
    >
      {children}
      <Icon className="h-3.5 w-3.5" />
    </Link>
  );
}
