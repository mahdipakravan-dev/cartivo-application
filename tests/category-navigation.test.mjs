import assert from "node:assert/strict";
import test from "node:test";

import {
  getCategoryHref,
  getCategoryLabel,
} from "../src/lib/catalog-navigation.ts";
import {
  buildSearchParams,
  parseSearchParams,
} from "../src/lib/search-params.ts";

test("category navigation prefers the Persian label and category id", () => {
  const category = {
    id: 12,
    name: "Brake Components",
    persianName: "قطعات ترمز",
  };

  assert.equal(getCategoryLabel(category), "قطعات ترمز");
  assert.equal(
    getCategoryHref(category),
    "/parent/%D9%82%D8%B7%D8%B9%D8%A7%D8%AA%20%D8%AA%D8%B1%D9%85%D8%B2?categoryId=12",
  );
});

test("category navigation rejects missing and invalid ids", () => {
  assert.equal(getCategoryHref({ name: "Brakes" }), null);
  assert.equal(getCategoryHref({ id: Number.NaN, name: "Brakes" }), null);
});

test("category navigation falls back to the English category name", () => {
  assert.equal(getCategoryLabel({ id: 3, name: "Exterior" }), "Exterior");
  assert.equal(
    getCategoryHref({ id: 3, name: "Exterior" }),
    "/parent/Exterior?categoryId=3",
  );
});

test("part search parses and serializes category filters", () => {
  assert.deepEqual(
    parseSearchParams({ categoryId: "12", categoryIds: "3,4" }),
    { categoryId: 12, categoryIds: [3, 4] },
  );

  assert.equal(
    buildSearchParams({ categoryId: 12, categoryIds: [3, 4] }).toString(),
    "categoryIds=3%2C4&categoryId=12",
  );
});

test("removed parent-part filters are ignored", () => {
  assert.deepEqual(parseSearchParams({ parentPartIds: "7,8" }), {});
});
