import { apiClient } from "./client";
import type {
  PartDetailResponse,
  PartFrontofficeResponse,
  PaginatedResult,
  PageResponse,
} from "./types";
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

/** Fetch directly assigned purchasable parts for one category. */
export async function getPartsByCategory(
  categoryId: number,
  params: Pick<PartSearchParams, "carIds" | "page" | "size"> = {},
): Promise<PaginatedResult<PartFrontofficeResponse>> {
  try {
    const url = new URL(
      `/api/frontoffice/parts/category/${categoryId}`,
      SERVER_BASE_URL,
    );
    const carId = params.carIds?.[0];
    if (carId != null) url.searchParams.set("carId", String(carId));
    url.searchParams.set("page", String(params.page ?? 0));
    url.searchParams.set("size", String(params.size ?? 20));

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch category parts (${response.status})`);
    }
    return parsePage<PartFrontofficeResponse>(await response.json() as PageResponse);
  } catch {
    return {
      items: [],
      totalElements: 0,
      totalPages: 0,
      page: params.page ?? 0,
      size: params.size ?? 20,
      hasNext: false,
      hasPrevious: false,
    };
  }
}

/** Fetch a single part by ID (SSR). */
export async function getPartById(
  id: string | number,
): Promise<PartDetailResponse | null> {
  try {
    const numericId = Number(id);
    const { data, error } = await apiClient.GET("/api/frontoffice/parts/{id}", {
      params: { path: { id: numericId } },
      cache: "no-store",
    });

    if (error || !data) return null;
    const part = data as PartFrontofficeResponse & {
      details?: PartDetailResponse["details"];
    };
    return {
      ...part,
      details: Array.isArray(part.details) ? part.details : [],
    };
  } catch {
    return null;
  }
}
