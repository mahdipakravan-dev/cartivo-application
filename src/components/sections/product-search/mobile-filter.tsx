"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterSidebar } from "./filter-sidebar";
import type { PartSearchParams } from "@/lib/api/parts";
import type { CarFrontofficeDetailResponse } from "@/lib/api/types";

interface MobileFilterProps {
  initialParams: PartSearchParams;
  cars: CarFrontofficeDetailResponse[];
}

export function MobileFilterToggle({ initialParams, cars }: MobileFilterProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (initialParams.carIds?.length ?? 0) +
    (initialParams.partBrandIds?.length ?? 0) +
    (initialParams.parentPartIds?.length ?? 0) +
    (initialParams.positionType ? 1 : 0) +
    (initialParams.minPrice != null ? 1 : 0) +
    (initialParams.maxPrice != null ? 1 : 0);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:shadow-sm lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        فیلترها
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </button>

      {/* Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-[#FBFCFD] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">فیلترها</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar initialParams={initialParams} cars={cars} />
          </div>
        </>
      )}
    </>
  );
}
