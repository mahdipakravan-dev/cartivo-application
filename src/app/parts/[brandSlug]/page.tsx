import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getBrandBySlug, getCarsByBrand } from "@/lib/api/brands";
import { searchParts } from "@/lib/api/parts";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { parseSearchParams } from "@/lib/search-params";
import { JsonLd } from "@/lib/seo/json-ld";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchResults } from "@/components/sections/product-search/search-results";
import type { CarFrontofficeDetailResponse } from "@/lib/api/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = await getBrandBySlug(brandSlug);
  if (!brand) return { title: "برند یافت نشد" };

  return {
    title: `قطعات یدکی ${brand.persianName} — لیست خودروها و قطعات`,
    description: `خرید قطعات یدکی ${brand.persianName} (${brand.englishName}) با مقایسه قیمت فروشندگان.`,
    alternates: { canonical: ROUTES.partsBrand(brandSlug) },
    openGraph: {
      title: `قطعات یدکی ${brand.persianName} | ${siteConfig.name}`,
      description: `لیست خودروها و قطعات یدکی ${brand.persianName} در کارتیوو.`,
      url: ROUTES.partsBrand(brandSlug),
      type: "website",
      ...(brand.iconUrl ? { images: [{ url: brand.iconUrl }] } : {}),
    },
  };
}

function CarItem({
  car,
  brandSlug,
}: {
  car: CarFrontofficeDetailResponse;
  brandSlug: string;
}) {
  const primaryImage = car.imageUrls?.[0];

  return (
    <Link
      href={ROUTES.partsCar(brandSlug, String(car.id))}
      className="group/car flex shrink-0 flex-col items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${car.brand} ${car.model} — مشاهده جزئیات`}
    >
      <div className="relative flex h-26 w-26 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm shadow-slate-100/50 transition-all duration-300 group-hover/car:-translate-y-1 group-hover/car:border-slate-200 group-hover/car:shadow-lg group-hover/car:shadow-slate-200/60">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={`${car.brand} ${car.model}`}
            width={80}
            height={80}
            className="object-cover transition-transform duration-300 group-hover/car:scale-110"
            loading="lazy"
          />
        ) : (
          <span className="text-lg font-bold text-slate-300 transition-colors group-hover/car:text-slate-500">
            {car.model?.slice(0, 3)}
          </span>
        )}
      </div>

      <div className="max-w-[8rem] text-center">
        <span className="block truncate text-xs font-medium text-slate-500 transition-colors group-hover/car:text-slate-800">
          {car.model}
        </span>
      </div>
    </Link>
  );
}

export default async function PartsBrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ brandSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { brandSlug } = await params;
  const sp = await searchParams;
  const filters = parseSearchParams(sp);

  const [brand, carsResult] = await Promise.all([
    getBrandBySlug(brandSlug),
    getCarsByBrand(brandSlug),
  ]);

  if (!brand) notFound();

  const cars = carsResult.items;
  filters.brandIds = [brand.id!];
  const results = await searchParts(filters);

  const brandJsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.persianName,
    alternateName: brand.englishName,
    url: `${siteConfig.url}${ROUTES.partsBrand(brandSlug)}`,
    ...(brand.iconUrl ? { logo: brand.iconUrl } : {}),
  };

  return (
    <>
      <JsonLd data={brandJsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]" /> */}

        <div className="relative container-cartivo px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
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
              <li aria-current="page" className="font-medium text-white">
                {brand.persianName}
              </li>
            </ol>
          </nav>

          <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 shadow-xl shadow-black/10 backdrop-blur-sm sm:h-36 sm:w-36">
              {brand.iconUrl ? (
                <Image
                  src={brand.iconUrl}
                  alt={`لوگوی ${brand.persianName}`}
                  width={120}
                  height={120}
                  className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                />
              ) : (
                <span className="text-3xl font-bold text-white/30">
                  {brand.englishName?.slice(0, 3)}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {brand.persianName}
              </h1>
              <p className="mt-2 text-lg text-white/50">{brand.englishName}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  {cars.length.toLocaleString("fa-IR")} مدل خودرو
                </span>
                {brand.countryCode && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                    {brand.countryCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FBFCFD] to-transparent" />
      </section>

      {/* Cars Section */}
      <section className="py-8 sm:py-8">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <SectionHeader title="خودروها" />
          {cars.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-400">
              خودرویی برای این برند یافت نشد.
            </p>
          ) : (
            <div className="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:flex-wrap sm:justify-start sm:gap-5">
                {cars.map((car) => (
                  <CarItem key={car.id} car={car} brandSlug={brandSlug} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section className="border-t border-slate-100 py-8 sm:py-12">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <SectionHeader title="جست‌وجوی قطعات" />
          <Suspense
            fallback={
              <div className="py-16 text-center text-sm text-slate-400">
                در حال بارگذاری...
              </div>
            }
          >
            <SearchResults
              initialParams={filters}
              cars={cars}
              results={results}
              brandSlug={brandSlug}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
