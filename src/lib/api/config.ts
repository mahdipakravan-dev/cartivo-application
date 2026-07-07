/**
 * Centralized API configuration.
 *
 * - SERVER_BASE_URL: internal backend address (server-only, never exposed to client)
 * - CLIENT_BASE_URL: public-facing API base (used by CSR fetches in browser)
 * - DEFAULT_HEADERS: shared headers for all requests
 */

export const SERVER_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:8080";

export const CLIENT_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const DEFAULT_HEADERS: Record<string, string> = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
