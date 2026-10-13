import assert from "node:assert/strict";
import test from "node:test";

import {
  isFitmentCompatibleWithGarageVehicle,
  isPartCompatibleWithGarage,
} from "../src/lib/part-compatibility.ts";

const savedCar = {
  vehicle: {
    year: 1402,
    calendarType: "PERSIAN",
    generation: { id: 10 },
    variant: { id: 20 },
  },
};

test("matches a saved car by variant and production-year range", () => {
  assert.equal(
    isFitmentCompatibleWithGarageVehicle(
      { variantId: 20, yearFrom: 1400, yearTo: 1404, calendarType: "PERSIAN" },
      savedCar,
    ),
    true,
  );
});

test("rejects a matching variant outside its production-year range", () => {
  assert.equal(
    isFitmentCompatibleWithGarageVehicle(
      { variantId: 20, yearFrom: 1395, yearTo: 1399, calendarType: "PERSIAN" },
      savedCar,
    ),
    false,
  );
});

test("falls back to generation matching when a fitment has no variant", () => {
  assert.equal(
    isFitmentCompatibleWithGarageVehicle({ generationId: 10 }, savedCar),
    true,
  );
});

test("matches when any saved garage car is compatible", () => {
  assert.equal(
    isPartCompatibleWithGarage(
      [{ variantId: 99 }, { variantId: 20, yearFrom: 1402 }],
      [{ vehicle: { variant: { id: 1 }, year: 1402 } }, savedCar],
    ),
    true,
  );
});
