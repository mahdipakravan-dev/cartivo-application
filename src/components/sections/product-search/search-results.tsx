"use client";

import { FilterSidebar } from "./filter-sidebar";
import { MobileFilterToggle } from "./mobile-filter";
import { ProductCard } from "@/components/product-card";
import { Pagination } from "./pagination";
import type { PartSearchParams } from "@/lib/api/parts";
import type { PartFrontofficeResponse, CarFrontofficeDetailResponse } from "@/lib/api/types";
import { Package } from "lucide-react";

interface SearchResultsProps {
  initialParams: PartSearchParams;
  cars: CarFrontofficeDetailResponse[];
  results: {
    items: PartFrontofficeResponse[];
    totalElements: number;
    totalPages: number;
  };
  /** Kept for compatibility with brand-filtered result pages. */
  brandSlug?: string;
}

export function SearchResults({
  initialParams,
  cars,
  results,
}: SearchResultsProps) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Mobile Filter Toggle */}
      <MobileFilterToggle initialParams={initialParams} cars={cars} />

      {/* Desktop Sidebar */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24">
          <FilterSidebar initialParams={initialParams} cars={cars} />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 min-w-0">
        {/* Results Header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {results.totalElements.toLocaleString("fa-IR")} قطعه یافت شد
          </p>
        </div>

        {/* Product Grid */}
        {results.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16">
            <Package className="h-12 w-12 text-slate-200" />
            <p className="mt-3 text-sm text-slate-400">
              قطعه‌ای با فیلترهای انتخاب‌شده یافت نشد.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.items.map((part) => (
              <ProductCard key={part.id} part={part} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8">
          <Pagination
            initialParams={initialParams}
            totalPages={results.totalPages}
            totalElements={results.totalElements}
          />
        </div>
      </div>
    </div>
  );
}
