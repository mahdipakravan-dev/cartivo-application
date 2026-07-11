import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";

export type GlobalSearchResponse = components["schemas"]["GlobalSearchResponse"];
export type SearchCar = components["schemas"]["CarFrontofficeResponse"];
export type SearchPart = components["schemas"]["PartChildResult"];
export type SearchCategory = components["schemas"]["PartCategoryResult"];

export function globalSearch(query: string) {
  return apiFetch<GlobalSearchResponse>("/api/frontoffice/global-search", {
    params: { q: query.trim() },
  });
}
