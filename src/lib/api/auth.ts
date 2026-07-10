import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";

export type CustomerProfile = components["schemas"]["CustomerFrontofficeResponse"];
export type ProfileUpdate = components["schemas"]["CustomerFrontofficeUpdateRequest"];
export type LoginResponse = components["schemas"]["CustomerLoginResponse"];

export function requestOtp(phoneNumber: string) {
  return apiFetch<components["schemas"]["OtpRequestResponse"]>(
    "/api/frontoffice/auth/request-otp",
    { method: "POST", body: JSON.stringify({ phoneNumber }) }
  );
}

export function verifyOtp(phoneNumber: string, code: string) {
  return apiFetch<LoginResponse>("/api/frontoffice/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ phoneNumber, code }),
  });
}

export function getProfile() {
  return apiFetch<CustomerProfile>("/api/frontoffice/customers/me");
}

export function updateProfile(profile: ProfileUpdate) {
  return apiFetch<CustomerProfile>("/api/frontoffice/customers/me", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}
