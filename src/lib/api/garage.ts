import { apiFetch } from "./fetch";
import type { components } from "./generated/schema";

export type GarageVehicle = components["schemas"]["CustomerCarResponse"];
export type GarageVehicleCreateRequest =
  components["schemas"]["CustomerCarCreateRequest"];
export type GarageVehicleUpdateRequest =
  components["schemas"]["CustomerCarUpdateRequest"];

const GARAGE_PATH = "/api/frontoffice/me/garage";

export function getGarageVehicles() {
  return apiFetch<GarageVehicle[]>(GARAGE_PATH);
}

export function createGarageVehicle(payload: GarageVehicleCreateRequest) {
  return apiFetch<GarageVehicle>(GARAGE_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateGarageVehicle(
  garageVehicleId: number,
  payload: GarageVehicleUpdateRequest,
) {
  return apiFetch<GarageVehicle>(`${GARAGE_PATH}/${garageVehicleId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function makeGarageVehicleDefault(garageVehicleId: number) {
  return apiFetch<GarageVehicle>(
    `${GARAGE_PATH}/${garageVehicleId}/default`,
    { method: "PUT" },
  );
}

export function deleteGarageVehicle(garageVehicleId: number) {
  return apiFetch<void>(`${GARAGE_PATH}/${garageVehicleId}`, {
    method: "DELETE",
  });
}
