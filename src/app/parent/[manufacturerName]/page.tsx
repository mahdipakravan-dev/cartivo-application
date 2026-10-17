import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  BadgeCheck,
  ChevronLeft,
  CircleGauge,
  ImageOff,
  Layers3,
  PackageSearch,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { getCategoryById, getChildCategories } from "@/lib/api/categories";
import { getPartsByCategory } from "@/lib/api/parts";
import type { CategorySummaryResponse } from "@/lib/api/types";
import { ProductCard } from "@/components/product-card";
import { ROUTES } from "@/lib/routes";
import { getCategoryHref, getCategoryLabel } from "@/lib/catalog-navigation";
import { siteConfig } from "@/lib/config/site";

interface TopLevelCategoriesPageProps {
  params: Promise<{ manufacturerName: string }>;
  searchParams: Promise<{
    categoryId?: string | string[];
  }>;
}

export async function generateMetadata({
  searchParams,
}: TopLevelCategoriesPageProps): Promise<Metadata> {
  const categoryId = parseCategoryId((await searchParams).categoryId);
  const category = categoryId == null ? null : await getCategoryById(categoryId);
  const name = category ? getCategoryLabel(category) : null;
  const canonical = category ? getCategoryHref(category) : null;

  // شناسه‌ی نامعتبر یا دسته‌ی ناموجود صفحه‌ی خطا با کد ۲۰۰ می‌دهد؛
  // نباید ایندکس شود.
  if (!category || !name || !canonical) {
    return { title: "دسته‌بندی یافت نشد", robots: { index: false, follow: true } };
  }

  const title = `خرید قطعات ${name} خودرو — انواع و قیمت`;
  const description = `انواع قطعات ${name} خودرو را بر اساس زیرشاخه و خودروی خود پیدا کنید؛ مقایسه قیمت فروشندگان و خرید آنلاین از ${siteConfig.name}.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: canonical,
      type: "website",
      ...(category.imageUrl ? { images: [{ url: category.imageUrl }] } : {}),
    },
  };
}

export default async function TopLevelCategoriesPage({
  params,
  searchParams,
}: TopLevelCategoriesPageProps) {
  const [{ manufacturerName: encodedManufacturerName }, query] =
    await Promise.all([params, searchParams]);
  const manufacturerName = decodeRouteSegment(encodedManufacturerName);
  const categoryId = parseCategoryId(query.categoryId);

  if (categoryId === null) {
    return (
      <PageState
        icon={TriangleAlert}
        title="شناسه دسته‌بندی معتبر نیست"
        description="برای مشاهده دسته‌بندی‌های قطعات، دوباره از منوی اصلی یک مورد را انتخاب کنید."
      />
    );
  }

  const [category, result, partsResult] = await Promise.all([
    getCategoryById(categoryId),
    getChildCategories(categoryId),
    getPartsByCategory(categoryId, { size: 100 }),
  ]);
  const parts = partsResult.items;
  const displayName =
    category?.persianName?.trim() || category?.name?.trim() || manufacturerName;
  const isBrakeCategory =
    categoryId === 7 || displayName.replace(/\s/g, "").includes("ترمز");

  if (!category || result.status === "error") {
    return (
      <PageState
        icon={TriangleAlert}
        title="دریافت دسته‌بندی‌ها ممکن نشد"
        description="ارتباط با سرویس دسته‌بندی‌ها برقرار نشد. لطفاً کمی بعد دوباره تلاش کنید."
      />
    );
  }

  return (
    <div className="bg-[var(--background)] pb-20 pt-8 sm:pt-24">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="مسیر ناوبری"
          className="mb-5 text-xs text-text-muted sm:mb-7"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href={ROUTES.home}
                className="rounded-sm transition-colors hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                خانه
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronLeft className="size-3" />
            </li>
            <li aria-current="page" className="font-bold text-dark">
              {displayName}
            </li>
          </ol>
        </nav>

        <header className="relative isolate min-h-[34rem] overflow-hidden rounded-[2rem] bg-[#11161d] text-white shadow-[0_28px_80px_rgb(15_23_42/0.16)] sm:min-h-[31rem] lg:min-h-[34rem]">
          {isBrakeCategory ? (
            <Image
              src="/images/category-heroes/brake-system-hero.png"
              alt="دیسک و کالیپر سیستم ترمز خودرو"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 1600px"
              className="object-cover object-left"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_70%,rgb(246_107_27/0.25),transparent_38%),linear-gradient(135deg,#172433,#0b1118)]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_15_22/0.08)_0%,rgb(10_15_22/0.45)_44%,rgb(10_15_22/0.98)_100%)] sm:bg-[linear-gradient(90deg,rgb(10_15_22/0.02)_0%,rgb(10_15_22/0.25)_45%,rgb(10_15_22/0.98)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(10_15_22/0.86)_0%,transparent_48%)] sm:bg-none" />

          <div className="relative z-10 flex min-h-[34rem] max-w-3xl flex-col justify-between px-6 py-7 sm:min-h-[31rem] sm:px-10 sm:py-10 lg:min-h-[34rem] lg:px-14 lg:py-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md">
                <span className="size-2 rounded-full bg-accent shadow-[0_0_0_5px_rgb(246_107_27/0.12)]" />
                {result.items.length.toLocaleString("fa-IR")} دسته‌بندی تخصصی
              </span>
              <h1 className="mt-6 max-w-2xl text-3xl font-black leading-[1.5] text-balance sm:text-4xl lg:text-[3.25rem]">
                {isBrakeCategory
                  ? "مطمئن برانید؛ قطعه درست را پیدا کنید"
                  : `قطعه درست برای ${displayName}`}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-8 text-white/75 sm:text-base">
                از میان دسته‌های {displayName}، مستقیم به
                قطعه‌ای برسید که با خودروی شما سازگار است.
              </p>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link
                href="#categories"
                className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgb(246_107_27/0.25)] transition-colors hover:bg-[#dc5710] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#11161d]"
              >
                انتخاب دسته‌بندی
                <ArrowDown className="size-4" aria-hidden="true" />
              </Link>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck
                    className="size-4 text-accent-light"
                    aria-hidden="true"
                  />
                  خرید مطمئن
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck
                    className="size-4 text-accent-light"
                    aria-hidden="true"
                  />
                  بررسی سازگاری
                </span>
              </div>
            </div>
          </div>
        </header>

        <section
          id="categories"
          className="scroll-mt-28 pt-12 sm:pt-16"
          aria-labelledby="category-list-title"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black text-accent">
                یک مسیر کوتاه‌تر تا قطعه مناسب
              </p>
              <h2
                id="category-list-title"
                className="mt-2 text-2xl font-black text-dark sm:text-3xl"
              >
                دسته‌بندی‌های {displayName}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-text-muted">
              بخش موردنظر را انتخاب کنید تا نتایج دقیق‌تری ببینید.
            </p>
          </div>

          {result.items.length > 0 ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          id="all-parts"
          className="scroll-mt-28 pt-16 sm:pt-20"
          aria-labelledby="manufacturer-parts-title"
        >
          <div className="rounded-[1.75rem] border border-border/60 bg-white px-5 py-6 shadow-[0_8px_30px_rgb(15_23_42/0.04)] sm:px-7 sm:py-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black text-accent">آماده بررسی</p>
                <h2
                  id="manufacturer-parts-title"
                  className="mt-2 text-2xl font-black text-dark sm:text-3xl"
                >
                  همه قطعات {displayName}
                </h2>
                <p className="mt-2 text-sm leading-7 text-text-muted">
                  قیمت، برند و سازگاری هر قطعه را در یک نگاه مقایسه کنید.
                </p>
              </div>
              <div className="flex min-w-36 items-center gap-3 rounded-2xl bg-background px-4 py-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white">
                  <CircleGauge className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-xl font-black text-dark">
                    {partsResult.totalElements.toLocaleString("fa-IR")}
                  </strong>
                  <span className="text-xs text-text-muted">قطعه موجود</span>
                </span>
              </div>
            </div>
          </div>

          {parts.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
    </div>
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
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#fff_0%,#f0f3f7_100%)]">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={label}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span className="flex size-20 items-center justify-center rounded-2xl border border-border/50 bg-white text-text-secondary shadow-sm">
            <ImageOff className="size-8" strokeWidth={1.4} />
          </span>
        )}
        <span className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-xl border border-white/80 bg-white/85 text-primary shadow-sm backdrop-blur-sm transition-colors group-hover:bg-primary group-hover:text-white">
          <ArrowLeft className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="border-t border-border/50 p-5">
        <h3 className="text-base font-black text-dark transition-colors group-hover:text-primary">
          {label}
        </h3>
        {category.name && category.name !== label && (
          <p className="mt-1.5 text-xs text-text-muted" dir="ltr">
            {category.name}
          </p>
        )}
      </div>
    </>
  );

  return category.id != null ? (
    <Link
      href={ROUTES.parentCategory(manufacturerName, category.id)}
      className="group overflow-hidden rounded-[1.5rem] border border-border/50 bg-white shadow-[0_8px_28px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_18px_45px_rgb(15_48_90/0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
    >
      {content}
    </Link>
  ) : (
    <article className="group overflow-hidden rounded-[1.5rem] border border-border/50 bg-white shadow-sm">
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

function parseCategoryId(value: string | string[] | undefined): number | null {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  const categoryId = Number(value);
  return Number.isSafeInteger(categoryId) && categoryId > 0 ? categoryId : null;
}

function decodeRouteSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
