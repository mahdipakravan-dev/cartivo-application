# Frontend Handoff: Seller Selection and Part Purchase

This document describes the required client flow for showing a part's available sellers, selecting
one seller, optionally locking that seller's price, and placing the final order.

## Important contract changes

- A part may have multiple seller offers.
- The customer must select a seller before adding/buying a part.
- Store `partId` and `sellerId` together in cart state. A `partId` alone is no longer enough.
- Every order item requires `sellerId`.
- If a price lock is used, it must be created for and submitted with the same `partId` and
  `sellerId`.
- Seller prices are direct prices. The frontend must not show or submit a STATIC/DYNAMIC pricing
  type.
- All price values are in Rial.

## Required services

| Client service | Method and endpoint | Authentication | Purpose |
|---|---|---|---|
| Part details | `GET /api/frontoffice/parts/{partId}` | No | Load the selected part |
| Seller offers | `GET /api/frontoffice/parts/{partId}/sellers` | No | Load selectable sellers and prices |
| Selected price details | `GET /api/frontoffice/parts/{partId}/price?sellerId={sellerId}` | No | Optional verification/details for one selected offer |
| Price history | `GET /api/frontoffice/parts/{partId}/price-history?page=0&size=20` | No | Display daily average price history/chart |
| Price lock | `POST /api/frontoffice/price-locks` | Customer Bearer token | Optionally freeze the selected seller price |
| Customer addresses | `GET /api/frontoffice/customer-addresses` | Customer Bearer token | Select the delivery address |
| Payment methods | `GET /api/frontoffice/payment-methods` | No | Select a payment method |
| Create order | `POST /api/frontoffice/orders` | Customer Bearer token | Final purchase |

Authenticated requests use:

```http
Authorization: Bearer <customer-access-token>
Content-Type: application/json
```

## Recommended UI flow

1. Open the part detail page and load the part.
2. Call the seller-offers endpoint.
3. Render one clickable card/row for each seller.
4. When a card is clicked, store the full selected offer, especially `sellerId` and `priceRial`.
5. Enable **Add to cart** or **Buy now** only after a seller is selected.
6. Store this cart line shape:

   ```ts
   type CartLine = {
     partId: number;
     sellerId: number;
     sellerName: string;
     quantity: number;
     displayedUnitPriceRial: string;
     priceLockToken?: string;
   };
   ```

7. At checkout, load/select the customer address and payment method.
8. Optionally create a price lock for each cart line. If no lock is created, the backend uses the
   seller's current price when the order is submitted.
9. Submit the final order with `sellerId` on every item.
10. Use the prices returned in the order response as the final charged/snapshotted prices.

## 1. Load and show available sellers

```http
GET /api/frontoffice/parts/10/sellers
```

Successful response:

```json
[
  {
    "sellerId": 25,
    "sellerName": "Karavan Parts",
    "priceRial": 1200000,
    "validFrom": "2026-09-14T07:00:00Z",
    "validUntil": null,
    "lastUpdatedAt": "2026-09-14T07:15:00Z"
  },
  {
    "sellerId": 31,
    "sellerName": "Tehran Auto",
    "priceRial": 1350000,
    "validFrom": "2026-09-14T07:05:00Z",
    "validUntil": "2026-10-01T00:00:00Z",
    "lastUpdatedAt": "2026-09-14T07:20:00Z"
  }
]
```

The list is ordered from the lowest price to the highest price.

Suggested seller card:

```text
┌──────────────────────────────────┐
│ Karavan Parts                    │
│ 1,200,000 Rial                   │
│ Updated: 14 Sep 2026             │
│                         [Select] │
└──────────────────────────────────┘
```

Client behavior:

- Use `sellerId` as the selection key, not `sellerName`.
- Visually mark exactly one selected seller for each cart line.
- An empty array means there is currently no purchasable offer. Disable purchase actions and show
  an unavailable message.
- Do not keep an old seller selection if it is absent from a newly fetched list.
- Format `priceRial` for display only. Keep the original numeric/string value for state; never
  calculate the final server price on the client.

Example TypeScript service:

```ts
export type SellerOffer = {
  sellerId: number;
  sellerName: string;
  priceRial: number | string;
  validFrom: string;
  validUntil: string | null;
  lastUpdatedAt: string;
};

export async function getPartSellerOffers(partId: number): Promise<SellerOffer[]> {
  const response = await fetch(`/api/frontoffice/parts/${partId}/sellers`);
  if (!response.ok) throw await response.json();
  return response.json();
}
```

