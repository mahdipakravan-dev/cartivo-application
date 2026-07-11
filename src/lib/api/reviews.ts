import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";
import type { PageResponse } from "./types";

export type Review = components["schemas"]["ReviewFrontofficeResponse"];
export type ReviewRequest = components["schemas"]["ReviewFrontofficeRequest"];

export async function getCarReviews(carId: number, size = 20): Promise<Review[]> {
  const page = await apiFetch<PageResponse>(`/api/frontoffice/reviews/cars/${carId}`, {
    params: { page: 0, size, sortBy: "createdAt", sortDir: "DESC" },
  });
  return (page.content ?? []) as Review[];
}

export function createReview(payload: ReviewRequest) {
  return apiFetch<Review>("/api/frontoffice/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
