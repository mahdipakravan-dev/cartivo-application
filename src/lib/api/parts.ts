import { apiClient } from "./client";
import type { PartFrontofficeResponse, PaginatedResult, PageResponse } from "./types";

function parsePage<T>(page: PageResponse, fallback: T[] = []): PaginatedResult<T> {
  return {
    items: (page.content ?? fallback) as T[],
    totalElements: page.totalElements ?? 0,
    totalPages: page.totalPages ?? 0,
    page: page.page ?? 0,
    size: page.size ?? 0,
    hasNext: page.hasNext ?? false,
    hasPrevious: page.hasPrevious ?? false,
  };
}

export interface PartSearchParams {
  brandIds?: number[];
  carIds?: number[];
  partBrandIds?: number[];
  parentPartIds?: number[];
  positionType?: "INTERIOR" | "EXTERIOR";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export type PartSearchParamsUpdate = {
  [K in keyof PartSearchParams]: PartSearchParams[K] | undefined;
};

export async function searchParts(
  params: PartSearchParams,
): Promise<PaginatedResult<PartFrontofficeResponse>> {
  try {
    const query: Record<string, unknown> = {
      page: params.page ?? 0,
      size: params.size ?? 20,
    };

    if (params.brandIds?.length) query.brandIds = params.brandIds;
    if (params.carIds?.length) query.carIds = params.carIds;
    if (params.partBrandIds?.length) query.partBrandIds = params.partBrandIds;
    if (params.parentPartIds?.length) query.parentPartIds = params.parentPartIds;
    if (params.positionType) query.positionType = params.positionType;
    if (params.minPrice != null) query.minPrice = params.minPrice;
    if (params.maxPrice != null) query.maxPrice = params.maxPrice;
    if (params.sortBy) query.sortBy = params.sortBy;
    if (params.sortDir) query.sortDir = params.sortDir;

    const { data, error } = await apiClient.GET("/api/frontoffice/parts/search", {
      params: { query },
      cache: "no-store",
    });

    if (error || !data) throw new Error("Failed to search parts");
    return parsePage<PartFrontofficeResponse>(data);
  } catch {
    return { items: [], totalElements: 0, totalPages: 0, page: 0, size: 20, hasNext: false, hasPrevious: false };
  }
}

/** Fetch a single part by ID (SSR). */
export async function getPartById(
  id: number,
): Promise<PartFrontofficeResponse | null> {
  try {
    const { data, error } = await apiClient.GET("/api/frontoffice/parts/{id}", {
      params: { path: { id } },
      cache: "no-store",
    });

    if (error || !data) return null;
    return data as PartFrontofficeResponse;
  } catch {
    return null;
  }
}
