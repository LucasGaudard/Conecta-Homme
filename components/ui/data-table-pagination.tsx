import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  hrefWithParams,
  type SearchParamRecord,
} from "@/components/ui/data-table-params";
import { PageSizeSelect } from "@/components/ui/page-size-select";
import { cn } from "@/lib/utils";

type DataTablePaginationProps = {
  page: number;
  pageParam: string;
  pageSize: number;
  pageSizeParam: string;
  searchParams?: SearchParamRecord;
  totalItems: number;
  totalPages: number;
};

function PaginationLink({
  children,
  disabled,
  href,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  href: string;
}) {
  return (
    <Link
      href={disabled ? "#" : href}
      aria-disabled={disabled}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-navy-950 shadow-sm transition hover:bg-slate-50",
        disabled && "pointer-events-none opacity-45",
      )}
    >
      {children}
    </Link>
  );
}

export function DataTablePagination({
  page,
  pageParam,
  pageSize,
  pageSizeParam,
  searchParams,
  totalItems,
  totalPages,
}: DataTablePaginationProps) {
  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-navy-950">
          {totalItems} registro(s)
        </p>
        <p className="text-xs text-slate-500">
          Exibindo {firstItem}-{lastItem} de {totalItems} · Pagina {page} de{" "}
          {totalPages}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <PageSizeSelect
          pageParam={pageParam}
          pageSize={pageSize}
          pageSizeParam={pageSizeParam}
          searchParams={searchParams}
        />
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <PaginationLink
            disabled={page <= 1}
            href={hrefWithParams(searchParams, { [pageParam]: page - 1 })}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </PaginationLink>
          <PaginationLink
            disabled={page >= totalPages}
            href={hrefWithParams(searchParams, { [pageParam]: page + 1 })}
          >
            Proxima
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </div>
      </div>
    </div>
  );
}
