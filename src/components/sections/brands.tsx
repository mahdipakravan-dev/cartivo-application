import { getTopBrands } from "@/lib/api/brands";
import { ROUTES } from "@/lib/routes";
import type { BrandFrontofficeResponse } from "@/lib/api/types";
import { SectionHeader } from "@/components/ui/section-header";

export async function BrandsSection() {
  const brands = await getTopBrands();
  const brandItems = brands as BrandFrontofficeResponse[]

  if (brandItems?.length === 0) return null;

  // More than 8 brands — use infinite marquee
  const { BrandMarquee } = await import("@/components/sections/brand-marquee");

  return (
    <section className="relative overflow-hidden py-12 sm:py-16" aria-label="برندهای خودرو">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <SectionHeader title="انتخاب برند" href={ROUTES.brands} linkText="مشاهده همه برند ها" />
        <div className="mt-8">
          <BrandMarquee brands={brandItems} />
        </div>
      </div>
    </section>
  );
}
