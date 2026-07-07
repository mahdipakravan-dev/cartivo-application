import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getAllBrands } from "@/lib/api/brands";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { JsonLd } from "@/lib/seo/json-ld";
import { BrandGrid } from "./_components/brand-grid";
import { SlaBadges } from "./_components/sla-badges";

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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" /> */}
        {/* <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]" /> */}

        <div className="relative mx-auto max-w-7xl  pt-20 pb-28 sm:px-6 mt-4">

          {/* Breadcrumb */}
          <nav aria-label="مسیر ناوبری" className="mb-8 text-sm text-white/40">
            <ol className="flex items-center gap-2">
              <li>
                <Link href={ROUTES.home} className="transition-colors hover:text-white/70">
                  خانه
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-white">
                برندهای خودرو
              </li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              +{brands.length.toLocaleString("fa-IR")} برند خودرو فعال
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              برندهای خودرو
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
              برند خودروی خود را انتخاب کنید تا قطعات یدکی سازگار، قیمت فروشندگان
              و جزئیات فنی را مشاهده کنید.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/15">
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-transparent to-emerald-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-center rounded-xl bg-white/5 backdrop-blur-sm">
                  <div className="flex-1 px-5 py-4">
                    <input
                      type="text"
                      placeholder="نام برند را جست‌وجو کنید..."
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                      dir="rtl"
                    />
                  </div>
                  <button
                    aria-label="جست‌وجو"
                    className="m-1.5 flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/20"
                  >
                    جست‌وجو
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        {/* <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FBFCFD] to-transparent" /> */}
      </section>

      {/* SLA Badges — overlapping hero */}
      {/* <section className="relative z-10 -mt-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SlaBadges />
        </div>
      </section> */}

      {/* Brands Grid */}
      <section className="py-4 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BrandGrid brands={brands} />
        </div>
      </section>
    </>
  );
}
