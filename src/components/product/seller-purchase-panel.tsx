"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  LoaderCircle,
  RefreshCw,
  ShoppingCart,
  Store,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getEffectivePrice,
  getPartSellerOffers,
  type EffectivePrice,
  type SellerOffer,
} from "@/lib/api/pricing";
import { ROUTES } from "@/lib/routes";
import { useCartStore } from "@/lib/store/cart-store";
import { getAvailableQuantityError } from "@/lib/seller-shipping";
import { cn } from "@/lib/utils";

interface SellerPurchasePanelProps {
  partId: number;
  name: string;
  imageUrl?: string;
  className?: string;
}

type CompleteOffer = SellerOffer & {
  sellerId: number;
  sellerName: string;
  priceRial: number;
};

export function SellerPurchasePanel({
  partId,
  name,
  imageUrl,
  className,
}: SellerPurchasePanelProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const [offers, setOffers] = useState<CompleteOffer[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [effectivePrice, setEffectivePrice] = useState<EffectivePrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const loadOffers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getPartSellerOffers(partId);
      const available = result.flatMap((offer) =>
        offer.sellerId != null && offer.sellerName && offer.priceRial != null
          ? [{ ...offer, sellerId: offer.sellerId, sellerName: offer.sellerName, priceRial: offer.priceRial }]
          : [],
      );
      setOffers(available);
      setEffectivePrice(null);
      setSelectedSellerId((current) => {
        if (current != null && available.some((offer) => offer.sellerId === current)) return current;
        return null;
      });
    } catch (reason) {
      setOffers([]);
      setSelectedSellerId(null);
      setEffectivePrice(null);
      setError(reason instanceof Error ? reason.message : "دریافت فروشندگان این قطعه انجام نشد.");
    } finally {
      setLoading(false);
    }
  }, [partId]);

  useEffect(() => {
    void loadOffers();
  }, [loadOffers]);

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.sellerId === selectedSellerId) ?? null,
    [offers, selectedSellerId],
  );
  const selectedPrice =
    effectivePrice?.sellerId === selectedSellerId && effectivePrice.finalCalculatedPrice != null
      ? effectivePrice.finalCalculatedPrice
      : selectedOffer?.priceRial;
  const selectedCartQuantity = selectedOffer
    ? cartItems.find(
        (item) => item.partId === partId && item.sellerId === selectedOffer.sellerId,
      )?.quantity ?? 0
    : 0;
  const exceedsAvailability = selectedOffer
    ? getAvailableQuantityError(
        selectedCartQuantity + 1,
        selectedOffer.availableQuantity,
      ) != null
    : false;

  const selectOffer = async (offer: CompleteOffer) => {
    setSelectedSellerId(offer.sellerId);
    setEffectivePrice(null);
    setError("");
    setVerifying(true);
    try {
      const details = await getEffectivePrice(partId, offer.sellerId);
      if (
        (details.partId != null && details.partId !== partId) ||
        (details.sellerId != null && details.sellerId !== offer.sellerId) ||
        details.finalCalculatedPrice == null
      ) {
        throw new Error("قیمت این فروشنده قابل تأیید نیست. فروشنده دیگری را انتخاب کنید.");
      }
      setEffectivePrice(details);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "تأیید قیمت فروشنده انجام نشد.";
      setSelectedSellerId(null);
      setEffectivePrice(null);
      await loadOffers();
      setError(message);
    } finally {
      setVerifying(false);
    }
  };

  const addSelected = (buyNow: boolean) => {
    if (!selectedOffer || selectedPrice == null || exceedsAvailability) return;
    addItem({
      partId,
      sellerId: selectedOffer.sellerId,
      sellerName: selectedOffer.sellerName,
      name,
      displayedUnitPriceRial: selectedPrice,
      ...(imageUrl ? { imageUrl } : {}),
    });
    if (buyNow) {
      router.push(ROUTES.basket);
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-slate-800">
            <Store className="size-4 text-cyan-700" /> انتخاب فروشنده
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">برای خرید، یکی از پیشنهادهای معتبر را انتخاب کنید.</p>
        </div>
        <button
          type="button"
          onClick={() => void loadOffers()}
          disabled={loading}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:text-[#14305A] disabled:opacity-50"
          aria-label="به‌روزرسانی پیشنهاد فروشندگان"
        >
          <RefreshCw className={cn("size-4", loading && "animate-spin")} />
        </button>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs leading-6 text-red-700">{error}</p>}

      {loading ? (
        <div className="flex min-h-28 items-center justify-center rounded-2xl bg-slate-50"><LoaderCircle className="size-6 animate-spin text-[#14305A]" /></div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-5 text-center">
          <p className="text-sm font-bold text-amber-900">این قطعه در حال حاضر فروشنده فعال ندارد.</p>
          <p className="mt-1 text-xs text-amber-700/70">پس از ثبت قیمت جدید، امکان خرید فعال می‌شود.</p>
        </div>
      ) : (
        <div className="space-y-2.5" role="radiogroup" aria-label="فروشندگان موجود">
          {offers.map((offer, index) => {
            const selected = selectedSellerId === offer.sellerId;
            return (
              <button
                key={offer.sellerId}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={verifying}
                onClick={() => void selectOffer(offer)}
                className={cn(
                  "relative flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-right transition",
                  selected ? "border-[#14305A] bg-blue-50/60 ring-2 ring-blue-100" : "border-slate-200 hover:border-cyan-200 hover:bg-slate-50",
                )}
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-sm font-black text-slate-800">
                    {offer.sellerName}
                    {index === 0 && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] text-emerald-700">کمترین قیمت</span>}
                  </span>
                  <span className="mt-1 block text-[10px] text-slate-400">به‌روزرسانی: {formatDate(offer.lastUpdatedAt)}</span>
                </span>
                <span className="shrink-0 text-left">
                  <span className="block text-base font-black text-[#14305A]">{offer.priceRial.toLocaleString("fa-IR")}</span>
                  <span className="text-[10px] text-slate-400">ریال</span>
                </span>
                {selected && <span className="absolute -left-2 -top-2 flex size-6 items-center justify-center rounded-full bg-[#14305A] text-white"><Check className="size-3.5" /></span>}
              </button>
            );
          })}
        </div>
      )}

      {selectedOffer && selectedPrice != null && (
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-end justify-between gap-3">
            <span className="text-xs text-slate-500">قیمت انتخاب‌شده از {selectedOffer.sellerName}</span>
            <strong className="text-xl text-[#14305A]">{selectedPrice.toLocaleString("fa-IR")} <span className="text-[10px] font-medium text-slate-400">ریال</span></strong>
          </div>
          {effectivePrice?.validUntil && <p className="mt-2 text-[10px] text-slate-400">معتبر تا {formatDateTime(effectivePrice.validUntil)}</p>}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" onClick={() => addSelected(false)} disabled={!selectedOffer || selectedPrice == null || verifying || loading || exceedsAvailability} className="h-12 rounded-xl">
          {verifying ? <LoaderCircle className="animate-spin" /> : added ? <Check /> : <ShoppingCart />}
          {added ? "به سبد اضافه شد" : "افزودن به سبد"}
        </Button>
        <Button type="button" variant="outline" onClick={() => addSelected(true)} disabled={!selectedOffer || selectedPrice == null || verifying || loading || exceedsAvailability} className="h-12 rounded-xl border-[#14305A] text-[#14305A]">
          <Zap /> خرید فوری
        </Button>
      </div>

      {!selectedOffer && offers.length > 0 && <p className="text-center text-[11px] font-medium text-amber-700">ابتدا فروشنده را انتخاب کنید.</p>}

    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "نامشخص";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date);
}

function formatDateTime(value?: string) {
  if (!value) return "نامشخص";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
