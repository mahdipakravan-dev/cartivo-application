import Link from "next/link";
import { Package } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import type { PartFrontofficeResponse } from "@/lib/api/types";

interface ProductCardProps {
  part: PartFrontofficeResponse;
  brandSlug: string;
  carId?: number;
}

export function ProductCard({ part, brandSlug, carId }: ProductCardProps) {
  const href = carId
    ? ROUTES.partsPart(brandSlug, String(carId), String(part.id))
    : `/parts/${brandSlug}/${part.id}`;

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/60"
      aria-label={part.name}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-primary/5">
          <Package className="h-6 w-6 text-slate-400 transition-colors group-hover:text-primary" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-800">
            {part.name}
          </h3>

          {part.price != null && (
            <p className="mt-1.5 text-sm font-semibold text-primary">
              {part.price.toLocaleString("fa-IR")}
              <span className="mr-1 text-xs font-normal text-slate-400">ریال</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
