# Front-office API additions

This document describes the category and vehicle-model filters added to the public catalog API.
All endpoints below are public and do not require an authorization header.

## Search parts

```http
GET /api/frontoffice/parts/search
```

The search endpoint now accepts these additional query parameters:

| Parameter | Type | Meaning |
|---|---|---|
| `categoryId` | number | Match parts assigned to this Category |
| `categoryIds` | number[] | Match parts assigned to any supplied Category |
| `modelId` | number | Match parts with a fitment under this vehicle model |

`categoryId` and `categoryIds` are aliases that can be used separately or together. When both
are present, their values are combined and a part matches when it is assigned to any of them.
Duplicate IDs are ignored.

List values can use Spring's comma-separated query format:

```http
GET /api/frontoffice/parts/search?categoryIds=12,13&page=0&size=20
```

Repeated parameters are also supported by standard Spring query binding:

```http
GET /api/frontoffice/parts/search?categoryIds=12&categoryIds=13
```

Examples:

```http
# One Category
GET /api/frontoffice/parts/search?categoryId=12

# Any of several Categories
GET /api/frontoffice/parts/search?categoryIds=12,13,18

# Every generation/variant/year fitment belonging to one model
GET /api/frontoffice/parts/search?modelId=7

# Filters remain composable with the existing search parameters
GET /api/frontoffice/parts/search?modelId=7&categoryId=12&partBrandIds=3&minPrice=100000&page=0&size=24
```

The IDs have different meanings:

- `modelId` is the `model.id` returned inside an item from `GET /api/frontoffice/cars`.
- `categoryId`/`categoryIds` use Category IDs, not top-level Part IDs.
- `parentPartIds` remains available for filtering by the existing top-level Part hierarchy.

All supplied filter groups are combined with AND. Multiple values within `categoryIds` are
combined with OR. As before, search results contain only active, non-deleted leaf parts that have
a current seller price and positive inventory.

The response remains the standard paginated `PartSearchFrontofficeResponse`:

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

An unknown Category or model ID produces a successful empty page rather than a 404 response.

## Get a Category directly by ID

```http
GET /api/frontoffice/categories/{id}
```

This endpoint lets a Category URL resolve directly and removes the need to retain or reconstruct
`?parentId=` solely to load the selected Category.

Example:

```http
GET /api/frontoffice/categories/12
```

Response:

```json
{
  "id": 12,
  "name": "Brake Components",
  "persianName": "قطعات ترمز",
  "imageUrl": "https://api.example.com/files/uploads/brake-components.webp",
  "parts": []
}
```

The endpoint returns only active, non-deleted Categories. The `parts` array is empty because this
lookup is independent of a selected vehicle; use the existing navigation endpoint when compatible
parts must be embedded:

```http
GET /api/frontoffice/categories?carId=31&brandId=1&partId=8
```

### Errors

- `404 NOT_FOUND`: the Category does not exist, is inactive, or is soft-deleted.

## Frontend migration

1. Send the selected Category directly as `categoryId` (or multiple selections as `categoryIds`)
   instead of fetching by `parentPartIds` and filtering the response locally.
2. On a model-only page, send `modelId` instead of expanding the model into model-year IDs for
   `carIds`.
3. Resolve Category routes with `GET /api/frontoffice/categories/{id}`. Keep `parentId` only when
   the UI actually needs the list of Categories belonging to a top-level Part.

