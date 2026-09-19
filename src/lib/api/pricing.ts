import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";
import type { SellerShippingMethod } from "@/lib/seller-shipping";

export type EffectivePrice = components["schemas"]["EffectivePriceResponse"];
export type PriceLock = components["schemas"]["PriceLockResponse"];
type GeneratedSellerOffer = components["schemas"]["SellerOfferResponse"];
export type SellerOffer = Omit<
  GeneratedSellerOffer,
  "shippingCostRial" | "shippingMethod" | "sellerDetails"
> & {
  shippingCostRial?: number | null;
  shippingMethod?: SellerShippingMethod | null;
  sellerDetails?: string | null;
};
export type PriceHistoryPage = components["schemas"]["PageResponsePartAveragePriceHistoryResponse"];
export type PriceHistoryPoint = components["schemas"]["PartAveragePriceHistoryResponse"];

export function getPartSellerOffers(partId: number) {
  return apiFetch<SellerOffer[]>(`/api/frontoffice/parts/${partId}/sellers`);
}

/**
 * Returns the current persisted price selected from seller pricing.
 * Passing a seller ID asks the backend for that seller's effective price.
 */
export function getEffectivePrice(partId: number, sellerId?: number) {
  return apiFetch<EffectivePrice>(`/api/frontoffice/parts/${partId}/price`, {
    ...(sellerId != null ? { params: { sellerId } } : {}),
  });
}

export function getPartPriceHistory(partId: number, page = 0, size = 20) {
  return apiFetch<PriceHistoryPage>(`/api/frontoffice/parts/${partId}/price-history`, {
    params: { page, size, sortBy: "priceDate", sortDir: "DESC" },
  });
}

/** Freeze the selected seller's price while the customer checks out. */
export function createPriceLock(partId: number, sellerId: number) {
  return apiFetch<PriceLock>("/api/frontoffice/price-locks", {
    method: "POST",
    body: JSON.stringify({ partId, sellerId }),
  });
}

export function validatePriceLock(token: string) {
  return apiFetch<PriceLock>(
    `/api/frontoffice/price-locks/${encodeURIComponent(token)}/validate`,
    { method: "POST" },
  );
}
