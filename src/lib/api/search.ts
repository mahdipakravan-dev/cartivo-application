import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";
import type { CategorySummaryResponse } from "./types";

type GeneratedGlobalSearchResponse = components["schemas"]["GlobalSearchResponse"];
export type SearchCar = components["schemas"]["CarFrontofficeResponse"];
export type SearchCategory = CategorySummaryResponse;
export interface SearchPart {
  id?: number;
  name?: string;
  description?: string;
  partBrandName?: string;
  price?: number;
  manufacturerYears?: number[];
  categories?: CategorySummaryResponse[];
}
export type GlobalSearchResponse = Omit<
  GeneratedGlobalSearchResponse,
  "partCategories" | "parts"
> & {
  partCategories?: SearchCategory[];
  parts?: SearchPart[];
};

export function globalSearch(query: string) {
  return apiFetch<GlobalSearchResponse>("/api/frontoffice/global-search", {
    params: { q: query.trim() },
  });
}