## 2. Optional: lock the selected seller price

Price locking is recommended when the customer enters checkout. It prevents the selected price
from changing during the lock window.

```http
POST /api/frontoffice/price-locks
Authorization: Bearer <customer-access-token>
Content-Type: application/json

{
  "partId": 10,
  "sellerId": 25
}
```

Successful response:

```json
{
  "lockToken": "555a6ef5-3f03-4a89-b94c-5a9b35874851",
  "partId": 10,
  "sellerId": 25,
  "customerId": 7,
  "lockedPrice": 1200000,
  "formula": null,
  "appliedRates": {},
  "calculationBreakdown": "Seller price = 1200000",
  "calculatedAt": "2026-09-14T07:15:00Z",
  "expiresAt": "2026-09-14T07:30:00Z",
  "valid": true
}
```

Store `lockToken` on the matching cart line. Never reuse it for another part or seller. A lock is
single-use and expires at `expiresAt`.

The lock can be checked before final submission:

```http
POST /api/frontoffice/price-locks/{lockToken}/validate
Authorization: Bearer <customer-access-token>
```

## 3. Submit the final order

Each item must contain the seller selected by the customer.

Without a price lock:

```http
POST /api/frontoffice/orders
Authorization: Bearer <customer-access-token>
Content-Type: application/json

{
  "addressId": 4,
  "paymentMethodId": 1,
  "items": [
    {
      "partId": 10,
      "sellerId": 25,
      "quantity": 2
    }
  ]
}
```

With a price lock:

```json
{
  "addressId": 4,
  "paymentMethodId": 1,
  "items": [
    {
      "partId": 10,
      "sellerId": 25,
      "quantity": 2,
      "priceLockToken": "555a6ef5-3f03-4a89-b94c-5a9b35874851"
    }
  ]
}
```

Relevant part of the `201 Created` response:

```json
{
  "id": 1001,
  "status": "PENDING",
  "totalAmountRial": 2400000,
  "items": [
    {
      "partId": 10,
      "partName": "Door Lock",
      "sellerId": 25,
      "sellerName": "Karavan Parts",
      "quantity": 2,
      "unitPriceRial": 1200000,
      "lineTotalRial": 2400000
    }
  ],
  "createdAt": "2026-09-14T07:25:00Z"
}
```

The backend revalidates the seller offer during order creation. The UI's displayed price is not
authoritative. After success, replace client totals with `unitPriceRial`, `lineTotalRial`, and
`totalAmountRial` from this response.

## 4. Daily average price-history chart

```http
GET /api/frontoffice/parts/10/price-history?page=0&size=20
```

Response:

```json
{
  "content": [
    {
      "partId": 10,
      "priceDate": "2026-09-14",
      "averagePriceRial": 1275000,
      "sellerCount": 2,
      "recordedAt": "2026-09-14T07:20:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1,
  "hasNext": false,
  "hasPrevious": false
}
```

Use `priceDate` as the chart X-axis and `averagePriceRial` as the Y-axis. `sellerCount` tells the
user how many available seller offers contributed to that day's average.

## Error handling

Backend errors follow this shape:

```json
{
  "timestamp": "2026-09-14T07:30:00Z",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Seller 25 has no available price for part 10",
  "fieldErrors": null
}
```

Handle these cases:

| Status | Typical reason | Client action |
|---|---|---|
| `400` | Seller offer expired/removed, seller mismatch, consumed/expired lock, or invalid quantity | Show `message`, refresh offers, and require seller reselection when necessary |
| `401` | Missing or expired customer token for lock/order/address APIs | Redirect to customer login and preserve the cart |
| `403` | Token is not a customer token or resource belongs to another customer | Show access error and require the correct account |
| `404` | Part, address, payment method, order, or lock no longer exists | Refresh the relevant data and remove invalid cart state |

## Frontend acceptance checklist

- [ ] Seller offers load when a purchasable part opens.
- [ ] Every seller row shows seller name and formatted Rial price.
- [ ] Only one seller is selected per cart line.
- [ ] Buy/Add-to-cart is disabled until selection.
- [ ] Cart identity includes both `partId` and `sellerId`.
- [ ] Changing a seller updates the displayed line price.
- [ ] Checkout sends `sellerId` for every item.
- [ ] A price-lock token is used only with its matching part and seller.
- [ ] Order success uses server-returned prices and totals.
- [ ] A rejected/expired offer refreshes the seller list and prompts reselection.
- [ ] The average-history chart reads the paginated `content` array.
