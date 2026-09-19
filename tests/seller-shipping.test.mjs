import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateMerchandiseTotalRial,
  formatShippingCost,
  getAvailableQuantityError,
  getShippingMethodLabel,
} from "../src/lib/seller-shipping.ts";

test("maps every supported shipping method to its Persian customer label", () => {
  assert.equal(getShippingMethodLabel("SELLER_DELIVERY"), "ارسال توسط فروشنده");
  assert.equal(getShippingMethodLabel("POST"), "پست");
  assert.equal(getShippingMethodLabel("COURIER"), "پیک");
  assert.equal(getShippingMethodLabel("FREIGHT"), "باربری");
  assert.equal(getShippingMethodLabel(null), "روش ارسال اعلام نشده");
});

test("formats free, priced, and unknown shipping costs", () => {
  assert.equal(formatShippingCost(0), "رایگان");
  assert.equal(formatShippingCost(250_000), "۲۵۰٬۰۰۰ ریال");
  assert.equal(formatShippingCost(null), "هزینه اعلام نشده");
});

test("rejects only quantities above a seller's known availability", () => {
  assert.equal(getAvailableQuantityError(3, 2), "تنها ۲ عدد از این کالا قابل سفارش است.");
  assert.equal(getAvailableQuantityError(2, 2), null);
  assert.equal(getAvailableQuantityError(3, null), null);
});

test("keeps informational shipping cost out of the payable merchandise total", () => {
  assert.equal(
    calculateMerchandiseTotalRial([
      { unitPriceRial: 1_250_000, quantity: 2, shippingCostRial: 250_000 },
    ]),
    2_500_000,
  );
});
