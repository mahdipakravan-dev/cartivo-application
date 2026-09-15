import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";

export type OrderRequest = components["schemas"]["OrderFrontofficeRequest"];
export type Order = components["schemas"]["OrderFrontofficeResponse"];
export type OrderPage = Omit<components["schemas"]["PageResponse"], "content"> & {
  content?: Order[];
};

export interface OrderHistoryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export function createOrder(order: OrderRequest) {
  return apiFetch<Order>("/api/frontoffice/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function getMyOrders(params: OrderHistoryParams = {}) {
  return apiFetch<OrderPage>("/api/frontoffice/orders/my", { params: { ...params } });
}

export function getOrder(orderId: number) {
  return apiFetch<Order>(`/api/frontoffice/orders/${orderId}`);
}

export function findMatchingRecentOrder(
  orders: Order[],
  request: OrderRequest,
  submittedAt: number,
): Order | undefined {
  const requestedVoucher = normalizeVoucherCode(request.voucherCode);
  const requestLines = orderLineSignature(request.items);

  return orders.find((order) => {
    const createdAt = order.createdAt ? new Date(order.createdAt).getTime() : Number.NaN;
    if (Number.isNaN(createdAt) || createdAt < submittedAt - 5_000) return false;
    if (order.address?.id !== request.addressId || order.paymentMethod?.id !== request.paymentMethodId) return false;
    if (normalizeVoucherCode(order.voucher?.code) !== requestedVoucher) return false;
    return orderLineSignature(order.items ?? []) === requestLines;
  });
}

export function normalizeVoucherCode(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized.toLocaleUpperCase("en-US") : undefined;
}

function orderLineSignature(
  items: Array<{ partId?: number; sellerId?: number; quantity?: number }>,
): string {
  return items
    .map((item) => `${item.partId ?? ""}:${item.sellerId ?? ""}:${item.quantity ?? ""}`)
    .sort()
    .join("|");
}
