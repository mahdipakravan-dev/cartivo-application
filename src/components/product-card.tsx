import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BadgeCheck, CarFront, Package, ShoppingBag } from "lucide-react";
import type { PartFrontofficeResponse } from "@/lib/api/types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  part: PartFrontofficeResponse;
  variant?: "horizontal" | "vertical";
}

export function ProductCard({ part, variant = "horizontal" }: ProductCardProps) {
  if (part.id == null) return null;
  const primaryImage = part.imageUrls?.find(Boolean);
  const brandName = part.partBrand?.persianName || part.partBrand?.englishName;
  const compatibleCar = part.cars?.find(Boolean);
  const compatibleCarName = compatibleCar
    ? [compatibleCar.brand?.persianName || compatibleCar.brand?.englishName, compatibleCar.model]
        .filter(Boolean)
        .join(" ")
    : null;

  return (
    <Link
      href={ROUTES.partDetail(String(part.id))}
      className={cn(
        "group relative grid overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgb(15_48_90/0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        variant === "horizontal"
          ? "min-h-[220px] sm:grid-cols-[minmax(150px,38%)_1fr]"
          : "grid-rows-[210px_1fr]",
      )}
      aria-label={`مشاهده ${part.name || "قطعه"}`}
    >
      <div className={cn(
        "relative overflow-hidden bg-[radial-gradient(circle_at_center,#fff_0%,#f1f5f9_78%)]",
        variant === "horizontal"
          ? "min-h-48 border-b border-slate-100 sm:min-h-full sm:border-b-0 sm:border-l"
          : "min-h-[210px] border-b border-slate-100",
      )}>
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={`تصویر ${part.name || "قطعه خودرو"}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 35vw, 260px"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-20 items-center justify-center rounded-2xl border border-slate-100 bg-white text-slate-300 shadow-sm">
              <Package className="size-9" strokeWidth={1.5} />
            </div>
          </div>
        )}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg border border-white/80 bg-white/85 px-2 py-1 text-[10px] font-bold text-emerald-700 shadow-sm backdrop-blur-sm">
          <BadgeCheck className="size-3" /> موجود
        </span>
        <div className="pointer-events-none absolute inset-x-5 bottom-2 h-5 rounded-[50%] bg-slate-900/5 blur-md" />
      </div>

      <div className="relative flex min-w-0 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {brandName && (
              <p className="mb-1.5 truncate text-[10px] font-bold text-cyan-700">{brandName}</p>
            )}
            <h3 className="line-clamp-2 text-sm font-extrabold leading-6 text-slate-800 transition-colors group-hover:text-[#14305A] sm:text-base sm:leading-7">
              {part.name || "قطعه خودرو"}
            </h3>
          </div>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-[#14305A] group-hover:text-white">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          </span>
        </div>

        {compatibleCarName && (
          <div className="mt-3 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-400">
            <CarFront className="size-3.5 shrink-0 text-slate-300" />
            <span className="truncate">مناسب برای {compatibleCarName}</span>
            {(part.cars?.length ?? 0) > 1 && (
              <span className="shrink-0">+{((part.cars?.length ?? 1) - 1).toLocaleString("fa-IR")}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[10px] text-slate-400">قیمت محصول</span>
            {part.price != null ? (
              <p className="mt-1 whitespace-nowrap text-base font-black text-[#14305A] sm:text-lg">
                {part.price.toLocaleString("fa-IR")}
                <span className="mr-1 text-[11px] font-medium text-slate-400">ریال</span>
              </p>
            ) : (
              <p className="mt-1 text-sm font-bold text-slate-500">تماس بگیرید</p>
            )}
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#14305A] text-white shadow-lg shadow-blue-950/15 transition-colors group-hover:bg-blue-700">
            <ShoppingBag className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
