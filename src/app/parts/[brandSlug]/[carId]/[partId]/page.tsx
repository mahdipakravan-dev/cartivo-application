import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug, getCarByIdOrSlug } from "@/lib/api/brands";
import { getPartById } from "@/lib/api/parts";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { JsonLd } from "@/lib/seo/json-ld";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Shield, Truck, CheckCircle } from "lucide-react";
import { SellerPurchasePanel } from "@/components/product/seller-purchase-panel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandSlug: string; carId: string; partId: string }>;
}): Promise<Metadata> {
  const { brandSlug, carId, partId } = await params;
  const [brand, car, part] = await Promise.all([
    getBrandBySlug(brandSlug),
    getCarByIdOrSlug(carId, brandSlug),
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
    getCarByIdOrSlug(carId, brandSlug),
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
          <nav
            aria-label="مسیر ناوبری"
            className="mb-8 text-sm text-text-secondary"
          >
            <ol className="flex items-center gap-2">
              <li>
                <Link
                  href={ROUTES.home}
                  className="transition-colors hover:text-text-muted"
                >
                  خانه
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={ROUTES.parts}
                  className="transition-colors hover:text-text-muted"
                >
                  قطعات
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={ROUTES.brandDetail(brandSlug)}
                  className="transition-colors hover:text-text-muted"
                >
                  {brand.persianName}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={ROUTES.partsCar(brandSlug, carId)}
                  className="transition-colors hover:text-text-muted"
                >
                  {car.model}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-text-muted">
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
                      <h1 className="text-2xl font-extrabold tracking-tight text-dark sm:text-3xl">
                        {part.name}
                      </h1>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full  bg-background px-3 py-1 text-xs font-medium text-text-muted">
                          {brand.persianName}
                        </span>
                        <span className="rounded-full  bg-background px-3 py-1 text-xs font-medium text-text-muted">
                          {car.brand} {car.model}
                        </span>
                        {car.trimLevel && (
                          <span className="rounded-full  bg-background px-3 py-1 text-xs font-medium text-text-muted">
                            {car.trimLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Part Details */}
                  <div className="mt-8 border-t border-border pt-8">
                    <h2 className="text-lg font-bold text-dark">مشخصات قطعه</h2>
                    <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-background p-4">
                        <dt className="text-xs font-medium text-text-secondary">
                          نام قطعه
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-dark">
                          {part.name}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-background p-4">
                        <dt className="text-xs font-medium text-text-secondary">
                          شناسه
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-dark">
                          {part.id}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-background p-4">
                        <dt className="text-xs font-medium text-text-secondary">
                          خودروی سازگار
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-dark">
                          {car.brand} {car.model}
                          {car.trimLevel ? ` ${car.trimLevel}` : ""}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-background p-4">
                        <dt className="text-xs font-medium text-text-secondary">
                          برند خودرو
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-dark">
                          {brand.persianName}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Compatible Car */}
                  <div className="mt-8 border-t border-border pt-8">
                    <h2 className="text-lg font-bold text-dark">
                      خودروی سازگار
                    </h2>
                    <Link
                      href={ROUTES.partsCar(brandSlug, carId)}
                      className="mt-4 block rounded-xl  bg-background p-4 transition-all hover:border-border hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Package className="h-6 w-6 text-text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-dark">
                            {car.brand} {car.model}
                          </p>
                          <p className="text-xs text-text-secondary">
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
                    <SellerPurchasePanel
                      partId={part.id!}
                      name={part.name || "قطعه خودرو"}
                    />

                    {/* Features */}
                    <div className="mt-6 space-y-3 border-t border-border pt-6">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>اصالت کالا تضمین شده</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Shield className="h-4 w-4 text-accent" />
                        <span>گارانتی بازگشت ۷ روزه</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Truck className="h-4 w-4 text-accent" />
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
                      className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-background"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-border/20 group-hover:bg-primary/5">
                        <Package className="h-5 w-5 text-text-secondary group-hover:text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-text-muted">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-[10px] text-text-secondary">
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
