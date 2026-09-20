import { apiClient } from "./client";
import type { PartFrontofficeResponse, PaginatedResult, PageResponse } from "./types";
import { collectPaginatedItems } from "../catalog-navigation";
import { SERVER_BASE_URL } from "./config";

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
  modelId?: number;
  partBrandIds?: number[];
  parentPartIds?: number[];
  categoryId?: number;
  categoryIds?: number[];
  positionType?: "INTERIOR" | "EXTERIOR" | "BOTH";
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

/** Fetch top-level parts that have compatible children for a vehicle brand. */
export async function getBrandTopLevelParts(
  brandId: number,
): Promise<PartFrontofficeResponse[]> {
  try {
    const url = new URL("/api/frontoffice/parts", SERVER_BASE_URL);
    url.searchParams.set("brandId", String(brandId));
    url.searchParams.set("page", "0");
    url.searchParams.set("size", "100");
    url.searchParams.set("sort", "name,asc");
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "force-cache",
      next: { tags: ["frontoffice-catalog", `vehicle-brand-parts:${brandId}`] },
    });
    if (!response.ok) throw new Error(`Failed to fetch brand parts (${response.status})`);
    const page = await response.json() as PageResponse;
    return (page.content ?? []) as PartFrontofficeResponse[];
  } catch {
    return [];
  }
}

/** Fetch every purchasable part matching the supplied catalog filters. */
export async function searchAllParts(
  params: Omit<PartSearchParams, "page" | "size">,
): Promise<PartFrontofficeResponse[]> {
  return collectPaginatedItems((page) => searchParts({
    ...params,
    page,
    size: 100,
  }));
}

/** Fetch every active top-level part for global catalog navigation. */
export async function getAllTopLevelParts(): Promise<PartFrontofficeResponse[]> {
  try {
    return await collectPaginatedItems(async (page) => {
      const { data, error } = await apiClient.GET("/api/frontoffice/parts/top-level", {
        params: {
          query: { page, size: 100, sortBy: "name", sortDir: "ASC" },
        },
        cache: "force-cache",
        next: { tags: ["top-level-parts"] },
      });

      if (error || !data) throw new Error("Failed to fetch top-level parts");
      return parsePage<PartFrontofficeResponse>(data);
    });
  } catch {
    return [];
  }
}

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
    if (params.modelId != null) query.modelId = params.modelId;
    if (params.partBrandIds?.length) query.partBrandIds = params.partBrandIds;
    if (params.parentPartIds?.length) query.parentPartIds = params.parentPartIds;
    if (params.categoryId != null) query.categoryId = params.categoryId;
    if (params.categoryIds?.length) query.categoryIds = params.categoryIds;
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
  id: string | number,
): Promise<PartFrontofficeResponse | null> {
  try {
    const numericId = Number(id);
    const { data, error } = await apiClient.GET("/api/frontoffice/parts/{id}", {
      params: { path: { id: numericId } },
      cache: "no-store",
    });

    if (error || !data) return null;
    return data as PartFrontofficeResponse;
  } catch {
    return null;
  }
}
