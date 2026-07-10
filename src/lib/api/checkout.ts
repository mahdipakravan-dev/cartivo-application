import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";

export type CustomerAddress = components["schemas"]["CustomerAddressResponse"];
export type CustomerAddressRequest = components["schemas"]["CustomerAddressRequest"];
export type PaymentMethod = components["schemas"]["PaymentMethodFrontofficeResponse"];

export function getAddresses() {
  return apiFetch<CustomerAddress[]>("/api/frontoffice/customer-addresses");
}

export function createAddress(address: CustomerAddressRequest) {
  return apiFetch<CustomerAddress>("/api/frontoffice/customer-addresses", {
    method: "POST",
    body: JSON.stringify(address),
  });
}

export async function getPaymentMethods() {
  const page = await apiFetch<components["schemas"]["PageResponse"]>(
    "/api/frontoffice/payment-methods",
    { params: { page: 0, size: 50 } }
  );
  return (page.content || []) as PaymentMethod[];
}
