"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, CarFront, Factory, FolderTree, LoaderCircle, PackageSearch,
  Search, SearchX, Sparkles, X,
} from "lucide-react";
import { globalSearch, type GlobalSearchResponse } from "@/lib/api/search";
import { ROUTES } from "@/lib/routes";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY: GlobalSearchResponse = { brands: [], cars: [], partCategories: [], parts: [] };

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResponse>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) {
      setResults(EMPTY);
      setLoading(false);
      setError("");
      return;
    }
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      globalSearch(normalized)
        .then((data) => active && setResults(data))
        .catch((reason) => active && setError(reason instanceof Error ? reason.message : "جست‌وجو انجام نشد."))
        .finally(() => active && setLoading(false));
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const count = useMemo(() =>
    (results.brands?.length ?? 0) + (results.cars?.length ?? 0) +
    (results.parts?.length ?? 0) + (results.partCategories?.length ?? 0), [results]);

  if (!open) return null;
  const close = () => onOpenChange(false);

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center bg-slate-950/60 px-3 pt-16 backdrop-blur-md sm:px-6 sm:pt-24" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section role="dialog" aria-modal="true" aria-label="جست‌وجوی سراسری" className="flex max-h-[calc(100dvh-5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-[0_30px_100px_rgb(2_6_23/0.35)] sm:max-h-[calc(100dvh-8rem)] sm:rounded-[2rem]">
        <div className="relative border-b border-slate-100 p-3 sm:p-5">
          <Search className="absolute right-7 top-1/2 size-5 -translate-y-1/2 text-[#14305A] sm:right-9" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="نام خودرو، برند یا قطعه را بنویسید..."
            className="h-14 w-full rounded-2xl bg-slate-50 pr-12 pl-14 text-sm font-medium text-slate-800 outline-none ring-1 ring-slate-100 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-600/20 sm:h-16 sm:pr-14 sm:text-base"
          />
          {loading ? <LoaderCircle className="absolute left-8 top-1/2 size-5 -translate-y-1/2 animate-spin text-cyan-700 sm:left-10" /> : query ? <button onClick={() => setQuery("")} aria-label="پاک کردن" className="absolute left-7 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 sm:left-9"><X className="size-4" /></button> : null}
        </div>

        <div className="scrollbar-hide min-h-64 flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6">
          {query.trim().length < 2 ? <SearchIntro /> : error ? <State icon={SearchX} title="جست‌وجو با خطا مواجه شد" subtitle={error} /> : !loading && count === 0 ? <State icon={SearchX} title="نتیجه‌ای پیدا نشد" subtitle="عبارت دیگری را امتحان کنید یا نام را کوتاه‌تر بنویسید." /> : (
            <div className="space-y-6">
              <div className="flex items-center justify-between"><p className="text-xs font-bold text-slate-500">نتایج برای «{query.trim()}»</p><span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-400 shadow-sm">{count.toLocaleString("fa-IR")} نتیجه</span></div>
              {(results.brands?.length ?? 0) > 0 && <ResultGroup title="برندهای خودرو" icon={Factory}><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{results.brands!.map((brand, index) => <ResultLink key={brand.id ?? index} href={ROUTES.brandDetail(brand.slug ?? "")} onClick={close} image={brand.iconUrl} title={brand.persianName || brand.englishName || "برند خودرو"} subtitle={brand.englishName} fallback={Factory} />)}</div></ResultGroup>}
              {(results.cars?.length ?? 0) > 0 && <ResultGroup title="خودروها" icon={CarFront}><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{results.cars!.map((car, index) => <ResultLink key={car.id ?? index} href={car.id == null ? ROUTES.parts : `${ROUTES.parts}?carIds=${car.id}`} onClick={close} image={car.imageUrls?.find(Boolean)} title={[car.brand, car.model].filter(Boolean).join(" ") || "خودرو"} subtitle={car.trimLevel || "مشاهده قطعات سازگار"} fallback={CarFront} />)}</div></ResultGroup>}
              {(results.parts?.length ?? 0) > 0 && <ResultGroup title="قطعات" icon={PackageSearch}><div className="grid gap-2 sm:grid-cols-2">{results.parts!.map((part, index) => <ResultLink key={part.id ?? index} href={part.id == null ? ROUTES.parts : ROUTES.partDetail(String(part.id))} onClick={close} title={part.name || "قطعه خودرو"} subtitle={[part.partBrandName, part.parentPartName].filter(Boolean).join(" • ") || part.description} fallback={PackageSearch} />)}</div></ResultGroup>}
              {(results.partCategories?.length ?? 0) > 0 && <ResultGroup title="دسته‌بندی قطعات" icon={FolderTree}><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{results.partCategories!.map((category, index) => <ResultLink key={category.id ?? index} href={category.id == null ? ROUTES.parts : `${ROUTES.parts}?parentPartIds=${category.id}`} onClick={close} title={category.name || "دسته‌بندی قطعات"} subtitle={category.position === "INTERIOR" ? "قطعات داخلی" : category.position === "EXTERIOR" ? "قطعات بیرونی" : "مشاهده محصولات"} fallback={FolderTree} />)}</div></ResultGroup>}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-3 text-[10px] text-slate-400"><span>جست‌وجوی هوشمند در کاتالوگ کارتیوو</span><button onClick={close} className="rounded-lg bg-slate-50 px-2 py-1 font-bold text-slate-500">ESC بستن</button></footer>
      </section>
    </div>
  );
}

function ResultGroup({ title, icon: Icon, children }: { title: string; icon: typeof Search; children: React.ReactNode }) {
  return <section><div className="mb-3 flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-[#14305A] text-cyan-200"><Icon className="size-4" /></span><h2 className="text-sm font-black text-slate-800">{title}</h2></div>{children}</section>;
}

function ResultLink({ href, onClick, image, title, subtitle, fallback: Icon }: { href: string; onClick: () => void; image?: string | undefined; title: string; subtitle?: string | undefined; fallback: typeof Search }) {
  return <Link href={href} onClick={onClick} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"><span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">{image ? <Image src={image} alt="" fill sizes="48px" className="object-contain p-1.5" /> : <Icon className="size-5 text-slate-300" />}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-slate-700 group-hover:text-[#14305A]">{title}</strong>{subtitle && <small className="mt-1 block truncate text-[10px] text-slate-400">{subtitle}</small>}</span><ArrowLeft className="size-3.5 shrink-0 text-slate-300 transition group-hover:-translate-x-1 group-hover:text-cyan-700" /></Link>;
}

function SearchIntro() { return <div className="flex min-h-72 flex-col items-center justify-center text-center"><div className="relative flex size-20 items-center justify-center rounded-[1.5rem] bg-[#14305A] text-white shadow-xl shadow-blue-950/15"><Search className="size-8" /><Sparkles className="absolute -left-2 -top-2 size-5 text-cyan-400" /></div><h2 className="mt-5 text-xl font-black text-slate-800">دنبال چه چیزی هستید؟</h2><p className="mt-2 max-w-md text-sm leading-7 text-slate-400">حداقل دو حرف از نام قطعه، خودرو یا برند را وارد کنید تا همه نتایج مرتبط را یک‌جا ببینید.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{["لنت ترمز", "پژو ۲۰۶", "تویوتا", "چراغ جلو"].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] text-slate-500">{item}</span>)}</div></div>; }
function State({ icon: Icon, title, subtitle }: { icon: typeof Search; title: string; subtitle: string }) { return <div className="flex min-h-72 flex-col items-center justify-center text-center"><Icon className="size-12 text-slate-200" /><h2 className="mt-4 text-base font-black text-slate-700">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{subtitle}</p></div>; }
