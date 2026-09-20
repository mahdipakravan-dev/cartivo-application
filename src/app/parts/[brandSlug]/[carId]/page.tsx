import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowDownLeft, BadgeCheck, CarFront, ChevronLeft, Package, Search, Wrench } from "lucide-react";
import { getBrandBySlug, getCarByIdOrSlug } from "@/lib/api/brands";
import { getBrandTopLevelParts } from "@/lib/api/parts";
import { getVehicleCategories } from "@/lib/api/categories";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { JsonLd } from "@/lib/seo/json-ld";
import { ProductCard } from "@/components/product-card";

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
    getCarByIdOrSlug(carId, brandSlug),
  ]);

  if (!brand || !car) return { title: "خودرو یافت نشد" };

  return {
    title: `قطعات یدکی ${car.displayName || `${car.brand} ${car.model}`} | ${siteConfig.name}`,
    description: `خرید قطعات یدکی ${car.displayName || `${car.brand} ${car.model}`} با مقایسه قیمت فروشندگان.`,
    alternates: { canonical: ROUTES.partsCar(brandSlug, carId) },
    openGraph: {
      title: `قطعات یدکی ${car.displayName || `${car.brand} ${car.model}`} | ${siteConfig.name}`,
      description: `لیست قطعات یدکی ${car.displayName || `${car.brand} ${car.model}`} در کارتیوو.`,
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

  const [brand, car] = await Promise.all([
    getBrandBySlug(brandSlug),
    getCarByIdOrSlug(carId, brandSlug),
  ]);

  if (!brand || !car) notFound();

  const primaryImage = car.imageUrls?.[0];
  const carName = car.displayName || [brand.persianName, car.model, car.trimLevel, car.year].filter(Boolean).join(" ");
  const topLevelParts = brand.id == null ? [] : await getBrandTopLevelParts(brand.id);
  const rawPartId = Array.isArray(sp.partId) ? sp.partId[0] : sp.partId;
  const requestedPartId = rawPartId ? Number(rawPartId) : null;
  const selectedPart = topLevelParts.find((part) => part.id === requestedPartId) ?? topLevelParts[0];
  const categories = brand.id != null && car.id != null && selectedPart?.id != null
    ? await getVehicleCategories({ carId: car.id, brandId: brand.id, partId: selectedPart.id })
    : [];
  const compatiblePartCount = new Set(
    categories.flatMap((category) => category.parts.map((part) => part.id).filter((id): id is number => id != null)),
  ).size;

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
                <Link href={ROUTES.brandDetail(brandSlug)} className="transition-colors hover:text-[#14305A]">
                  {brand.persianName}
                </Link>
              </li>
              {car.modelId != null && (
                <>
                  <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
                  <li>
                    <Link href={ROUTES.partsModel(brandSlug, car.modelId)} className="transition-colors hover:text-[#14305A]">
                      {car.baseModelName || car.model}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
              <li aria-current="page" className="truncate font-bold text-slate-600">
                {car.displayName || car.model}
              </li>
            </ol>
          </nav>

          <section className="relative isolate overflow-hidden rounded-[2rem] bg-primary shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
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
                    {car.year != null && (
                      <span className="rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/65">
                        سال {car.year.toLocaleString("fa-IR", { useGrouping: false })}
                      </span>
                    )}
                    {car.bodyType && (
                      <span className="rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/65">
                        {BODY_TYPE_LABELS[car.bodyType] ?? car.bodyType}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/65">
                      <Package className="size-3.5 text-cyan-300" />
                      {compatiblePartCount.toLocaleString("fa-IR")} قطعه
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
                    <Link href={car.modelId != null ? ROUTES.partsModel(brandSlug, car.modelId) : ROUTES.brandDetail(brandSlug)} className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/15">
                      {car.modelId != null ? "همه قطعات این مدل" : "مدل‌های دیگر"}
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
              <p className="text-xs font-bold text-cyan-700">انتخاب گروه قطعه</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">قطعات سازگار با {car.displayName || `${brand.persianName} ${car.model}`}</h2>
            </div>
            <p className="text-sm text-slate-400">نتایج برای همین مدل و سال تولید نمایش داده می‌شوند.</p>
          </div>

          {topLevelParts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">گروه قطعه‌ای برای این برند یافت نشد.</div>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {topLevelParts.map((part) => (
                  <Link
                    key={part.id}
                    href={`${ROUTES.partsCar(brandSlug, carId)}?partId=${part.id}#compatible-parts`}
                    scroll={false}
                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${part.id === selectedPart?.id ? "border-primary bg-primary text-primary-foreground" : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200"}`}
                  >
                    {part.name || "گروه قطعه"}
                  </Link>
                ))}
              </div>

              {categories.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                  <Package className="mx-auto size-10 text-slate-200" />
                  <p className="mt-3 text-sm font-bold text-slate-500">قطعه سازگاری در این گروه ثبت نشده است</p>
                </div>
              ) : (
                <div className="mt-7 space-y-9">
                  {categories.map((category, index) => (
                    <section key={category.id ?? index}>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-cyan-700">{selectedPart?.name}</p>
                          <h3 className="mt-1 text-xl font-black text-slate-800">{category.persianName || category.name || "دسته‌بندی قطعات"}</h3>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">{category.parts.length.toLocaleString("fa-IR")} محصول</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {category.parts.map((part) => <ProductCard key={part.id} part={part} variant="vertical" />)}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      </main>
    </>
  );
}
