import { SERVER_BASE_URL } from "./config";
import {
  getVehicleModels,
  getVehicleVariants,
  type VehicleBrand,
  type VehicleModel,
  type VehicleVariant,
} from "./vehicle-selector";
import type {
  BrandFrontofficeResponse,
  CarFrontofficeDetailResponse,
  PaginatedResult,
} from "./types";

const SELECTOR_PATH = "/api/public/vehicle-selector";

async function selectorFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${SELECTOR_PATH}/${path}`, SERVER_BASE_URL);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value != null && value !== "") url.searchParams.set(key, String(value));
  });
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "force-cache",
    next: { tags: ["vehicle-selector"] },
  });
  if (!response.ok) throw new Error(`Vehicle selector request failed (${response.status})`);
  return response.json() as Promise<T>;
}

function toCatalogBrand(brand: VehicleBrand): BrandFrontofficeResponse {
  return {
    ...(brand.id != null && { id: brand.id, slug: String(brand.id) }),
    ...(brand.name && { persianName: brand.name }),
    ...(brand.englishName && { englishName: brand.englishName }),
    ...(brand.logoUrl && { iconUrl: brand.logoUrl }),
  };
}

function toCatalogCar(
  brand: VehicleBrand,
  model: VehicleModel,
  variant: VehicleVariant,
): CarFrontofficeDetailResponse {
  const brandName = brand.name || brand.englishName;
  const modelName = variant.generation?.name || model.name || model.englishName;
  const description = [
    variant.engineCode && `کد موتور: ${variant.engineCode}`,
    variant.transmissionType && `گیربکس: ${variant.transmissionType}`,
  ].filter(Boolean).join(" • ");
  return {
    ...(variant.id != null && { id: variant.id }),
    ...(brandName && { brand: brandName }),
    ...(modelName && { model: modelName }),
    ...(variant.name && { trimLevel: variant.name }),
    ...(description && { description }),
  };
}

function paginate<T>(items: T[], page = 0, size = 20): PaginatedResult<T> {
  const start = page * size;
  const totalPages = size > 0 ? Math.ceil(items.length / size) : 0;
  return {
    items: items.slice(start, start + size),
    totalElements: items.length,
    totalPages,
    page,
    size,
    hasNext: page + 1 < totalPages,
    hasPrevious: page > 0,
  };
}

async function getSelectorBrands(search?: string) {
  return selectorFetch<VehicleBrand[]>("brands", { search });
}

async function getSelectorModels(brandId: number) {
  return selectorFetch<VehicleModel[]>("models", { brandId });
}

async function getSelectorVariants(modelId: number) {
  return selectorFetch<VehicleVariant[]>("variants", { modelId });
}

export async function getBrands(params?: {
  page?: number;
  size?: number;
  sort?: string;
}): Promise<PaginatedResult<BrandFrontofficeResponse>> {
  try {
    const brands = (await getSelectorBrands()).map(toCatalogBrand);
    return paginate(brands, params?.page ?? 0, params?.size ?? 20);
  } catch {
    return paginate([], params?.page ?? 0, params?.size ?? 20);
  }
}

export async function getAllBrands(): Promise<BrandFrontofficeResponse[]> {
  return (await getBrands({ page: 0, size: Number.MAX_SAFE_INTEGER })).items;
}

export async function getTopBrands(): Promise<BrandFrontofficeResponse[]> {
  return (await getBrands({ page: 0, size: 10 })).items;
}

export async function getBrandBySlug(
  slug: string,
): Promise<BrandFrontofficeResponse | null> {
  const brands = await getAllBrands();
  return brands.find((brand) => brand.slug === slug || String(brand.id) === slug) ?? null;
}

export async function getCarsByBrand(
  brandSlug: string,
): Promise<PaginatedResult<CarFrontofficeDetailResponse>> {
  try {
    const brandId = Number(brandSlug);
    if (!Number.isFinite(brandId)) return paginate([], 0, 50);
    const brands = await getSelectorBrands();
    const brand = brands.find((item) => item.id === brandId);
    if (!brand) return paginate([], 0, 50);
    const models = await getSelectorModels(brandId);
    const variants = await Promise.all(
      models.map(async (model) =>
        model.id == null
          ? []
          : (await getSelectorVariants(model.id)).map((variant) =>
              toCatalogCar(brand, model, variant),
            ),
      ),
    );
    return paginate(variants.flat(), 0, 50);
  } catch {
    return paginate([], 0, 50);
  }
}

export async function getCarByIdOrSlug(
  idOrSlug: string | number,
): Promise<CarFrontofficeDetailResponse | null> {
  const variantId = Number(idOrSlug);
  if (!Number.isFinite(variantId)) return null;
  try {
    const brands = await getSelectorBrands();
    for (const brand of brands) {
      if (brand.id == null) continue;
      const models = await getSelectorModels(brand.id);
      for (const model of models) {
        if (model.id == null) continue;
        const variant = (await getSelectorVariants(model.id)).find(
          (item) => item.id === variantId,
        );
        if (variant) return toCatalogCar(brand, model, variant);
      }
    }
  } catch {
    return null;
  }
  return null;
}

export async function fetchCarsByBrand(
  brandSlug: string,
): Promise<CarFrontofficeDetailResponse[]> {
  const brandId = Number(brandSlug);
  if (!Number.isFinite(brandId)) return [];
  try {
    const models = await getVehicleModels(brandId);
    const variants = await Promise.all(
      models.map(async (model) =>
        model.id == null
          ? []
          : (await getVehicleVariants(model.id)).map((variant) => ({
              ...(variant.id != null && { id: variant.id }),
              ...((variant.generation?.name || model.name || model.englishName) && {
                model: variant.generation?.name || model.name || model.englishName,
              }),
              ...(variant.name && { trimLevel: variant.name }),
            })),
      ),
    );
    return variants.flat();
  } catch {
    return [];
  }
}
