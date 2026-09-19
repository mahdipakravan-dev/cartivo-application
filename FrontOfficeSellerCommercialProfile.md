# Front-office seller shipping profile

The public seller-offers endpoint now includes each seller's shipping method, shipping cost, and editable public details.

Profit margin and settlement term are internal BackOffice values and are intentionally not exposed to customers.

## Endpoint

```http
GET /api/frontoffice/parts/{partId}/sellers
```

The endpoint remains public and returns only currently available, in-stock seller offers.

Example response:

```json
[
  {
    "sellerId": 25,
    "sellerName": "Ali Karimi",
    "priceRial": 1250000,
    "shippingCostRial": 250000,
    "shippingMethod": "SELLER_DELIVERY",
    "sellerDetails": "Dispatches from Tehran within one business day",
    "inventoryQuantity": 12,
    "availableQuantity": 10,
    "validFrom": "2026-09-15T09:00:00Z",
    "validUntil": null,
    "lastUpdatedAt": "2026-09-15T09:00:00Z"
  }
]
```

## TypeScript model

```ts
export type SellerShippingMethod =
  | 'SELLER_DELIVERY'
  | 'POST'
  | 'COURIER'
  | 'FREIGHT';

export interface SellerOffer {
  sellerId: number;
  sellerName: string;
  priceRial: number;
  shippingCostRial: number | null;
  shippingMethod: SellerShippingMethod | null;
  sellerDetails: string | null;
  inventoryQuantity: number;
  availableQuantity: number;
  validFrom: string;
  validUntil: string | null;
  lastUpdatedAt: string;
}
```

Legacy seller records are populated by migration with zero shipping cost and `SELLER_DELIVERY`. Keep the nullable TypeScript types during rolling deployment compatibility.

## Display guidance

Suggested Persian labels:

```ts
export const shippingMethodLabels: Record<SellerShippingMethod, string> = {
  SELLER_DELIVERY: 'ارسال توسط فروشنده',
  POST: 'پست',
  COURIER: 'پیک',
  FREIGHT: 'باربری',
};
```

Recommended offer-card flow:

1. Display the product price and shipping cost separately.
2. Show `رایگان` when `shippingCostRial` is zero.
3. Display the mapped shipping-method label.
4. Render `sellerDetails` as plain escaped text; never inject it as HTML.
5. Continue limiting selectable quantity to `availableQuantity`.
6. Refresh offers before checkout because seller pricing, inventory, and shipping metadata can change.

Formatting helper:

```ts
export function formatRial(value: number): string {
  return `${new Intl.NumberFormat('fa-IR').format(value)} ریال`;
}
```

## Checkout limitation

`shippingCostRial` is currently informational. The backend does not add it to price locks, orders, payment totals, or vouchers. Do not silently add it to the payable total in FrontOffice until the checkout contract is extended to persist and validate shipping charges.

The displayed comparison total may be shown as an estimate if clearly labeled:

```ts
const estimatedOfferTotal = offer.priceRial + (offer.shippingCostRial ?? 0);
```

This estimate must not replace the authoritative order total returned by the backend.

Regenerate the FrontOffice OpenAPI client so the updated `SellerOfferResponse` fields are available.
