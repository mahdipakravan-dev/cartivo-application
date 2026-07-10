import Link from "next/link";
import { BadgeCheck, Check, ChevronLeft, Headphones, RotateCcw, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import type { PartFrontofficeResponse } from "@/lib/api/types";
import { ROUTES } from "@/lib/routes";
import { JsonLd } from "@/lib/seo/json-ld";
import { ProductGallery } from "./product-gallery";
import { Button } from "@/components/ui/button";

type RichPart = PartFrontofficeResponse & {
  description?: string;
  imageUrls?: string[];
  brandName?: string;
  manufacturer?: string;
  sku?: string;
  partNumber?: string;
};

export function ProductDetail({ part }: { part: RichPart }) {
  const name = part.name || "قطعه خودرو";
  const images = part.imageUrls?.filter(Boolean) || [];
  const brand = part.brandName || part.manufacturer;
  const productUrl = ROUTES.partDetail(String(part.id));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(part.description ? { description: part.description } : {}),
    ...(images.length ? { image: images } : {}),
    ...(part.sku || part.partNumber ? { sku: part.sku || part.partNumber } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(part.price != null ? { offers: { "@type": "Offer", url: productUrl, priceCurrency: "IRR", price: part.price, availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" } } : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <nav aria-label="مسیر ناوبری" className="mb-6 overflow-hidden text-xs text-slate-400">
            <ol className="flex items-center gap-1.5 whitespace-nowrap">
              <li><Link href={ROUTES.home} className="hover:text-[#14305A]">خانه</Link></li><li><ChevronLeft className="size-3" /></li>
              <li><Link href={ROUTES.parts} className="hover:text-[#14305A]">قطعات</Link></li><li><ChevronLeft className="size-3" /></li>
              <li className="truncate font-bold text-slate-600" aria-current="page">{name}</li>
            </ol>
          </nav>

          <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-4 shadow-[0_20px_60px_rgb(15_23_42/0.06)] sm:p-7 lg:p-9">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] lg:gap-12">
              <ProductGallery images={images} name={name} />
              <div className="flex flex-col py-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700"><BadgeCheck className="size-4" /> تضمین اصالت کالا</div>
                <h1 className="mt-4 text-2xl font-black leading-relaxed text-slate-900 sm:text-3xl">{name}</h1>
                {brand && <p className="mt-2 text-sm text-slate-500">برند: <span className="font-bold text-slate-700">{brand}</span></p>}
                <div className="my-6 h-px bg-slate-100" />

                <h2 className="text-sm font-extrabold text-slate-800">ویژگی‌های محصول</h2>
                <ul className="mt-3 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check className="size-4 text-emerald-500" /> مناسب استفاده در خودرو</li>
                  <li className="flex items-center gap-2"><Check className="size-4 text-emerald-500" /> کنترل کیفیت و سلامت فیزیکی</li>
                  {part.partNumber && <li className="flex items-center gap-2"><Check className="size-4 text-emerald-500" /> شماره فنی: <span dir="ltr">{part.partNumber}</span></li>}
                </ul>

                <div className="mt-auto pt-8">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-sm text-slate-500">قیمت محصول</span>
                      {part.price != null ? <p className="text-2xl font-black text-[#14305A]">{part.price.toLocaleString("fa-IR")} <span className="text-xs font-medium text-slate-400">ریال</span></p> : <p className="font-bold text-slate-600">تماس بگیرید</p>}
                    </div>
                    <Button type="button" size="lg" disabled={part.price == null} className="mt-5 h-12 w-full rounded-xl text-base shadow-lg shadow-blue-950/15"><ShoppingCart className="size-5" /> افزودن به سبد خرید</Button>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 sm:text-xs">
                    <div className="flex flex-col items-center gap-2"><Truck className="size-5 text-orange-500" /> ارسال سریع</div>
                    <div className="flex flex-col items-center gap-2"><ShieldCheck className="size-5 text-blue-600" /> ضمانت اصالت</div>
                    <div className="flex flex-col items-center gap-2"><RotateCcw className="size-5 text-emerald-600" /> بازگشت ۷ روزه</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
            <article className="rounded-[1.75rem] border border-slate-100 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-slate-900">معرفی و مشخصات محصول</h2>
              <p className="mt-4 leading-8 text-slate-600">{part.description || `${name} با بررسی سلامت فیزیکی و تضمین اصالت برای شما ارسال می‌شود. برای اطمینان از سازگاری قطعه با مدل خودرو، پیش از ثبت سفارش مشخصات محصول را بررسی کنید.`}</p>
              <dl className="mt-7 divide-y divide-slate-100 border-t border-slate-100">
                <Spec label="نام محصول" value={name} />
                <Spec label="شناسه محصول" value={part.id?.toLocaleString("fa-IR") || "—"} />
                {brand && <Spec label="برند سازنده" value={brand} />}
                {(part.sku || part.partNumber) && <Spec label="کد فنی" value={part.sku || part.partNumber || ""} ltr />}
              </dl>
            </article>
            <aside className="h-fit rounded-[1.75rem] bg-[#14305A] p-6 text-white">
              <Headphones className="size-8 text-cyan-300" />
              <h2 className="mt-5 text-lg font-extrabold">برای انتخاب قطعه کمک می‌خواهید؟</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">کارشناسان کارتیوو برای بررسی سازگاری قطعه با خودروی شما در کنارتان هستند.</p>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

function Spec({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean }) {
  return <div className="grid grid-cols-[120px_1fr] gap-4 py-4 text-sm"><dt className="text-slate-400">{label}</dt><dd dir={ltr ? "ltr" : undefined} className="font-bold text-slate-700">{value}</dd></div>;
}
