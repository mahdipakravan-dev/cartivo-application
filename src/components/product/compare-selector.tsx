"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, Search, SearchX, Scale, X } from "lucide-react";
import { globalSearch, type SearchPart } from "@/lib/api/search";
import { apiFetch } from "@/lib/api/fetch";
import type { PartFrontofficeResponse } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CompareSelectorProps {
  basePartId: number;
  selectedTargetId?: number | undefined;
}

type CompareSearchPart = SearchPart & { id: number; price: number };

export function CompareSelector({ basePartId, selectedTargetId }: CompareSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CompareSearchPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) {
      setResults([]);
      setLoading(false);
      setError("");
      return;
    }

    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      globalSearch(normalized)
        .then(async (data) => {
          if (!active) return;
          const parts = (data.parts ?? []).filter((part): part is SearchPart & { id: number } => part.id != null);
          const pricedParts = await Promise.all(
            parts.map(async (part) => {
              try {
                const details = await apiFetch<PartFrontofficeResponse>(`/api/frontoffice/parts/${part.id}`);
                return details.price != null ? { ...part, price: details.price } : null;
              } catch {
                return null;
              }
            }),
          );
          if (!active) return;
          setResults(pricedParts.filter((part): part is CompareSearchPart => part != null));
        })
        .catch((reason) => {
          if (!active) return;
          setError(reason instanceof Error ? reason.message : "جست‌وجو انجام نشد.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const filteredResults = useMemo(
    () =>
      results.filter((part) => part.id != null && part.id !== basePartId),
    [basePartId, results],
  );

  const updateTarget = (targetId?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("base", String(basePartId));
    if (targetId != null) {
      params.set("target", String(targetId));
    } else {
      params.delete("target");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_16px_50px_rgb(15_23_42/0.045)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-cyan-700">انتخاب محصول دوم</p>
          <h2 className="mt-2 text-xl font-black text-slate-900">برای مقایسه، قطعه دیگری انتخاب کنید</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            نام قطعه یا برند سازنده را وارد کنید. نتیجه‌ها از بین محصولات موجود نمایش داده می‌شوند.
          </p>
        </div>
        {selectedTargetId != null && (
          <Button variant="outline" onClick={() => updateTarget(undefined)} className="h-10 rounded-xl px-4">
            <X className="size-4" />
            حذف انتخاب
          </Button>
        )}
      </div>

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="مثلاً لنت ترمز جلو یا بوش"
          className="h-12 rounded-xl border-slate-200 bg-slate-50 pr-10 pl-10 text-sm"
        />
        {loading ? (
          <LoaderCircle className="absolute left-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-cyan-700" />
        ) : query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="پاک کردن جست‌وجو"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 min-h-24">
        {query.trim().length < 2 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            <Scale className="size-5 text-slate-300" />
            حداقل دو حرف وارد کنید تا قطعات قابل مقایسه را ببینید.
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
            <SearchX className="size-5" />
            {error}
          </div>
        ) : !loading && filteredResults.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            <SearchX className="size-5 text-slate-300" />
            نتیجه‌ای برای این جست‌وجو پیدا نشد.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredResults.map((part) => {
              const active = part.id === selectedTargetId;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => updateTarget(part.id!)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-right transition ${
                    active
                      ? "border-cyan-200 bg-cyan-50/70"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-800">{part.name || "قطعه خودرو"}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {[part.partBrandName, part.parentPartName].filter(Boolean).join(" • ") || part.description || "مشاهده جزئیات"}
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#14305A]">
                      {part.price?.toLocaleString("fa-IR")} ریال
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${active ? "bg-[#14305A] text-white" : "bg-slate-100 text-slate-500"}`}>
                    {active ? "انتخاب شده" : "مقایسه"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
