"use client";

import { useEffect, useMemo, useState } from "react";
import { CarFront, Search } from "lucide-react";
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
  const [cars, setCars] = useState<CarFrontofficeDetailResponse[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);

  useEffect(() => {
    if (!selectedBrandSlug) {
      setCars([]);
      setSelectedCarId("");
      return;
    }

    let cancelled = false;
    setLoadingCars(true);
    setSelectedCarId("");

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
    () =>
      cars
        .filter((car) => car.id != null)
        .map((car) => ({
          value: String(car.id),
          label: car.displayName || [
            car.model,
            car.trimLevel,
            car.year?.toLocaleString("fa-IR", { useGrouping: false }),
          ].filter(Boolean).join(" — "),
        })),
    [cars]
  );

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
        onValueChange={setSelectedCarId}
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
          disabled={!selectedBrandSlug || !selectedCarId}
          onClick={() =>
            router.push(ROUTES.partsCar(selectedBrandSlug, selectedCarId))
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
