import type { BrandFrontofficeResponse } from "@/lib/api/types";
import type { PreloadedRootState } from "@/lib/store/store";

interface CatalogPreloadInput {
  brands?: BrandFrontofficeResponse[];
}

export function createCatalogPreloadedState({
  brands,
}: CatalogPreloadInput): PreloadedRootState {
  return {
    catalog: {
      brands: brands ?? [],
      brandsStatus: brands ? "succeeded" : "idle",
      brandsError: null,
      hydratedAt: brands ? new Date().toISOString() : null,
    },
  };
}
