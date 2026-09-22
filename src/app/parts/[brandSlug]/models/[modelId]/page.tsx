import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CarFront, ChevronLeft, Layers3, PackageSearch } from "lucide-react";

import { CarsSection } from "@/components/sections/cars-section";
import { SearchResults } from "@/components/sections/product-search/search-results";
import { getBrandBySlug, getCarModelsByBrand } from "@/lib/api/brands";
import { searchParts } from "@/lib/api/parts";
import { ROUTES } from "@/lib/routes";
import { parseSearchParams } from "@/lib/search-params";

interface ModelPageProps {
  params: Promise<{ brandSlug: string; modelId: string }>;
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { brandSlug, modelId } = await params;
  const [brand, models] = await Promise.all([
    getBrandBySlug(brandSlug),
    getCarModelsByBrand(brandSlug),
  ]);
  const model = models.find((item) => item.id === Number(modelId));
  if (!brand || !model) return { title: "مدل خودرو یافت نشد" };
  return {
    title: `قطعات ${brand.persianName} ${model.name} — همه سال‌ها`,
    description: `لیست قطعات سازگار با ${brand.persianName} ${model.name} در همه تیپ‌ها و سال‌های تولید.`,
    alternates: { canonical: ROUTES.partsModel(brandSlug, modelId) },
  };
}

export default async function ModelPage({
  params,
  searchParams,
}: ModelPageProps & {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { brandSlug, modelId } = await params;
  const [brand, models, rawSearchParams] = await Promise.all([
    getBrandBySlug(brandSlug),
    getCarModelsByBrand(brandSlug),
    searchParams,
  ]);
  const model = models.find((item) => item.id === Number(modelId));
  if (!brand || !model) notFound();

  const filters = parseSearchParams(rawSearchParams);
  const modelCarIds = model.cars.flatMap((car) => car.id == null ? [] : [car.id]);
  const { carIds, ...nonVehicleFilters } = filters;
  const requestedCarIds = carIds?.filter((id) => modelCarIds.includes(id));
  const effectiveFilters = {
    ...nonVehicleFilters,
    modelId: model.id,
    ...(requestedCarIds?.length ? { carIds: requestedCarIds } : {}),
  };
  const results = await searchParts(effectiveFilters);

  return (
    <main className="bg-[var(--background)] pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav aria-label="مسیر ناوبری" className="mb-6 text-xs text-text-secondary">
          <ol className="flex items-center gap-1.5">
            <li><Link href={ROUTES.home} className="hover:text-primary">خانه</Link></li>
            <li><ChevronLeft className="size-3" /></li>
            <li><Link href={ROUTES.brandDetail(brandSlug)} className="hover:text-primary">{brand.persianName}</Link></li>
            <li><ChevronLeft className="size-3" /></li>
            <li className="font-bold text-text-muted">{model.name}</li>
          </ol>
        </nav>

        <header className="relative isolate overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-white shadow-[0_24px_70px_rgb(15_23_42/0.12)] sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute -right-24 -top-32 size-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-accent">
              <CarFront className="size-4" /> مدل خودرو، بدون وابستگی به سال
            </span>
            <h1 className="mt-6 text-3xl font-black sm:text-4xl lg:text-5xl">{brand.persianName} {model.name}</h1>
            {model.englishName && <p dir="ltr" className="mt-2 w-fit text-lg text-white/45">{model.englishName}</p>}
            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/65 sm:text-base">
              قطعات سازگار با این مدل در همه تیپ‌ها و سال‌های تولید را ببینید؛ برای نتیجه دقیق‌تر می‌توانید نسخه و سال خودرو را هم انتخاب کنید.
            </p>
          </div>
        </header>

        <section className="pt-10 sm:pt-12" aria-labelledby="model-configurations-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-accent">تیپ و سال تولید</p>
              <h2 id="model-configurations-title" className="mt-2 text-2xl font-black text-dark sm:text-3xl">نسخه‌های {model.name}</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-text-secondary shadow-sm">
              <Layers3 className="size-4" /> {model.cars.length.toLocaleString("fa-IR")} انتخاب
            </span>
          </div>
          <CarsSection cars={model.cars} brandSlug={brandSlug} brandName={brand.persianName ?? ""} />
        </section>

        <section className="border-t border-border/70 pt-10 sm:pt-12" aria-labelledby="model-parts-title">
          <div className="mb-7">
            <p className="text-xs font-bold text-accent">همه سال‌ها و تیپ‌ها</p>
            <h2 id="model-parts-title" className="mt-2 text-2xl font-black text-dark sm:text-3xl">
              قطعات سازگار با {brand.persianName} {model.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              این فهرست از قطعات سازگار با حداقل یکی از نسخه‌های این مدل ساخته شده است.
            </p>
          </div>

          {modelCarIds.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white py-14 text-center">
              <PackageSearch className="mx-auto size-10 text-text-secondary" />
              <p className="mt-3 text-sm font-bold text-text-secondary">نسخه‌ای برای دریافت قطعات این مدل ثبت نشده است</p>
            </div>
          ) : (
            <Suspense fallback={<div className="py-16 text-center text-sm text-text-secondary">در حال بارگذاری...</div>}>
              <SearchResults initialParams={filters} cars={model.cars} results={results} />
            </Suspense>
          )}
        </section>
      </div>
    </main>
  );
}
