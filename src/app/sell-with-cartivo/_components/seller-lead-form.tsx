"use client";

import { useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PHONE_ERROR = "شماره موبایل را به‌صورت ۰۹۱۲۳۴۵۶۷۸۹ وارد کنید.";

export function SellerLeadForm() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);

  const validate = (value: string) => {
    const normalized = normalizePhone(value);
    const message = /^09\d{9}$/.test(normalized) ? "" : PHONE_ERROR;
    setError(message);
    return { normalized, valid: !message };
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validate(phone);
    if (!result.valid) {
      window.requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSubmittedPhone(result.normalized);
    }, 650);
  };

  if (submittedPhone) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[1.75rem] border border-emerald-200 bg-white p-6 text-center shadow-[0_24px_70px_rgb(15_23_42/0.15)] sm:p-8"
      >
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-black text-dark">درخواست شما ثبت شد</h2>
        <p className="mt-3 text-sm leading-7 text-text-muted">
          کارشناس همکاری با فروشندگان در اولین فرصت با شماره
          <span dir="ltr" className="mx-1 inline-block font-black text-primary">
            {formatPhone(submittedPhone)}
          </span>
          تماس می‌گیرد.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSubmittedPhone("");
            setPhone("");
          }}
          className="mt-6 h-11 rounded-xl px-5 font-bold"
        >
          ثبت شماره دیگر
        </Button>
      </div>
    );
  }

  return (
    <form
      id="seller-callback-form"
      onSubmit={submit}
      noValidate
      className="rounded-[1.75rem] border border-white/70 bg-white p-5 text-right shadow-[0_24px_70px_rgb(15_23_42/0.16)] sm:p-7"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-accent">
        <Phone className="size-5" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-black text-dark">برای شروع، فقط شماره شما را می‌خواهیم</h2>
      <p className="mt-3 text-sm leading-7 text-text-muted">
        شماره خود را بگذارید؛ کارشناس کارتیوُ در اولین فرصت با شما
        تماس می‌گیرد.
      </p>

      {error && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold leading-6 text-red-700 outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          {error}
        </div>
      )}

      <label htmlFor="seller-phone" className="mt-5 block text-sm font-bold text-dark">
        شماره تلفن همراه
        <span className="mr-1 text-red-600" aria-hidden="true">
          *
        </span>
      </label>
      <div className="relative mt-2">
        <Input
          id="seller-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            if (error) setError("");
          }}
          onBlur={(event) => {
            if (event.target.value) validate(event.target.value);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby="seller-phone-help seller-phone-error"
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          dir="ltr"
          className="h-13 rounded-xl border-border bg-background px-4 pl-12 text-left text-base tabular-nums placeholder:text-left md:text-base"
        />
        <Phone
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
      </div>
      <p id="seller-phone-help" className="mt-2 min-h-6 text-xs leading-6 text-text-muted">
        این شماره فقط برای هماهنگی همکاری استفاده می‌شود.
      </p>
      <span id="seller-phone-error" className="sr-only">
        {error}
      </span>

      <Button
        type="submit"
        disabled={loading}
        className="mt-4 h-13 w-full rounded-xl bg-accent text-sm font-black text-white shadow-lg shadow-accent/20 hover:bg-accent/90"
      >
        {loading ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            در حال ثبت…
          </>
        ) : (
          <>
            درخواست تماس
            <ArrowLeft className="size-4" aria-hidden="true" />
          </>
        )}
      </Button>
      <p className="mt-4 text-center text-[11px] leading-5 text-text-secondary">
        ثبت درخواست به معنای ایجاد تعهد همکاری نیست.
      </p>
    </form>
  );
}

function normalizePhone(value: string) {
  return value
    .trim()
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[\s()-]/g, "");
}

function formatPhone(value: string) {
  return `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7)}`;
}
