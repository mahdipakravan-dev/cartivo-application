import assert from "node:assert/strict";
import test from "node:test";

import { formatPartDetail } from "../src/lib/part-details.ts";

const detail = (overrides) => ({
  categoryId: 12,
  key: "example",
  label: "نمونه",
  dataType: "TEXT",
  unit: null,
  sortOrder: 10,
  value: "value",
  ...overrides,
});

test("formats boolean part details in Persian", () => {
  assert.equal(
    formatPartDetail(detail({ dataType: "BOOLEAN", value: true })),
    "بله",
  );
  assert.equal(
    formatPartDetail(detail({ dataType: "BOOLEAN", value: false })),
    "خیر",
  );
});

test("joins multi-select values with Persian punctuation", () => {
  assert.equal(
    formatPartDetail(
      detail({ dataType: "MULTI_SELECT", value: ["تهویه‌دار", "شیاردار"] }),
    ),
    "تهویه‌دار، شیاردار",
  );
});

test("appends a specification unit", () => {
  assert.equal(
    formatPartDetail(
      detail({ dataType: "DECIMAL", value: 280.5, unit: "mm" }),
    ),
    "280.5 mm",
  );
});
