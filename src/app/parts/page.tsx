import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowDownLeft, CarFront, ChevronLeft, Factory, PackageSearch, Search } from "lucide-react";
import { searchParts } from "@/lib/api/parts";
import { parseSearchParams } from "@/lib/search-params";
import { ROUTES } from "@/lib/routes";
import { siteConfig } from "@/lib/config/site";
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
  const filters = parseSearchParams(await searchParams);
  const results = await searchParts(filters);

  return (
    <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav aria-label="مسیر ناوبری" className="mb-6 text-xs text-slate-400">
          <ol className="flex items-center gap-1.5">
            <li><Link href={ROUTES.home} className="hover:text-[#14305A]">خانه</Link></li>
            <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
            <li className="font-bold text-slate-600" aria-current="page">قطعات یدکی</li>
          </ol>
        </nav>

        <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
          <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 left-1/3 size-80 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="grid min-h-[350px] lg:grid-cols-[1.1fr_.9fr]">
            <div className="relative z-10 flex items-center px-6 py-11 sm:px-10 lg:px-14 lg:py-14">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100">
                  <PackageSearch className="size-4" /> بازار قطعات یدکی کارتیوو
                </div>
                <h1 className="mt-5 text-3xl font-black leading-[1.35] text-white sm:text-4xl lg:text-5xl">
                  قطعه‌ی مناسب خودرو را
                  <span className="block text-cyan-300">سریع و دقیق پیدا کنید</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
                  میان قطعات موجود جست‌وجو کنید و نتایج را بر اساس موقعیت، قیمت و سازگاری محدود کنید.
                </p>
                <a href="#parts-directory" className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#14305A] transition hover:-translate-y-0.5 hover:bg-cyan-50">
                  <Search className="size-4" /> جست‌وجوی قطعات <ArrowDownLeft className="size-4" />
                </a>
              </div>
            </div>

            <div className="relative hidden items-center justify-center border-r border-white/10 lg:flex">
              <div className="absolute size-72 rounded-full border border-white/10" />
              <div className="absolute size-56 rounded-full border border-dashed border-cyan-200/20" />
              <PackageSearch className="size-32 text-cyan-200/20" strokeWidth={1} />
              <Link href={ROUTES.brands} className="absolute right-10 top-10 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-bold text-white/75 backdrop-blur-md hover:bg-white/15">
                <CarFront className="size-4 text-cyan-300" /> برند خودرو
              </Link>
              <Link href={ROUTES.partBrands} className="absolute bottom-10 left-10 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-bold text-white/75 backdrop-blur-md hover:bg-white/15">
                <Factory className="size-4 text-cyan-300" /> برند قطعه
              </Link>
            </div>
          </div>
        </section>

        <section id="parts-directory" className="scroll-mt-24 pt-10 sm:pt-12">
          <div className="mb-7 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold text-cyan-700">فهرست محصولات</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">همه قطعات یدکی</h2>
            </div>
            <p className="text-sm text-slate-400">{results.totalElements.toLocaleString("fa-IR")} قطعه یافت شد</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-[0_16px_50px_rgb(15_23_42/0.045)] sm:p-6 lg:p-8">
            <Suspense fallback={<div className="py-16 text-center text-sm text-slate-400">در حال بارگذاری...</div>}>
              <SearchResults initialParams={filters} cars={[]} results={results} brandSlug="" />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
