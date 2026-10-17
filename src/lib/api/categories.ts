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

async function getAllCategories(
  categoryParentId?: number,
): Promise<CategoriesResult> {
  try {
    const items = await collectPaginatedItems(async (page) => {
      const url = new URL("/api/frontoffice/categories", SERVER_BASE_URL);
      if (categoryParentId != null) {
        url.searchParams.set("categoryParentId", String(categoryParentId));
      }
      url.searchParams.set("page", String(page));
      url.searchParams.set("size", "100");
      url.searchParams.set("sortBy", "name");
      url.searchParams.set("sortDir", "ASC");
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "force-cache",
        next: {
          tags: [
            "categories",
            categoryParentId == null
              ? "categories:root"
              : `categories:parent:${categoryParentId}`,
          ],
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch categories (${response.status})`);
      return parsePage(await response.json() as PageResponse);
    });

    return { status: "success", items };
  } catch {
    return { status: "error", items: [] };
  }
}

/** Fetch all active root categories. */
export function getRootCategories(): Promise<CategoriesResult> {
  return getAllCategories();
}

/** Fetch all active direct children of a category. */
export function getChildCategories(
  categoryParentId: number,
): Promise<CategoriesResult> {
  return getAllCategories(categoryParentId);
}

/**
 * Fetch categories and compatible purchasable parts for one exact model year.
 * `carId` is the modelYearId returned by `/api/frontoffice/cars`.
 */
export async function getVehicleCategories(params: {
  carId: number;
  brandId: number;
  categoryParentId?: number;
}): Promise<VehicleCategory[]> {
  try {
    const url = new URL("/api/frontoffice/categories/navigation", SERVER_BASE_URL);
    url.searchParams.set("carId", String(params.carId));
    url.searchParams.set("brandId", String(params.brandId));
    if (params.categoryParentId != null) {
      url.searchParams.set("categoryParentId", String(params.categoryParentId));
    }
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

/**
 * Walk up `categoryParentId` to the root category (max 8 levels).
 * Category URLs are `/parent/{rootLabel}/{id}`, so the canonical URL of any
 * category depends on its real root — not on whatever label is in the URL.
 */
export async function getCategoryRoot(
  id: number,
): Promise<CategorySummaryResponse | null> {
  let current = await getCategoryById(id);
  for (let depth = 0; current && depth < 8; depth += 1) {
    const parentId = current.categoryParentId;
    if (parentId == null) return current;
    current = await getCategoryById(parentId);
  }
  return null;
}
