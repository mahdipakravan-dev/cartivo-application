import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ImageOff,
  Layers3,
  PackageSearch,
  TriangleAlert,
} from "lucide-react";
import { getAllCategoriesByParent } from "@/lib/api/categories";
import { searchAllParts } from "@/lib/api/parts";
import type { CategorySummaryResponse } from "@/lib/api/types";
import { ProductCard } from "@/components/product-card";
import { ROUTES } from "@/lib/routes";

interface TopLevelCategoriesPageProps {
  params: Promise<{ manufacturerName: string }>;
  searchParams: Promise<{
    parentId?: string | string[];
  }>;
}

export async function generateMetadata({
  params,
}: TopLevelCategoriesPageProps): Promise<Metadata> {
  const { manufacturerName: encodedManufacturerName } = await params;
  const manufacturerName = decodeRouteSegment(encodedManufacturerName);
  return {
    title: `دسته‌بندی‌های ${manufacturerName}`,
    description: `مشاهده دسته‌بندی‌های قطعات ${manufacturerName} در کارتیوُ`,
  };
}

export default async function TopLevelCategoriesPage({
  params,
  searchParams,
}: TopLevelCategoriesPageProps) {
  const [{ manufacturerName: encodedManufacturerName }, query] =
    await Promise.all([params, searchParams]);
  const manufacturerName = decodeRouteSegment(encodedManufacturerName);
  const parentId = parseParentId(query.parentId);

  if (parentId === null) {
    return (
      <PageState
        icon={TriangleAlert}
        title="شناسه دسته‌بندی معتبر نیست"
        description="برای مشاهده دسته‌بندی‌های قطعات، دوباره از منوی اصلی یک مورد را انتخاب کنید."
      />
    );
  }

  const [result, parts] = await Promise.all([
    getAllCategoriesByParent(parentId),
    searchAllParts({ parentPartIds: [parentId] }),
  ]);

  if (result.status === "error") {
    return (
      <PageState
        icon={TriangleAlert}
        title="دریافت دسته‌بندی‌ها ممکن نشد"
        description="ارتباط با سرویس دسته‌بندی‌ها برقرار نشد. لطفاً کمی بعد دوباره تلاش کنید."
      />
    );
  }

  return (
    <main className="bg-[var(--background)] pb-20 pt-12 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="مسیر ناوبری"
          className="mb-6 text-xs text-text-secondary"
        >
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href={ROUTES.home} className="hover:text-[var(--primary)]">
                خانه
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronLeft className="size-3" />
            </li>
            <li aria-current="page" className="font-bold text-text-muted">
              {manufacturerName}
            </li>
          </ol>
        </nav>

        <header className="relative isolate overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-white shadow-[0_24px_70px_rgb(15_23_42/0.12)] sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute -right-24 -top-32 size-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 size-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-accent">
              <Layers3 className="size-4" />
              {result.items.length.toLocaleString("fa-IR")} دسته‌بندی
            </span>
            <h1 className="mt-6 text-3xl font-black leading-[1.45] sm:text-4xl lg:text-5xl">
              دسته‌بندی‌های {manufacturerName}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/60 sm:text-base">
              دسته‌بندی موردنظر را برای ادامه مسیر انتخاب قطعه پیدا کنید.
            </p>
          </div>
        </header>

        <section
          className="pt-10 sm:pt-12"
          aria-labelledby="category-list-title"
        >
          <h2
            id="category-list-title"
            className="text-2xl font-black text-dark sm:text-3xl"
          >
            همه دسته‌بندی‌ها
          </h2>

          {result.items.length > 0 ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {result.items.map((category, index) => (
                <CategoryCard
                  key={category.id ?? `${category.name}-${index}`}
                  category={category}
                  manufacturerName={manufacturerName}
                />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-[1.75rem] border border-dashed border-border bg-white px-6 py-16 text-center">
              <Layers3 className="mx-auto size-12 text-text-secondary" />
              <h3 className="mt-4 text-lg font-black text-text-muted">
                دسته‌بندی‌ای ثبت نشده است
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                برای این بخش هنوز دسته‌بندی فعالی وجود ندارد.
              </p>
            </div>
          )}
        </section>

        <section
          className="pt-14 sm:pt-16"
          aria-labelledby="manufacturer-parts-title"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold text-accent">
                قطعات {manufacturerName}
              </p>
              <h2
                id="manufacturer-parts-title"
                className="mt-2 text-2xl font-black text-dark sm:text-3xl"
              >
                همه قطعات
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                {parts.length.toLocaleString("fa-IR")} قطعه برای نمایش پیدا شد.
              </p>
            </div>
          </div>

          {parts.length > 0 ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {parts.map((part, index) => (
                <ProductCard
                  key={part.id ?? `${part.name}-${index}`}
                  part={part}
                />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-[1.75rem] border border-dashed border-border bg-white px-6 py-16 text-center">
              <PackageSearch className="mx-auto size-12 text-text-secondary" />
              <h3 className="mt-4 text-lg font-black text-text-muted">
                قطعه‌ای پیدا نشد
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                برای این تولیدکننده هنوز قطعه فعالی ثبت نشده است.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CategoryCard({
  category,
  manufacturerName,
}: {
  category: CategorySummaryResponse;
  manufacturerName: string;
}) {
  const label =
    category.persianName?.trim() ||
    category.name?.trim() ||
    "دسته‌بندی بدون نام";
  const content = (
    <>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-background">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={label}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImageOff className="size-14 text-text-secondary" strokeWidth={1.4} />
        )}
      </div>
      <div className="p-5">
        <h3 className="text-base font-black text-[var(--primary)]">{label}</h3>
        {category.name && category.name !== label && (
          <p className="mt-1 text-xs text-text-secondary" dir="ltr">
            {category.name}
          </p>
        )}
      </div>
    </>
  );

  return category.id != null ? (
    <Link
      href={ROUTES.parentCategory(manufacturerName, category.id)}
      className="group overflow-hidden rounded-[1.5rem]  bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgb(15_48_90/0.12)]"
    >
      {content}
    </Link>
  ) : (
    <article className="group overflow-hidden rounded-[1.5rem]  bg-white shadow-sm">
      {content}
    </article>
  );
}

function PageState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof TriangleAlert;
  title: string;
  description: string;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[var(--background)] px-4 py-24 text-center">
      <div className="max-w-lg rounded-[1.75rem]  bg-white px-8 py-12 shadow-sm">
        <Icon className="mx-auto size-12 text-amber-500" />
        <h1 className="mt-5 text-2xl font-black text-[var(--primary)]">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          {description}
        </p>
        <Link
          href={ROUTES.home}
          className="mt-7 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </main>
  );
}

function parseParentId(value: string | string[] | undefined): number | null {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  const parentId = Number(value);
  return Number.isSafeInteger(parentId) && parentId > 0 ? parentId : null;
}

function decodeRouteSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
