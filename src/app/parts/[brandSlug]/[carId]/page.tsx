import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBrandBySlug, getCarsByBrand, getCarByIdOrSlug } from "@/lib/api/brands";
import { searchParts } from "@/lib/api/parts";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { parseSearchParams } from "@/lib/search-params";
import { JsonLd } from "@/lib/seo/json-ld";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchResults } from "@/components/sections/product-search/search-results";

const BODY_TYPE_LABELS: Record<string, string> = {
  SEDAN: "سدان",
  HATCHBACK: "هاچبک",
  SUV: "شاسی‌بلند",
  CROSSOVER: "کراس‌اور",
  PICKUP: "پیکاپ",
  VAN: "ون",
  COUPE: "کوپه",
  MINIVAN: "مینی‌ون",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string; carId: string }>;
}): Promise<Metadata> {
  const { brandSlug, carId } = await params;
  const [brand, car] = await Promise.all([
    getBrandBySlug(brandSlug),
    getCarByIdOrSlug(carId),
  ]);

  if (!brand || !car) return { title: "خودرو یافت نشد" };

  return {
    title: `قطعات یدکی ${car.brand} ${car.model} | ${siteConfig.name}`,
    description: `خرید قطعات یدکی ${car.brand} ${car.model} (${car.trimLevel ?? ""}) با مقایسه قیمت فروشندگان.`,
    alternates: { canonical: ROUTES.partsCar(brandSlug, carId) },
    openGraph: {
      title: `قطعات یدکی ${car.brand} ${car.model} | ${siteConfig.name}`,
      description: `لیست قطعات یدکی ${car.brand} ${car.model} در کارتیوو.`,
      url: ROUTES.partsCar(brandSlug, carId),
      type: "website",
      ...(car.imageUrls?.[0] ? { images: [{ url: car.imageUrls[0] }] } : {}),
    },
  };
}

export default async function PartsCarPage({
  params,
  searchParams,
}: {
  params: Promise<{ brandSlug: string; carId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { brandSlug, carId } = await params;
  const sp = await searchParams;
  const filters = parseSearchParams(sp);

  const [brand, car] = await Promise.all([
    getBrandBySlug(brandSlug),
    getCarByIdOrSlug(carId),
  ]);

  if (!brand || !car) notFound();

  const primaryImage = car.imageUrls?.[0];
  filters.carIds = [car.id!];
  const results = await searchParts(filters);

  const carJsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${car.brand} ${car.model}`,
    brand: { "@type": "Brand", name: brand.persianName },
    ...(car.trimLevel ? { model: car.trimLevel } : {}),
    ...(primaryImage ? { image: primaryImage } : {}),
  };

  return (
    <>
      <JsonLd data={carJsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <nav aria-label="مسیر ناوبری" className="mb-8 text-sm text-white/40">
            <ol className="flex items-center gap-2">
              <li>
                <Link href={ROUTES.home} className="transition-colors hover:text-white/70">
                  خانه
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ROUTES.parts} className="transition-colors hover:text-white/70">
                  قطعات
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ROUTES.partsBrand(brandSlug)} className="transition-colors hover:text-white/70">
                  {brand.persianName}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-white">
                {car.model}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            {/* Car Image */}
            <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 shadow-xl shadow-black/10 backdrop-blur-sm sm:h-56 sm:w-56">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={`${car.brand} ${car.model}`}
                  width={200}
                  height={200}
                  className="h-36 w-36 object-contain sm:h-44 sm:w-44"
                />
              ) : (
                <span className="text-4xl font-bold text-white/30">
                  {car.model?.slice(0, 3)}
                </span>
              )}
            </div>

            {/* Car Info */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {car.brand} {car.model}
              </h1>
              {car.trimLevel && (
                <p className="mt-2 text-lg text-white/50">{car.trimLevel}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {car.bodyType && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                    {BODY_TYPE_LABELS[car.bodyType] ?? car.bodyType}
                  </span>
                )}
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  {brand.persianName}
                </span>
              </div>
              {car.description && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/40">
                  {car.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FBFCFD] to-transparent" />
      </section>

      {/* Search Section — no car filter */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={`قطعات ${car.brand} ${car.model}`} />
          <Suspense
            fallback={
              <div className="py-16 text-center text-sm text-slate-400">
                در حال بارگذاری...
              </div>
            }
          >
            <SearchResults
              initialParams={filters}
              cars={[]}
              results={results}
              brandSlug={brandSlug}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
