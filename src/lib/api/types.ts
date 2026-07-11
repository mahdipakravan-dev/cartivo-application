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
export type CarFrontofficeDetailResponse =
  components["schemas"]["CarFrontofficeDetailResponse"];
export type CarResponse = components["schemas"]["CarResponse"];
export type PartFrontofficeResponse =
  components["schemas"]["PartFrontofficeResponse"];
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
