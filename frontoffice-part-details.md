# Front-office part details

The public single-part endpoint now returns the populated category-driven specifications for a part:

```http
GET /api/frontoffice/parts/{partId}
```

No new front-office request body is needed. Detail values are managed in the back office and are read-only for customers.

## Response

The existing part response contains a new `details` array:

```json
{
  "id": 125,
  "name": "دیسک ترمز جلو",
  "price": 4200000,
  "details": [
    {
      "categoryId": 12,
      "key": "diameter",
      "label": "قطر",
      "dataType": "DECIMAL",
      "unit": "mm",
      "sortOrder": 10,
      "value": 280.5
    },
    {
      "categoryId": 12,
      "key": "disc_type",
      "label": "نوع دیسک",
      "dataType": "SELECT",
      "unit": null,
      "sortOrder": 20,
      "value": "vented"
    }
  ]
}
```

Only active mappings that belong to the part's currently assigned categories and have a stored value are returned. Empty optional fields and back-office configuration such as `required`, `options`, and `mappingId` are not exposed.

Top-level parts and list/search responses return no specification data. This avoids additional database work where the customer is not viewing one product. The `details` property on a top-level response is an empty array.

## TypeScript model

```ts
type PartDetail = {
  categoryId: number;
  key: string;
  label: string;
  dataType:
    | "TEXT"
    | "TEXTAREA"
    | "INTEGER"
    | "DECIMAL"
    | "BOOLEAN"
    | "DATE"
    | "SELECT"
    | "MULTI_SELECT";
  unit: string | null;
  sortOrder: number;
  value: string | number | boolean | string[];
};

type PartDetailResponse = {
  // Existing part response properties...
  details: PartDetail[];
};
```

## Rendering the specification section

Hide the entire section when `details.length === 0`. Otherwise, render a specification table using `label` and a formatted value:

```ts
function formatDetail(detail: PartDetail): string {
  let value: string;

  switch (detail.dataType) {
    case "BOOLEAN":
      value = detail.value ? "بله" : "خیر";
      break;
    case "MULTI_SELECT":
      value = (detail.value as string[]).join("، ");
      break;
    default:
      value = String(detail.value);
  }

  return detail.unit ? `${value} ${detail.unit}` : value;
}
```

Example React rendering:

```tsx
{part.details.length > 0 && (
  <section aria-labelledby="part-specifications-title">
    <h2 id="part-specifications-title">مشخصات فنی</h2>
    <dl>
      {part.details.map((detail) => (
        <div key={`${detail.categoryId}-${detail.key}`}>
          <dt>{detail.label}</dt>
          <dd>{formatDetail(detail)}</dd>
        </div>
      ))}
    </dl>
  </section>
)}
```

The API already orders fields by `sortOrder` and then mapping ID. The frontend may preserve that order. Use `categoryId` together with `key` as the rendering key because mapping keys are unique per category, not globally.

## Fetching

Fetch the full part after the user opens its product-detail route:

```ts
const { data: part } = await api.get<PartDetailResponse>(
  `/api/frontoffice/parts/${partId}`,
);
```

Do not attempt to build customer-visible details from the back-office mapping endpoint. That endpoint requires panel permissions and includes empty/configuration fields that are not intended for storefront display.
