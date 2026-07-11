import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowDownLeft, BadgeCheck, CarFront, ChevronLeft, Package, Search, Wrench } from "lucide-react";
import { getBrandBySlug, getCarsByBrand, getCarByIdOrSlug } from "@/lib/api/brands";
import { searchParts } from "@/lib/api/parts";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { parseSearchParams } from "@/lib/search-params";
import { JsonLd } from "@/lib/seo/json-ld";
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
  const carName = [brand.persianName, car.model, car.trimLevel].filter(Boolean).join(" ");
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

      <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <nav aria-label="مسیر ناوبری" className="mb-6 overflow-hidden text-xs text-slate-400">
            <ol className="flex items-center gap-1.5 whitespace-nowrap">
              <li>
                <Link href={ROUTES.home} className="transition-colors hover:text-[#14305A]">
                  خانه
                </Link>
              </li>
              <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
              <li>
                <Link href={ROUTES.partsBrand(brandSlug)} className="transition-colors hover:text-[#14305A]">
                  {brand.persianName}
                </Link>
              </li>
              <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
              <li aria-current="page" className="truncate font-bold text-slate-600">
                {car.model}
              </li>
            </ol>
          </nav>

          <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
            <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-36 left-1/3 size-80 rounded-full bg-blue-400/10 blur-3xl" />

            <div className="grid lg:min-h-[430px] lg:grid-cols-[1fr_1.1fr]">
              <div className="relative z-10 flex items-center px-6 py-11 sm:px-10 lg:px-14 lg:py-16">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100 backdrop-blur-sm">
                    <BadgeCheck className="size-4" />
                    قطعات سازگار با خودروی شما
                  </div>
                  <h1 className="mt-6 text-3xl font-black leading-[1.35] text-white sm:text-4xl lg:text-5xl">
                    قطعات یدکی
                    <span className="block text-cyan-300">{brand.persianName} {car.model}</span>
                  </h1>
                  {car.trimLevel && (
                    <p className="mt-2 text-sm font-bold text-white/45">تیپ {car.trimLevel}</p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/65">
                      <CarFront className="size-3.5 text-cyan-300" />
                      {brand.persianName}
                    </span>
                    {car.bodyType && (
                      <span className="rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/65">
                        {BODY_TYPE_LABELS[car.bodyType] ?? car.bodyType}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/65">
                      <Package className="size-3.5 text-cyan-300" />
                      {results.totalElements.toLocaleString("fa-IR")} قطعه
                    </span>
                  </div>

                  {car.description && (
                    <p className="mt-5 line-clamp-2 max-w-lg text-sm leading-7 text-white/55">
                      {car.description}
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href="#compatible-parts" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#14305A] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-cyan-50">
                      <Search className="size-4" />
                      مشاهده قطعات سازگار
                      <ArrowDownLeft className="size-4" />
                    </a>
                    <Link href={ROUTES.partsBrand(brandSlug)} className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/15">
                      مدل‌های دیگر
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden border-t border-white/10 p-7 sm:min-h-[340px] lg:min-h-[430px] lg:border-r lg:border-t-0 lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(103_232_249/0.12)_0,transparent_62%)]" />
                <div className="absolute bottom-[18%] h-px w-[80%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute bottom-[17%] h-10 w-[65%] rounded-[50%] bg-black/20 blur-xl" />
                {primaryImage ? (
                  <div className="relative h-56 w-full max-w-xl sm:h-72 lg:h-80">
                    <Image
                      src={primaryImage}
                      alt={carName}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain drop-shadow-[0_24px_24px_rgb(0_0_0/0.3)] transition-transform duration-700 hover:scale-[1.03]"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative flex size-44 items-center justify-center rounded-[2.5rem] border border-white/15 bg-white/10 backdrop-blur-sm">
                    <CarFront className="size-20 text-cyan-200/35" />
                  </div>
                )}
                <Wrench className="absolute left-10 top-10 size-8 rotate-[-20deg] text-cyan-300/20" />
              </div>
            </div>
          </section>
        </div>

      <section id="compatible-parts" className="scroll-mt-24 py-10 sm:py-12">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold text-cyan-700">قطعات سازگار</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">قطعات {brand.persianName} {car.model}</h2>
            </div>
            <p className="text-sm text-slate-400">نتایج بر اساس خودروی انتخاب‌شده فیلتر شده‌اند.</p>
          </div>
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
      </main>
    </>
  );
}
