import type { Metadata } from "next";
import Link from "next/link";
import { getAllBrands } from "@/lib/api/brands";
import { siteConfig } from "@/lib/config/site";
import { JsonLd } from "@/lib/seo/json-ld";
import { BrandCard } from "./_components/brand-card";

/**
 * صفحه‌ی «برندهای خودرو» — نمونه‌ی مرجع (Reference Implementation)
 * برای همه‌ی صفحات لیستی سئومحور پروژه.
 *
 * استراتژی رندر: SSG خالص.
 * - `dynamic = "force-static"` تضمین می‌کند صفحه در build ساخته شود.
 * - fetch داخل getAllBrands با `force-cache` + تگ "brands" کش می‌شود؛
 *   پس از تغییر برندها در بک‌آفیس، بک‌اند می‌تواند webhook بزند و با
 *   `revalidateTag("brands")` صفحه بدون rebuild کامل به‌روز شود.
 */
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "برندهای خودرو — لیست کامل برندها و قطعات یدکی",
  description:
    "لیست کامل برندهای خودرو در کارتیوو؛ سایپا، ایران‌خودرو، کیا، هیوندای و… . برند خودروی خود را انتخاب کنید و قطعات یدکی سازگار با مدل و سال ساخت را با مقایسه قیمت فروشندگان بخرید.",
  alternates: {
    canonical: "/brands",
  },
  openGraph: {
    title: `برندهای خودرو | ${siteConfig.name}`,
    description:
      "انتخاب برند خودرو برای مشاهده‌ی قطعات یدکی سازگار — با مقایسه قیمت چند فروشنده.",
    url: "/brands",
    type: "website",
  },
};

export default async function BrandsPage() {
  const brands = await getAllBrands();

  /**
   * داده‌ی ساختاریافته:
   * 1) BreadcrumbList — مسیر ناوبری برای نمایش در نتایج گوگل
   * 2) ItemList از Brand — به گوگل می‌گوید این صفحه «لیست برندها» است
   */
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "برندهای خودرو",
        item: `${siteConfig.url}/brands`,
      },
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
        name: brand.name,
        alternateName: brand.nameEn,
        url: `${siteConfig.url}/brands/${brand.slug}`,
        ...(brand.logoUrl ? { logo: brand.logoUrl } : {}),
      },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb قابل مشاهده — هم برای کاربر، هم هم‌راستا با JSON-LD */}
        <nav aria-label="مسیر ناوبری" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                خانه
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-foreground">
              برندهای خودرو
            </li>
          </ol>
        </nav>

        {/* H1 یکتا با کلیدواژه‌ی اصلی صفحه */}
        <header className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            برندهای خودرو
          </h1>
          <p className="mt-3 leading-8 text-muted-foreground">
            برند خودروی خود را انتخاب کنید تا مدل‌ها و قطعات یدکی سازگار را
            ببینید. در کارتیوو قیمت هر قطعه را از چند فروشنده هم‌زمان مقایسه
            می‌کنید.
          </p>
        </header>

        {/* لیست معنایی: ul/li برای ساختار صحیح سند */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <li key={brand.id}>
              <BrandCard brand={brand} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
