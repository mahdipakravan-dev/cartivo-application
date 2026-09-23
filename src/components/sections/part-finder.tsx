"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CarFront, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { fetchCarsByBrand } from "@/lib/api/brands";
import type {
  BrandFrontofficeResponse,
  CarFrontofficeDetailResponse,
} from "@/lib/api/types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface PartFinderProps {
  brands?: BrandFrontofficeResponse[];
  className?: string;
  layout?: "responsive" | "stacked";
  searchButtonClassName?: string;
  variant?: "default" | "showcase";
}

function getVehicleKey(car: CarFrontofficeDetailResponse) {
  if (car.variantId != null) return `variant:${car.variantId}`;

  return [
    "vehicle",
    car.modelId ?? "",
    car.generationId ?? "",
    car.model ?? car.baseModelName ?? "",
    car.trimLevel ?? "",
  ].join(":");
}

function getVehicleLabel(car: CarFrontofficeDetailResponse) {
  const label = [car.model || car.baseModelName, car.trimLevel]
    .filter(Boolean)
    .join(" — ");

  if (label) return label;

  return car.displayName?.replace(/\s*[-–—]?\s*[۰-۹0-9]{4}\s*$/, "") || "خودرو";
}

export function PartFinder({
  brands = [],
  className,
  layout = "responsive",
  searchButtonClassName,
  variant = "default",
}: PartFinderProps) {
  const router = useRouter();
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("");
  const [selectedYearId, setSelectedYearId] = useState("");
  const [cars, setCars] = useState<CarFrontofficeDetailResponse[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);

  useEffect(() => {
    if (!selectedBrandSlug) {
      setCars([]);
      setSelectedCarId("");
      setSelectedYearId("");
      return;
    }

    let cancelled = false;
    setLoadingCars(true);
    setSelectedCarId("");
    setSelectedYearId("");

    fetchCarsByBrand(selectedBrandSlug)
      .then((response) => {
        if (!cancelled) setCars(response);
      })
      .finally(() => {
        if (!cancelled) setLoadingCars(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedBrandSlug]);

  const brandOptions = useMemo(
    () =>
      brands
        .filter((brand) => brand.slug)
        .map((brand) => ({
          value: brand.slug ?? "",
          label: brand.persianName ?? "",
        })),
    [brands]
  );

  const carOptions = useMemo(
    () => {
      if (variant === "showcase") {
        const vehicles = new Map<string, { value: string; label: string }>();

        cars.forEach((car) => {
          const value = getVehicleKey(car);
          if (!vehicles.has(value)) {
            vehicles.set(value, { value, label: getVehicleLabel(car) });
          }
        });

        return [...vehicles.values()].sort((left, right) =>
          left.label.localeCompare(right.label, "fa"),
        );
      }

      return cars
        .filter((car) => car.id != null)
        .map((car) => ({
          value: String(car.id),
          label:
            car.displayName ||
            [
              car.model,
              car.trimLevel,
              car.year?.toLocaleString("fa-IR", { useGrouping: false }),
            ]
              .filter(Boolean)
              .join(" — "),
        }));
    },
    [cars, variant],
  );

  const yearOptions = useMemo(() => {
    if (variant !== "showcase" || !selectedCarId) return [];

    const years = new Map<
      string,
      { value: string; label: string; year: number }
    >();

    cars.forEach((car) => {
      const modelYearId = car.modelYearId ?? car.id;
      if (
        getVehicleKey(car) !== selectedCarId ||
        modelYearId == null ||
        car.year == null
      ) {
        return;
      }

      const value = String(modelYearId);
      years.set(value, {
        value,
        label: car.year.toLocaleString("fa-IR", { useGrouping: false }),
        year: car.year,
      });
    });

    return [...years.values()]
      .sort((left, right) => right.year - left.year)
      .map(({ value, label }) => ({ value, label }));
  }, [cars, selectedCarId, variant]);

  const fields = [
    (
      <SearchableSelect
        key="brand"
        options={brandOptions}
        value={selectedBrandSlug}
        onValueChange={setSelectedBrandSlug}
        placeholder="انتخاب برند"
        searchPlaceholder="جستجوی برند..."
        ariaLabel="انتخاب برند خودرو"
        variant={variant}
        leadingIcon={variant === "showcase" ? <CarFront /> : undefined}
        className="flex-1"
      />
    ),
    (
      <SearchableSelect
        key="car"
        options={carOptions}
        value={selectedCarId}
        onValueChange={(value) => {
          setSelectedCarId(value);
          setSelectedYearId("");
        }}
        placeholder="انتخاب خودرو"
        searchPlaceholder="جستجوی خودرو..."
        disabled={!selectedBrandSlug || loadingCars}
        emptyMessage={loadingCars ? "در حال بارگذاری..." : "خودرویی یافت نشد"}
        ariaLabel="انتخاب مدل خودرو"
        variant={variant}
        leadingIcon={variant === "showcase" ? <CarFront /> : undefined}
        className="flex-1"
      />
    ),
  ];

  if (variant === "showcase") {
    fields.push(
      <SearchableSelect
        key="year"
        options={yearOptions}
        value={selectedYearId}
        onValueChange={setSelectedYearId}
        placeholder="سال ساخت"
        searchPlaceholder="جستجوی سال ساخت..."
        disabled={!selectedCarId || loadingCars}
        emptyMessage="سال ساختی یافت نشد"
        ariaLabel="انتخاب سال ساخت"
        variant="showcase"
        leadingIcon={<CalendarDays />}
        className="flex-1"
      />,
    );
  }

  return (
    <div className={cn("w-full", className)} dir="rtl">
      <div className="flex flex-col gap-3">
        <div
          className={cn(
            "flex flex-col gap-3",
            layout === "responsive" && "sm:flex-row",
          )}
        >
          {fields}
        </div>
        <Button
          size="lg"
          disabled={
            !selectedBrandSlug ||
            !selectedCarId ||
            (variant === "showcase" && !selectedYearId)
          }
          onClick={() =>
            router.push(
              ROUTES.partsCar(
                selectedBrandSlug,
                variant === "showcase" ? selectedYearId : selectedCarId,
              ),
            )
          }
          className={cn(
            "h-12 w-full rounded-xl text-sm font-semibold shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
            variant === "showcase" &&
              "border border-primary/10 text-base font-bold shadow-primary/20 hover:shadow-xl focus-visible:ring-primary/25 disabled:bg-primary disabled:text-primary-foreground disabled:opacity-100",
            searchButtonClassName,
          )}
        >
          <Search
            data-icon="inline-start"
            className={variant === "showcase" ? "size-5" : undefined}
          />
          جستجو
        </Button>
      </div>
    </div>
  );
}
