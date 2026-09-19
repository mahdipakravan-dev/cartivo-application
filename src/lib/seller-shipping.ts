export type SellerShippingMethod =
  | "SELLER_DELIVERY"
  | "POST"
  | "COURIER"
  | "FREIGHT";

export const shippingMethodLabels: Record<SellerShippingMethod, string> = {
  SELLER_DELIVERY: "ارسال توسط فروشنده",
  POST: "پست",
  COURIER: "پیک",
  FREIGHT: "باربری",
};

export function getShippingMethodLabel(method?: SellerShippingMethod | null) {
  return method ? shippingMethodLabels[method] : "روش ارسال اعلام نشده";
}

export function formatRial(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

export function formatShippingCost(value?: number | null) {
  if (value == null) return "هزینه اعلام نشده";
  return value === 0 ? "رایگان" : formatRial(value);
}

export function getAvailableQuantityError(
  quantity: number,
  availableQuantity?: number | null,
) {
  if (availableQuantity == null || quantity <= availableQuantity) return null;
  return `تنها ${availableQuantity.toLocaleString("fa-IR")} عدد از این کالا قابل سفارش است.`;
}

export function calculateMerchandiseTotalRial(
  lines: Array<{
    unitPriceRial: number;
    quantity: number;
    shippingCostRial?: number | null | undefined;
  }>,
) {
  return lines.reduce(
    (total, line) => total + line.unitPriceRial * line.quantity,
    0,
  );
}
