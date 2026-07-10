import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";

export type OrderRequest = components["schemas"]["OrderFrontofficeRequest"];
export type Order = components["schemas"]["OrderFrontofficeResponse"];

export function createOrder(order: OrderRequest) {
  return apiFetch<Order>("/api/frontoffice/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function getMyOrders(params: { page?: number; size?: number } = {}) {
  return apiFetch<components["schemas"]["PageResponse"]>("/api/frontoffice/orders/my", { params });
}

export function getOrder(orderId: number) {
  return apiFetch<Order>(`/api/frontoffice/orders/${orderId}`);
}
