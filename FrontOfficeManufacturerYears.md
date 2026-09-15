# Front-office Part manufacturer-years integration

FrontOffice Part responses now expose the Shamsi manufacturing years supported by each Part through `manufacturerYears`.

Values are integers, limited to the inclusive range `1340` through `1406`, de-duplicated, and returned in ascending order. A Part with no year assignment returns an empty array.

## Affected endpoints

The field is included in Part objects returned by:

```text
GET /api/frontoffice/parts/top-level
GET /api/frontoffice/parts/cars/{carId}/top-level
GET /api/frontoffice/parts/{parentPartId}/children
GET /api/frontoffice/parts/search
GET /api/frontoffice/parts/most-ordered
GET /api/frontoffice/parts/{id}
GET /api/frontoffice/global-search
```

These endpoints remain public except where existing security rules say otherwise. No new endpoint or request parameter is required.

## Response field

Example Part response fragment:

```json
{
  "id": 10,
  "name": "Front Brake Pad",
  "manufacturerYears": [1398, 1399, 1400]
}
```

The field is present on both top-level and child Parts. It is also included in `partCategories` and `parts` items returned by global search.

## TypeScript models

Add the field to every local Part response shape used by the affected endpoints:

```ts
export interface PartResponse {
  // Existing Part fields remain unchanged.
  manufacturerYears: number[];
}

export interface PartSearchResponse {
  // Existing search-result fields remain unchanged.
  manufacturerYears: number[];
}

export interface MostOrderedPartResponse {
  // Existing most-ordered fields remain unchanged.
  manufacturerYears: number[];
}

export interface GlobalSearchPartCategory {
  id: number;
  name: string;
  position: string | null;
  manufacturerYears: number[];
}

export interface GlobalSearchPart {
  id: number;
  name: string;
  description: string | null;
  parentPartId: number | null;
  parentPartName: string | null;
  partBrandName: string | null;
  manufacturerYears: number[];
}
```

## Display guidance

Use Shamsi values exactly as returned. Do not pass them through JavaScript `Date`, Gregorian conversion, or timezone logic.

Compact display helper:

```ts
export function formatManufacturerYears(years: number[]): string {
  if (years.length === 0) return 'All years / unspecified';
  if (years.length === 1) return String(years[0]);

  const consecutive = years.every(
    (year, index) => index === 0 || year === years[index - 1] + 1,
  );

  return consecutive
    ? `${years[0]}–${years[years.length - 1]}`
    : years.join(', ');
}
```

Choose the empty-state text according to product rules. The backend only means “no years assigned”; it does not claim universal compatibility.

Recommended rendering:

- Part card: show a compact range such as `1398–1400`.
- Part detail: show every year or a range plus an expandable list.
- Right-to-left Persian UI: render localized digits if desired, but retain numeric values in application state.
- Filters: do not present a manufacturer-year filter yet because the backend does not currently accept one.

## Client compatibility

During a rolling deployment, tolerate the field being temporarily absent from cached or older API responses:

```ts
export function getManufacturerYears(part: {
  manufacturerYears?: number[] | null;
}): number[] {
  return part.manufacturerYears ?? [];
}
```

After all environments and generated clients are updated, the field can be treated as a required array.

If the stack generates clients from OpenAPI, regenerate the FrontOffice client so all affected Part and global-search response types include `manufacturerYears`.
