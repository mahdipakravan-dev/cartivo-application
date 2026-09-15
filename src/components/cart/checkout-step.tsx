"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowRight, Check, CreditCard, LoaderCircle, MapPin, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAddress, getAddresses, getPaymentMethods, type CustomerAddress, type CustomerAddressRequest, type PaymentMethod } from "@/lib/api/checkout";
import { createOrder, findMatchingRecentOrder, getMyOrders, type Order, type OrderRequest } from "@/lib/api/orders";
import { createPriceLock, getPartSellerOffers, validatePriceLock, type PriceLock } from "@/lib/api/pricing";
import { clearAccessToken, getAccessToken } from "@/lib/api/auth-token";
import { isApiError } from "@/lib/api/fetch";
import { ROUTES } from "@/lib/routes";
import { cartLineKey, type CartItem, useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

type AddressForm = CustomerAddressRequest;

interface CheckoutStepProps {
  items: CartItem[];
  onBack: () => void;
  onSuccess: (order: Order) => void;
}

const toEnglishDigits = (value: string) => value
  .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
  .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

function normalizePhone(value: string) {
  const digits = toEnglishDigits(value).replace(/\D/g, "");
  if (/^09\d{9}$/.test(digits)) return `+98${digits.slice(1)}`;
  if (/^989\d{9}$/.test(digits)) return `+${digits}`;
  return value;
}

export function CheckoutStep({ items, onBack, onSuccess }: CheckoutStepProps) {
  const [checkoutItems] = useState(() => items.map((item) => ({ ...item })));
  const updateItemPrice = useCartStore((state) => state.updateItemPrice);
  const setPriceLock = useCartStore((state) => state.setPriceLock);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submissionInFlight = useRef(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [priceLocks, setPriceLocks] = useState<Record<string, PriceLock>>({});
  const [sellerPrices, setSellerPrices] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      checkoutItems.map((item) => [cartLineKey(item.partId, item.sellerId), item.displayedUnitPriceRial]),
    ),
  );
  const [invalidLines, setInvalidLines] = useState<Record<string, string>>({});
  const [lockNotice, setLockNotice] = useState("");
  const [error, setError] = useState("");
  const form = useForm<AddressForm>({
    defaultValues: { city: "", county: "", fullAddress: "", plaque: "", recipientPhoneNumber: "", description: "" },
  });
  const lockedTotal = checkoutItems.reduce((sum, item) => {
    const key = cartLineKey(item.partId, item.sellerId);
    return sum + (priceLocks[key]?.lockedPrice ?? sellerPrices[key] ?? item.displayedUnitPriceRial) * item.quantity;
  }, 0);
  const hasInvalidLines = Object.keys(invalidLines).length > 0;
  const allPricesLocked = checkoutItems.every((item) =>
    isUsablePriceLock(priceLocks[cartLineKey(item.partId, item.sellerId)], item),
  );

  const requestAuthentication = useCallback(() => {
    clearAccessToken();
    window.dispatchEvent(new Event("cartivo-open-auth"));
  }, []);

  const loadCheckout = useCallback(async () => {
    setLoading(true);
    setError("");
    setLockNotice("");
    const [addressResult, paymentResult, offerResults, lockResults] = await Promise.all([
      getAddresses().then((value) => ({ value })).catch((reason: unknown) => ({ reason })),
      getPaymentMethods().then((value) => ({ value })).catch((reason: unknown) => ({ reason })),
      Promise.allSettled(checkoutItems.map((item) => getPartSellerOffers(item.partId))),
      Promise.allSettled(checkoutItems.map((item) => createPriceLock(item.partId, item.sellerId))),
    ]);

    const errors: string[] = [];
    if ("value" in addressResult) {
      setAddresses(addressResult.value);
      setAddressId((current) => addressResult.value.some((address) => address.id === current) ? current : addressResult.value.find((address) => address.id != null)?.id ?? null);
      setCreatingAddress(addressResult.value.length === 0);
    } else {
      if (isApiError(addressResult.reason, 401)) requestAuthentication();
      errors.push(errorMessage(addressResult.reason, "دریافت آدرس‌ها با خطا مواجه شد."));
    }

    if ("value" in paymentResult) {
      setPaymentMethods(paymentResult.value);
      setPaymentMethodId((current) => paymentResult.value.some((method) => method.id === current) ? current : paymentResult.value.find((method) => method.id != null)?.id ?? null);
    } else {
      errors.push(errorMessage(paymentResult.reason, "دریافت روش‌های پرداخت با خطا مواجه شد."));
    }

    const nextSellerPrices: Record<string, number> = {};
    const nextInvalidLines = offerResults.reduce<Record<string, string>>((result, offerResult, index) => {
      const item = checkoutItems[index];
      if (!item) return result;
      const key = cartLineKey(item.partId, item.sellerId);
      if (offerResult.status === "rejected") {
        result[key] = errorMessage(offerResult.reason, "بررسی پیشنهاد فروشنده انجام نشد.");
      } else {
        const offer = offerResult.value.find((candidate) => candidate.sellerId === item.sellerId);
        if (offer?.priceRial == null) result[key] = "پیشنهاد این فروشنده دیگر فعال نیست.";
        else {
          nextSellerPrices[key] = offer.priceRial;
          updateItemPrice(item.partId, item.sellerId, offer.priceRial);
        }
      }
      return result;
    }, {});
    setSellerPrices((current) => ({ ...current, ...nextSellerPrices }));
    setInvalidLines(nextInvalidLines);

    const { locks, failures, authenticationRequired } = collectPriceLocks(checkoutItems, lockResults);
    setPriceLocks(locks);
    Object.entries(locks).forEach(([key, lock]) => {
      const item = checkoutItems.find((candidate) => cartLineKey(candidate.partId, candidate.sellerId) === key);
      if (!item || !isUsablePriceLock(lock, item)) return;
      updateItemPrice(item.partId, item.sellerId, lock.lockedPrice);
      setPriceLock(item.partId, item.sellerId, lock.lockToken);
    });
    if (authenticationRequired) requestAuthentication();
    if (failures.length > 0) setLockNotice("قفل قیمت برای برخی اقلام ایجاد نشد؛ هنگام ثبت سفارش قیمت جاری فروشنده استفاده می‌شود.");
    if (Object.keys(nextInvalidLines).length > 0) errors.push("برای ادامه باید فروشنده اقلام نامعتبر را دوباره انتخاب کنید.");
    setError(errors.join(" "));
    setLoading(false);
  }, [checkoutItems, requestAuthentication, setPriceLock, updateItemPrice]);

  useEffect(() => {
    void loadCheckout();
  }, [loadCheckout]);

  useEffect(() => {
    const continueAfterLogin = () => {
      if (getAccessToken()) void loadCheckout();
    };
    window.addEventListener("cartivo-auth-change", continueAfterLogin);
    return () => window.removeEventListener("cartivo-auth-change", continueAfterLogin);
  }, [loadCheckout]);

  const saveAddress = async (values: AddressForm) => {
    setError("");
    try {
      const result = await createAddress({
        city: values.city.trim(),
        county: values.county.trim(),
        fullAddress: values.fullAddress.trim(),
        plaque: toEnglishDigits(values.plaque.trim()),
        recipientPhoneNumber: normalizePhone(values.recipientPhoneNumber),
        ...(values.description?.trim() ? { description: values.description.trim() } : {}),
      });
      setAddresses((current) => [...current, result]);
      setAddressId(result.id ?? null);
      setCreatingAddress(false);
      form.reset();
    } catch (requestError) {
      if (isApiError(requestError, 401)) requestAuthentication();
      setError(requestError instanceof Error ? requestError.message : "ثبت آدرس با خطا مواجه شد.");
    }
  };

  const finalize = async () => {
    if (submissionInFlight.current) return;
    if (hasInvalidLines) {
      setError("برای ادامه باید فروشنده اقلام نامعتبر را دوباره انتخاب کنید.");
      return;
    }
    if (addressId == null || paymentMethodId == null) {
      setError("آدرس تحویل و روش پرداخت را انتخاب کنید.");
      return;
    }
    submissionInFlight.current = true;
    setSubmitting(true);
    setError("");
    const submittedAt = Date.now();
    let orderRequest: OrderRequest | null = null;
    try {
      const { locks, failures } = await validateOrRenewLocks(checkoutItems, priceLocks);
      setPriceLocks(locks);
      if (failures.length > 0) setLockNotice("برخی قفل‌های قیمت تمدید نشدند؛ سفارش با قیمت جاری فروشنده ثبت می‌شود.");
      const normalizedVoucherCode = voucherCode.trim();
      orderRequest = {
        addressId,
        paymentMethodId,
        items: checkoutItems.map((item) => {
          const lock = locks[cartLineKey(item.partId, item.sellerId)];
          return {
            partId: item.partId,
            sellerId: item.sellerId,
            quantity: item.quantity,
            ...(isUsablePriceLock(lock, item) ? { priceLockToken: lock.lockToken } : {}),
          };
        }),
        ...(normalizedVoucherCode ? { voucherCode: normalizedVoucherCode } : {}),
      };
      const order = await createOrder(orderRequest);
      onSuccess(order);
    } catch (requestError) {
      if (isApiError(requestError, 401)) requestAuthentication();
      if (isApiError(requestError, 400, 404)) {
        await refreshInvalidLines(checkoutItems, setInvalidLines);
        if (requestError.status === 404) {
          const [nextAddresses, nextPayments] = await Promise.allSettled([getAddresses(), getPaymentMethods()]);
          if (nextAddresses.status === "fulfilled") {
            setAddresses(nextAddresses.value);
            if (!nextAddresses.value.some((address) => address.id === addressId)) setAddressId(null);
          }
          if (nextPayments.status === "fulfilled") {
            setPaymentMethods(nextPayments.value);
            if (!nextPayments.value.some((method) => method.id === paymentMethodId)) setPaymentMethodId(null);
          }
        }
      }
      if (!isApiError(requestError) && orderRequest) {
        try {
          const recentOrders = await getMyOrders({ page: 0, size: 20, sortBy: "createdAt", sortDir: "DESC" });
          const matchingOrder = findMatchingRecentOrder(recentOrders.content ?? [], orderRequest, submittedAt);
          if (matchingOrder) {
            onSuccess(matchingOrder);
            return;
          }
          setError("پاسخ ثبت سفارش دریافت نشد، اما سفارش مشابهی در تاریخچه پیدا نشد. می‌توانید دوباره تلاش کنید.");
        } catch {
          setError("ارتباط هنگام ثبت سفارش قطع شد و بررسی تاریخچه سفارش‌ها نیز ممکن نبود. پیش از تلاش دوباره، سفارش‌های حساب خود را بررسی کنید.");
        }
      } else {
        setError(requestError instanceof Error ? requestError.message : "ثبت سفارش با خطا مواجه شد.");
      }
    } finally {
      submissionInFlight.current = false;
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-80 items-center justify-center rounded-3xl bg-white"><LoaderCircle className="size-7 animate-spin text-[#14305A]" /></div>;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 sm:p-7">
          <h2 className="font-black text-slate-900">اقلام و فروشندگان انتخاب‌شده</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {checkoutItems.map((item) => {
              const key = cartLineKey(item.partId, item.sellerId);
              const lock = priceLocks[key];
              return <div key={key} className="flex flex-col justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"><div><p className="text-sm font-bold text-slate-700">{item.name}</p><p className="mt-1 text-xs text-cyan-700">{item.sellerName}</p>{invalidLines[key] && <p className="mt-2 text-xs text-red-600">{invalidLines[key]} <Link href={ROUTES.partDetail(String(item.partId))} className="font-bold underline">انتخاب مجدد فروشنده</Link></p>}</div><div className="text-left"><p className="text-sm font-black text-[#14305A]">{(lock?.lockedPrice ?? sellerPrices[key] ?? item.displayedUnitPriceRial).toLocaleString("fa-IR")} ریال</p><p className="mt-1 text-[10px] text-slate-400">{isUsablePriceLock(lock, item) ? `قفل‌شده تا ${formatDateTime(lock.expiresAt)}` : "قیمت جاری فروشنده"}</p></div></div>;
            })}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#14305A]"><MapPin className="size-5" /></span><div><h2 className="font-black text-slate-900">آدرس تحویل</h2><p className="mt-1 text-xs text-slate-400">سفارش به این آدرس ارسال می‌شود</p></div></div>{addresses.length > 0 && <Button type="button" variant="ghost" size="sm" onClick={() => setCreatingAddress((value) => !value)}><Plus /> آدرس جدید</Button>}</div>

          {!creatingAddress && addresses.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {addresses.map((address) => address.id != null && (
                <button key={address.id} type="button" onClick={() => setAddressId(address.id!)} className={cn("relative rounded-2xl border p-4 text-right transition", addressId === address.id ? "border-[#14305A] bg-blue-50/50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300")}>
                  {addressId === address.id && <span className="absolute left-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#14305A] text-white"><Check className="size-3" /></span>}
                  <p className="font-bold text-slate-800">{address.city}، {address.county}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">{address.fullAddress}، پلاک {address.plaque}</p>
                  <p dir="ltr" className="mt-2 text-right text-xs text-slate-400">{address.recipientPhoneNumber}</p>
                </button>
              ))}
            </div>
          )}

          {creatingAddress && (
            <form onSubmit={form.handleSubmit(saveAddress)} className="mt-5 grid gap-4 sm:grid-cols-2" noValidate>
              <AddressField label="شهر" name="city" form={form} />
              <AddressField label="شهرستان" name="county" form={form} />
              <div className="sm:col-span-2"><AddressField label="نشانی کامل" name="fullAddress" form={form} /></div>
              <AddressField label="پلاک" name="plaque" form={form} />
              <AddressField label="شماره موبایل گیرنده" name="recipientPhoneNumber" form={form} placeholder="09121234567" phone />
              <div className="sm:col-span-2"><AddressField label="توضیحات (اختیاری)" name="description" form={form} required={false} /></div>
              <div className="sm:col-span-2 flex gap-2"><Button type="submit" disabled={form.formState.isSubmitting} className="h-10 rounded-xl">{form.formState.isSubmitting && <LoaderCircle className="animate-spin" />} ذخیره و انتخاب آدرس</Button>{addresses.length > 0 && <Button type="button" variant="ghost" onClick={() => setCreatingAddress(false)}>انصراف</Button>}</div>
            </form>
          )}
        </section>

        <section className="rounded-[1.75rem] border border-slate-100 bg-white p-5 sm:p-7">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><CreditCard className="size-5" /></span><div><h2 className="font-black text-slate-900">روش پرداخت</h2><p className="mt-1 text-xs text-slate-400">یکی از روش‌های فعال را انتخاب کنید</p></div></div>
          {paymentMethods.length === 0 ? <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">در حال حاضر روش پرداخت فعالی وجود ندارد.</p> : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((method) => method.id != null && (
                <button key={method.id} type="button" onClick={() => setPaymentMethodId(method.id!)} className={cn("flex items-center gap-3 rounded-2xl border p-4 text-right transition", paymentMethodId === method.id ? "border-[#14305A] bg-blue-50/50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300")}>
                  <span className={cn("flex size-5 items-center justify-center rounded-full border", paymentMethodId === method.id ? "border-[#14305A] bg-[#14305A] text-white" : "border-slate-300")}>{paymentMethodId === method.id && <Check className="size-3" />}</span>
                  <div><p className="text-sm font-bold text-slate-800">{method.persianName || method.englishName || "روش پرداخت"}</p>{method.persianName && method.englishName && <p className="mt-1 text-[10px] text-slate-400">{method.englishName}</p>}</div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/40 lg:sticky lg:top-24">
        <button type="button" onClick={onBack} className="mb-5 flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#14305A]"><ArrowRight className="size-4" /> بازگشت به سبد خرید</button>
        <h2 className="font-black text-slate-900">خلاصه نهایی سفارش</h2>
        <dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><dt className="text-slate-500">تعداد کالا</dt><dd>{checkoutItems.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("fa-IR")}</dd></div><div className="flex justify-between"><dt className="text-slate-500">قیمت فروشندگان</dt><dd>{lockedTotal.toLocaleString("fa-IR")} ریال</dd></div></dl>
        <div className="mt-5 border-t border-slate-100 pt-5">
          <label htmlFor="voucher-code" className="text-xs font-bold text-slate-600">کد تخفیف (اختیاری)</label>
          <Input
            id="voucher-code"
            value={voucherCode}
            onChange={(event) => setVoucherCode(event.target.value)}
            onBlur={() => setVoucherCode((value) => value.trim())}
            disabled={submitting}
            dir="ltr"
            autoComplete="off"
            spellCheck={false}
            className="mt-2 h-11 rounded-xl text-left uppercase"
            placeholder="SAVE10"
          />
          <p className="mt-2 text-[11px] leading-5 text-slate-400">اعتبار کد هنگام ثبت نهایی سفارش توسط سرور بررسی می‌شود.</p>
        </div>
        <div className="my-5 h-px bg-slate-100" />
        <div className="flex items-end justify-between"><span className="text-sm font-bold text-slate-600">{allPricesLocked ? "مبلغ قفل‌شده سفارش" : "مبلغ برآوردی سفارش"}</span><b className="text-xl text-[#14305A]">{lockedTotal.toLocaleString("fa-IR")} <span className="text-[10px] font-normal text-slate-400">ریال</span></b></div>
        {lockNotice && <p role="status" className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">{lockNotice}</p>}
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">{error}</p>}
        <Button type="button" onClick={finalize} disabled={submitting || hasInvalidLines || addressId == null || paymentMethodId == null} className="mt-6 h-12 w-full rounded-xl text-base shadow-lg shadow-blue-950/15">{submitting ? <LoaderCircle className="animate-spin" /> : "ثبت نهایی سفارش"}</Button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400"><ShieldCheck className="size-4 text-emerald-600" /> اطلاعات سفارش پیش از ثبت بررسی می‌شود</p>
      </aside>
    </div>
  );
}

function isUsablePriceLock(lock: PriceLock | undefined, item: CartItem): lock is PriceLock & { lockToken: string; lockedPrice: number } {
  if (!lock?.lockToken || lock.lockedPrice == null || lock.valid === false) return false;
  if (lock.partId !== item.partId || lock.sellerId !== item.sellerId) return false;
  if (lock.expiresAt) {
    const expiresAt = new Date(lock.expiresAt).getTime();
    if (!Number.isNaN(expiresAt) && expiresAt <= Date.now()) return false;
  }
  return true;
}

function errorMessage(reason: unknown, fallback: string) {
  return reason instanceof Error ? reason.message : fallback;
}

function collectPriceLocks(items: CartItem[], results: PromiseSettledResult<PriceLock>[]) {
  const locks: Record<string, PriceLock> = {};
  const failures: unknown[] = [];
  let authenticationRequired = false;
  results.forEach((result, index) => {
    const item = items[index];
    if (!item) return;
    if (result.status === "fulfilled" && isUsablePriceLock(result.value, item)) {
      locks[cartLineKey(item.partId, item.sellerId)] = result.value;
      return;
    }
    const reason = result.status === "rejected" ? result.reason : new Error(`قفل قیمت «${item.name}» معتبر نیست.`);
    if (isApiError(reason, 401)) authenticationRequired = true;
    failures.push(reason);
  });
  return { locks, failures, authenticationRequired };
}

async function validateOrRenewLocks(items: CartItem[], currentLocks: Record<string, PriceLock>) {
  const results = await Promise.allSettled(items.map(async (item) => {
    const current = currentLocks[cartLineKey(item.partId, item.sellerId)];
    if (isUsablePriceLock(current, item)) {
      try {
        const validated = await validatePriceLock(current.lockToken);
        if (isUsablePriceLock(validated, item)) return validated;
      } catch (reason) {
        if (isApiError(reason, 401, 403)) throw reason;
        // The lock may have expired while the customer entered checkout details.
      }
    }
    return createPriceLock(item.partId, item.sellerId);
  }));
  const collected = collectPriceLocks(items, results);
  const authenticationError = results.find((result) => result.status === "rejected" && isApiError(result.reason, 401, 403));
  if (authenticationError?.status === "rejected") throw authenticationError.reason;
  return collected;
}

async function refreshInvalidLines(items: CartItem[], setInvalidLines: (lines: Record<string, string>) => void) {
  const results = await Promise.allSettled(items.map((item) => getPartSellerOffers(item.partId)));
  const invalid = results.reduce<Record<string, string>>((result, offerResult, index) => {
    const item = items[index];
    if (!item) return result;
    const key = cartLineKey(item.partId, item.sellerId);
    if (offerResult.status === "rejected") result[key] = errorMessage(offerResult.reason, "پیشنهاد فروشنده قابل بررسی نیست.");
    else if (!offerResult.value.some((offer) => offer.sellerId === item.sellerId && offer.priceRial != null)) result[key] = "این پیشنهاد منقضی یا حذف شده است.";
    return result;
  }, {});
  setInvalidLines(invalid);
}

function formatDateTime(value?: string) {
  if (!value) return "نامشخص";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function AddressField({ label, name, form, placeholder, required = true, phone = false }: { label: string; name: keyof AddressForm; form: ReturnType<typeof useForm<AddressForm>>; placeholder?: string; required?: boolean; phone?: boolean }) {
  const error = form.formState.errors[name]?.message;
  return <label className="block text-xs font-bold text-slate-600">{label}<Input placeholder={placeholder} inputMode={phone ? "tel" : "text"} dir={phone ? "ltr" : "rtl"} aria-invalid={!!error} className="mt-1.5 h-11 rounded-xl font-normal" {...form.register(name, { required: required ? `${label} را وارد کنید.` : false, ...(phone ? { validate: (value) => /^(?:09\d{9}|\+989\d{9})$/.test(toEnglishDigits(value || "").replace(/\s/g, "")) || "شماره موبایل معتبر نیست." } : {}) })} />{error && <span className="mt-1.5 block text-[11px] text-red-600">{String(error)}</span>}</label>;
}
