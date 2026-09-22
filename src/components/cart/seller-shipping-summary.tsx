import { Truck } from "lucide-react";

import type { SellerOffer } from "@/lib/api/pricing";
import { cartLineKey, type CartItem } from "@/lib/store/cart-store";
import {
  formatShippingCost,
  getShippingMethodLabel,
} from "@/lib/seller-shipping";

interface SellerShippingSummaryProps {
  items: CartItem[];
  offers: Record<string, SellerOffer>;
}

export function SellerShippingSummary({
  items,
  offers,
}: SellerShippingSummaryProps) {
  if (Object.keys(offers).length === 0) return null;

  return (
    <div className="mt-6 border-t border-border pt-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Truck className="size-5" />
        </span>
        <div>
          <h3 className="text-sm font-black text-dark">روش ارسال فروشندگان</h3>
          <p className="mt-1 text-xs text-text-secondary">
            جزئیات ارسال اقلام به آدرس انتخاب‌شده
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const key = cartLineKey(item.partId, item.sellerId);
          const offer = offers[key];
          if (!offer) return null;

          return (
            <article key={key} className="rounded-2xl  bg-background/70 p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-dark">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    فروشنده: {item.sellerName}
                  </p>
                </div>
                <dl className="shrink-0 space-y-1 text-xs sm:text-left">
                  <div className="flex gap-2 sm:justify-end">
                    <dt className="text-text-secondary">روش:</dt>
                    <dd className="font-bold text-text-muted">
                      {getShippingMethodLabel(offer.shippingMethod)}
                    </dd>
                  </div>
                  <div className="flex gap-2 sm:justify-end">
                    <dt className="text-text-secondary">هزینه:</dt>
                    <dd className="font-bold text-text-muted">
                      {formatShippingCost(offer.shippingCostRial)}
                    </dd>
                  </div>
                </dl>
              </div>
              {offer.sellerDetails?.trim() && (
                <p className="mt-3 whitespace-pre-line border-t border-border/70 pt-3 text-xs leading-6 text-text-secondary">
                  {offer.sellerDetails}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-5 text-amber-700">
        هزینه ارسال فعلاً اطلاع‌رسانی است و در مبلغ قابل پرداخت سفارش محاسبه
        نمی‌شود.
      </p>
    </div>
  );
}
