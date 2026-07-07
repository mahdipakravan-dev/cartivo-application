/**
 * Centralized route definitions.
 * Routes with params are functions; static routes are strings.
 */
export const ROUTES = {
  home: "/",
  brands: "/brands",
  brandDetail: (slug: string) => `/brands/${slug}`,

  // Parts hierarchy
  parts: "/parts",
  partsBrand: (brandSlug: string) => `/parts/${brandSlug}`,
  partsCar: (brandSlug: string, carSlug: string) => `/parts/${brandSlug}/${carSlug}`,
  partsPart: (brandSlug: string, carSlug: string, partId: string) =>
    `/parts/${brandSlug}/${carSlug}/${partId}`,
} as const;
