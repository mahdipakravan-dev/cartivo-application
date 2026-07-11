import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";
import type { PageResponse } from "./types";

export type PartRequest = components["schemas"]["PartRequestFrontofficeResponse"];
export type PartRequestPayload = components["schemas"]["PartRequestFrontofficeRequest"];

export function createPartRequest(payload: PartRequestPayload) {
  return apiFetch<PartRequest>("/api/frontoffice/part-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getPartRequests(customerId: number, size = 50): Promise<PartRequest[]> {
  const page = await apiFetch<PageResponse>("/api/frontoffice/part-requests", {
    params: { customerId, page: 0, size, sortBy: "createdAt", sortDir: "DESC" },
  });
  return (page.content ?? []) as PartRequest[];
}
