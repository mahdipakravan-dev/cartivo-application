import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownLeft, BadgeCheck, CarFront, ChevronLeft, Search } from "lucide-react";
import { getAllBrands } from "@/lib/api/brands";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { JsonLd } from "@/lib/seo/json-ld";
import { BrandGrid } from "./_components/brand-grid";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "برندهای خودرو — لیست کامل برندها و قطعات یدکی",
  description:
    "لیست کامل برندهای خودرو در کارتیوو؛ سایپا، ایران‌خودرو، کیا، هیوندای و… . برند خودروی خود را انتخاب کنید و قطعات یدکی سازگار با مدل و سال ساخت را با مقایسه قیمت فروشندگان بخرید.",
  alternates: { canonical: ROUTES.brands },
  openGraph: {
    title: `برندهای خودرو | ${siteConfig.name}`,
    description:
      "انتخاب برند خودرو برای مشاهده‌ی قطعات یدکی سازگار — با مقایسه قیمت چند فروشنده.",
    url: ROUTES.brands,
    type: "website",
  },
};

export default async function BrandsPage() {
  const brands = await getAllBrands();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "برندهای خودرو", item: `${siteConfig.url}/brands` },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "برندهای خودرو در کارتیوو",
    numberOfItems: brands.length,
    itemListElement: brands.map((brand, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Brand",
        name: brand.persianName,
        alternateName: brand.englishName,
        url: `${siteConfig.url}/brands/${brand.slug}`,
        ...(brand.iconUrl ? { logo: brand.iconUrl } : {}),
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <nav aria-label="مسیر ناوبری" className="mb-6 text-xs text-slate-400">
            <ol className="flex items-center gap-1.5">
              <li><Link href={ROUTES.home} className="transition-colors hover:text-[#14305A]">خانه</Link></li>
              <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
              <li><Link href={ROUTES.parts} className="transition-colors hover:text-[#14305A]">قطعات</Link></li>
              <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
              <li aria-current="page" className="font-bold text-slate-600">برندهای خودرو</li>
            </ol>
          </nav>

          <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
            <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="grid min-h-[390px] lg:grid-cols-[1.05fr_.95fr]">
              <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100 backdrop-blur-sm">
                    <BadgeCheck className="size-4" />
                    {brands.length.toLocaleString("fa-IR")} برند فعال و به‌روز
                  </div>
                  <h1 className="mt-6 text-3xl font-black leading-[1.35] text-white sm:text-4xl lg:text-5xl">
                    قطعه‌ی درست را از
                    <span className="block text-cyan-300">برند خودروی خودتان</span>
                    پیدا کنید
                  </h1>
                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                    برند خودرو را انتخاب کنید تا فقط قطعات سازگار با مدل‌های همان برند را ببینید؛ سریع‌تر، دقیق‌تر و بدون حدس‌زدن.
                  </p>
                  <a href="#brand-directory" className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#14305A] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-cyan-50">
                    <Search className="size-4" />
                    انتخاب برند خودرو
                    <ArrowDownLeft className="size-4" />
                  </a>
                </div>
              </div>

              <div className="relative hidden min-h-[390px] items-center justify-center border-r border-white/10 lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.08)_0,transparent_65%)]" />
                <div className="relative grid w-[360px] rotate-[-4deg] grid-cols-3 gap-3" aria-hidden="true">
                  {brands.slice(0, 9).map((brand, index) => (
                    <div key={brand.id ?? index} className={`flex aspect-square flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] p-3 text-center shadow-xl backdrop-blur-sm ${index === 4 ? "scale-110 border-cyan-300/30 bg-cyan-300/15" : ""}`}>
                      <CarFront className="mb-2 size-5 text-cyan-300/80" />
                      <span className="line-clamp-1 text-xs font-bold text-white/80">{brand.persianName}</span>
                      <span dir="ltr" className="mt-0.5 line-clamp-1 text-[9px] uppercase tracking-wider text-white/35">{brand.englishName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="brand-directory" className="scroll-mt-24 pt-10 sm:pt-12">
            <div className="mb-7">
              <p className="text-xs font-bold text-cyan-700">فهرست برندها</p>
              <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">خودروی شما ساخت کدام برند است؟</h2>
                <p className="text-sm text-slate-400">با جست‌وجو یا کشور سازنده، سریع‌تر انتخاب کنید.</p>
              </div>
            </div>
            <BrandGrid brands={brands} />
          </section>
        </div>
      </main>
    </>
  );
}
