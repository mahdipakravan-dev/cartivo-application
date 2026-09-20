# FrontOffice Catalog Navigation API

This document describes the customer-facing navigation flow:

```text
brand -> exact car -> top-level part -> category -> related purchasable parts
```

FrontOffice catalog endpoints are public. Garage endpoints require a customer JWT.

## Identifier rule

`carId` in the category API is an exact `carModelYearId`, not a legacy `cars.id`, model ID,
generation ID, or variant ID. The value comes from `GET /api/frontoffice/cars` and can also be
sent directly to the Garage API as `carModelYearId`.

## Pagination

The `/cars`, `/parts`, and `/categories` endpoints accept the standard parameters:

- `page` (zero-based)
- `size`
- `sort`, for example `sort=name,asc`

Paginated responses use:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0,
  "hasNext": false,
  "hasPrevious": false
}
```

## 1. List brands

```http
GET /api/frontoffice/brands
GET /api/frontoffice/brands?search=iran
```

Only active, non-deleted brands are returned. This endpoint returns a JSON array rather than a
page.

```json
[
  {
    "id": 1,
    "name": "ایران خودرو",
    "englishName": "Iran Khodro",
    "logoUrl": "/files/iran-khodro.png"
  }
]
```

## 2. List cars for a brand

```http
GET /api/frontoffice/cars?brandId=1&page=0&size=20
```

This flattens the normalized model/generation/variant/year hierarchy into exact selectable cars.
Only fully active catalog paths are returned.

```json
{
  "content": [
    {
      "modelYearId": 31,
      "year": 1404,
      "calendarType": "PERSIAN",
      "brand": { "id": 1, "name": "ایران خودرو", "englishName": "Iran Khodro", "logoUrl": null },
      "model": { "id": 5, "name": "دنا", "englishName": "Dena" },
      "generation": { "id": 7, "name": "دنا پلاس", "code": null },
      "variant": {
        "id": 21,
        "name": "تیپ ۲ اتوماتیک",
        "displayName": "دنا پلاس — تیپ ۲ اتوماتیک",
        "generation": { "id": 7, "name": "دنا پلاس", "code": null },
        "engineCode": "EF7P",
        "transmissionType": "AUTOMATIC"
      },
      "displayName": "دنا پلاس — تیپ ۲ اتوماتیک — 1404"
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

## 3. List top-level parts for a brand

```http
GET /api/frontoffice/parts?brandId=1&page=0&size=20
```

The response contains active top-level Parts that have at least one active child Part with a
fitment for the selected vehicle brand. These IDs are used as `partId` in the next request.

```json
{
  "content": [
    {
      "id": 8,
      "name": "Brake",
      "leaf": false,
      "position": "BOTH",
      "price": null,
      "categories": []
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

## 4. List categories and their related parts

```http
GET /api/frontoffice/categories?carId=31&brandId=1&partId=8&page=0&size=20
```

All three IDs are required:

- `carId`: exact `modelYearId` returned by `/cars`
- `brandId`: selected vehicle brand
- `partId`: selected top-level Part returned by `/parts`

The backend verifies that `carId` belongs to `brandId`. Only active categories that contain at
least one active, compatible assigned Part are returned. Every category includes all compatible
Parts assigned to it in `parts`. A related Part may have `price: null` if no current price is
configured.

```json
{
  "content": [
    {
      "id": 12,
      "name": "Brake Pads",
      "persianName": "لنت ترمز",
      "imageUrl": "/files/brake-pads.png",
      "parts": [
        {
          "id": 45,
          "name": "Front Brake Pad",
          "businessName": "Front Brake Pad Set",
          "partNumber": "BP-001",
          "price": 1250000,
          "parentPartId": 8,
          "parentPartName": "Brake",
          "categories": [
            { "id": 12, "name": "Brake Pads", "persianName": "لنت ترمز", "imageUrl": "/files/brake-pads.png" }
          ]
        }
      ]
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

The older category lookup remains available:

```http
GET /api/frontoffice/categories?parentId=8
```

It returns category metadata and an empty `parts` array because it has no vehicle selection.

## 5. Add the selected car to Garage

```http
POST /api/frontoffice/me/garage
Authorization: Bearer <customer-jwt>
Content-Type: application/json

{
  "carModelYearId": 31,
  "vin": "IR12345678901",
  "plateNumber": "12 الف 345 ایران 67",
  "nickname": "ماشین من",
  "color": "سفید",
  "mileage": 45000,
  "isDefault": true
}
```

## Validation responses

- Unknown identifiers return `404 NOT_FOUND`.
- A `carId` that does not belong to `brandId` returns `400 BAD_REQUEST` with
  `carId does not belong to brandId`.
- Deleted or inactive catalog paths are not exposed by FrontOffice navigation.

