# Front-office inventory integration

The customer-facing application reads seller-specific inventory from the existing seller-offers endpoint. A part has one inventory record per seller, and only offers with a positive `availableQuantity` are returned.

## Endpoint

```http
GET /api/frontoffice/parts/{partId}/sellers
```

This endpoint is public. No authorization header is required.

Example response:

```json
[
  {
    "sellerId": 25,
    "sellerName": "Example Seller",
    "priceRial": 1250000,
    "inventoryQuantity": 12,
    "availableQuantity": 10,
    "validFrom": "2026-09-15T09:00:00Z",
    "validUntil": null,
    "lastUpdatedAt": "2026-09-15T09:00:00Z"
  }
]
```

- `inventoryQuantity` is the seller's total physical stock.
- `availableQuantity` is `inventoryQuantity - reservedQuantity` and is the maximum quantity that should be selectable by a customer.
- `reservedQuantity` is intentionally not exposed to customers.
- An inactive seller, expired price, missing inventory, or `availableQuantity <= 0` removes that seller's offer from this response.

## Front-end model

```ts
export interface SellerOffer {
  sellerId: number;
  sellerName: string;
  priceRial: number;
  inventoryQuantity: number;
  availableQuantity: number;
  validFrom: string;
  validUntil: string | null;
  lastUpdatedAt: string;
}
```

## UI flow

1. Load the part, then request `GET /api/frontoffice/parts/{partId}/sellers`.
2. Render one offer row or card per returned seller.
3. Show `availableQuantity` as the stock visible to the customer.
4. Disable purchase controls when the returned list is empty.
5. Set the quantity input maximum to the selected seller's `availableQuantity`.
6. When creating an order, continue sending the selected `sellerId` with the part and quantity.
7. Refresh seller offers after an order attempt or when returning to a previously opened product page because inventory can change.

Example fetch helper:

```ts
export async function getSellerOffers(partId: number): Promise<SellerOffer[]> {
  const response = await fetch(`/api/frontoffice/parts/${partId}/sellers`);
  if (!response.ok) {
    throw new Error(`Unable to load seller inventory (${response.status})`);
  }
  return response.json();
}
```

The general part detail/search endpoints select prices only from seller offers that currently have available inventory. A part with no in-stock seller pricing is therefore not considered currently purchasable.

