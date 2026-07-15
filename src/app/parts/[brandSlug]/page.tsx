import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowDownLeft, BadgeCheck, CarFront, ChevronLeft, Search, Wrench } from "lucide-react";
import { getBrandBySlug, getCarsByBrand } from "@/lib/api/brands";
import { getPartById, searchParts } from "@/lib/api/parts";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { parseSearchParams } from "@/lib/search-params";
import { JsonLd } from "@/lib/seo/json-ld";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchResults } from "@/components/sections/product-search/search-results";
import type { CarFrontofficeDetailResponse } from "@/lib/api/types";
import { ProductDetail } from "@/components/product/product-detail";

const isPartId = (value: string) => /^\d+$/.test(value);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}): Promise<Metadata> {
  const { brandSlug } = await params;
  if (isPartId(brandSlug)) {
    const part = await getPartById(brandSlug);
    if (!part) return { title: "قطعه یافت نشد" };
    const title = `${part.name || "قطعه خودرو"} — خرید و قیمت`;
    const description = `مشاهده مشخصات و قیمت ${part.name || "قطعه خودرو"}، تضمین اصالت و ارسال سریع از کارتیوو.`;
    return {
      title,
      description,
      alternates: { canonical: ROUTES.partDetail(brandSlug) },
      openGraph: {
        title: `${title} | ${siteConfig.name}`,
        description,
        url: ROUTES.partDetail(brandSlug),
        type: "website",
      },
      twitter: { card: "summary_large_image", title, description },
      robots: { index: true, follow: true },
    };
  }
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
  brandName,
}: {
  car: CarFrontofficeDetailResponse;
  brandSlug: string;
  brandName: string;
}) {
  const primaryImage = car.imageUrls?.[0];
  const carName = [brandName, car.model, car.trimLevel].filter(Boolean).join(" ");

  return (
    <Link
      href={ROUTES.partsCar(brandSlug, String(car.id))}
      className="group/car overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 outline-none transition duration-300 hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow-[0_18px_40px_rgb(15_23_42/0.08)] focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${carName} — مشاهده قطعات سازگار`}
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#fff_0%,#f1f5f9_75%)] p-4 sm:p-5">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={carName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-4 transition-transform duration-500 group-hover/car:scale-105 sm:p-5"
            loading="lazy"
          />
        ) : (
          <CarFront className="size-14 text-slate-200 transition-colors group-hover/car:text-cyan-600/30" />
        )}
        <span className="absolute right-3 top-3 rounded-lg border border-white/80 bg-white/80 px-2 py-1 text-[9px] font-bold text-slate-500 shadow-sm backdrop-blur-sm">
          {brandName}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3.5">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-extrabold text-slate-800">{car.model || "مدل خودرو"}</h3>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">{car.trimLevel || "مشاهده قطعات سازگار"}</p>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover/car:bg-[#14305A] group-hover/car:text-white">
          <ChevronLeft className="size-4" />
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
  if (isPartId(brandSlug)) {
    const part = await getPartById(brandSlug);
    if (!part) notFound();
    return <ProductDetail part={part} />;
  }
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

      <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <nav aria-label="مسیر ناوبری" className="mb-6 text-xs text-slate-400">
            <ol className="flex items-center gap-2">
              <li>
                <Link href={ROUTES.home} className="transition-colors hover:text-[#14305A]">
                  خانه
                </Link>
              </li>
              <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
              <li>
                <Link href={ROUTES.brands} className="transition-colors hover:text-[#14305A]">
                  برندهای خودرو
                </Link>
              </li>
              <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
              <li aria-current="page" className="font-bold text-slate-600">
                {brand.persianName}
              </li>
            </ol>
          </nav>

          <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
            <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-36 left-1/3 size-80 rounded-full bg-blue-400/10 blur-3xl" />

            <div className="grid min-h-[400px] lg:grid-cols-[1.08fr_.92fr]">
              <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100 backdrop-blur-sm">
                    <BadgeCheck className="size-4" />
                    انتخاب دقیق بر اساس خودرو
                  </div>
                  <h1 className="mt-6 text-3xl font-black leading-[1.35] text-white sm:text-4xl lg:text-5xl">
                    قطعات یدکی
                    <span className="block text-cyan-300">{brand.persianName}</span>
                  </h1>
                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                    مدل خودروی {brand.persianName} خود را انتخاب کنید تا قطعات سازگار را بدون جست‌وجوی اضافه و با اطمینان بیشتری پیدا کنید.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {cars.length > 0 && (
                      <a href="#brand-cars" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#14305A] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-cyan-50">
                        <CarFront className="size-4" />
                        انتخاب مدل خودرو
                        <ArrowDownLeft className="size-4" />
                      </a>
                    )}
                    <a href="#brand-parts" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15">
                      <Search className="size-4" />
                      مشاهده قطعات
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative hidden min-h-[400px] items-center justify-center overflow-hidden border-r border-white/10 lg:flex">
                <div className="absolute size-[340px] rounded-full border border-white/10" />
                <div className="absolute size-[270px] rounded-full border border-dashed border-cyan-200/15" />
                <div className="absolute size-[210px] rounded-full bg-cyan-300/10 blur-2xl" />
                <div className="relative flex size-52 items-center justify-center rounded-[2.5rem] border border-white/20 bg-white p-8 shadow-2xl shadow-black/25">
                  {brand.iconUrl ? (
                    <Image
                      src={brand.iconUrl}
                      alt={`لوگوی ${brand.persianName}`}
                      width={150}
                      height={150}
                      className="h-full w-full object-contain"
                      priority
                    />
                  ) : (
                    <span dir="ltr" className="text-4xl font-black text-[#14305A]">
                      {brand.englishName?.slice(0, 3)}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-9 right-10 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-bold text-white/75 shadow-xl backdrop-blur-md">
                  <CarFront className="size-4 text-cyan-300" />
                  {cars.length.toLocaleString("fa-IR")} مدل خودرو
                </div>
              </div>
            </div>
          </section>
        </div>

      {/* Cars Section */}
      <section id="brand-cars" className="scroll-mt-24 py-10 sm:py-12">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_16px_50px_rgb(15_23_42/0.045)] sm:p-7 lg:p-9">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold text-cyan-700">انتخاب خودرو</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                  مدل‌های {brand.persianName}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  مدل دقیق خودروی خود را انتخاب کنید تا فقط قطعات سازگار نمایش داده شوند.
                </p>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-500">
                <CarFront className="size-4 text-cyan-700" />
                {cars.length.toLocaleString("fa-IR")} مدل موجود
              </div>
            </div>

            {cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-50">
                  <CarFront className="size-7 text-slate-300" />
                </div>
                <p className="mt-4 text-sm font-bold text-slate-500">خودرویی برای این برند یافت نشد</p>
                <p className="mt-1 text-xs text-slate-400">می‌توانید قطعات برند را از بخش بعدی جست‌وجو کنید.</p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {cars.map((car) => (
                  <CarItem
                    key={car.id}
                    car={car}
                    brandSlug={brandSlug}
                    brandName={brand.persianName ?? ""}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="brand-parts" className="scroll-mt-24 border-t border-slate-200/70 py-10 sm:py-12">
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
            />
          </Suspense>
        </div>
      </section>
      </main>
    </>
  );
}
