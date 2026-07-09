import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug, getCarByIdOrSlug } from "@/lib/api/brands";
import { getPartById } from "@/lib/api/parts";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { JsonLd } from "@/lib/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingCart, Shield, Truck, CheckCircle } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string; carId: string; partId: string }>;
}): Promise<Metadata> {
  const { brandSlug, carId, partId } = await params;
  const [brand, car, part] = await Promise.all([
    getBrandBySlug(brandSlug),
    getCarByIdOrSlug(carId),
    getPartById(partId),
  ]);

  if (!brand || !car || !part) return { title: "قطعه یافت نشد" };

  return {
    title: `${part.name} — ${car.brand} ${car.model} | ${siteConfig.name}`,
    description: `خرید ${part.name} مناسب ${car.brand} ${car.model} با بهترین قیمت از فروشندگان معتبر.`,
    alternates: {
      canonical: ROUTES.partsPart(brandSlug, carId, partId),
    },
    openGraph: {
      title: `${part.name} — ${car.brand} ${car.model} | ${siteConfig.name}`,
      description: `خرید ${part.name} مناسب ${car.brand} ${car.model}.`,
      url: ROUTES.partsPart(brandSlug, carId, partId),
      type: "website",
    },
  };
}

export default async function PartsPartPage({
  params,
}: {
  params: Promise<{ brandSlug: string; carId: string; partId: string }>;
}) {
  const { brandSlug, carId, partId } = await params;

  const [brand, car, part] = await Promise.all([
    getBrandBySlug(brandSlug),
    getCarByIdOrSlug(carId),
    getPartById(Number(partId)),
  ]);

  if (!brand || !car || !part) notFound();

  const partJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: part.name,
    description: `${part.name} مناسب ${car.brand} ${car.model}`,
    brand: {
      "@type": "Brand",
      name: brand.persianName,
    },
    ...(part.price != null
      ? {
        offers: {
          "@type": "Offer",
          price: part.price,
          priceCurrency: "IRR",
          availability: "https://schema.org/InStock",
        },
      }
      : {}),
  };

  return (
    <>
      <JsonLd data={partJsonLd} />

      <section className="py-8 sm:py-12">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="مسیر ناوبری" className="mb-8 text-sm text-slate-400">
            <ol className="flex items-center gap-2">
              <li>
                <Link href={ROUTES.home} className="transition-colors hover:text-slate-600">
                  خانه
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ROUTES.parts} className="transition-colors hover:text-slate-600">
                  قطعات
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ROUTES.partsBrand(brandSlug)} className="transition-colors hover:text-slate-600">
                  {brand.persianName}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ROUTES.partsCar(brandSlug, carId)} className="transition-colors hover:text-slate-600">
                  {car.model}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-slate-700">
                {part.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 sm:p-8">
                  {/* Part Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/5">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        {part.name}
                      </h1>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                          {brand.persianName}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                          {car.brand} {car.model}
                        </span>
                        {car.trimLevel && (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            {car.trimLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Part Details */}
                  <div className="mt-8 border-t border-slate-100 pt-8">
                    <h2 className="text-lg font-bold text-slate-800">مشخصات قطعه</h2>
                    <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="text-xs font-medium text-slate-400">نام قطعه</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">{part.name}</dd>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="text-xs font-medium text-slate-400">شناسه</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">{part.id}</dd>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="text-xs font-medium text-slate-400">خودروی سازگار</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">
                          {car.brand} {car.model}
                          {car.trimLevel ? ` ${car.trimLevel}` : ""}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <dt className="text-xs font-medium text-slate-400">برند خودرو</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">{brand.persianName}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Compatible Car */}
                  <div className="mt-8 border-t border-slate-100 pt-8">
                    <h2 className="text-lg font-bold text-slate-800">خودروی سازگار</h2>
                    <Link
                      href={ROUTES.partsCar(brandSlug, carId)}
                      className="mt-4 block rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-200 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Package className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {car.brand} {car.model}
                          </p>
                          <p className="text-xs text-slate-400">
                            {car.trimLevel && `${car.trimLevel} • `}
                            مشاهده همه قطعات
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar — Price & Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Card>
                  <CardContent className="p-6">
                    {/* Price */}
                    <div className="text-center">
                      <p className="text-sm text-slate-400">قیمت</p>
                      {part.price != null ? (
                        <p className="mt-2 text-3xl font-extrabold text-primary">
                          {part.price.toLocaleString("fa-IR")}
                          <span className="mr-1 text-sm font-normal text-slate-400">ریال</span>
                        </p>
                      ) : (
                        <p className="mt-2 text-lg font-bold text-slate-400">قیمت تماس بگیرید</p>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      size="lg"
                      className="mt-6 w-full"
                      disabled={part.price == null}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      افزودن به سبد خرید
                    </Button>

                    {/* Features */}
                    <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>اصالت کالا تضمین شده</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span>گارانتی بازگشت ۷ روزه</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Truck className="h-4 w-4 text-orange-500" />
                        <span>ارسال سریع به سراسر کشور</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Car Info Card */}
                <Card>
                  <CardContent className="p-4">
                    <Link
                      href={ROUTES.partsCar(brandSlug, carId)}
                      className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-primary/5">
                        <Package className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-slate-600">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          مشاهده همه قطعات این خودرو
                        </p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
