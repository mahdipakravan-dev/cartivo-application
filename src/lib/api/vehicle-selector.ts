import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";

export type VehicleBrand = components["schemas"]["SelectorBrand"];
export type VehicleModel = components["schemas"]["SelectorModel"];
export type VehicleVariant = components["schemas"]["SelectorVariant"];
export type ResolvedVehicle = components["schemas"]["ResolvedVehicle"];

export interface VehicleModelYear {
  id: number;
  year: number;
  calendarType: "PERSIAN" | "GREGORIAN";
}

const SELECTOR_PATH = "/api/public/vehicle-selector";

export function getVehicleBrands(search?: string) {
  return apiFetch<VehicleBrand[]>(`${SELECTOR_PATH}/brands`, {
    params: { search },
  });
}

export function getVehicleModels(brandId: number, search?: string) {
  return apiFetch<VehicleModel[]>(`${SELECTOR_PATH}/models`, {
    params: { brandId, search },
  });
}

export function getVehicleVariants(modelId: number, search?: string) {
  return apiFetch<VehicleVariant[]>(`${SELECTOR_PATH}/variants`, {
    params: { modelId, search },
  });
}

export function getVehicleModelYears(variantId: number) {
  return apiFetch<VehicleModelYear[]>(`${SELECTOR_PATH}/model-years`, {
    params: { variantId },
  });
}

export function resolveVehicle(modelYearId: number) {
  return apiFetch<ResolvedVehicle>(`${SELECTOR_PATH}/resolve`, {
    params: { modelYearId },
  });
}
