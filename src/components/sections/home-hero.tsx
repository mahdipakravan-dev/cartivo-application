"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ROUTES } from "@/lib/routes";
import { fetchCarsByBrand } from "@/lib/api/brands";
import type { BrandFrontofficeResponse, CarFrontofficeDetailResponse } from "@/lib/api/types";

interface HomeHeroProps {
  brands: BrandFrontofficeResponse[];
}

const HERO_IMAGES = [
  "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/8272c8ed3_generated_0cb84b85.png",
];

export function HomeHero({ brands }: HomeHeroProps) {
  const router = useRouter();
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>("");
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [cars, setCars] = useState<CarFrontofficeDetailResponse[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedBrandSlug) {
      setCars([]);
      return;
    }
    setLoadingCars(true);
    setSelectedCarId("");
    fetchCarsByBrand(selectedBrandSlug)
      .then(setCars)
      .finally(() => setLoadingCars(false));
  }, [selectedBrandSlug]);

  const brandOptions = brands.map((brand) => ({
    value: brand.slug ?? "",
    label: brand.persianName ?? "",
  }));

  const carOptions = cars.map((car) => ({
    value: car.id?.toString() ?? "",
    label: `${car.model ?? ""}${car.trimLevel ? ` ${car.trimLevel}` : ""}`,
  }));

  return (
    <section className="relative flex min-h-[600px] items-center pt-16 lg:min-h-[680px] lg:pt-20">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="خودرو در شب"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
              i === currentImageIndex ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-l from-[#102a50]/95 via-[#102a50]/80 to-[#102a50]/50" />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#FBFCFD] via-[#102a50]/40 to-transparent" /> */}
        {/* <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FBFCFD] to-transparent" /> */}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            قطعات مناسب خودرو شما را سریع پیدا کنید
          </h1>
          <p className="mb-8 text-base leading-relaxed text-white/80 lg:text-lg">
            برند و مدل خودروی خود را انتخاب کنید تا قطعات سازگار را مشاهده
            کنید
          </p>

          {/* Search Card */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <SearchableSelect
                  options={brandOptions}
                  value={selectedBrandSlug}
                  onValueChange={setSelectedBrandSlug}
                  placeholder="انتخاب برند"
                  searchPlaceholder="جستجوی برند..."
                  className="flex-1"
                />
                <SearchableSelect
                  options={carOptions}
                  value={selectedCarId}
                  onValueChange={setSelectedCarId}
                  placeholder="انتخاب خودرو"
                  searchPlaceholder="جستجوی خودرو..."
                  disabled={!selectedBrandSlug || loadingCars}
                  emptyMessage={
                    loadingCars ? "در حال بارگذاری..." : "خودرویی یافت نشد"
                  }
                  className="flex-1"
                />
              </div>
              <Button
                size="lg"
                disabled={!selectedBrandSlug || !selectedCarId}
                onClick={() => router.push(ROUTES.partsCar(selectedBrandSlug, selectedCarId))}
                className="h-12 w-full rounded-xl bg-[#14305A] text-sm font-semibold text-white shadow-lg shadow-[#14305A]/30 transition-all hover:bg-[#1a3d6f] hover:shadow-xl hover:shadow-[#14305A]/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-4 w-4" />
                جستجو
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
