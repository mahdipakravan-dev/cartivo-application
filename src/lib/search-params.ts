import type { PartSearchParams } from "@/lib/api/parts";

/**
 * Parse URL search params into typed PartSearchParams.
 * Arrays are encoded as comma-separated values: ?carIds=1,2,3
 */
export function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): PartSearchParams {
  const result: PartSearchParams = {};

  const brandIds = parseNumberArray(searchParams.brandIds);
  const carIds = parseNumberArray(searchParams.carIds);
  const partBrandIds = parseNumberArray(searchParams.partBrandIds);
  const parentPartIds = parseNumberArray(searchParams.parentPartIds);

  if (brandIds) result.brandIds = brandIds;
  if (carIds) result.carIds = carIds;
  if (partBrandIds) result.partBrandIds = partBrandIds;
  if (parentPartIds) result.parentPartIds = parentPartIds;
  if (isValidPosition(searchParams.position)) result.positionType = searchParams.position as "INTERIOR" | "EXTERIOR";

  const minPrice = parseNumber(searchParams.minPrice);
  const maxPrice = parseNumber(searchParams.maxPrice);
  const page = parseNumber(searchParams.page);
  const size = parseNumber(searchParams.size);

  if (minPrice != null) result.minPrice = minPrice;
  if (maxPrice != null) result.maxPrice = maxPrice;
  if (page != null) result.page = page;
  if (size != null) result.size = size;
  if (typeof searchParams.sort === "string") result.sortBy = searchParams.sort;
  if (isValidSortDir(searchParams.dir)) result.sortDir = searchParams.dir as "ASC" | "DESC";

  return result;
}

/**
 * Build a URLSearchParams object from PartSearchParams.
 * Omits undefined/empty values.
 */
export function buildSearchParams(
  params: PartSearchParams,
  overrides?: Partial<Record<keyof PartSearchParams, unknown>>,
): URLSearchParams {
  const merged = { ...params, ...overrides };
  const sp = new URLSearchParams();

  if (Array.isArray(merged.brandIds) && merged.brandIds.length) sp.set("brandIds", (merged.brandIds as number[]).join(","));
  if (Array.isArray(merged.carIds) && merged.carIds.length) sp.set("carIds", (merged.carIds as number[]).join(","));
  if (Array.isArray(merged.partBrandIds) && merged.partBrandIds.length) sp.set("partBrandIds", (merged.partBrandIds as number[]).join(","));
  if (Array.isArray(merged.parentPartIds) && merged.parentPartIds.length) sp.set("parentPartIds", (merged.parentPartIds as number[]).join(","));
  if (merged.positionType) sp.set("position", merged.positionType as string);
  if (merged.minPrice != null) sp.set("minPrice", String(merged.minPrice));
  if (merged.maxPrice != null) sp.set("maxPrice", String(merged.maxPrice));
  if (merged.page) sp.set("page", String(merged.page));
  if (merged.sortBy) sp.set("sort", merged.sortBy as string);
  if (merged.sortDir) sp.set("dir", merged.sortDir as string);

  return sp;
}

function parseNumberArray(value: string | string[] | undefined): number[] | undefined {
  if (!value) return undefined;
  const raw = Array.isArray(value) ? value.join(",") : value;
  const nums = raw.split(",").map(Number).filter((n) => !isNaN(n) && n > 0);
  return nums.length ? nums : undefined;
}

function parseNumber(value: string | string[] | undefined): number | undefined {
  if (!value) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  const num = Number(raw);
  return isNaN(num) ? undefined : num;
}

function isValidPosition(value: string | string[] | undefined): boolean {
  return value === "INTERIOR" || value === "EXTERIOR";
}

function isValidSortDir(value: string | string[] | undefined): boolean {
  return value === "ASC" || value === "DESC";
}
