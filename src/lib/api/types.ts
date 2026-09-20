import type { components } from "./generated/schema";

/**
 * Type aliases derived from the OpenAPI-generated schema.
 * Run `npm run openapi` after backend changes to stay in sync.
 */
export type CustomerFrontofficeResponse =
  components["schemas"]["CustomerFrontofficeResponse"];
export type CustomerFrontofficeUpdateRequest =
  components["schemas"]["CustomerFrontofficeUpdateRequest"];
export type PageResponse = components["schemas"]["PageResponse"];
export type BrandFrontofficeResponse =
  components["schemas"]["BrandFrontofficeResponse"];

/**
 * Compatibility view used by the existing catalog routes. Vehicle variants
 * now supply these fields instead of the removed `/frontoffice/cars` API.
 */
export interface CarFrontofficeDetailResponse {
  id?: number;
  brand?: string;
  model?: string;
  trimLevel?: string;
  bodyType?:
    | "SEDAN"
    | "HATCHBACK"
    | "SUV"
    | "CROSSOVER"
    | "PICKUP"
    | "VAN"
    | "COUPE"
    | "MINIVAN";
  description?: string;
  imageUrls?: string[];
}

export interface CarResponse {
  id?: number;
  model?: string;
  trimLevel?: string;
  bodyType?: CarFrontofficeDetailResponse["bodyType"];
  imageUrls?: string[];
  slug?: string;
  brand?: {
    id?: number;
    englishName?: string;
    persianName?: string;
    slug?: string;
    iconUrl?: string;
    countryCode?: string;
  };
}
export type PartFrontofficeResponse =
  components["schemas"]["PartFrontofficeResponse"];
export type CategorySummaryResponse =
  components["schemas"]["CategorySummaryResponse"];
export type PartBrandFrontofficeResponse =
  components["schemas"]["PartBrandFrontofficeResponse"];
export type BlogDetailResponse = components["schemas"]["BlogDetailResponse"];

/**
 * Generic paginated result — maps PageResponse.content to a concrete type.
 */
export interface PaginatedResult<T> {
  items: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** @deprecated Use BrandFrontofficeResponse instead */
export type BrandFrontDto = BrandFrontofficeResponse;
/** @deprecated Use PaginatedResult<BrandFrontofficeResponse> instead */
export type PageBrandFrontDto = PaginatedResult<BrandFrontofficeResponse>;
