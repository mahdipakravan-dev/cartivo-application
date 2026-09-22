"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { BrandFrontofficeResponse } from "@/lib/api/types";

interface BrandGridProps {
  brands: BrandFrontofficeResponse[];
}

const COUNTRY_FILTERS = [
  { code: "IR", label: "ایران" },
  { code: "KR", label: "کره جنوبی" },
  { code: "JP", label: "ژاپن" },
  { code: "DE", label: "آلمان" },
  { code: "FR", label: "فرانسه" },
  { code: "US", label: "آمریکا" },
  { code: "CN", label: "چین" },
];

export function BrandGrid({ brands }: BrandGridProps) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string | null>(null);

  const filtered = brands.filter((brand) => {
    const matchesQuery = !query.trim()
      ? true
      : brand.persianName?.toLowerCase().includes(query.toLowerCase()) ||
        brand.englishName?.toLowerCase().includes(query.toLowerCase());
    const matchesCountry = !country || brand.countryCode === country;
    return matchesQuery && matchesCountry;
  });

  const availableCountries = COUNTRY_FILTERS.filter((cf) =>
    brands.some((b) => b.countryCode === cf.code),
  );

  return (
    <div>
      {/* Search + Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام برند را جست‌وجو کنید..."
            className="w-full rounded-2xl  bg-white py-3 pr-11 pl-10 text-sm text-text-muted outline-none transition-all placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-text-secondary transition-colors hover:text-text-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Country Filters */}
        {availableCountries.length > 0 && (
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-text-secondary" />
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCountry(null)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  !country
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white text-text-secondary hover:border-border",
                )}
              >
                همه
              </button>
              {availableCountries.map((cf) => (
                <button
                  key={cf.code}
                  onClick={() =>
                    setCountry(country === cf.code ? null : cf.code)
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    country === cf.code
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-white text-text-secondary hover:border-border",
                  )}
                >
                  {cf.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {(query || country) && (
        <p className="mt-4 text-sm text-text-secondary">
          {filtered.length.toLocaleString("fa-IR")} برند یافت شد
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-white/50 py-20">
          <Search className="h-12 w-12 text-text-secondary" />
          <p className="mt-4 text-sm font-medium text-text-secondary">
            برندی یافت نشد
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            فیلترها را تغییر دهید یا عبارت دیگری جست‌وجو کنید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-8">
          {filtered.map((brand) => (
            <Link
              key={brand.id}
              href={ROUTES.brandDetail(brand.slug ?? "")}
              className="group/brand flex flex-col items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${brand.persianName} — قطعات یدکی`}
            >
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full  bg-white shadow-sm shadow-border/50 transition-all duration-300 group-hover/brand:-translate-y-1 group-hover/brand:border-border group-hover/brand:shadow-lg group-hover/brand:shadow-border/60">
                {brand.iconUrl ? (
                  <Image
                    src={brand.iconUrl}
                    alt={`لوگوی ${brand.persianName}`}
                    width={80}
                    height={80}
                    className="h-14 w-14 object-contain transition-transform duration-300 group-hover/brand:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-lg font-bold text-text-secondary transition-colors group-hover/brand:text-text-secondary">
                    {brand.englishName?.slice(0, 3) ?? ""}
                  </span>
                )}
              </div>

              <span className="max-w-[8rem] truncate text-center text-xs font-medium text-text-secondary transition-colors group-hover/brand:text-dark">
                {brand.persianName}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
