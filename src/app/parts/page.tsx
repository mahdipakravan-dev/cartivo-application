import type { Metadata } from "next";
import { Suspense } from "react";
import { getBrands, getAllBrands } from "@/lib/api/brands";
import { searchParts } from "@/lib/api/parts";
import { parseSearchParams } from "@/lib/search-params";
import { ROUTES } from "@/lib/routes";
import { siteConfig } from "@/lib/config/site";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchResults } from "@/components/sections/product-search/search-results";

export const metadata: Metadata = {
  title: `قطعات یدکی خودرو | ${siteConfig.name}`,
  description: `جست‌وجو و مقایسه قیمت قطعات یدکی خودرو از هزاران فروشنده معتبر در ${siteConfig.name}.`,
  alternates: { canonical: ROUTES.parts },
};

export default async function PartsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseSearchParams(sp);

  const [brandsResult, results] = await Promise.all([
    getBrands({ size: 200 }),
    searchParts(filters),
  ]);

  const brands = brandsResult.items;

  return (
    <section className="py-8 sm:py-12">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="قطعات یدکی خودرو"
          href={ROUTES.brands}
          linkText="مشاهده برندها"
        />
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
            brandSlug=""
          />
        </Suspense>
      </div>
    </section>
  );
}
