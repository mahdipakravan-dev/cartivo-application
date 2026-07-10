import { CLIENT_BASE_URL, DEFAULT_HEADERS } from "./config";
import { getAccessToken } from "./auth-token";

/**
 * Type-safe fetch wrapper for CSR (Client Components).
 *
 * - Prepends CLIENT_BASE_URL to relative paths
 * - Merges default headers
 * - Returns parsed JSON or throws
 */

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  const base = CLIENT_BASE_URL || "";
  const url = new URL(path, base || window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...init } = options;

  const url = buildUrl(path, params);
  const accessToken = getAccessToken();

  const response = await fetch(url, {
    ...init,
    headers: {
      ...DEFAULT_HEADERS,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message || `خطا در ارتباط با سرور (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
