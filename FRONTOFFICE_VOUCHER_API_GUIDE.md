# Frontoffice Voucher Implementation Guide

This guide describes how the customer-facing client should apply one optional global voucher while
creating an order.

## Feature summary

Voucher redemption is part of order creation. The customer enters a code during checkout, and the
client submits that code in the existing order request. There is no separate voucher-validation or
discount-preview endpoint.

The server validates the voucher and calculates all totals atomically when the order is created.
Client-side totals are estimates until a successful order response is received.

## Authentication

Order creation and order history require a customer access token:

```http
Authorization: Bearer <customer-access-token>
Content-Type: application/json
```

The authenticated customer identity comes from the token. Do not send `customerId` in the order
body or query string.

## Relevant endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/frontoffice/orders` | Create an order with an optional voucher code |
| `GET` | `/api/frontoffice/orders/my` | Check the authenticated customer's order history |
| `GET` | `/api/frontoffice/orders/{id}` | Load one order belonging to the authenticated customer |

There is deliberately no `/vouchers/validate` endpoint. Do not call a voucher API when the user
clicks Apply; either keep the entered code for final submission or show a clearly labeled local
estimate.

## TypeScript contracts

```ts
export type OrderItemRequest = {
  partId: number;
  sellerId: number;
  quantity: number;
  priceLockToken?: string;
};

export type CreateOrderRequest = {
  addressId: number;
  paymentMethodId: number;
  items: OrderItemRequest[];
  voucherCode?: string;
};

export type VoucherInfo = {
  code: string;
  percent: number;
};

export type OrderItem = {
  partId: number;
  partName: string;
  sellerId: number | null;
  sellerName: string | null;
  quantity: number;
  unitPriceRial: number;
  lineTotalRial: number;
};

export type PaymentMethodInfo = {
  id: number;
  englishName: string;
  persianName: string | null;
  slug: string | null;
  iconUrl: string | null;
};

export type CustomerAddress = {
  id: number;
  city: string;
  county: string;
  fullAddress: string;
  plaque: string;
  recipientPhoneNumber: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  subtotalAmountRial: number;
  discountAmountRial: number;
  totalAmountRial: number;
  voucher: VoucherInfo | null;
  address: CustomerAddress | null;
  paymentMethod: PaymentMethodInfo | null;
  items: OrderItem[];
  createdAt: string;
};

export type ApiError = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors: Array<{ field: string; message: string }> | null;
};
```

If the API client represents large Rial amounts as strings to avoid JavaScript precision loss,
replace the three price fields and item price fields with `number | string` consistently.

## Checkout UI behavior

Recommended flow:

1. Show one optional voucher-code input near the order summary.
2. Trim the value for local display, but do not rely on client normalization for correctness.
3. Store only one voucher code because the API accepts a single scalar `voucherCode`.
4. If the user removes the voucher, omit `voucherCode` or send a blank value. Omitting it is
   preferred.
5. Submit the voucher only in the final `POST /api/frontoffice/orders` request.
6. Disable repeated submissions while the request is in flight.
7. On success, replace every locally calculated total with the server response.
8. Show the normalized response code and percentage from `response.voucher`, not the raw input.

Because no preview endpoint exists, an Apply button should only update local checkout state. It
must not tell the user that the voucher is valid. Suggested copy is “Code will be verified when you
place the order.”

## Create an order without a voucher

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

Relevant successful response fields:

```json
{
  "id": 1001,
  "status": "PENDING",
  "subtotalAmountRial": 2400000,
  "discountAmountRial": 0,
  "totalAmountRial": 2400000,
  "voucher": null,
  "address": {
    "id": 4,
    "city": "Tehran",
    "county": "Central",
    "fullAddress": "Example delivery address",
    "plaque": "12",
    "recipientPhoneNumber": "+989121234567",
    "description": null,
    "createdAt": "2026-09-10T08:00:00Z",
    "updatedAt": "2026-09-10T08:00:00Z"
  },
  "paymentMethod": {
    "id": 1,
    "englishName": "Online Payment",
    "persianName": "پرداخت آنلاین",
    "slug": "online-payment",
    "iconUrl": null
  },
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
  "createdAt": "2026-09-15T10:20:00Z"
}
```

## Create an order with a voucher

