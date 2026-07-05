"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildSearchParams } from "@/lib/search-params";
import type { PartSearchParams, PartSearchParamsUpdate } from "@/lib/api/parts";
import type { CarFrontofficeDetailResponse } from "@/lib/api/types";

interface FilterSidebarProps {
  initialParams: PartSearchParams;
  cars: CarFrontofficeDetailResponse[];
  className?: string;
}

const POSITION_OPTIONS = [
  { value: "INTERIOR" as const, label: "داخلی" },
  { value: "EXTERIOR" as const, label: "خارجی" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "جدیدترین" },
  { value: "price", label: "قیمت" },
  { value: "name", label: "نام" },
];

export function FilterSidebar({ initialParams, cars, className }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const applyFilters = useCallback(
    (updates: PartSearchParamsUpdate) => {
      const next = buildSearchParams(initialParams, updates);
      startTransition(() => {
        router.push(`?${next.toString()}`, { scroll: false });
      });
    },
    [router, initialParams],
  );

  const toggleArrayFilter = useCallback(
    (key: "carIds" | "partBrandIds" | "parentPartIds", id: number) => {
      const current = initialParams[key] ?? [];
      const next = current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id];
      applyFilters({ [key]: next.length ? next : undefined, page: 0 });
    },
    [initialParams, applyFilters],
  );

  const activeCount =
    (initialParams.carIds?.length ?? 0) +
    (initialParams.partBrandIds?.length ?? 0) +
    (initialParams.parentPartIds?.length ?? 0) +
    (initialParams.positionType ? 1 : 0) +
    (initialParams.minPrice != null ? 1 : 0) +
    (initialParams.maxPrice != null ? 1 : 0);

  return (
    <aside className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <SlidersHorizontal className="h-4 w-4" />
          فیلترها
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => applyFilters({ carIds: undefined, partBrandIds: undefined, parentPartIds: undefined, positionType: undefined, minPrice: undefined, maxPrice: undefined, page: 0 })}
            className="text-xs text-slate-400 transition-colors hover:text-red-500"
          >
            پاک کردن همه
          </button>
        )}
      </div>

      {isPending && (
        <div className="absolute inset-0 z-10 rounded-2xl bg-white/60 backdrop-blur-[1px]" />
      )}

      {/* Sort */}
      <FilterSection title="مرتب‌سازی">
        <select
          value={initialParams.sortBy ?? ""}
          onChange={(e) => applyFilters({ sortBy: e.target.value || undefined, page: 0 })}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
        >
          <option value="">پیش‌فرض</option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Position */}
      <FilterSection title="موقعیت">
        <div className="flex gap-2">
          {POSITION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                applyFilters({
                  positionType: initialParams.positionType === opt.value ? undefined : opt.value,
                  page: 0,
                })
              }
              className={cn(
                "flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-all",
                initialParams.positionType === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="محدوده قیمت (ریال)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="از"
            defaultValue={initialParams.minPrice ?? ""}
            onBlur={(e) => {
              const v = e.target.value ? Number(e.target.value) : undefined;
              if (v !== initialParams.minPrice) applyFilters({ minPrice: v, page: 0 });
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          <span className="shrink-0 text-slate-300">—</span>
          <input
            type="number"
            placeholder="تا"
            defaultValue={initialParams.maxPrice ?? ""}
            onBlur={(e) => {
              const v = e.target.value ? Number(e.target.value) : undefined;
              if (v !== initialParams.maxPrice) applyFilters({ maxPrice: v, page: 0 });
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </FilterSection>

      {/* Cars */}
      {cars.length > 0 && (
        <FilterSection title="خودرو" defaultOpen>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {cars.map((car) => (
              <label
                key={car.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={initialParams.carIds?.includes(car.id!) ?? false}
                  onChange={() => toggleArrayFilter("carIds", car.id!)}
                  className="h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="truncate text-slate-600">
                  {car.model}
                  {car.manufactureYear ? ` (${car.manufactureYear})` : ""}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Active Filters */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {initialParams.carIds?.map((id) => {
            const car = cars.find((c) => c.id === id);
            return (
              <ActiveTag
                key={`car-${id}`}
                label={car?.model ?? String(id)}
                onRemove={() => toggleArrayFilter("carIds", id)}
              />
            );
          })}
          {initialParams.positionType && (
            <ActiveTag
              label={initialParams.positionType === "INTERIOR" ? "داخلی" : "خارجی"}
              onRemove={() => applyFilters({ positionType: undefined, page: 0 })}
            />
          )}
          {initialParams.minPrice != null && (
            <ActiveTag
              label={`از ${initialParams.minPrice.toLocaleString("fa-IR")}`}
              onRemove={() => applyFilters({ minPrice: undefined, page: 0 })}
            />
          )}
          {initialParams.maxPrice != null && (
            <ActiveTag
              label={`تا ${initialParams.maxPrice.toLocaleString("fa-IR")}`}
              onRemove={() => applyFilters({ maxPrice: undefined, page: 0 })}
            />
          )}
        </div>
      )}
    </aside>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="flex cursor-pointer items-center justify-between rounded-xl py-1 text-sm font-semibold text-slate-700 select-none">
        {title}
        <span className="text-slate-300 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="pt-2">{children}</div>
    </details>
  );
}

function ActiveTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
      {label}
      <button onClick={onRemove} className="rounded-full p-0.5 transition-colors hover:bg-primary/10">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
