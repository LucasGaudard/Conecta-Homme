type CsvValue = Date | number | string | null | undefined;

export type CsvColumn<T> = {
  header: string;
  value: (row: T) => CsvValue;
};

function formatCsvValue(value: CsvValue) {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function escapeCsv(value: CsvValue) {
  const text = formatCsvValue(value);
  const escaped = text.replaceAll('"', '""');

  return /[",\r\n;]/.test(escaped) ? `"${escaped}"` : escaped;
}

export function toCsv<T>(
  rows: T[],
  columns: CsvColumn<T>[],
  options: { bom?: boolean } = {},
) {
  const header = columns.map((column) => escapeCsv(column.header)).join(";");
  const body = rows.map((row) =>
    columns.map((column) => escapeCsv(column.value(row))).join(";"),
  );
  const prefix = options.bom === false ? "" : "\uFEFF";

  return [`${prefix}${header}`, ...body].join("\r\n");
}

export function csvResponse(csv: string, filename: string) {
  return new Response(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}

export function timestampedFilename(prefix: string) {
  const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");

  return `${prefix}-${stamp}.csv`;
}
