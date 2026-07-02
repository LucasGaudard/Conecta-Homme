"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DataTableToolbarProps = {
  activeFilters?: number;
  onClear?: () => void;
  onSearchChange: (value: string) => void;
  placeholder: string;
  resultLabel: string;
  searchValue: string;
};

export function DataTableToolbar({
  activeFilters = 0,
  onClear,
  onSearchChange,
  placeholder,
  resultLabel,
  searchValue,
}: DataTableToolbarProps) {
  const [localValue, setLocalValue] = useState(searchValue);

  useEffect(() => {
    setLocalValue(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearchChange(localValue);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [localValue, onSearchChange]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={localValue}
          onChange={(event) => setLocalValue(event.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500">{resultLabel}</p>
        {activeFilters > 0 && onClear ? (
          <Button type="button" variant="outline" size="sm" onClick={onClear}>
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        ) : null}
      </div>
    </div>
  );
}
