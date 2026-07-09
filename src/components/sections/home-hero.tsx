"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ROUTES } from "@/lib/routes";
import { fetchCarsByBrand } from "@/lib/api/brands";
import type { BrandFrontofficeResponse, CarFrontofficeDetailResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type HeroVariant = "default" | "boxed" | "full-primary";

interface HomeHeroProps {
  brands: BrandFrontofficeResponse[];
  variant?: HeroVariant;
}

export function HomeHero({ brands, variant = "default" }: HomeHeroProps) {
  const router = useRouter();
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>("");
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [cars, setCars] = useState<CarFrontofficeDetailResponse[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);

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

  if (variant === "boxed") {
    return (
      <section className={
        cn(
          "relative px-4 py-10 sm:px-6 lg:px-8",
          variant === "boxed" && "mt-8"
        )
      }>
        <div className="container-cartivo overflow-hidden rounded-3xl bg-[#14305A] shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Image - Left side */}
            <div className="relative w-full lg:w-1/2">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-60"
                style={{
                  backgroundImage: "url(https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/8272c8ed3_generated_0cb84b85.png)",
                }}
              />
            </div>

            {/* Content - Right side */}
            <div className="relative flex w-full items-center p-8 sm:p-12 lg:w-1/2 lg:p-16">
              <div className="w-full max-w-lg">
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
                      className="h-12 w-full rounded-xl bg-white text-sm font-semibold text-[#14305A] shadow-lg transition-all hover:bg-white/90 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Search className="h-4 w-4" />
                      جستجو
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "full-primary") {
    return (
      <section className="relative isolate min-h-[680px] overflow-hidden bg-primary pt-24 text-white lg:min-h-[760px] lg:pt-28">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-contain bg-[position:left_center] bg-no-repeat opacity-35 lg:block"
          style={{ backgroundImage: "var(--cartivo-hero-background-image)" }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/15" />

        <div className="container-cartivo relative z-10 flex min-h-[560px] items-center px-4 py-12 sm:px-6 lg:min-h-[632px] lg:px-8 lg:py-16">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)]">
            <div className="relative hidden min-h-[360px] lg:block" />

            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
                جست‌وجوی سریع قطعات یدکی
              </p>
              <h1 className="mb-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                قطعات مناسب خودرو شما را سریع پیدا کنید
              </h1>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-white/80 lg:text-lg">
                برند و مدل خودروی خود را انتخاب کنید تا قطعات سازگار را مشاهده
                کنید
              </p>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
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
                    className="h-12 w-full rounded-xl bg-white text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Search className="h-4 w-4" />
                    جستجو
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative flex min-h-[600px] items-center bg-cover bg-center bg-no-repeat pt-16 lg:min-h-[680px] lg:pt-20"
      style={{ backgroundImage: "var(--cartivo-hero-background)" }}
    >
      {/* Content */}
      <div className="relative z-10 w-full container-cartivo px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
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
