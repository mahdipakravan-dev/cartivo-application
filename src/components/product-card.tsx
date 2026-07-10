import Link from "next/link";
import { ArrowLeft, BadgeCheck, Package, ShoppingBag } from "lucide-react";
import type { PartFrontofficeResponse } from "@/lib/api/types";
import { ROUTES } from "@/lib/routes";

interface ProductCardProps {
  part: PartFrontofficeResponse;
}

export function ProductCard({ part }: ProductCardProps) {
  if (part.id == null) return null;

  return (
    <Link
      href={ROUTES.partDetail(String(part.id))}
      className="group relative flex min-h-52 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgb(15_23_42/0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgb(15_48_90/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`مشاهده ${part.name || "قطعه"}`}
    >
      <div className="pointer-events-none absolute -left-12 -top-14 size-32 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 text-[#14305A] ring-1 ring-slate-100 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
          <Package className="size-8" strokeWidth={1.6} />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
          <BadgeCheck className="size-3.5" /> موجود
        </span>
      </div>

      <div className="relative mt-5 flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-base font-extrabold leading-7 text-slate-800 transition-colors group-hover:text-[#14305A]">
          {part.name || "قطعه خودرو"}
        </h3>
        <p className="mt-1 text-xs text-slate-400">قطعه اصلی خودرو</p>

        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[10px] text-slate-400">قیمت محصول</span>
            {part.price != null ? (
              <p className="mt-1 text-lg font-black text-[#14305A]">
                {part.price.toLocaleString("fa-IR")}
                <span className="mr-1 text-[11px] font-medium text-slate-400">ریال</span>
              </p>
            ) : (
              <p className="mt-1 text-sm font-bold text-slate-500">تماس بگیرید</p>
            )}
          </div>
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#14305A] text-white shadow-lg shadow-blue-950/15 transition-all group-hover:bg-blue-700">
            <ShoppingBag className="size-4 transition-opacity group-hover:opacity-0" />
            <ArrowLeft className="absolute size-4 translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
        </div>
      </div>
    </Link>
  );
}
