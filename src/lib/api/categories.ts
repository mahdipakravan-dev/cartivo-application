import { collectPaginatedItems } from "../catalog-navigation";
import { apiClient } from "./client";
import type {
  CategorySummaryResponse,
  PaginatedResult,
  PageResponse,
} from "./types";

export type CategoriesResult =
  | { status: "success"; items: CategorySummaryResponse[] }
  | { status: "error"; items: [] };

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
      const { data, error } = await apiClient.GET("/api/frontoffice/categories", {
        params: {
          query: {
            parentId,
            page,
            size: 100,
            sortBy: "name",
            sortDir: "ASC",
          },
        },
        cache: "force-cache",
        next: { tags: ["categories", `categories:${parentId}`] },
      });

      if (error || !data) throw new Error("Failed to fetch categories");
      return parsePage(data);
    });

    return { status: "success", items };
  } catch {
    return { status: "error", items: [] };
  }
}
