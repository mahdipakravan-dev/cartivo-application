import { collectPaginatedItems } from "../catalog-navigation";
import { apiClient } from "./client";
import { SERVER_BASE_URL } from "./config";
import type {
  CategorySummaryResponse,
  PartFrontofficeResponse,
  PaginatedResult,
  PageResponse,
} from "./types";

export interface VehicleCategory extends CategorySummaryResponse {
  parts: PartFrontofficeResponse[];
}

export type CategoriesResult =
  | { status: "success"; items: CategorySummaryResponse[] }
  | { status: "error"; items: [] };

/** Resolve one active category without requiring its parent Part id. */
export async function getCategoryById(
  id: number,
): Promise<CategorySummaryResponse | null> {
  try {
    const { data, error } = await apiClient.GET("/api/frontoffice/categories/{id}", {
      params: { path: { id } },
      cache: "force-cache",
      next: { tags: ["categories", `category:${id}`] },
    });

    if (error || !data) return null;
    return data as CategorySummaryResponse;
  } catch {
    return null;
  }
}

function parsePage(page: PageResponse): PaginatedResult<CategorySummaryResponse> {
  return {
    items: (page.content ?? []) as CategorySummaryResponse[],
    totalElements: page.totalElements ?? 0,
    totalPages: page.totalPages ?? 0,
    page: page.page ?? 0,
    size: page.size ?? 0,
    hasNext: page.hasNext ?? false,
    hasPrevious: page.hasPrevious ?? false,
  };
}

/** Fetch all active categories belonging to one top-level part. */
export async function getAllCategoriesByParent(
  parentId: number,
): Promise<CategoriesResult> {
  try {
    const items = await collectPaginatedItems(async (page) => {
      const url = new URL("/api/frontoffice/categories", SERVER_BASE_URL);
      url.searchParams.set("parentId", String(parentId));
      url.searchParams.set("page", String(page));
      url.searchParams.set("size", "100");
      url.searchParams.set("sortBy", "name");
      url.searchParams.set("sortDir", "ASC");
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "force-cache",
        next: { tags: ["categories", `categories:${parentId}`] },
      });

      if (!response.ok) throw new Error(`Failed to fetch categories (${response.status})`);
      return parsePage(await response.json() as PageResponse);
    });

    return { status: "success", items };
  } catch {
    return { status: "error", items: [] };
  }
}

/**
 * Fetch categories and compatible purchasable parts for one exact model year.
 * `carId` is the modelYearId returned by `/api/frontoffice/cars`.
 */
export async function getVehicleCategories(params: {
  carId: number;
  brandId: number;
  partId: number;
}): Promise<VehicleCategory[]> {
  try {
    const url = new URL("/api/frontoffice/categories", SERVER_BASE_URL);
    url.searchParams.set("carId", String(params.carId));
    url.searchParams.set("brandId", String(params.brandId));
    url.searchParams.set("partId", String(params.partId));
    url.searchParams.set("page", "0");
    url.searchParams.set("size", "100");
    url.searchParams.set("sort", "name,asc");
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Failed to fetch vehicle categories (${response.status})`);
    const page = await response.json() as PageResponse;
    return (page.content ?? []) as VehicleCategory[];
  } catch {
    return [];
  }
}
