# Front-office category hierarchy changes

Parts are no longer hierarchy nodes. Every part is a purchasable catalog item and can be assigned to zero or more categories. The hierarchy now belongs entirely to categories through `categoryParentId`.

## Category responses

All front-office category representations now include:

```json
{
  "id": 12,
  "name": "Brake Components",
  "persianName": "قطعات ترمز",
  "imageUrl": "/files/brakes.webp",
  "categoryParentId": 3,
  "position": "EXTERIOR",
  "parts": []
}
```

`categoryParentId` is `null` for a root category. `position` is now category metadata and may be `INTERIOR`, `EXTERIOR`, `BOTH`, or `null`.

The compact `categories` array embedded in part, search, most-ordered, and global-search results has the same `categoryParentId` and `position` fields.

## Browsing categories

### List root categories

```http
GET /api/frontoffice/categories?page=0&size=20
```

### List direct children

```http
GET /api/frontoffice/categories?categoryParentId=12&page=0&size=20
```

Only active, non-deleted categories are returned. An unknown or inactive parent returns `404`.

### Vehicle-aware navigation

```http
GET /api/frontoffice/categories/navigation?carId=44&brandId=7&categoryParentId=12&page=0&size=20
```

Omit `categoryParentId` to start at the roots. The response contains direct child categories that have compatible parts, and each category's `parts` array contains its directly assigned compatible parts.

## Browsing and searching parts

The old part-tree routes were removed:

- `GET /api/frontoffice/parts/top-level`
- `GET /api/frontoffice/parts/cars/{carId}/top-level`
- `GET /api/frontoffice/parts/{parentPartId}/children`

Use categories for navigation and this route for a category's directly assigned parts:

```http
GET /api/frontoffice/parts/category/{categoryId}?carId=44&page=0&size=20
```

`carId` is optional. Part search continues at `GET /api/frontoffice/parts/search`; `parentPartIds` was removed. Use `categoryId`, `categoryIds`, or `positionType` instead.

Part responses no longer contain `parentPartId`, `parentPartName`, `leaf`, or part-level `position`. Their `categories` array is the authoritative classification.

Global search now searches real categories for `partCategories` and returns category summaries on each matching part instead of parent-part fields.
