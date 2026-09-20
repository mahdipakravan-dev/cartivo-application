/**
 * Centralized route definitions.
 * Routes with params are functions; static routes are strings.
 */
export const ROUTES = {
  home: "/",
  brands: "/parts/brands",
  partBrands: "/parts/part-brands",
  partBrandDetail: (slug: string) => `/parts/part-brands/${slug}`,
  brandDetail: (slug: string) => `/parts/brands/${slug}`,

  // Parts hierarchy
  parts: "/parts",
  categories: "/categories",
  contact: "/contact",
  basket: "/basket",
  profile: "/profile",
  compare: "/compare",
  blogDetail: (slug: string) => `/blogs/${slug}`,
  partDetail: (partId: string) => `/parts/${partId}`,
  compareParts: (basePartId: string | number, targetPartId?: string | number) =>
    `/compare?base=${basePartId}${targetPartId != null ? `&target=${targetPartId}` : ""}`,
  partsBrand: (brandSlug: string) => `/parts/${brandSlug}`,
  partsCar: (brandSlug: string, carSlug: string) => `/parts/${brandSlug}/${carSlug}`,
  partsModel: (brandSlug: string, modelId: string | number) =>
    `/parts/${brandSlug}/models/${modelId}`,
  parentPart: (manufacturerName: string, parentId: string | number) =>
    `/parent/${encodeURIComponent(manufacturerName)}?parentId=${parentId}`,
  parentCategory: (
    manufacturerName: string,
    categoryId: string | number,
  ) => `/parent/${encodeURIComponent(manufacturerName)}/${categoryId}`,
  partsPart: (brandSlug: string, carSlug: string, partId: string) =>
    `/parts/${brandSlug}/${carSlug}/${partId}`,
} as const;
