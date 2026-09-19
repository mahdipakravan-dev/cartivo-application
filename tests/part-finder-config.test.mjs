import assert from "node:assert/strict";
import test from "node:test";

import {
  PART_FINDER_FIELDS,
  PRODUCTION_YEAR_OPTIONS,
} from "../src/components/sections/part-finder-config.ts";

test("vehicle search starts with production year and exposes no VIN or image modes", () => {
  assert.deepEqual(PART_FINDER_FIELDS, ["year", "brand", "car"]);
  assert.equal(PART_FINDER_FIELDS.includes("vin"), false);
  assert.equal(PART_FINDER_FIELDS.includes("image"), false);
});

test("production year choices are newest-first Persian calendar years", () => {
  assert.equal(PRODUCTION_YEAR_OPTIONS[0]?.value, "1405");
  assert.equal(PRODUCTION_YEAR_OPTIONS.at(-1)?.value, "1360");
  assert.equal(PRODUCTION_YEAR_OPTIONS.length, 46);
});
