import { apiClient } from "./client";
import { apiFetch } from "./fetch";
import type {
  BrandFrontofficeResponse,
  CarFrontofficeDetailResponse,
  PaginatedResult,
  PageResponse,
} from "./types";

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

// ---------------------------------------------------------------------------
// SSR functions (Server Components)
// ---------------------------------------------------------------------------

/** Fetch active brands with pagination. */
export async function getBrands(
  params?: { page?: number; size?: number; sort?: string },
): Promise<PaginatedResult<BrandFrontofficeResponse>> {
  const { data, error } = await apiClient.GET("/api/frontoffice/brands", {
    params: {
      query: {
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        ...params,
      },
    },
    cache: "force-cache",
    next: { tags: ["brands"] },
  });

  if (error || !data) throw new Error("Failed to fetch brands");
  return parsePage<BrandFrontofficeResponse>(data);
}

/** Fetch all brands (for /brands page and sitemap). */
export async function getAllBrands(): Promise<BrandFrontofficeResponse[]> {
  try {
    const result = await getBrands({ page: 0, size: 200 });
    return result.items;
  } catch {
    return [];
  }
}

export async function getTopBrands(): Promise<BrandFrontofficeResponse[]> {
  try {
    const { data, error } = await apiClient.GET("/api/frontoffice/brands/top", {
    params: {
      query: {
      },
    },
    cache: "force-cache",
    next: { tags: ["brands"] },
  });

  if (error || !data) throw new Error("Failed to fetch brands");
  if(data) return data
  } catch {
    return [];
  }
}

/** Fetch a single brand by slug. */
export async function getBrandBySlug(
  slug: string,
): Promise<BrandFrontofficeResponse | null> {
  try {
    const { data, error } = await apiClient.GET("/api/frontoffice/brand", {
      params: { query: { slug } },
      cache: "force-cache",
      next: { tags: ["brands"] },
    });

    if (error || !data) return null;
    return data as BrandFrontofficeResponse;
  } catch {
    return null;
  }
}

/** Fetch cars filtered by brand slug (SSR). */
export async function getCarsByBrand(
  brandSlug: string,
): Promise<PaginatedResult<CarFrontofficeDetailResponse>> {
  try {
    const { data, error } = await apiClient.GET("/api/frontoffice/cars", {
      params: { query: { brandSlug, page: 0, size: 50 } },
      cache: "force-cache",
      next: { tags: ["cars", `cars:${brandSlug}`] },
    });

    if (error || !data) throw new Error("Failed to fetch cars");
    return parsePage<CarFrontofficeDetailResponse>(data);
  } catch {
    return { items: [], totalElements: 0, totalPages: 0, page: 0, size: 0, hasNext: false, hasPrevious: false };
  }
}

/** Fetch a single car by ID or slug (SSR). */
export async function getCarByIdOrSlug(
  idOrSlug: string | number,
): Promise<CarFrontofficeDetailResponse | null> {
  try {
    const id = Number(idOrSlug);
    const query = isNaN(id) ? { slug: String(idOrSlug) } : { id };
    const { data, error } = await apiClient.GET("/api/frontoffice/cars/detail", {
      params: { query },
      cache: "force-cache",
      next: { tags: ["cars", `car:${idOrSlug}`] },
    });

    if (error || !data) return null;
    return data as CarFrontofficeDetailResponse;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// CSR functions (Client Components)
// ---------------------------------------------------------------------------

/** Fetch cars filtered by brand slug (CSR). */
export async function fetchCarsByBrand(
  brandSlug: string,
): Promise<CarFrontofficeDetailResponse[]> {
  try {
    const data = await apiFetch<{ content?: CarFrontofficeDetailResponse[] }>(
      "/api/frontoffice/cars",
      { params: { brandSlug, page: 0, size: 50 } }
    );
    return data.content ?? [];
  } catch {
    return [];
  }
}
