/**
 * Centralized route definitions.
 * Routes with params are functions; static routes are strings.
 */
export const ROUTES = {
  home: "/",
  brands: "/parts/brands",
  partBrands: "/parts/part-brands",
  partBrandDetail: (slug: string) => `/parts/part-brands/${slug}`,
  brandDetail: (slug: string) => `/parts/${slug}`,

  // Parts hierarchy
  parts: "/parts",
  categories: "/categories",
  contact: "/contact",
  basket: "/basket",
  profile: "/profile",
  blogDetail: (slug: string) => `/blogs/${slug}`,
  partDetail: (partId: string) => `/parts/${partId}`,
  partsBrand: (brandSlug: string) => `/parts/${brandSlug}`,
  partsCar: (brandSlug: string, carSlug: string) => `/parts/${brandSlug}/${carSlug}`,
  partsPart: (brandSlug: string, carSlug: string, partId: string) =>
    `/parts/${brandSlug}/${carSlug}/${partId}`,
} as const;
