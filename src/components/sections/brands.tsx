import Link from "next/link";
import Image from "next/image";
import { getBrands, getTopBrands } from "@/lib/api/brands";
import { ROUTES } from "@/lib/routes";
import type { BrandFrontofficeResponse } from "@/lib/api/types";
import { SectionHeader } from "@/components/ui/section-header";

function BrandItem({ brand }: { brand: BrandFrontofficeResponse }) {
  return (
    <Link
      href={ROUTES.brandDetail(brand.slug ?? "")}
      className="group/brand flex shrink-0 flex-col items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${brand.persianName} — قطعات یدکی`}
    >
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm shadow-slate-100/50 transition-all duration-300 group-hover/brand:-translate-y-1 group-hover/brand:border-slate-200 group-hover/brand:shadow-lg group-hover/brand:shadow-slate-200/60">
        {brand.iconUrl ? (
          <Image
            src={brand.iconUrl}
            alt={`لوگوی ${brand.persianName}`}
            width={80}
            height={80}
            className="h-14 w-14 object-contain transition-transform duration-300 group-hover/brand:scale-110"
            loading="lazy"
          />
        ) : (
          <span className="text-lg font-bold text-slate-300 transition-colors group-hover/brand:text-slate-500">
            {brand.englishName?.slice(0, 3) ?? ""}
          </span>
        )}
      </div>

      <span className="max-w-[8rem] truncate text-center text-xs font-medium text-slate-500 transition-colors group-hover/brand:text-slate-800">
        {brand.persianName}
      </span>
    </Link>
  );
}

/** Static fallback for brands that fit in one row */
function StaticBrands({ brands }: { brands: BrandFrontofficeResponse[] }) {
  return (
    <div className="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide sm:flex-wrap sm:justify-start sm:gap-5">
        {brands.map((brand) => (
          <BrandItem key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}

export async function BrandsSection() {
  const brands = await getTopBrands();
  const brandItems = brands

  if (brandItems.length === 0) return null;

  console.log(brandItems)
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