```http
POST /api/frontoffice/orders
Authorization: Bearer <customer-access-token>
Content-Type: application/json

{
  "addressId": 4,
  "paymentMethodId": 1,
  "voucherCode": " save10 ",
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

Relevant `201 Created` response fields:

```json
{
  "id": 1002,
  "status": "PENDING",
  "subtotalAmountRial": 2400000,
  "discountAmountRial": 240000,
  "totalAmountRial": 2160000,
  "voucher": {
    "code": "SAVE10",
    "percent": 10.00
  },
  "address": {
    "id": 4,
    "city": "Tehran",
    "county": "Central",
    "fullAddress": "Example delivery address",
    "plaque": "12",
    "recipientPhoneNumber": "+989121234567",
    "description": null,
    "createdAt": "2026-09-10T08:00:00Z",
    "updatedAt": "2026-09-10T08:00:00Z"
  },
  "paymentMethod": {
    "id": 1,
    "englishName": "Online Payment",
    "persianName": "پرداخت آنلاین",
    "slug": "online-payment",
    "iconUrl": null
  },
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
  "createdAt": "2026-09-15T10:20:00Z"
}
```

## Total calculation semantics

The server calculates:

```text
subtotalAmountRial = sum of every item lineTotalRial
discountAmountRial = roundHalfUp(subtotalAmountRial × percent ÷ 100)
totalAmountRial    = subtotalAmountRial - discountAmountRial
```

Important rules:

- The percentage applies once to the complete pre-discount subtotal.
- The discount is rounded to a whole Rial using half-up rounding.
- `totalAmountRial` remains the final payable total.
- A 100% voucher can produce a final total of zero.
- The returned `voucher` is an immutable order snapshot. Later edits to the backoffice voucher do
  not alter historical order responses.
- A voucher's usage remains consumed if the order is later cancelled or soft-deleted.
- Seller prices, price locks, voucher reservation, the order, and voucher usage are processed in
  one transaction. A rejected checkout does not leave a partial order or consumed voucher use.

## API client example

```ts
async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) throw (await response.json()) as ApiError;
  return response.json() as Promise<T>;
}

export async function createOrder(
  request: CreateOrderRequest,
  customerToken: string,
): Promise<Order> {
  return parseResponse<Order>(
    await fetch("/api/frontoffice/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }),
  );
}

export async function getMyOrders(
  customerToken: string,
  page = 0,
  size = 20,
) {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  return parseResponse<{ content: Order[] }>(
    await fetch(`/api/frontoffice/orders/my?${query}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    }),
  );
}
```

Example submit logic:

```ts
const normalizedInput = voucherInput.trim();
const request: CreateOrderRequest = {
  addressId: selectedAddressId,
  paymentMethodId: selectedPaymentMethodId,
  items: cart.map(toOrderItemRequest),
  ...(normalizedInput ? { voucherCode: normalizedInput } : {}),
};

try {
  const order = await createOrder(request, customerToken);
  setOrder(order);
  setSubtotal(order.subtotalAmountRial);
  setDiscount(order.discountAmountRial);
  setPayableTotal(order.totalAmountRial);
} catch (error) {
  showCheckoutError(error as ApiError);
}
```

## Voucher rejection errors

Errors use this shape:

```json
{
  "timestamp": "2026-09-15T10:30:00Z",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Voucher has expired",
  "fieldErrors": null
}
```

Voucher-specific failures:

| Status | Message | Meaning |
|---:|---|---|
| `404` | `Voucher with code SAVE10 was not found` | The normalized code does not exist or was deleted |
| `400` | `Voucher is inactive` | Backoffice disabled the voucher |
| `400` | `Voucher is not yet valid` | Current time is before `validFrom` |
| `400` | `Voucher has expired` | Current time is at or after exclusive `validTo` |
| `400` | `Voucher usage limit has been reached` | Global redemption capacity is exhausted |
| `400` | `Customer voucher usage limit has been reached` | This customer reached the per-customer limit |

The same checkout request can also fail because an address, payment method, part, seller offer, or
price lock is invalid. Display the server `message` near the order submission area. Keep the cart
and checkout selections so the customer can correct the problem.

Treat messages as display text rather than stable programmatic codes. Use the HTTP status and the
current checkout operation for application logic.

## Retry safety

An HTTP timeout or dropped connection is ambiguous: the server may have created the order even if
the client did not receive the response. Before retrying an ambiguous submission:

1. Call `GET /api/frontoffice/orders/my?sortBy=createdAt&sortDir=DESC`.
2. Check whether a matching recent order exists.
3. If it exists, navigate to that order instead of resubmitting.
4. Only retry when order history confirms that no order was created.

Do not automatically retry `POST /api/frontoffice/orders` at the HTTP-client/interceptor layer.

## Frontoffice implementation checklist

- [ ] Add one optional voucher-code input to checkout.
- [ ] Explain that final validation occurs when the order is placed.
- [ ] Omit `voucherCode` when the trimmed input is empty.
- [ ] Submit no more than one voucher code.
- [ ] Disable duplicate submissions while checkout is in flight.
- [ ] Replace all local totals with the successful order response.
- [ ] Render `voucher.code` and `voucher.percent` when `voucher` is non-null.
- [ ] Render no discount state when `voucher` is null and `discountAmountRial` is zero.
- [ ] Preserve the cart and selections after voucher rejection.
- [ ] Show server errors without trying to infer voucher validity locally.
- [ ] Check order history before retrying an ambiguous failed submission.
- [ ] Do not restore or advertise voucher availability after order cancellation.

