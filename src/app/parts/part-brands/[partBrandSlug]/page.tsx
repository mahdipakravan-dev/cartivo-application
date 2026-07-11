import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowDownLeft, BadgeCheck, ChevronLeft, Factory, Package, Search } from "lucide-react";
import { SearchResults } from "@/components/sections/product-search/search-results";
import { getPartBrandBySlug } from "@/lib/api/content";
import { searchParts } from "@/lib/api/parts";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { parseSearchParams } from "@/lib/search-params";

export async function generateMetadata({ params }: { params: Promise<{ partBrandSlug: string }> }): Promise<Metadata> {
  const { partBrandSlug } = await params;
  const brand = await getPartBrandBySlug(partBrandSlug);
  if (!brand) return { title: "برند قطعه یافت نشد" };
  const name = brand.persianName || brand.englishName || "برند قطعه";
  return {
    title: `قطعات یدکی ${name}`,
    description: `مشاهده و خرید قطعات تولیدشده توسط برند ${name} در ${siteConfig.name}.`,
    alternates: { canonical: ROUTES.partBrandDetail(partBrandSlug) },
  };
}

export default async function PartBrandDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ partBrandSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { partBrandSlug } = await params;
  const brand = await getPartBrandBySlug(partBrandSlug);
  if (!brand?.id) notFound();
  const name = brand.persianName || brand.englishName || "برند قطعه";
  const filters = parseSearchParams(await searchParams);
  filters.partBrandIds = [brand.id];
  const results = await searchParts(filters);

  return (
    <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav aria-label="مسیر ناوبری" className="mb-6 overflow-hidden text-xs text-slate-400"><ol className="flex items-center gap-1.5 whitespace-nowrap"><li><Link href={ROUTES.home} className="hover:text-[#14305A]">خانه</Link></li><li><ChevronLeft className="size-3" /></li><li><Link href={ROUTES.partBrands} className="hover:text-[#14305A]">برندهای تولیدکننده</Link></li><li><ChevronLeft className="size-3" /></li><li className="truncate font-bold text-slate-600">{name}</li></ol></nav>

        <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
          <div className="absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="grid min-h-[400px] lg:grid-cols-[1.08fr_.92fr]">
            <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 lg:px-14">
              <div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100"><BadgeCheck className="size-4" />تولیدکننده قطعات یدکی</div><h1 className="mt-6 text-3xl font-black leading-[1.4] text-white sm:text-4xl lg:text-5xl">قطعات برند<span className="block text-cyan-300">{name}</span></h1>{brand.englishName && brand.englishName !== name && <p dir="ltr" className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-white/35">{brand.englishName}</p>}<p className="mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">محصولات موجود این تولیدکننده را بررسی کنید و با فیلترهای دقیق، قطعه مناسب را پیدا کنید.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#manufacturer-parts" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#14305A]"><Search className="size-4" /> مشاهده محصولات <ArrowDownLeft className="size-4" /></a><span className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 text-xs font-bold text-white/70"><Package className="size-4 text-cyan-300" />{results.totalElements.toLocaleString("fa-IR")} قطعه</span></div></div>
            </div>
            <div className="relative hidden items-center justify-center border-r border-white/10 lg:flex"><div className="absolute size-[330px] rounded-full border border-white/10" /><div className="absolute size-[250px] rounded-full border border-dashed border-cyan-200/15" /><div className="relative flex size-52 rotate-[-3deg] items-center justify-center rounded-[2.5rem] border border-white/20 bg-white p-8 shadow-2xl">{brand.iconUrl ? <Image src={brand.iconUrl} alt={`لوگوی ${name}`} fill sizes="208px" className="object-contain p-8" priority /> : <Factory className="size-20 text-[#14305A]" />}</div>{brand.countryCode && <span dir="ltr" className="absolute left-10 top-10 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-black tracking-widest text-white/70">{brand.countryCode}</span>}</div>
          </div>
        </section>
      </div>

      <section id="manufacturer-parts" className="scroll-mt-24 py-10 sm:py-12"><div className="container-cartivo px-4 sm:px-6 lg:px-8"><div className="mb-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-xs font-bold text-cyan-700">محصولات تولیدکننده</p><h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">قطعات {name}</h2></div><Link href={ROUTES.partBrands} className="text-sm font-bold text-cyan-700">انتخاب برند دیگر</Link></div><div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-[0_16px_50px_rgb(15_23_42/0.045)] sm:p-6 lg:p-8"><Suspense fallback={<div className="py-16 text-center text-sm text-slate-400">در حال بارگذاری...</div>}><SearchResults initialParams={filters} cars={[]} results={results} /></Suspense></div></div></section>
    </main>
  );
}
