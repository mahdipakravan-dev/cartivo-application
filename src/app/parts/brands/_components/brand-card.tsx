import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import type { BrandFrontofficeResponse } from "@/lib/api/types";
import { Card, CardContent } from "@/components/ui/card";

export function BrandCard({ brand }: { brand: BrandFrontofficeResponse }) {
  return (
    <Link
      href={ROUTES.brandDetail(brand.slug ?? "")}
      className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`مشاهده‌ی قطعات یدکی ${brand.persianName ?? ""}`}
    >
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {brand.iconUrl ? (
              <Image
                src={brand.iconUrl}
                alt={`لوگوی ${brand.persianName ?? ""}`}
                width={56}
                height={56}
                className="object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {brand.englishName?.slice(0, 2)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold">{brand.persianName}</h2>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {brand.englishName}
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
