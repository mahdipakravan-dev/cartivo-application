"use client";

import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, MessageSquareText, Send, Star, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/api/auth";
import { getAccessToken } from "@/lib/api/auth-token";
import { createReview, getCarReviews, type Review } from "@/lib/api/reviews";
import type { CarResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function ProductReviews({ cars }: { cars: CarResponse[] }) {
  const validCars = useMemo(() => cars.filter((car) => car.id != null), [cars]);
  const [carId, setCarId] = useState<number | null>(validCars[0]?.id ?? null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (carId == null) return;
    setLoading(true);
    setError("");
    getCarReviews(carId)
      .then(setReviews)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "دریافت دیدگاه‌ها انجام نشد."))
      .finally(() => setLoading(false));
  }, [carId]);

  const average = reviews.length
    ? reviews.reduce((total, review) => total + (review.rating ?? 0), 0) / reviews.length
    : 0;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (carId == null) return;
    if (!getAccessToken()) {
      window.dispatchEvent(new Event("cartivo-open-auth"));
      return;
    }
    setSubmitting(true);
    setError("");
    setSubmitted(false);
    try {
      const profile = await getProfile();
      if (profile.id == null) throw new Error("شناسه حساب کاربری دریافت نشد.");
      await createReview({ customerId: profile.id, carId, rating, ...(comment.trim() && { comment: comment.trim() }) });
      setComment("");
      setRating(5);
      setSubmitted(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "ثبت دیدگاه انجام نشد.");
    } finally {
      setSubmitting(false);
    }
  };

  if (validCars.length === 0) return null;

  return (
    <section className="mt-8 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_16px_50px_rgb(15_23_42/0.04)] sm:p-8">
      <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold text-cyan-700">نظر خریداران</p><h2 className="mt-2 text-2xl font-black text-slate-900">امتیاز و دیدگاه کاربران</h2><p className="mt-2 text-sm text-slate-400">دیدگاه‌ها برای خودروی سازگار انتخاب‌شده نمایش داده می‌شوند.</p></div>
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"><div className="text-left"><strong className="text-2xl text-[#14305A]">{average ? average.toLocaleString("fa-IR", { maximumFractionDigits: 1 }) : "—"}</strong><p className="text-[10px] text-slate-400">از ۵ امتیاز</p></div><Star className="size-7 fill-amber-400 text-amber-400" /></div>
      </div>

      {validCars.length > 1 && <label className="mt-6 block max-w-sm text-xs font-bold text-slate-600">خودروی موردنظر<select value={carId ?? ""} onChange={(event) => setCarId(Number(event.target.value))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary">{validCars.map((car) => <option key={car.id} value={car.id}>{carName(car)}</option>)}</select></label>}

      <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_360px]">
        <div>
          {loading ? <div className="flex min-h-48 items-center justify-center"><LoaderCircle className="size-6 animate-spin text-[#14305A]" /></div> : reviews.length === 0 ? <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 text-center"><MessageSquareText className="size-10 text-slate-200" /><p className="mt-3 text-sm font-bold text-slate-500">هنوز دیدگاهی ثبت نشده است</p><p className="mt-1 text-xs text-slate-400">اولین نفری باشید که تجربه خود را می‌نویسد.</p></div> : <div className="space-y-3">{reviews.map((review, index) => <ReviewCard key={review.id ?? index} review={review} />)}</div>}
        </div>

        <form onSubmit={submit} className="h-fit rounded-2xl bg-slate-50 p-5">
          <h3 className="text-base font-black text-slate-800">دیدگاه شما</h3><p className="mt-1 text-xs leading-5 text-slate-400">دیدگاه پس از بررسی و تأیید منتشر می‌شود.</p>
          <div className="mt-5 flex gap-1" dir="ltr">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} ستاره`}><Star className={cn("size-7 transition", value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-amber-300")} /></button>)}</div>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={1000} rows={5} placeholder="تجربه شما از این قطعه برای خودروی انتخاب‌شده..." className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 outline-none placeholder:text-slate-300 focus:border-primary" />
          {error && <p role="alert" className="mt-3 text-xs font-bold text-red-600">{error}</p>}
          {submitted && <p className="mt-3 text-xs font-bold text-emerald-700">دیدگاه شما ثبت شد و پس از تأیید نمایش داده می‌شود.</p>}
          <Button type="submit" disabled={submitting} className="mt-4 h-11 w-full rounded-xl">{submitting ? <LoaderCircle className="animate-spin" /> : <><Send className="size-4" /> ثبت دیدگاه</>}</Button>
        </form>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return <article className="rounded-2xl border border-slate-100 p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-slate-50"><UserRound className="size-4 text-slate-400" /></span><div><p className="text-xs font-bold text-slate-700">کاربر کارتیوو</p><p className="mt-0.5 text-[10px] text-slate-400">{formatDate(review.createdAt)}</p></div></div><div className="flex" dir="ltr">{[1, 2, 3, 4, 5].map((value) => <Star key={value} className={cn("size-3.5", value <= (review.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />)}</div></div>{review.comment && <p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p>}</article>;
}

function carName(car: CarResponse) { return [car.brand?.persianName || car.brand?.englishName, car.model, car.trimLevel].filter(Boolean).join(" ") || "خودرو"; }
function formatDate(value?: string) { if (!value) return ""; const date = new Date(value); return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date); }
