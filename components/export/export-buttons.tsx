import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SearchParamRecord } from "@/components/ui/data-table-params";

type ExportButtonsProps = {
  basePath: string;
  label?: string;
  searchParams?: SearchParamRecord;
};

function buildExportHref(basePath: string, searchParams?: SearchParamRecord) {
  const params = new URLSearchParams();

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
      return;
    }

    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function ExportButtons({
  basePath,
  label = "Exportar CSV",
  searchParams,
}: ExportButtonsProps) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={buildExportHref(basePath, searchParams)} prefetch={false}>
        <Download className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}
