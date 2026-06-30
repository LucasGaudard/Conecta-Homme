"use client";

type FilterSelectProps = {
  label: string;
  onChange: (value: string) => void;
  options: Array<{
    label: string;
    value: string;
  }>;
  value: string;
};

export function FilterSelect({ label, onChange, options, value }: FilterSelectProps) {
  return (
    <label className="space-y-2">
      <span className="field-label">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-navy-950 shadow-sm transition duration-200 hover:border-slate-300 focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
