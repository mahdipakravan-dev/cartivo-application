import { apiFetch } from "./fetch";
import { SERVER_BASE_URL } from "./config";
import type { components } from "./generated/schema";
import type {
  BrandFrontofficeResponse,
  CarFrontofficeDetailResponse,
  PaginatedResult,
} from "./types";

type CatalogBrandResponse = components["schemas"]["SelectorBrand"];

interface CatalogCarResponse {
  modelYearId: number;
  year: number;
  calendarType: "PERSIAN" | "GREGORIAN";
  brand?: components["schemas"]["SelectorBrand"];
  model?: components["schemas"]["SelectorModel"];
  generation?: components["schemas"]["SelectorGeneration"];
  variant?: components["schemas"]["SelectorVariant"];
  displayName?: string;
}

interface CatalogPage<T> {
  content?: T[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface CatalogCarModel {
  id: number;
  name: string;
  englishName?: string;
  cars: CarFrontofficeDetailResponse[];
}

async function frontofficeFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`/api/frontoffice/${path}`, SERVER_BASE_URL);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value != null && value !== "") url.searchParams.set(key, String(value));
  });
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "force-cache",
    next: { tags: ["frontoffice-catalog"] },
  });
  if (!response.ok) throw new Error(`Frontoffice catalog request failed (${response.status})`);
  return response.json() as Promise<T>;
}

function toCatalogBrand(brand: CatalogBrandResponse): BrandFrontofficeResponse {
  return {
    ...(brand.id != null && { id: brand.id, slug: String(brand.id) }),
    ...(brand.name && { persianName: brand.name }),
    ...(brand.englishName && { englishName: brand.englishName }),
    ...(brand.logoUrl && { iconUrl: brand.logoUrl }),
  };
}

function toCatalogCar(car: CatalogCarResponse): CarFrontofficeDetailResponse {
  const modelName = car.generation?.name || car.model?.name || car.model?.englishName;
  const description = [
    car.variant?.engineCode && `کد موتور: ${car.variant.engineCode}`,
    car.variant?.transmissionType && `گیربکس: ${car.variant.transmissionType}`,
  ].filter(Boolean).join(" • ");
  return {
    id: car.modelYearId,
    modelYearId: car.modelYearId,
    year: car.year,
    calendarType: car.calendarType,
    ...(car.displayName && { displayName: car.displayName }),
    ...((car.brand?.name || car.brand?.englishName) && {
      brand: car.brand?.name || car.brand?.englishName,
    }),
    ...(modelName && { model: modelName }),
    ...(car.variant?.name && { trimLevel: car.variant.name }),
    ...(car.model?.id != null && { modelId: car.model.id }),
    ...(car.model?.name && { baseModelName: car.model.name }),
    ...(car.model?.englishName && { modelEnglishName: car.model.englishName }),
    ...(car.generation?.id != null && { generationId: car.generation.id }),
    ...(car.variant?.id != null && { variantId: car.variant.id }),
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

async function getCatalogBrands(search?: string) {
  return frontofficeFetch<CatalogBrandResponse[]>("brands", { search });
}

async function getAllCatalogCars(brandId: number): Promise<CatalogCarResponse[]> {
  const first = await frontofficeFetch<CatalogPage<CatalogCarResponse>>("cars", {
    brandId,
    page: 0,
    size: 100,
    sort: "year,desc",
  });
  const items = [...(first.content ?? [])];
  const totalPages = first.totalPages ?? 1;
  if (totalPages > 1) {
    const remaining = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        frontofficeFetch<CatalogPage<CatalogCarResponse>>("cars", {
          brandId,
          page: index + 1,
          size: 100,
          sort: "year,desc",
        }),
      ),
    );
    remaining.forEach((page) => items.push(...(page.content ?? [])));
  }
  return items;
}

export async function getBrands(params?: {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}): Promise<PaginatedResult<BrandFrontofficeResponse>> {
  try {
    const brands = (await getCatalogBrands(params?.search)).map(toCatalogBrand);
    return paginate(brands, params?.page ?? 0, params?.size ?? 20);
  } catch {
    return paginate([], params?.page ?? 0, params?.size ?? 20);
  }
}

export async function getAllBrands(): Promise<BrandFrontofficeResponse[]> {
  try {
    return (await getCatalogBrands()).map(toCatalogBrand);
  } catch {
    return [];
  }
}

export async function getTopBrands(): Promise<BrandFrontofficeResponse[]> {
  return (await getAllBrands()).slice(0, 10);
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
  const brandId = Number(brandSlug);
  if (!Number.isFinite(brandId)) return paginate([], 0, 100);
  try {
    const cars = (await getAllCatalogCars(brandId)).map(toCatalogCar);
    return paginate(cars, 0, Math.max(cars.length, 1));
  } catch {
    return paginate([], 0, 100);
  }
}

export async function getCarModelsByBrand(
  brandSlug: string,
): Promise<CatalogCarModel[]> {
  const { items: cars } = await getCarsByBrand(brandSlug);
  const models = new Map<number, CatalogCarModel>();
  cars.forEach((car) => {
    if (car.modelId == null) return;
    const existing = models.get(car.modelId);
    if (existing) {
      existing.cars.push(car);
      return;
    }
    models.set(car.modelId, {
      id: car.modelId,
      name: car.baseModelName || car.model || `مدل ${car.modelId}`,
      ...(car.modelEnglishName && { englishName: car.modelEnglishName }),
      cars: [car],
    });
  });
  return [...models.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "fa"),
  );
}

export async function getCarByIdOrSlug(
  idOrSlug: string | number,
  brandSlug: string,
): Promise<CarFrontofficeDetailResponse | null> {
  const modelYearId = Number(idOrSlug);
  const brandId = Number(brandSlug);
  if (!Number.isFinite(modelYearId) || !Number.isFinite(brandId)) return null;
  try {
    const car = (await getAllCatalogCars(brandId)).find(
      (item) => item.modelYearId === modelYearId,
    );
    return car ? toCatalogCar(car) : null;
  } catch {
    return null;
  }
}

export async function fetchCarsByBrand(
  brandSlug: string,
): Promise<CarFrontofficeDetailResponse[]> {
  const brandId = Number(brandSlug);
  if (!Number.isFinite(brandId)) return [];
  try {
    const first = await apiFetch<CatalogPage<CatalogCarResponse>>(
      "/api/frontoffice/cars",
      { params: { brandId, page: 0, size: 100, sort: "year,desc" } },
    );
    return (first.content ?? []).map(toCatalogCar);
  } catch {
    return [];
  }
}
