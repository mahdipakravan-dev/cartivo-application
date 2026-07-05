/**
 * Centralized route definitions.
 * Routes with params are functions; static routes are strings.
 */
export const ROUTES = {
  home: "/",
  brands: "/brands",
  brandDetail: (slug: string) => `/brands/${slug}`,
  brandSearch: (slug: string) => `/brands/${slug}`,
} as const;
