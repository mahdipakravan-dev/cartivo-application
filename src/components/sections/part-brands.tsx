import Image from "next/image";
import Link from "next/link";
import { Factory } from "lucide-react";
import { getPartBrands } from "@/lib/api/content";
import type { PartBrandFrontofficeResponse } from "@/lib/api/types";
import { ROUTES } from "@/lib/routes";
import { SectionHeader } from "@/components/ui/section-header";

function PartBrandItem({ brand }: { brand: PartBrandFrontofficeResponse }) {
  const name = brand.persianName || brand.englishName || "برند قطعه";
  const href = brand.slug ? ROUTES.partBrandDetail(brand.slug) : ROUTES.partBrands;

  return (
    <Link href={href} className="group flex w-28 shrink-0 flex-col items-center text-center outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <div className="relative flex size-24 items-center justify-center rounded-full border border-slate-100 bg-white p-4 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-cyan-200 group-hover:shadow-[0_14px_35px_rgb(15_48_90/0.1)]">
        {brand.iconUrl ? (
          <Image src={brand.iconUrl} alt={`لوگوی ${name}`} fill sizes="96px" className="object-contain p-5 transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <Factory className="size-8 text-slate-300 transition-colors group-hover:text-cyan-700" />
        )}
      </div>
      <h3 className="mt-3 w-full truncate text-xs font-bold text-slate-600 transition-colors group-hover:text-[#14305A]">{name}</h3>
      {brand.partCount != null && (
        <p className="mt-1 text-[10px] text-slate-400">{brand.partCount.toLocaleString("fa-IR")} قطعه</p>
      )}
    </Link>
  );
}

export async function PartBrandsSection() {
  const brands = await getPartBrands();
  if (brands.length === 0) return null;

  return (
    <section className="bg-[#f8fafc] py-14 sm:py-16" aria-label="برندهای تولیدکننده قطعه">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <SectionHeader title="برندهای تولیدکننده قطعه" href={ROUTES.partBrands} linkText="مشاهده برندهای تولید کننده قطعه" />
        <div className="mt-8 flex flex-nowrap gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {brands.map((brand, index) => <PartBrandItem key={brand.id ?? index} brand={brand} />)}
        </div>
      </div>
    </section>
  );
}
