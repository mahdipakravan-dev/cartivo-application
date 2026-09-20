import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft, ImageOff, Layers3 } from "lucide-react";

import { SearchResults } from "@/components/sections/product-search/search-results";
import { getCategoryById } from "@/lib/api/categories";
import { searchParts } from "@/lib/api/parts";
import { ROUTES } from "@/lib/routes";
import { parseSearchParams } from "@/lib/search-params";

interface ManufacturerCategoryPageProps {
  params: Promise<{ manufacturerName: string; categoryId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: ManufacturerCategoryPageProps): Promise<Metadata> {
  const { manufacturerName: encodedManufacturerName, categoryId } = await params;
  const manufacturerName = decodeRouteSegment(encodedManufacturerName);
  const numericCategoryId = parseId(categoryId);
  const category = numericCategoryId == null ? null : await getCategoryById(numericCategoryId);
  const categoryName = category?.persianName || category?.name;

  if (!categoryName) return { title: "دسته‌بندی یافت نشد" };

  return {
    title: `${categoryName} — قطعات ${manufacturerName}`,
    description: `مشاهده و خرید قطعات دسته‌بندی ${categoryName} از ${manufacturerName} در کارتیوو`,
    alternates: { canonical: ROUTES.parentCategory(manufacturerName, numericCategoryId!) },
  };
}

export default async function ManufacturerCategoryPage({
  params,
  searchParams,
}: ManufacturerCategoryPageProps) {
  const [{ manufacturerName: encodedManufacturerName, categoryId }, rawSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const manufacturerName = decodeRouteSegment(encodedManufacturerName);
  const numericCategoryId = parseId(categoryId);
  if (numericCategoryId == null) notFound();

  const filters = parseSearchParams(rawSearchParams);
  const [category, results] = await Promise.all([
    getCategoryById(numericCategoryId),
    searchParts({ ...filters, categoryId: numericCategoryId }),
  ]);
  if (!category) notFound();

  const categoryName = category.persianName?.trim() || category.name?.trim() || "دسته‌بندی قطعات";

  return (
    <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav aria-label="مسیر ناوبری" className="mb-6 text-xs text-slate-400">
          <ol className="flex items-center gap-1.5">
            <li><Link href={ROUTES.home} className="hover:text-[#14305A]">خانه</Link></li>
            <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
            <li>{manufacturerName}</li>
            <li aria-hidden="true"><ChevronLeft className="size-3" /></li>
            <li aria-current="page" className="font-bold text-slate-600">{categoryName}</li>
          </ol>
        </nav>

        <header className="relative isolate overflow-hidden rounded-[2rem] bg-primary text-white shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
          <div className="absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="grid min-h-[330px] lg:grid-cols-[1fr_0.65fr]">
            <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 lg:px-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100">
                  <Layers3 className="size-4" /> دسته‌بندی قطعات
                </span>
                <h1 className="mt-6 text-3xl font-black leading-[1.45] sm:text-4xl lg:text-5xl">{categoryName}</h1>
                {category.name && category.name !== categoryName && (
                  <p dir="ltr" className="mt-2 w-fit text-sm text-white/45">{category.name}</p>
                )}
                <p className="mt-5 text-sm leading-8 text-white/60">
                  {results.totalElements.toLocaleString("fa-IR")} قطعه از {manufacturerName} در این دسته‌بندی پیدا شد.
                </p>
              </div>
            </div>

            <div className="relative hidden items-center justify-center border-r border-white/10 p-10 lg:flex">
              <div className="relative flex size-52 items-center justify-center overflow-hidden rounded-[2rem] border border-white/15 bg-white/10">
                {category.imageUrl ? (
                  <Image src={category.imageUrl} alt={categoryName} fill sizes="208px" className="object-contain p-8" priority />
                ) : (
                  <ImageOff className="size-20 text-white/25" strokeWidth={1.3} />
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="pt-10 sm:pt-12" aria-labelledby="category-parts-title">
          <div className="mb-7">
            <p className="text-xs font-bold text-cyan-700">محصولات دسته‌بندی</p>
            <h2 id="category-parts-title" className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              قطعات {categoryName}
            </h2>
          </div>
          <Suspense fallback={<div className="py-16 text-center text-sm text-slate-400">در حال بارگذاری...</div>}>
            <SearchResults initialParams={filters} cars={[]} results={results} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

function parseId(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function decodeRouteSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
