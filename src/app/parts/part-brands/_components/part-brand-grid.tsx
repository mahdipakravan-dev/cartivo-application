"use client";

import Image from "next/image";
import Link from "next/link";
import { Factory, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { PartBrandFrontofficeResponse } from "@/lib/api/types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  { code: "IR", label: "ایران" }, { code: "DE", label: "آلمان" },
  { code: "JP", label: "ژاپن" }, { code: "KR", label: "کره جنوبی" },
  { code: "FR", label: "فرانسه" }, { code: "US", label: "آمریکا" },
  { code: "CN", label: "چین" },
];

export function PartBrandGrid({ brands }: { brands: PartBrandFrontofficeResponse[] }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string | null>(null);
  const availableCountries = COUNTRIES.filter((item) => brands.some((brand) => brand.countryCode === item.code));
  const filtered = brands.filter((brand) => {
    const search = query.trim().toLowerCase();
    const matchesQuery = !search || brand.persianName?.toLowerCase().includes(search) || brand.englishName?.toLowerCase().includes(search);
    return matchesQuery && (!country || brand.countryCode === country);
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="نام برند قطعه را جست‌وجو کنید..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pr-11 pl-10 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10" />
          {query && <button onClick={() => setQuery("")} aria-label="پاک کردن جست‌وجو" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"><X className="size-4" /></button>}
        </div>
        {availableCountries.length > 0 && (
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 shrink-0 text-slate-400" />
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setCountry(null)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", !country ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-500")}>همه</button>
              {availableCountries.map((item) => <button key={item.code} onClick={() => setCountry(country === item.code ? null : item.code)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", country === item.code ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-500")}>{item.label}</button>)}
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-slate-200 py-20 text-slate-400"><Search className="size-12 text-slate-200" /><p className="mt-4 text-sm font-bold">برندی یافت نشد</p></div>
      ) : (
        <div className="mt-8 grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
          {filtered.map((brand, index) => {
            const name = brand.persianName || brand.englishName || "برند قطعه";
            return (
              <Link key={brand.id ?? index} href={ROUTES.partBrandDetail(brand.slug ?? "")} className="group flex flex-col items-center gap-3 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="relative flex size-24 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:border-cyan-200 group-hover:shadow-lg">
                  {brand.iconUrl ? <Image src={brand.iconUrl} alt={`لوگوی ${name}`} fill sizes="96px" className="object-contain p-5 transition-transform group-hover:scale-110" /> : <Factory className="size-8 text-slate-300" />}
                </div>
                <div className="w-full"><h2 className="truncate text-xs font-bold text-slate-600 group-hover:text-[#14305A]">{name}</h2>{brand.partCount != null && <p className="mt-1 text-[10px] text-slate-400">{brand.partCount.toLocaleString("fa-IR")} قطعه</p>}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
