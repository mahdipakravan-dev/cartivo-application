"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, ChevronLeft, CircleUserRound,
  ClipboardList, LoaderCircle, LogOut, Mail, MapPin, Package, Phone, ReceiptText, Save, ShoppingBag,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProfile, updateProfile, type CustomerProfile, type ProfileUpdate } from "@/lib/api/auth";
import { clearAccessToken, getAccessToken } from "@/lib/api/auth-token";
import { getMyOrders, getOrder, type Order } from "@/lib/api/orders";
import { getPartRequests, type PartRequest } from "@/lib/api/part-requests";
import type { PageResponse } from "@/lib/api/types";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Tab = "profile" | "orders" | "requests";
type ProfileForm = { firstName: string; lastName: string; email: string; nationalCode: string };

const STATUS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "در انتظار بررسی", className: "bg-amber-50 text-amber-700" },
  CONFIRMED: { label: "تأیید شده", className: "bg-blue-50 text-blue-700" },
  SHIPPED: { label: "ارسال شده", className: "bg-cyan-50 text-cyan-700" },
  DELIVERED: { label: "تحویل شده", className: "bg-emerald-50 text-emerald-700" },
  CANCELLED: { label: "لغو شده", className: "bg-red-50 text-red-700" },
};

const REQUEST_STATUS: Record<string, { label: string; className: string }> = {
  NEW: { label: "ثبت‌شده", className: "bg-blue-50 text-blue-700" },
  IN_PROGRESS: { label: "در حال بررسی", className: "bg-amber-50 text-amber-700" },
  RESOLVED: { label: "پاسخ داده‌شده", className: "bg-emerald-50 text-emerald-700" },
  REJECTED: { label: "امکان تأمین ندارد", className: "bg-red-50 text-red-700" },
};

