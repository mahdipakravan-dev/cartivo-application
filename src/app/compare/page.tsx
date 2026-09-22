import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Package, Scale, Search, ShoppingBag } from "lucide-react";
import { CompareSelector } from "@/components/product/compare-selector";
import { Button } from "@/components/ui/button";
import { getPartById } from "@/lib/api/parts";
import type { PartFrontofficeResponse } from "@/lib/api/types";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "مقایسه قطعات خودرو",
  description:
    "دو قطعه خودرو را کنار هم مقایسه کنید تا انتخاب دقیق‌تری داشته باشید.",
  alternates: { canonical: ROUTES.compare },
};

const POSITION_LABEL: Record<string, string> = {
  INTERIOR: "داخلی",
  EXTERIOR: "بیرونی",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const baseId = firstValue(params.base);
  const targetId = firstValue(params.target);

  const [basePart, targetPart] = await Promise.all([
    baseId ? getPartById(baseId) : Promise.resolve(null),
    targetId ? getPartById(targetId) : Promise.resolve(null),
  ]);

  return (
    <main className="bg-[var(--background)] pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="مسیر ناوبری"
          className="mb-6 overflow-hidden text-xs text-text-secondary"
        >
          <ol className="flex items-center gap-1.5 whitespace-nowrap">
            <li>
              <Link href={ROUTES.home} className="hover:text-[var(--primary)]">
                خانه
              </Link>
            </li>
            <li>
              <ChevronLeft className="size-3" />
            </li>
            <li>
              <Link href={ROUTES.parts} className="hover:text-[var(--primary)]">
                قطعات
              </Link>
            </li>
            <li>
              <ChevronLeft className="size-3" />
            </li>
            <li className="font-bold text-text-muted">مقایسه قطعات</li>
          </ol>
        </nav>

        <section className="overflow-hidden rounded-[2rem] bg-primary px-6 py-8 text-white shadow-[0_24px_70px_rgb(15_23_42/0.12)] sm:px-8 sm:py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-accent">
            <Scale className="size-4" />
            ابزار مقایسه
          </div>
          <h1 className="mt-5 text-3xl font-black leading-[1.4] sm:text-4xl">
            دو قطعه را کنار هم مقایسه کنید
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65 sm:text-base">
            قیمت، برند، سازگاری با خودرو و جزئیات هر قطعه را یک‌جا ببینید تا
            انتخاب سریع‌تر و دقیق‌تری داشته باشید.
          </p>
        </section>

        {!basePart ? (
          <section className="mt-8 rounded-[1.75rem] border border-dashed border-border bg-white px-6 py-14 text-center shadow-[0_16px_50px_rgb(15_23_42/0.045)] sm:px-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-background text-text-secondary">
              <Search className="size-7" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-dark">
              محصول پایه انتخاب نشده است
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              ابتدا وارد صفحه یک محصول شوید و روی گزینه مقایسه کلیک کنید تا همان
              محصول به‌عنوان مبنا در این صفحه قرار بگیرد.
            </p>
            <Button
              render={<Link href={ROUTES.parts} />}
              className="mt-6 h-12 rounded-xl px-5"
            >
              مشاهده قطعات
            </Button>
          </section>
        ) : (
          <>
            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_420px]">
              <section className="grid gap-6 lg:grid-cols-2">
                <CompareProductCard
                  part={basePart}
                  tone="primary"
                  title="محصول اول"
                />
                {targetPart ? (
                  <CompareProductCard
                    part={targetPart}
                    tone="secondary"
                    title="محصول دوم"
                  />
                ) : (
                  <EmptyCompareCard />
                )}
              </section>
              <CompareSelector
                basePartId={basePart.id!}
                selectedTargetId={targetPart?.id}
              />
            </div>

            <section className="mt-8 rounded-[1.75rem]  bg-white p-5 shadow-[0_16px_50px_rgb(15_23_42/0.045)] sm:p-7">
              <div className="flex flex-col justify-between gap-3 border-b border-border pb-5 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold text-accent">جدول مقایسه</p>
                  <h2 className="mt-2 text-2xl font-black text-dark">
                    مقایسه ویژگی‌های کلیدی
                  </h2>
                </div>
                {!targetPart && (
                  <p className="text-sm text-text-secondary">
                    برای کامل شدن جدول، محصول دوم را از پنل سمت چپ انتخاب کنید.
                  </p>
                )}
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl ">
                <div className="grid grid-cols-[140px_1fr] border-b border-border bg-background text-xs font-bold text-text-secondary sm:grid-cols-[180px_1fr_1fr]">
                  <div className="px-4 py-4">ویژگی</div>
                  <div className="px-4 py-4 text-text-muted">
                    {basePart.name || "محصول اول"}
                  </div>
                  <div className="hidden px-4 py-4 text-text-muted sm:block">
                    {targetPart?.name || "در انتظار انتخاب محصول دوم"}
                  </div>
                </div>
                <CompareRow
                  label="قیمت"
                  first={formatPrice(basePart.price)}
                  second={formatPrice(targetPart?.price)}
                />
                <CompareRow
                  label="برند سازنده"
                  first={partBrand(basePart)}
                  second={partBrand(targetPart)}
                />
                <CompareRow
                  label="موقعیت قطعه"
                  first={partPosition(basePart)}
                  second={partPosition(targetPart)}
                />
                <CompareRow
                  label="وضعیت سفارش"
                  first={orderState(basePart)}
                  second={orderState(targetPart)}
                />
                <CompareRow
                  label="خودروهای سازگار"
                  first={compatibleCars(basePart)}
                  second={compatibleCars(targetPart)}
                />
                <CompareRow
                  label="شرح محصول"
                  first={partDescription(basePart)}
                  second={partDescription(targetPart)}
                  multiline
                />
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function CompareProductCard({
  part,
  tone,
  title,
}: {
  part: PartFrontofficeResponse;
  tone: "primary" | "secondary";
  title: string;
}) {
  const image = part.imageUrls?.find(Boolean);

  return (
    <article
      className={`overflow-hidden rounded-[1.75rem] border p-5 shadow-[0_16px_50px_rgb(15_23_42/0.045)] sm:p-6 ${
        tone === "primary"
          ? "border-[var(--primary)]/10 bg-white"
          : "border-accent bg-accent/10"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-accent">{title}</p>
          <h2 className="mt-2 text-xl font-black text-dark">
            {part.name || "قطعه خودرو"}
          </h2>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-text-secondary shadow-sm">
          کد {part.id?.toLocaleString("fa-IR") || "—"}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-[1.5rem] bg-background p-4">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={part.name || "تصویر محصول"}
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <Package className="size-10 text-text-secondary" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--primary)]">
            {formatPrice(part.price)}
          </p>
          <p className="mt-2 text-xs leading-6 text-text-secondary">
            {partBrand(part)}
          </p>
          <p className="mt-1 text-xs leading-6 text-text-secondary">
            {partPosition(part)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Link
          href={ROUTES.partDetail(String(part.id))}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white"
        >
          مشاهده محصول
          <ChevronLeft className="size-4" />
        </Link>
        {part.price != null ? (
          <div className="inline-flex h-11 items-center justify-center gap-2 rounded-xl  bg-white px-4 text-sm font-bold text-text-muted">
            <ShoppingBag className="size-4 text-accent" />
            قابل سفارش
          </div>
        ) : (
          <div className="inline-flex h-11 items-center justify-center rounded-xl  bg-white px-4 text-sm font-bold text-text-secondary">
            نیاز به استعلام
          </div>
        )}
      </div>
    </article>
  );
}

function EmptyCompareCard() {
  return (
    <article className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-border bg-white p-6 text-center shadow-[0_16px_50px_rgb(15_23_42/0.045)]">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-background text-text-secondary">
        <Scale className="size-7" />
      </div>
      <h2 className="mt-5 text-xl font-black text-dark">
        محصول دوم را انتخاب کنید
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-7 text-text-secondary">
        از پنل انتخاب سمت چپ استفاده کنید تا این بخش با اطلاعات محصول دوم کامل
        شود.
      </p>
    </article>
  );
}

function CompareRow({
  label,
  first,
  second,
  multiline = false,
}: {
  label: string;
  first: string;
  second: string;
  multiline?: boolean;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] border-b border-border last:border-b-0 sm:grid-cols-[180px_1fr_1fr]">
      <div className="bg-background px-4 py-4 text-xs font-bold text-text-secondary">
        {label}
      </div>
      <div
        className={`px-4 py-4 text-sm font-medium text-text-muted ${multiline ? "leading-7" : ""}`}
      >
        {first}
      </div>
      <div
        className={`hidden px-4 py-4 text-sm font-medium text-text-muted sm:block ${multiline ? "leading-7" : ""}`}
      >
        {second}
      </div>
    </div>
  );
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatPrice(price?: number) {
  return price != null
    ? `${price.toLocaleString("fa-IR")} ریال`
    : "تماس بگیرید";
}

function partBrand(part?: PartFrontofficeResponse | null) {
  return (
    part?.partBrand?.persianName || part?.partBrand?.englishName || "نامشخص"
  );
}

function partPosition(part?: PartFrontofficeResponse | null) {
  if (!part?.position) return "نامشخص";
  return POSITION_LABEL[part.position] || part.position;
}

function orderState(part?: PartFrontofficeResponse | null) {
  if (!part) return "هنوز انتخاب نشده";
  if (part.leaf === false) return "دسته‌بندی";
  return part.price != null ? "قابل سفارش" : "نیاز به استعلام";
}

function compatibleCars(part?: PartFrontofficeResponse | null) {
  if (!part) return "هنوز انتخاب نشده";
  const fitments = part.fitments?.filter(Boolean) ?? [];
  if (fitments.length === 0) return "ثبت نشده";
  return fitments
    .map((fitment) =>
      [fitment.generationName, fitment.variantName].filter(Boolean).join(" — "),
    )
    .join("، ");
}

function partDescription(part?: PartFrontofficeResponse | null) {
  if (!part) return "هنوز انتخاب نشده";
  return part.description || "توضیحی برای این محصول ثبت نشده است.";
}
