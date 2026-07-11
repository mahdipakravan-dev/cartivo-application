"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ClipboardPlus, LoaderCircle, MessageSquareText, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProfile } from "@/lib/api/auth";
import { getAccessToken } from "@/lib/api/auth-token";
import { createPartRequest } from "@/lib/api/part-requests";
import { ROUTES } from "@/lib/routes";

const POST_LOGIN_ACTION = "cartivo_post_login_action";

export function PartRequestCover() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener("cartivo-open-part-request", reopen);
    return () => window.removeEventListener("cartivo-open-part-request", reopen);
  }, []);

  const start = () => {
    if (getAccessToken()) {
      setOpen(true);
      return;
    }
    window.sessionStorage.setItem(POST_LOGIN_ACTION, "part-request");
    window.dispatchEvent(new Event("cartivo-open-auth"));
  };

  return (
    <section id="part-request" className="scroll-mt-24 bg-white py-14 sm:py-16" aria-label="ثبت درخواست قطعه">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="relative isolate min-h-[330px] overflow-hidden rounded-[2rem] bg-[#14305A] shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
          <div className="absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute -bottom-36 left-1/3 size-80 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="grid min-h-[330px] items-center lg:grid-cols-[1.1fr_.9fr]">
            <div className="relative z-10 px-6 py-12 sm:px-10 lg:px-14"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100"><SearchX className="size-4" /> سرویس درخواست قطعه</span><h2 className="mt-5 text-3xl font-black leading-[1.45] text-white sm:text-4xl">قطعه مورد نظر رو پیدا نکردی؟<span className="block text-cyan-300">درخواست قطعه ثبت کن</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-white/60">مشخصات قطعه را برای ما بنویس؛ کارشناسان کارتیوو نتیجه بررسی را از طریق پیامک و پروفایل به شما اطلاع می‌دهند.</p><Button onClick={start} className="mt-7 h-12 rounded-xl bg-white px-5 text-sm font-extrabold text-[#14305A] hover:bg-cyan-50"><ClipboardPlus className="size-4" /> ثبت درخواست قطعه <ArrowLeft className="size-4" /></Button></div>
            <div className="relative hidden h-full items-center justify-center border-r border-white/10 lg:flex"><div className="absolute size-64 rounded-full border border-white/10" /><div className="absolute size-48 rounded-full border border-dashed border-cyan-200/15" /><ClipboardPlus className="size-28 text-cyan-200/20" strokeWidth={1} /><div className="absolute bottom-9 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-bold text-white/65">پیگیری آسان از پروفایل کاربری</div></div>
          </div>
        </div>
      </div>
      <PartRequestDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}

function PartRequestDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, onOpenChange]);

  if (!open) return null;
  const close = () => { onOpenChange(false); window.setTimeout(() => { setSuccess(false); setError(""); }, 200); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const profile = await getProfile();
      if (profile.id == null) throw new Error("شناسه حساب کاربری دریافت نشد.");
      await createPartRequest({ customerId: profile.id, requestedPartName: name.trim(), ...(description.trim() && { description: description.trim() }) });
      setSuccess(true);
      setName("");
      setDescription("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "ثبت درخواست انجام نشد.");
    } finally { setLoading(false); }
  };

  return <div className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && close()}><section role="dialog" aria-modal="true" aria-label="ثبت درخواست قطعه" className="relative w-full overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-w-lg sm:rounded-[2rem]"><div className="h-1.5 bg-gradient-to-l from-[#14305A] via-cyan-600 to-cyan-300" /><button onClick={close} className="absolute left-5 top-5 flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100" aria-label="بستن"><X className="size-4" /></button>{success ? <div className="px-7 py-12 text-center sm:px-10"><div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-8" /></div><h2 className="mt-5 text-2xl font-black text-slate-900">درخواست شما ثبت شد</h2><p className="mt-3 text-sm leading-7 text-slate-500">نتیجه از طریق پیامک به شما اطلاع داده می‌شود؛ همچنین در قسمت پروفایل کاربری شما قابل مشاهده خواهد بود.</p><div className="mt-7 grid gap-2 sm:grid-cols-2"><Link href={ROUTES.profile} onClick={close} className="flex h-11 items-center justify-center rounded-xl bg-[#14305A] text-sm font-bold text-white">مشاهده در پروفایل</Link><Button variant="outline" onClick={close} className="h-11 rounded-xl">بستن</Button></div></div> : <form onSubmit={submit} className="px-6 pb-7 pt-8 sm:px-8"><div className="flex size-12 items-center justify-center rounded-2xl bg-[#14305A] text-cyan-200"><MessageSquareText className="size-6" /></div><h2 className="mt-4 text-xl font-black text-slate-900">چه قطعه‌ای نیاز دارید؟</h2><p className="mt-2 text-sm leading-6 text-slate-400">نام دقیق قطعه الزامی است. هر جزئیات دیگری که به شناسایی آن کمک می‌کند نیز بنویسید.</p><label className="mt-6 block text-xs font-bold text-slate-600">نام قطعه <span className="text-red-500">*</span><Input value={name} onChange={(event) => setName(event.target.value)} required maxLength={200} autoFocus placeholder="مثلاً چراغ جلو پژو ۲۰۶" className="mt-2 h-12 rounded-xl" /></label><label className="mt-4 block text-xs font-bold text-slate-600">توضیحات تکمیلی<textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} rows={4} placeholder="مدل خودرو، سال ساخت، برند موردنظر یا هر توضیح دیگری..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-primary" /></label>{error && <p role="alert" className="mt-3 text-xs font-bold text-red-600">{error}</p>}<Button type="submit" disabled={loading || !name.trim()} className="mt-5 h-12 w-full rounded-xl text-sm font-bold">{loading ? <LoaderCircle className="animate-spin" /> : <><ClipboardPlus className="size-4" /> ثبت درخواست</>}</Button></form>}</section></div>;
}
