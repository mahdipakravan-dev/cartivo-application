"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
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
import {
  PART_FINDER_FIELDS,
  PRODUCTION_YEAR_OPTIONS,
} from "./part-finder-config";

interface PartFinderProps {
  brands?: BrandFrontofficeResponse[];
  className?: string;
  layout?: "responsive" | "stacked";
  searchButtonClassName?: string;
}

export function PartFinder({
  brands = [],
  className,
  layout = "responsive",
  searchButtonClassName,
}: PartFinderProps) {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState("");
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
          label: `${car.model ?? ""}${car.trimLevel ? ` ${car.trimLevel}` : ""}`,
        })),
    [cars]
  );

  const fields = {
    year: (
      <SearchableSelect
        key="year"
        options={PRODUCTION_YEAR_OPTIONS}
        value={selectedYear}
        onValueChange={setSelectedYear}
        placeholder="سال تولید"
        searchPlaceholder="جستجوی سال تولید..."
        className="flex-1"
      />
    ),
    brand: (
      <SearchableSelect
        key="brand"
        options={brandOptions}
        value={selectedBrandSlug}
        onValueChange={setSelectedBrandSlug}
        placeholder="انتخاب برند"
        searchPlaceholder="جستجوی برند..."
        className="flex-1"
      />
    ),
    car: (
      <SearchableSelect
        key="car"
        options={carOptions}
        value={selectedCarId}
        onValueChange={setSelectedCarId}
        placeholder="انتخاب خودرو"
        searchPlaceholder="جستجوی خودرو..."
        disabled={!selectedBrandSlug || loadingCars}
        emptyMessage={loadingCars ? "در حال بارگذاری..." : "خودرویی یافت نشد"}
        className="flex-1"
      />
    ),
  };

  return (
    <div className={cn("w-full", className)} dir="rtl">
      <div className="flex flex-col gap-3">
        <div
          className={cn(
            "flex flex-col gap-3",
            layout === "responsive" && "sm:flex-row",
          )}
        >
          {PART_FINDER_FIELDS.map((field) => fields[field])}
        </div>
        <Button
          size="lg"
          disabled={!selectedYear || !selectedBrandSlug || !selectedCarId}
          onClick={() =>
            router.push(ROUTES.partsCar(selectedBrandSlug, selectedCarId))
          }
          className={cn(
            "h-12 w-full rounded-xl text-sm font-semibold shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
            searchButtonClassName
          )}
        >
          <Search className="h-4 w-4" />
          جستجو
        </Button>
      </div>
    </div>
  );
}
