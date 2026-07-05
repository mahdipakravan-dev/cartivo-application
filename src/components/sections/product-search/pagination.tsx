"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildSearchParams } from "@/lib/search-params";
import type { PartSearchParams } from "@/lib/api/parts";

interface PaginationProps {
  initialParams: PartSearchParams;
  totalPages: number;
  totalElements: number;
}

export function Pagination({ initialParams, totalPages, totalElements }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentPage = initialParams.page ?? 0;

  const goToPage = useCallback(
    (page: number) => {
      const next = buildSearchParams(initialParams, { page });
      startTransition(() => {
        router.push(`?${next.toString()}`, { scroll: false });
      });
    },
    [router, initialParams],
  );

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i;
    if (currentPage < 3) return i;
    if (currentPage > totalPages - 4) return totalPages - 7 + i;
    return currentPage - 3 + i;
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-slate-400">
        {totalElements.toLocaleString("fa-IR")} نتیجه
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0 || isPending}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-300 hover:text-slate-700 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            disabled={isPending}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm font-medium transition-all",
              p === currentPage
                ? "border border-primary bg-primary text-primary-foreground shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
            )}
          >
            {(p + 1).toLocaleString("fa-IR")}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1 || isPending}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-300 hover:text-slate-700 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-500"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
