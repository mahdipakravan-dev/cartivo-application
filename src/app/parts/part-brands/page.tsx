import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ChevronLeft, Factory, Search } from "lucide-react";
import { getPartBrands } from "@/lib/api/content";
import { ROUTES } from "@/lib/routes";
import { PartBrandGrid } from "./_components/part-brand-grid";

export const metadata: Metadata = {
  title: "برندهای تولیدکننده قطعه",
  description: "فهرست برندهای تولیدکننده قطعات یدکی و محصولات موجود هر برند در کارتیوو.",
  alternates: { canonical: ROUTES.partBrands },
};

export default async function PartBrandsPage() {
  const brands = await getPartBrands(200);

  return (
    <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav aria-label="مسیر ناوبری" className="mb-6 text-xs text-slate-400"><ol className="flex items-center gap-1.5"><li><Link href={ROUTES.home} className="hover:text-[#14305A]">خانه</Link></li><li><ChevronLeft className="size-3" /></li><li><Link href={ROUTES.parts} className="hover:text-[#14305A]">قطعات</Link></li><li><ChevronLeft className="size-3" /></li><li className="font-bold text-slate-600">برندهای تولیدکننده</li></ol></nav>

        <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
          <div className="absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="grid min-h-[390px] lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 lg:px-14">
              <div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100"><BadgeCheck className="size-4" />{brands.length.toLocaleString("fa-IR")} برند تولیدکننده</div><h1 className="mt-6 text-3xl font-black leading-[1.4] text-white sm:text-4xl lg:text-5xl">قطعات را بر اساس<span className="block text-cyan-300">برند سازنده</span>انتخاب کنید</h1><p className="mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">تولیدکننده موردنظر را انتخاب کنید و تمام قطعات فعال آن برند را یک‌جا ببینید.</p><a href="#part-brand-directory" className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#14305A]"><Search className="size-4" /> انتخاب برند قطعه</a></div>
            </div>
            <div className="relative hidden items-center justify-center border-r border-white/10 lg:flex"><div className="absolute size-72 rounded-full border border-white/10" /><Factory className="size-32 text-cyan-200/20" strokeWidth={1} /><div className="absolute bottom-10 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-bold text-white/70">تولیدکنندگان معتبر قطعات یدکی</div></div>
          </div>
        </section>

        <section id="part-brand-directory" className="scroll-mt-24 pt-10 sm:pt-12"><div className="mb-7"><p className="text-xs font-bold text-cyan-700">فهرست تولیدکنندگان</p><h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">برند موردنظر خود را پیدا کنید</h2></div><PartBrandGrid brands={brands} /></section>
      </div>
    </main>
  );
}
