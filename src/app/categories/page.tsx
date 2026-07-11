import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft, Armchair, CarFront, ChevronLeft, Factory, Grid2X2,
  PackageSearch, SearchX, Sparkles, Wrench,
} from "lucide-react";
import { getBrands } from "@/lib/api/brands";
import { getPartBrands } from "@/lib/api/content";
import { searchParts } from "@/lib/api/parts";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: `دسته‌بندی قطعات خودرو | ${siteConfig.name}`,
  description: "دسترسی تصویری به قطعات داخلی و بیرونی، برندهای خودرو، تولیدکنندگان قطعه و تمام محصولات کارتیوو.",
  alternates: { canonical: ROUTES.categories },
};

type CardTone = "primary" | "light";
type CardSize = "medium" | "tall";

interface CategoryCardData {
  title: string;
  subtitle: string;
  eyebrow: string;
  href: string;
  images: string[];
  icon: LucideIcon;
  tone: CardTone;
  size: CardSize;
  imageMode?: "contain" | "cover";
}

export default async function CategoriesPage() {
  const [interior, exterior, allParts, brandsResult, partBrands] = await Promise.all([
    searchParts({ positionType: "INTERIOR", size: 6, sortBy: "createdAt", sortDir: "DESC" }),
    searchParts({ positionType: "EXTERIOR", size: 6, sortBy: "createdAt", sortDir: "DESC" }),
    searchParts({ size: 6, sortBy: "createdAt", sortDir: "DESC" }),
    getBrands({ size: 16, sort: "persianName" }),
    getPartBrands(16),
  ]);

  const cards: CategoryCardData[] = [
    {
      title: "قطعات داخلی",
      subtitle: "تجهیزات کابین، داشبورد، صندلی و اجزای داخل خودرو",
      eyebrow: "داخل خودرو",
      href: `${ROUTES.parts}?position=INTERIOR`,
      images: productImages(interior.items),
      icon: Armchair,
      tone: "primary",
      size: "tall",
    },
    {
      title: "برندهای خودرو",
      subtitle: "خودروی خود را بر اساس برند سازنده انتخاب کنید",
      eyebrow: "انتخاب خودرو",
      href: ROUTES.brands,
      images: brandsResult.items.map((brand) => brand.iconUrl).filter(isString),
      icon: CarFront,
      tone: "light",
      size: "medium",
      imageMode: "contain",
    },
    {
      title: "تمام قطعات یدکی",
      subtitle: "جست‌وجو و فیلتر میان همه محصولات فعال کارتیوو",
      eyebrow: "کاتالوگ کامل",
      href: ROUTES.parts,
      images: productImages(allParts.items),
      icon: PackageSearch,
      tone: "light",
      size: "tall",
    },
    {
      title: "قطعات بیرونی",
      subtitle: "قطعات بدنه، چراغ‌ها و تجهیزات نمای خارجی خودرو",
      eyebrow: "بیرون خودرو",
      href: `${ROUTES.parts}?position=EXTERIOR`,
      images: productImages(exterior.items),
      icon: CarFront,
      tone: "primary",
      size: "medium",
    },
    {
      title: "برندهای تولیدکننده قطعه",
      subtitle: "محصولات را بر اساس برند و سازنده قطعه مشاهده کنید",
      eyebrow: "تولیدکنندگان",
      href: ROUTES.partBrands,
      images: partBrands.map((brand) => brand.iconUrl).filter(isString),
      icon: Factory,
      tone: "primary",
      size: "tall",
      imageMode: "contain",
    },
    {
      title: "قطعه‌ات را پیدا نکردی؟",
      subtitle: "درخواست خود را ثبت کن تا کارشناسان کارتیوو بررسی کنند",
      eyebrow: "درخواست اختصاصی",
      href: "/#part-request",
      images: [],
      icon: SearchX,
      tone: "light",
      size: "medium",
    },
  ];

  return (
    <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav aria-label="مسیر ناوبری" className="mb-6 text-xs text-slate-400">
          <ol className="flex items-center gap-1.5"><li><Link href={ROUTES.home} className="hover:text-[#14305A]">خانه</Link></li><li><ChevronLeft className="size-3" /></li><li className="font-bold text-slate-600">دسته‌بندی‌ها</li></ol>
        </nav>

        <header className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] px-6 py-12 text-white shadow-[0_24px_70px_rgb(15_23_42/0.12)] sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 size-72 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100"><Grid2X2 className="size-4" /> مسیر سریع انتخاب قطعه</span><h1 className="mt-6 text-3xl font-black leading-[1.45] sm:text-4xl lg:text-5xl">هر چیزی که برای خودرو نیاز دارید،<span className="block text-cyan-300">از مسیر درست پیدا کنید</span></h1><p className="mt-5 max-w-2xl text-sm leading-8 text-white/60 sm:text-base">از موقعیت قطعه تا برند خودرو و تولیدکننده، دسته‌بندی مناسب را انتخاب کنید تا سریع‌تر به نتیجه برسید.</p></div>
          <Sparkles className="absolute bottom-10 left-12 hidden size-16 text-cyan-300/15 lg:block" />
        </header>

        <section className="pt-10 sm:pt-12" aria-labelledby="category-directory-title">
          <div className="mb-8"><p className="text-xs font-bold text-cyan-700">کاوش تصویری</p><h2 id="category-directory-title" className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">دسته‌بندی موردنظر را انتخاب کنید</h2><p className="mt-2 text-sm text-slate-400">کارت‌ها بر اساس محتوای واقعی و تازه کاتالوگ نمایش داده می‌شوند.</p></div>
          <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
            {cards.map((card) => <MasonryCategoryCard key={card.title} {...card} />)}
          </div>
        </section>
      </div>
    </main>
  );
}

