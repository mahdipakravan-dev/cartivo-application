import type { GarageVehicle } from "@/lib/api/garage";
import type { PartFrontofficeResponse } from "@/lib/api/types";

type PartFitment = NonNullable<PartFrontofficeResponse["fitments"]>[number];

export function isFitmentCompatibleWithGarageVehicle(
  fitment: PartFitment,
  garageVehicle: GarageVehicle,
): boolean {
  const vehicle = garageVehicle.vehicle;
  if (!vehicle) return false;

  const identityMatches = fitment.variantId != null
    ? vehicle.variant?.id === fitment.variantId
    : fitment.generationId != null
      ? vehicle.generation?.id === fitment.generationId
      : false;

  if (!identityMatches) return false;
  if (
    fitment.calendarType != null &&
    vehicle.calendarType != null &&
    fitment.calendarType !== vehicle.calendarType
  ) {
    return false;
  }

  if (vehicle.year == null) {
    return fitment.yearFrom == null && fitment.yearTo == null;
  }

  return (
    (fitment.yearFrom == null || vehicle.year >= fitment.yearFrom) &&
    (fitment.yearTo == null || vehicle.year <= fitment.yearTo)
  );
}

export function isPartCompatibleWithGarage(
  fitments: PartFrontofficeResponse["fitments"],
  garageVehicles: GarageVehicle[],
): boolean {
  return Boolean(
    fitments?.some((fitment) =>
      garageVehicles.some((vehicle) =>
        isFitmentCompatibleWithGarageVehicle(fitment, vehicle),
      ),
    ),
  );
}
