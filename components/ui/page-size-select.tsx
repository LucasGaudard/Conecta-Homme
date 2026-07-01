import Link from "next/link";
import {
  hrefWithParams,
  PAGE_SIZE_OPTIONS,
  type SearchParamRecord,
} from "@/components/ui/data-table-params";
import { cn } from "@/lib/utils";

type PageSizeSelectProps = {
  pageParam: string;
  pageSize: number;
  pageSizeParam: string;
  searchParams?: SearchParamRecord;
};

export function PageSizeSelect({
  pageParam,
  pageSize,
  pageSizeParam,
  searchParams,
}: PageSizeSelectProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <span>Itens por pagina</span>
      <div className="flex rounded-md border border-slate-200 bg-white p-1 shadow-sm">
        {PAGE_SIZE_OPTIONS.map((option) => (
          <Link
            key={option}
            href={hrefWithParams(searchParams, {
              [pageParam]: 1,
              [pageSizeParam]: option,
            })}
            className={cn(
              "rounded px-2.5 py-1 text-sm font-medium transition-colors",
              pageSize === option
                ? "bg-navy-950 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-navy-950",
            )}
          >
            {option}
          </Link>
        ))}
      </div>
    </div>
  );
}
