import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";
import { SERVER_BASE_URL, DEFAULT_HEADERS } from "./config";

/**
 * Type-safe OpenAPI client for SSR (Server Components / Route Handlers).
 *
 * Uses SERVER_BASE_URL (internal) so the backend address is never exposed to the browser.
 * All domain fetchers (brands, parts, …) use this client.
 */
export const apiClient = createClient<paths>({
  baseUrl: SERVER_BASE_URL,
  headers: DEFAULT_HEADERS,
});

apiClient.use({
  onRequest: (req) => {
    // console.log("OUTBOUND_SSR_REQUEST ", req.request.url, req.request.body)
  },
  onResponse: (res) => {
    console.log("[outbound]", res.request.url, res.response.status)
  },
  onError: () => { }
})