function MasonryCategoryCard({ title, subtitle, eyebrow, href, images, icon: Icon, tone, size, imageMode = "contain" }: CategoryCardData) {
  const primary = tone === "primary";
  const visibleImages = images.slice(0, 4);
  return (
    <Link href={href} className={`group relative mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[1.75rem] border transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgb(15_48_90/0.14)] ${size === "tall" ? "min-h-[450px]" : "min-h-[350px]"} ${primary ? "border-white/5 bg-[#14305A]" : "border-slate-100 bg-white"}`}>
      <div className={`relative grid overflow-hidden ${size === "tall" ? "h-72" : "h-52"} ${visibleImages.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {visibleImages.length > 0 ? visibleImages.map((image, index) => <div key={`${image}-${index}`} className={`relative overflow-hidden border-white/20 ${primary ? "bg-white/[0.08]" : "bg-slate-50"}`}><Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className={`${imageMode === "cover" ? "object-cover" : "object-contain p-4"} transition-transform duration-700 group-hover:scale-105`} /></div>) : <div className={`absolute inset-0 flex items-center justify-center ${primary ? "bg-[radial-gradient(circle_at_center,rgb(103_232_249/0.13),transparent_65%)]" : "bg-[radial-gradient(circle_at_center,#fff,#f1f5f9)]"}`}><Icon className={`size-24 ${primary ? "text-cyan-200/20" : "text-slate-200"}`} strokeWidth={1} /></div>}
        <div className={`absolute inset-0 ${primary ? "bg-gradient-to-t from-[#14305A] via-transparent to-transparent" : "bg-gradient-to-t from-white via-transparent to-transparent"}`} />
      </div>
      <div className={`relative z-10 p-6 ${size === "tall" ? "sm:p-7" : ""}`}>
        <div className="flex items-start justify-between gap-4"><div><p className={`text-[10px] font-bold ${primary ? "text-cyan-300" : "text-cyan-700"}`}>{eyebrow}</p><h3 className={`mt-2 text-xl font-black sm:text-2xl ${primary ? "text-white" : "text-[#14305A]"}`}>{title}</h3></div><span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${primary ? "border border-white/10 bg-white/10 text-cyan-200" : "bg-slate-50 text-[#14305A]"}`}><Icon className="size-5" /></span></div>
        <p className={`mt-3 text-sm leading-7 ${primary ? "text-white/55" : "text-slate-500"}`}>{subtitle}</p>
        <span className={`mt-5 inline-flex items-center gap-2 text-xs font-bold ${primary ? "text-cyan-200" : "text-cyan-700"}`}>مشاهده دسته‌بندی <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /></span>
      </div>
      {primary && <Wrench className="absolute -bottom-4 -left-3 size-20 rotate-[-18deg] text-white/[0.025]" />}
    </Link>
  );
}

function productImages(parts: { imageUrls?: string[] }[]) { return parts.flatMap((part) => part.imageUrls || []).filter(isString); }
function isString(value: string | undefined): value is string { return typeof value === "string" && value.length > 0; }
