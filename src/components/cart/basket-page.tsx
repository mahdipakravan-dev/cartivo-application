"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/api/orders";
import { getAccessToken } from "@/lib/api/auth-token";
import { getPartSellerOffers } from "@/lib/api/pricing";
import { ROUTES } from "@/lib/routes";
import { cartLineKey, useCartStore } from "@/lib/store/cart-store";
import { getAvailableQuantityError } from "@/lib/seller-shipping";
import { CheckoutStep } from "@/components/cart/checkout-step";

export function BasketPage() {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItemPrice = useCartStore((state) => state.updateItemPrice);
  const clear = useCartStore((state) => state.clear);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [awaitingAuthentication, setAwaitingAuthentication] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [refreshingPrices, setRefreshingPrices] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [invalidLines, setInvalidLines] = useState<Record<string, string>>({});
  const [availableQuantities, setAvailableQuantities] = useState<
    Record<string, number>
  >({});
  const lineSignature = items
    .map((item) => cartLineKey(item.partId, item.sellerId))
    .join(",");
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !lineSignature) return;
    let active = true;
    const currentItems = useCartStore.getState().items;
    setRefreshingPrices(true);
    setPriceError("");
    Promise.allSettled(
      currentItems.map((item) => getPartSellerOffers(item.partId)),
    )
      .then((results) => {
        if (!active) return;
        const nextInvalidLines: Record<string, string> = {};
        const nextAvailableQuantities: Record<string, number> = {};
        results.forEach((result, index) => {
          const item = currentItems[index];
          if (!item) return;
          const key = cartLineKey(item.partId, item.sellerId);
          if (result.status === "rejected") {
            nextInvalidLines[key] =
              result.reason instanceof Error
                ? result.reason.message
                : "بررسی پیشنهاد فروشنده انجام نشد.";
            return;
          }
          const offer = result.value.find(
            (candidate) => candidate.sellerId === item.sellerId,
          );
          if (offer?.priceRial == null) {
            nextInvalidLines[key] =
              "این فروشنده دیگر برای این قطعه پیشنهاد فعالی ندارد.";
            return;
          }
          if (offer.availableQuantity != null) {
            nextAvailableQuantities[key] = offer.availableQuantity;
          }
          updateItemPrice(item.partId, item.sellerId, offer.priceRial);
        });
        setInvalidLines(nextInvalidLines);
        setAvailableQuantities(nextAvailableQuantities);
        const hasQuantityError = currentItems.some((item) =>
          getAvailableQuantityError(
            item.quantity,
            nextAvailableQuantities[cartLineKey(item.partId, item.sellerId)],
          ),
        );
        if (Object.keys(nextInvalidLines).length > 0 || hasQuantityError) {
          setPriceError(
            "برخی پیشنهادهای سبد خرید تغییر کرده یا دیگر در دسترس نیستند.",
          );
        }
      })
      .catch((requestError) => {
        if (!active) return;
        setPriceError(
          requestError instanceof Error
            ? requestError.message
            : "به‌روزرسانی قیمت فروشندگان انجام نشد.",
        );
      })
      .finally(() => active && setRefreshingPrices(false));
    return () => {
      active = false;
    };
  }, [mounted, lineSignature, updateItemPrice]);

  useEffect(() => {
    if (!awaitingAuthentication) return;
    const continueAfterLogin = () => {
      if (!getAccessToken()) return;
      setAwaitingAuthentication(false);
      setStep("checkout");
      window.dispatchEvent(new Event("cartivo-close-auth"));
    };
    window.addEventListener("cartivo-auth-change", continueAfterLogin);
    return () =>
      window.removeEventListener("cartivo-auth-change", continueAfterLogin);
  }, [awaitingAuthentication]);

  const total = items.reduce(
    (sum, item) => sum + item.displayedUnitPriceRial * item.quantity,
    0,
  );
  const hasInvalidLines =
    Object.keys(invalidLines).length > 0 ||
    items.some((item) =>
      getAvailableQuantityError(
        item.quantity,
        availableQuantities[cartLineKey(item.partId, item.sellerId)],
      ),
    );

  const goToCheckout = () => {
    if (hasInvalidLines) {
      setPriceError(
        "برای ادامه، فروشنده نامعتبر را حذف کنید یا در صفحه قطعه فروشنده دیگری انتخاب کنید.",
      );
      return;
    }
    if (!getAccessToken()) {
      setAwaitingAuthentication(true);
      window.sessionStorage.setItem(
        "cartivo_post_login_action",
        "basket-checkout",
      );
      window.dispatchEvent(new Event("cartivo-open-auth"));
      return;
    }
    setStep("checkout");
  };

  const completeOrder = (result: Order) => {
    setOrder(result);
    clear();
  };

  if (!mounted) {
    return (
      <main className="min-h-[70vh] bg-background pt-28">
        <div className="container-cartivo px-4">
          <div className="h-64 animate-pulse rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  if (order) {
    return (
      <main className="flex min-h-[75vh] items-center bg-background px-4 pt-20">
        <div className="mx-auto w-full max-w-lg rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-border/50 sm:p-12">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-10" />
          </div>
          <h1 className="mt-6 text-2xl font-black text-dark">
            سفارش شما ثبت شد
          </h1>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            سفارش با موفقیت دریافت شد و در انتظار بررسی است.
          </p>
          {order.id != null && (
            <p className="mt-4 rounded-xl bg-background py-3 text-sm text-text-secondary">
              شماره سفارش:{" "}
              <b className="text-dark">{order.id.toLocaleString("fa-IR")}</b>
            </p>
          )}
          {order.items?.length ? (
            <div className="mt-4 space-y-2 text-right">
              {order.items.map((item, index) => (
                <div
                  key={`${item.partId}-${item.sellerId}-${index}`}
                  className="rounded-xl  p-3"
                >
                  <p className="text-sm font-bold text-text-muted">
                    {item.partName || "قطعه خودرو"}
                  </p>
                  <p className="mt-1 text-xs text-accent">
                    {item.sellerName || `فروشنده #${item.sellerId ?? "—"}`}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {item.quantity?.toLocaleString("fa-IR") ?? "—"} ×{" "}
                    {formatServerPrice(item.unitPriceRial)} ={" "}
                    {formatServerPrice(item.lineTotalRial)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          {(order.subtotalAmountRial != null ||
            order.totalAmountRial != null) && (
            <div className="mt-4 rounded-2xl bg-background p-4 text-sm">
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-text-secondary">جمع کالاها</dt>
                  <dd>{formatServerPrice(order.subtotalAmountRial)}</dd>
                </div>
                {order.voucher && (
                  <div className="flex justify-between text-emerald-700">
                    <dt>کد تخفیف</dt>
                    <dd>
                      {order.voucher.code || "—"} (
                      {formatPercent(order.voucher.percent)})
                    </dd>
                  </div>
                )}
                {order.discountAmountRial != null &&
                  order.discountAmountRial > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <dt>مبلغ تخفیف</dt>
                      <dd>− {formatServerPrice(order.discountAmountRial)}</dd>
                    </div>
                  )}
                <div className="flex justify-between border-t border-border pt-3 text-base font-black text-[var(--primary)]">
                  <dt>مبلغ نهایی</dt>
                  <dd>{formatServerPrice(order.totalAmountRial)}</dd>
                </div>
              </dl>
            </div>
          )}
          <Button
            render={<Link href={ROUTES.parts} />}
            className="mt-6 h-11 w-full rounded-xl"
          >
            ادامه خرید
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-background pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold text-accent">خرید امن و سریع</p>
            <h1 className="mt-2 text-2xl font-black text-dark sm:text-3xl">
              {step === "cart" ? "سبد خرید شما" : "اطلاعات ارسال و پرداخت"}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-white">
              ۱
            </span>
            <span
              className={
                step === "cart"
                  ? "text-[var(--primary)]"
                  : "text-text-secondary"
              }
            >
              سبد خرید
            </span>
            <span className="h-px w-8 bg-border/20" />
            <span
              className={
                step === "checkout"
                  ? "flex size-7 items-center justify-center rounded-full bg-primary text-white"
                  : "flex size-7 items-center justify-center rounded-full bg-border/20 text-text-secondary"
              }
            >
              ۲
            </span>
            <span
              className={
                step === "checkout"
                  ? "text-[var(--primary)]"
                  : "text-text-secondary"
              }
            >
              ارسال و پرداخت
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-border bg-white px-5 py-16 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-background">
              <ShoppingBag className="size-9 text-text-secondary" />
            </div>
            <h2 className="mt-5 text-lg font-extrabold text-dark">
              سبد خرید شما خالی است
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              می‌توانید از میان قطعات موجود، محصول مورد نظرتان را انتخاب کنید.
            </p>
            <Button
              render={<Link href={ROUTES.parts} />}
              className="mt-6 h-11 rounded-xl px-6"
            >
              <ArrowRight /> مشاهده قطعات
            </Button>
          </section>
        ) : step === "checkout" ? (
          <CheckoutStep
            items={items}
            onBack={() => setStep("cart")}
            onSuccess={completeOrder}
          />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-3">
              {priceError && (
                <p
                  role="alert"
                  className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800"
                >
                  {priceError}
                </p>
              )}
              {items.map((item) => {
                const key = cartLineKey(item.partId, item.sellerId);
                const availableQuantity = availableQuantities[key];
                const lineError =
                  invalidLines[key] ??
                  getAvailableQuantityError(item.quantity, availableQuantity);
                return (
                  <article
                    key={key}
                    className="flex flex-col gap-4 rounded-2xl  bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
                  >
                    <Link
                      href={ROUTES.partDetail(String(item.partId))}
                      className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-background to-accent"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="size-full object-contain p-2"
                        />
                      ) : (
                        <Package className="size-8 text-[var(--primary)]" />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={ROUTES.partDetail(String(item.partId))}
                        className="font-extrabold leading-7 text-dark hover:text-accent"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs font-bold text-accent">
                        فروشنده: {item.sellerName}
                      </p>
                      <p className="mt-1 text-sm font-bold text-[var(--primary)]">
                        {item.displayedUnitPriceRial.toLocaleString("fa-IR")}{" "}
                        <span className="text-[10px] font-normal text-text-secondary">
                          ریال
                        </span>
                      </p>
                      {lineError && (
                        <p className="mt-2 text-xs leading-5 text-red-600">
                          {lineError}{" "}
                          <Link
                            href={ROUTES.partDetail(String(item.partId))}
                            className="font-bold underline"
                          >
                            انتخاب فروشنده جدید
                          </Link>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="flex items-center rounded-xl  p-1">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              item.partId,
                              item.sellerId,
                              item.quantity + 1,
                            )
                          }
                          disabled={
                            availableQuantity != null &&
                            item.quantity >= availableQuantity
                          }
                          className="flex size-8 items-center justify-center rounded-lg text-text-muted hover:bg-border/20 disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label="افزایش تعداد"
                        >
                          <Plus className="size-4" />
                        </button>
                        <span className="w-9 text-center text-sm font-bold">
                          {item.quantity.toLocaleString("fa-IR")}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              item.partId,
                              item.sellerId,
                              item.quantity - 1,
                            )
                          }
                          className="flex size-8 items-center justify-center rounded-lg text-text-muted hover:bg-border/20"
                          aria-label="کاهش تعداد"
                        >
                          <Minus className="size-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.partId, item.sellerId)}
                        className="flex size-9 items-center justify-center rounded-xl text-text-secondary hover:bg-red-50 hover:text-red-600"
                        aria-label={`حذف ${item.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="rounded-[1.75rem]  bg-white p-6 shadow-lg shadow-border/40 lg:sticky lg:top-24">
              <h2 className="font-black text-dark">خلاصه سفارش</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-secondary">قیمت کالاها</dt>
                  <dd>{total.toLocaleString("fa-IR")} ریال</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">هزینه ارسال</dt>
                  <dd className="text-xs text-text-secondary">
                    در مرحله بعد محاسبه می‌شود
                  </dd>
                </div>
              </dl>
              <div className="my-5 h-px bg-border/20" />
              <div className="flex items-end justify-between">
                <span className="text-sm font-bold text-text-muted">
                  مبلغ قابل پرداخت
                </span>
                <b className="text-xl text-[var(--primary)]">
                  {total.toLocaleString("fa-IR")}{" "}
                  <span className="text-[10px] font-normal text-text-secondary">
                    ریال
                  </span>
                </b>
              </div>
              <Button
                type="button"
                onClick={goToCheckout}
                disabled={refreshingPrices || hasInvalidLines}
                className="mt-6 h-12 w-full rounded-xl text-base shadow-lg shadow-primary/15"
              >
                {refreshingPrices ? (
                  <>
                    <LoaderCircle className="animate-spin" /> به‌روزرسانی
                    قیمت‌ها
                  </>
                ) : (
                  "مرحله بعد"
                )}
              </Button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-text-secondary">
                <ShieldCheck className="size-4 text-emerald-600" /> پرداخت و
                اطلاعات شما امن است
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function formatServerPrice(value?: number) {
  return value == null ? "—" : `${value.toLocaleString("fa-IR")} ریال`;
}

function formatPercent(value?: number) {
  return value == null
    ? "—"
    : `${value.toLocaleString("fa-IR", { maximumFractionDigits: 2 })}٪`;
}