export function ProfileDashboard() {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const form = useForm<ProfileForm>({ defaultValues: { firstName: "", lastName: "", email: "", nationalCode: "" } });

  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    getProfile()
      .then(async (customer) => {
        const [orderPage, requests] = await Promise.all([
          getMyOrders({ page: 0, size: 50 }),
          customer.id != null ? getPartRequests(customer.id) : Promise.resolve([]),
        ]);
        setProfile(customer);
        setOrders((((orderPage as PageResponse).content ?? []) as Order[]));
        setPartRequests(requests);
        form.reset({ firstName: customer.firstName || "", lastName: customer.lastName || "", email: customer.email || "", nationalCode: customer.nationalCode || "" });
      })
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : "دریافت اطلاعات حساب انجام نشد.");
      })
      .finally(() => setLoading(false));
  }, [form]);

  const saveProfile = async (values: ProfileForm) => {
    setError("");
    setSaved(false);
    try {
      const payload: ProfileUpdate = {
        ...(values.firstName && { firstName: values.firstName }),
        ...(values.lastName && { lastName: values.lastName }),
        ...(values.email && { email: values.email }),
        ...(values.nationalCode && { nationalCode: values.nationalCode }),
      };
      const updated = await updateProfile(payload);
      setProfile(updated);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "ذخیره تغییرات انجام نشد.");
    }
  };

  const openOrder = async (id?: number) => {
    if (id == null) return;
    setLoadingOrder(true);
    setError("");
    try {
      setSelectedOrder(await getOrder(id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "جزئیات سفارش دریافت نشد.");
    } finally {
      setLoadingOrder(false);
    }
  };

  const logout = () => {
    clearAccessToken();
    window.location.href = ROUTES.home;
  };

  if (loading) return <div className="flex min-h-[70vh] items-center justify-center bg-[#f8fafc]"><LoaderCircle className="size-8 animate-spin text-[#14305A]" /></div>;
  if (!getAccessToken()) return <LoginRequired />;

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "کاربر کارتیوو";

  return (
    <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav aria-label="مسیر ناوبری" className="mb-6 text-xs text-slate-400"><ol className="flex items-center gap-1.5"><li><Link href={ROUTES.home} className="hover:text-[#14305A]">خانه</Link></li><li><ChevronLeft className="size-3" /></li><li className="font-bold text-slate-600">حساب کاربری</li></ol></nav>

        <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] px-6 py-9 text-white shadow-[0_24px_70px_rgb(15_23_42/0.12)] sm:px-10 lg:px-12">
          <div className="absolute -right-20 -top-28 size-72 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4"><div className="flex size-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><CircleUserRound className="size-8 text-cyan-200" /></div><div><p className="text-xs font-bold text-cyan-200">حساب کاربری من</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">{displayName}</h1><p dir="ltr" className="mt-1 text-right text-xs text-white/45">{localPhone(profile?.phoneNumber)}</p></div></div>
            <div className="flex flex-wrap gap-3"><Stat value={orders.length.toLocaleString("fa-IR")} label="سفارش" /><Stat value={partRequests.length.toLocaleString("fa-IR")} label="درخواست قطعه" /><Stat value={profile?.email ? "کامل" : "ناقص"} label="وضعیت پروفایل" /></div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-sm">
            <NavButton active={tab === "profile"} icon={UserRound} label="اطلاعات حساب" onClick={() => { setTab("profile"); setSelectedOrder(null); }} />
            <NavButton active={tab === "orders"} icon={ShoppingBag} label="سفارش‌های من" badge={orders.length} onClick={() => setTab("orders")} />
            <NavButton active={tab === "requests"} icon={ClipboardList} label="درخواست‌های قطعه" badge={partRequests.length} onClick={() => { setTab("requests"); setSelectedOrder(null); }} />
            <div className="my-2 h-px bg-slate-100" />
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600"><LogOut className="size-4" /> خروج از حساب</button>
          </aside>

          <section className="min-w-0 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_16px_50px_rgb(15_23_42/0.045)] sm:p-7 lg:p-9">
            {error && <div role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {tab === "profile" ? (
              <ProfileFormView form={form} profile={profile} saved={saved} onSubmit={saveProfile} />
            ) : tab === "requests" ? (
              <PartRequestsList requests={partRequests} />
            ) : selectedOrder || loadingOrder ? (
              <OrderDetail order={selectedOrder} loading={loadingOrder} onBack={() => setSelectedOrder(null)} />
            ) : (
              <OrdersList orders={orders} onOpen={openOrder} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileFormView({ form, profile, saved, onSubmit }: { form: ReturnType<typeof useForm<ProfileForm>>; profile: CustomerProfile | null; saved: boolean; onSubmit: (values: ProfileForm) => Promise<void> }) {
  return <div><Header eyebrow="مشخصات فردی" title="اطلاعات حساب" subtitle="اطلاعات تماس و هویتی خود را مشاهده یا ویرایش کنید." /><form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid gap-5 sm:grid-cols-2"><Field label="نام" icon={UserRound}><Input className="h-12 rounded-xl" {...form.register("firstName")} /></Field><Field label="نام خانوادگی" icon={UserRound}><Input className="h-12 rounded-xl" {...form.register("lastName")} /></Field><Field label="شماره موبایل" icon={Phone}><Input dir="ltr" disabled value={localPhone(profile?.phoneNumber)} className="h-12 rounded-xl bg-slate-50 text-left" /></Field><Field label="ایمیل" icon={Mail}><Input dir="ltr" type="email" className="h-12 rounded-xl text-left" {...form.register("email", { pattern: /^\S+@\S+\.\S+$/ })} /></Field><Field label="کد ملی" icon={BadgeCheck}><Input inputMode="numeric" maxLength={10} className="h-12 rounded-xl" {...form.register("nationalCode", { pattern: /^$|^\d{10}$/ })} /></Field><div className="flex items-end"><Button type="submit" disabled={form.formState.isSubmitting} className="h-12 w-full rounded-xl text-sm font-bold">{form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : saved ? <><CheckCircle2 /> ذخیره شد</> : <><Save /> ذخیره تغییرات</>}</Button></div></form></div>;
}

function OrdersList({ orders, onOpen }: { orders: Order[]; onOpen: (id?: number) => void }) {
  return <div><Header eyebrow="تاریخچه خرید" title="سفارش‌های من" subtitle="وضعیت سفارش‌ها و جزئیات هر خرید را اینجا دنبال کنید." />{orders.length === 0 ? <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 py-16 text-center"><Package className="size-12 text-slate-200" /><p className="mt-4 text-sm font-bold text-slate-500">هنوز سفارشی ثبت نکرده‌اید</p><Link href={ROUTES.parts} className="mt-4 text-sm font-bold text-cyan-700">مشاهده قطعات</Link></div> : <div className="mt-7 space-y-3">{orders.map((order) => <OrderRow key={order.id} order={order} onOpen={() => onOpen(order.id)} />)}</div>}</div>;
}

function PartRequestsList({ requests }: { requests: PartRequest[] }) {
  return <div><Header eyebrow="پیگیری درخواست‌ها" title="درخواست‌های قطعه" subtitle="نتیجه بررسی کارشناسان و وضعیت درخواست‌های خود را اینجا ببینید." />{requests.length === 0 ? <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-200 py-16 text-center"><ClipboardList className="size-12 text-slate-200" /><p className="mt-4 text-sm font-bold text-slate-500">هنوز درخواست قطعه‌ای ثبت نکرده‌اید</p><Link href={ROUTES.home} className="mt-4 text-sm font-bold text-cyan-700">ثبت درخواست از صفحه اصلی</Link></div> : <div className="mt-7 space-y-3">{requests.map((request, index) => { const status = REQUEST_STATUS[request.status || ""] || { label: request.status || "نامشخص", className: "bg-slate-50 text-slate-600" }; return <article key={request.id ?? index} className="rounded-2xl border border-slate-100 p-4 sm:p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div className="flex items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[#14305A]"><ClipboardList className="size-5" /></span><div><h3 className="text-sm font-black text-slate-800">{request.requestedPartName || "قطعه درخواستی"}</h3><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><CalendarDays className="size-3" />{formatDate(request.createdAt)}{request.id != null && ` • کد ${request.id.toLocaleString("fa-IR")}`}</p></div></div><span className={cn("w-fit rounded-full px-3 py-1.5 text-[10px] font-bold", status.className)}>{status.label}</span></div>{request.description && <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-500">{request.description}</p>}{request.adminResponse && <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3"><p className="text-[10px] font-bold text-emerald-700">پاسخ کارشناس</p><p className="mt-1 text-sm leading-7 text-emerald-900/70">{request.adminResponse}</p></div>}</article>; })}</div>}</div>;
}

function OrderRow({ order, onOpen }: { order: Order; onOpen: () => void }) {
  const status = STATUS[order.status || ""] || { label: order.status || "نامشخص", className: "bg-slate-50 text-slate-600" };
  return <button onClick={onOpen} className="group grid w-full gap-4 rounded-2xl border border-slate-100 p-4 text-right transition hover:border-cyan-200 hover:shadow-md sm:grid-cols-[1fr_auto_auto] sm:items-center"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-slate-50 text-[#14305A]"><ReceiptText className="size-5" /></span><div><p className="text-sm font-black text-slate-800">سفارش #{order.id?.toLocaleString("fa-IR")}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><CalendarDays className="size-3" />{formatDate(order.createdAt)}</p></div></div><span className={cn("w-fit rounded-full px-3 py-1.5 text-[10px] font-bold", status.className)}>{status.label}</span><div className="flex items-center justify-between gap-3 sm:justify-end"><p className="text-sm font-black text-[#14305A]">{formatPrice(order.totalAmountRial)}</p><ArrowLeft className="size-4 text-slate-300 transition group-hover:-translate-x-1 group-hover:text-cyan-700" /></div></button>;
}

function OrderDetail({ order, loading, onBack }: { order: Order | null; loading: boolean; onBack: () => void }) {
  if (loading || !order) return <div className="flex min-h-72 items-center justify-center"><LoaderCircle className="size-7 animate-spin text-[#14305A]" /></div>;
  const status = STATUS[order.status || ""] || { label: order.status || "نامشخص", className: "bg-slate-50 text-slate-600" };
  return <div><button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#14305A]"><ChevronLeft className="size-4 rotate-180" /> بازگشت به سفارش‌ها</button><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><Header eyebrow={`سفارش #${order.id?.toLocaleString("fa-IR")}`} title="جزئیات سفارش" subtitle={formatDate(order.createdAt)} /><span className={cn("w-fit rounded-full px-3 py-2 text-xs font-bold", status.className)}>{status.label}</span></div><div className="mt-7 divide-y divide-slate-100 rounded-2xl border border-slate-100">{order.items?.map((item, index) => <div key={`${item.partId}-${index}`} className="flex items-center justify-between gap-4 p-4"><div><p className="text-sm font-bold text-slate-700">{item.partName || "قطعه خودرو"}</p><p className="mt-1 text-xs text-slate-400">{item.quantity?.toLocaleString("fa-IR")} عدد × {formatPrice(item.unitPriceRial)}</p></div><p className="shrink-0 text-sm font-black text-[#14305A]">{formatPrice(item.lineTotalRial)}</p></div>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Info icon={MapPin} label="آدرس تحویل" value={[order.address?.city, order.address?.fullAddress, order.address?.plaque && `پلاک ${order.address.plaque}`].filter(Boolean).join("، ") || "—"} /><Info icon={ReceiptText} label="روش پرداخت" value={order.paymentMethod?.persianName || order.paymentMethod?.englishName || "—"} /></div><div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-5"><span className="text-sm text-slate-500">مبلغ کل سفارش</span><strong className="text-xl text-[#14305A]">{formatPrice(order.totalAmountRial)}</strong></div></div>;
}

function LoginRequired() { return <main className="flex min-h-[75vh] items-center justify-center bg-[#f8fafc] px-4 pt-20"><div className="max-w-md rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-xl"><div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#14305A] text-white"><CircleUserRound className="size-8" /></div><h1 className="mt-5 text-2xl font-black text-slate-900">وارد حساب خود شوید</h1><p className="mt-3 text-sm leading-7 text-slate-500">برای مشاهده پروفایل و سفارش‌ها ابتدا وارد شوید.</p><Button onClick={() => window.dispatchEvent(new Event("cartivo-open-auth"))} className="mt-6 h-12 w-full rounded-xl">ورود به حساب</Button></div></main>; }
function Header({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) { return <div><p className="text-xs font-bold text-cyan-700">{eyebrow}</p><h2 className="mt-1 text-2xl font-black text-slate-900">{title}</h2><p className="mt-2 text-sm text-slate-400">{subtitle}</p></div>; }
function Field({ label, icon: Icon, children }: { label: string; icon: typeof UserRound; children: React.ReactNode }) { return <label className="text-xs font-bold text-slate-600"><span className="mb-2 flex items-center gap-1.5"><Icon className="size-3.5 text-slate-400" />{label}</span>{children}</label>; }
function NavButton({ active, icon: Icon, label, badge, onClick }: { active: boolean; icon: typeof UserRound; label: string; badge?: number; onClick: () => void }) { return <button onClick={onClick} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition", active ? "bg-[#14305A] text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800")}><Icon className="size-4" />{label}{badge != null && <span className={cn("mr-auto rounded-full px-2 py-0.5 text-[10px]", active ? "bg-white/15" : "bg-slate-100")}>{badge.toLocaleString("fa-IR")}</span>}</button>; }
function Stat({ value, label }: { value: string; label: string }) { return <div className="min-w-24 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-center"><p className="font-black text-white">{value}</p><p className="mt-1 text-[10px] text-white/45">{label}</p></div>; }
function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) { return <div className="rounded-2xl border border-slate-100 p-4"><p className="flex items-center gap-2 text-xs font-bold text-slate-400"><Icon className="size-4" />{label}</p><p className="mt-2 text-sm leading-6 text-slate-700">{value}</p></div>; }
function formatPrice(value?: number) { return value == null ? "—" : `${value.toLocaleString("fa-IR")} ریال`; }
function formatDate(value?: string) { if (!value) return "—"; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date); }
function localPhone(value?: string) { return value?.startsWith("+98") ? `0${value.slice(3)}` : value || ""; }
