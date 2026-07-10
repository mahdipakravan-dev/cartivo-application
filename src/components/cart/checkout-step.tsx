"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Check, CreditCard, LoaderCircle, MapPin, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAddress, getAddresses, getPaymentMethods, type CustomerAddress, type CustomerAddressRequest, type PaymentMethod } from "@/lib/api/checkout";
import { createOrder, type Order } from "@/lib/api/orders";
import type { CartItem } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

type AddressForm = CustomerAddressRequest;

interface CheckoutStepProps {
  items: CartItem[];
  total: number;
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

export function CheckoutStep({ items, total, onBack, onSuccess }: CheckoutStepProps) {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<AddressForm>({
    defaultValues: { city: "", county: "", fullAddress: "", plaque: "", recipientPhoneNumber: "", description: "" },
  });

  useEffect(() => {
    let active = true;
    Promise.all([getAddresses(), getPaymentMethods()])
      .then(([addressResult, paymentResult]) => {
        if (!active) return;
        setAddresses(addressResult);
        setPaymentMethods(paymentResult);
        setAddressId(addressResult.find((address) => address.id != null)?.id ?? null);
        setPaymentMethodId(paymentResult.find((method) => method.id != null)?.id ?? null);
        setCreatingAddress(addressResult.length === 0);
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "دریافت اطلاعات ارسال با خطا مواجه شد."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

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
      setError(requestError instanceof Error ? requestError.message : "ثبت آدرس با خطا مواجه شد.");
    }
  };

  const finalize = async () => {
    if (addressId == null || paymentMethodId == null) {
      setError("آدرس تحویل و روش پرداخت را انتخاب کنید.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const order = await createOrder({
        addressId,
        paymentMethodId,
        items: items.map((item) => ({ partId: item.partId, quantity: item.quantity })),
      });
      onSuccess(order);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "ثبت سفارش با خطا مواجه شد.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-80 items-center justify-center rounded-3xl bg-white"><LoaderCircle className="size-7 animate-spin text-[#14305A]" /></div>;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
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
        <dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between"><dt className="text-slate-500">تعداد کالا</dt><dd>{items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("fa-IR")}</dd></div><div className="flex justify-between"><dt className="text-slate-500">قیمت کالاها</dt><dd>{total.toLocaleString("fa-IR")} ریال</dd></div></dl>
        <div className="my-5 h-px bg-slate-100" />
        <div className="flex items-end justify-between"><span className="text-sm font-bold text-slate-600">مبلغ سفارش</span><b className="text-xl text-[#14305A]">{total.toLocaleString("fa-IR")} <span className="text-[10px] font-normal text-slate-400">ریال</span></b></div>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">{error}</p>}
        <Button type="button" onClick={finalize} disabled={submitting || addressId == null || paymentMethodId == null} className="mt-6 h-12 w-full rounded-xl text-base shadow-lg shadow-blue-950/15">{submitting ? <LoaderCircle className="animate-spin" /> : "ثبت نهایی سفارش"}</Button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400"><ShieldCheck className="size-4 text-emerald-600" /> اطلاعات سفارش پیش از ثبت بررسی می‌شود</p>
      </aside>
    </div>
  );
}

function AddressField({ label, name, form, placeholder, required = true, phone = false }: { label: string; name: keyof AddressForm; form: ReturnType<typeof useForm<AddressForm>>; placeholder?: string; required?: boolean; phone?: boolean }) {
  const error = form.formState.errors[name]?.message;
  return <label className="block text-xs font-bold text-slate-600">{label}<Input placeholder={placeholder} inputMode={phone ? "tel" : "text"} dir={phone ? "ltr" : "rtl"} aria-invalid={!!error} className="mt-1.5 h-11 rounded-xl font-normal" {...form.register(name, { required: required ? `${label} را وارد کنید.` : false, ...(phone ? { validate: (value) => /^(?:09\d{9}|\+989\d{9})$/.test(toEnglishDigits(value || "").replace(/\s/g, "")) || "شماره موبایل معتبر نیست." } : {}) })} />{error && <span className="mt-1.5 block text-[11px] text-red-600">{String(error)}</span>}</label>;
}
