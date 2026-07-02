export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];
export type SortDirection = "asc" | "desc";

export type SearchParamValue = string | string[] | undefined;
export type SearchParamRecord = Record<string, SearchParamValue>;

export function getSearchParam(
  searchParams: SearchParamRecord | undefined,
  key: string,
) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function normalizePage(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export function normalizePageSize(value: string | undefined) {
  const parsed = Number(value);
  return PAGE_SIZE_OPTIONS.includes(parsed as PageSizeOption)
    ? (parsed as PageSizeOption)
    : 10;
}

export function normalizeSortDirection(value: string | undefined): SortDirection {
  return value === "asc" ? "asc" : "desc";
}

export function tableParamKeys(tableKey: string) {
  return {
    direction: `${tableKey}Dir`,
    page: `${tableKey}Page`,
    pageSize: `${tableKey}PageSize`,
    sort: `${tableKey}Sort`,
  };
}

export function pageCount(totalItems: number, pageSize: number) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages);
}

export function pageSlice<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function hrefWithParams(
  searchParams: SearchParamRecord | undefined,
  updates: Record<string, string | number | undefined>,
) {
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

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : "?";
}
