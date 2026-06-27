"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchInputProps = {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export function SearchInput({ onChange, placeholder, value }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}
