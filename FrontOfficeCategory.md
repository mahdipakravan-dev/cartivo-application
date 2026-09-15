# Front-office Category integration

Categories are public catalog groupings. A Category is attached to one or more existing top-level Parts, and the FrontOffice loads the active Categories for the selected top-level Part.

This is separate from `parentPartId`: the Part hierarchy remains unchanged. Category data is an additional many-to-many classification available on both top-level and child Parts.

## Endpoint

```http
GET /api/frontoffice/categories?parentId={topLevelPartId}
```

This endpoint is public; no authorization header is required. `parentId` is required and must identify a non-deleted top-level Part (a Part whose own `parentPartId` is null).

Standard pagination query parameters are supported:

| Parameter | Type | Default | Notes |
|---|---:|---:|---|
| `parentId` | number | required | Existing top-level Part ID |
| `page` | number | `0` | Zero-based page number |
| `size` | number | `20` | Capped by the backend maximum page size |
| `sortBy` | string | `createdAt` | Category field used for sorting |
| `sortDir` | `ASC \| DESC` | `DESC` | Sort direction |

Example:

```http
GET /api/frontoffice/categories?parentId=3&page=0&size=20&sortBy=name&sortDir=ASC
```

Example response:

```json
{
  "content": [
    {
      "id": 12,
      "name": "Brake Components",
      "persianName": "قطعات ترمز",
      "imageUrl": "https://api.example.com/files/uploads/brake-components.webp"
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

Only Categories where `active = true` and `deleted = false` are returned. An optional Category image is represented by `imageUrl`; render a fallback image when it is `null`.

## Front-end models

```ts
export interface Category {
  id: number;
  name: string;
  persianName: string;
  imageUrl: string | null;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PageQuery {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}
```

## API client

```ts
export async function getCategoriesByParent(
  parentId: number,
  query: PageQuery = {},
  signal?: AbortSignal,
): Promise<PageResponse<Category>> {
  const params = new URLSearchParams({ parentId: String(parentId) });

  if (query.page !== undefined) params.set('page', String(query.page));
  if (query.size !== undefined) params.set('size', String(query.size));
  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.sortDir) params.set('sortDir', query.sortDir);

  const response = await fetch(`/api/frontoffice/categories?${params}`, { signal });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? `Unable to load categories (${response.status})`);
  }

  return response.json();
}
```

For React Query-style stacks, use a key containing the parent and pagination state:

```ts
const categoryQueryKey = (parentId: number, query: PageQuery) =>
  ['categories', 'by-parent', parentId, query] as const;
```

Cancel or invalidate the previous request when the selected top-level Part changes.

## Part response changes

The primary public Part response shapes now include `categories`:

- `GET /api/frontoffice/parts/cars/{carId}/top-level`
- `GET /api/frontoffice/parts/{parentPartId}/children`
- `GET /api/frontoffice/parts/search`
- `GET /api/frontoffice/parts/most-ordered`
- `GET /api/frontoffice/parts/{id}`

Each item in `categories` uses this compact shape:

```ts
export interface CategorySummary {
  id: number;
  name: string;
  persianName: string;
  imageUrl: string | null;
}

export interface PartResponse {
  // Existing Part fields remain unchanged.
  categories: CategorySummary[];
}
```

Soft-deleted Categories are excluded from embedded Part responses. Treat an empty array as a valid Part with no assigned Categories.

## Recommended UI flow

1. Load or select an existing top-level Part.
2. Request Categories with that Part ID as `parentId`.
3. Render `name` or `persianName` based on the active locale and use the other as a fallback.
4. Use the Category ID for filtering/navigation state; do not use translated names as identifiers.
5. Read embedded `part.categories` when showing badges on Part cards or detail pages.
6. Reset the Category selection if the top-level Part changes and the selected Category is absent from the new response.
7. Support pagination or explicitly request an approved page size; do not assume every Category is returned in the first page.

## Errors

- `400 BAD_REQUEST`: `parentId` belongs to a child Part rather than a top-level Part.
- `404 NOT_FOUND`: the supplied Part does not exist or is soft-deleted.
- `500 INTERNAL_ERROR`: unexpected backend failure.

Typical error body:

```json
{
  "timestamp": "2026-09-15T10:30:00Z",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Category parentId must reference a top-level Part: 9",
  "fieldErrors": null
}
```

If the stack generates clients from OpenAPI, regenerate the FrontOffice client so `CategoryFrontofficeResponse`, `CategorySummaryResponse`, and the updated Part response fields are available.
