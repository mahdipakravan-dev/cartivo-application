import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import type { BrandFrontDto } from "@/lib/api/types";
import { Card, CardContent } from "@/components/ui/card";

/**
 * کارت برند — کامپوننت محلی صفحه‌ی /brands (کانونشن پوشه‌ی _components).
 * Server Component است؛ هیچ JS به کلاینت نمی‌فرستد.
 */
export function BrandCard({ brand }: { brand: BrandFrontDto }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`مشاهده‌ی قطعات یدکی ${brand.name}`}
    >
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={`لوگوی ${brand.name}`}
                width={56}
                height={56}
                className="object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {brand.nameEn.slice(0, 2)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold">{brand.name}</h2>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {typeof brand.modelCount === "number"
                ? `${brand.modelCount.toLocaleString("fa-IR")} مدل خودرو`
                : brand.nameEn}
            </p>
          </div>

          <ChevronLeft
            className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </CardContent>
      </Card>
    </Link>
  );
}
