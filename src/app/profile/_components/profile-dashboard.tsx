"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GarageVehicleForm } from "@/components/garage/garage-vehicle-form";
import {
  getProfile,
  updateProfile,
  type CustomerProfile,
  type ProfileUpdate,
} from "@/lib/api/auth";
import { clearAccessToken, getAccessToken } from "@/lib/api/auth-token";
import { getMyOrders, getOrder, type Order } from "@/lib/api/orders";
import { getPartRequests, type PartRequest } from "@/lib/api/part-requests";
import { getGarageVehicles, type GarageVehicle } from "@/lib/api/garage";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronLeft,
  CircleUserRound,
  ClipboardList,
  LoaderCircle,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  Save,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Tab = "profile" | "cars" | "orders" | "requests";
type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  nationalCode: string;
};
type ProfileFeedback = { type: "success" | "error"; message: string } | null;

const STATUS: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "در انتظار بررسی",
    className: "bg-amber-50 text-amber-700",
  },
  CONFIRMED: { label: "تأیید شده", className: "bg-accent/10 text-accent" },
  SHIPPED: { label: "ارسال شده", className: "bg-accent/10 text-accent" },
  DELIVERED: {
    label: "تحویل شده",
    className: "bg-emerald-50 text-emerald-700",
  },
  CANCELLED: { label: "لغو شده", className: "bg-red-50 text-red-700" },
};

const REQUEST_STATUS: Record<string, { label: string; className: string }> = {
  NEW: { label: "ثبت‌شده", className: "bg-accent/10 text-accent" },
  IN_PROGRESS: {
    label: "در حال بررسی",
    className: "bg-amber-50 text-amber-700",
  },
  RESOLVED: {
    label: "پاسخ داده‌شده",
    className: "bg-emerald-50 text-emerald-700",
  },
  REJECTED: { label: "امکان تأمین ندارد", className: "bg-red-50 text-red-700" },
};

export function ProfileDashboard() {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [garageVehicles, setGarageVehicles] = useState<GarageVehicle[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<ProfileFeedback>(null);
  const form = useForm<ProfileForm>({
    defaultValues: { firstName: "", lastName: "", email: "", nationalCode: "" },
  });

  useEffect(() => {
    const showGarage = () => setTab("cars");
    if (new URLSearchParams(window.location.search).get("tab") === "cars")
      showGarage();
    window.addEventListener("cartivo-show-garage", showGarage);
    return () => window.removeEventListener("cartivo-show-garage", showGarage);
  }, []);

  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    getProfile()
      .then(async (customer) => {
        const [orderPage, requests, cars] = await Promise.all([
          getMyOrders({ page: 0, size: 50 }),
          customer.id != null
            ? getPartRequests(customer.id)
            : Promise.resolve([]),
          getGarageVehicles(),
        ]);
        setProfile(customer);
        setOrders(orderPage.content ?? []);
        setPartRequests(requests);
        setGarageVehicles(cars);
        form.reset({
          firstName: customer.firstName || "",
          lastName: customer.lastName || "",
          email: customer.email || "",
          nationalCode: customer.nationalCode || "",
        });
      })
      .catch((reason) => {
        setError(
          reason instanceof Error
            ? reason.message
            : "دریافت اطلاعات حساب انجام نشد.",
        );
      })
      .finally(() => setLoading(false));
  }, [form]);

  useEffect(() => {
    const refreshCars = () => {
      if (!getAccessToken()) return;
      getGarageVehicles()
        .then(setGarageVehicles)
        .catch(() => undefined);
    };
    window.addEventListener("cartivo-garage-change", refreshCars);
    return () =>
      window.removeEventListener("cartivo-garage-change", refreshCars);
  }, []);

  const saveProfile = async (values: ProfileForm) => {
    setError("");
    setSaved(false);
    setProfileFeedback(null);
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
      setProfileFeedback({
        type: "success",
        message: "اطلاعات حساب با موفقیت ذخیره شد.",
      });
      window.setTimeout(() => setSaved(false), 2500);
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "ذخیره تغییرات انجام نشد.";
      setProfileFeedback({ type: "error", message });
    }
  };

  const handleInvalidProfileSubmit = () => {
    setSaved(false);
    setProfileFeedback({
      type: "error",
      message: "فرم کامل نیست. لطفا خطاهای فرم را بررسی کنید.",
    });
  };

  const openOrder = async (id?: number) => {
    if (id == null) return;
    setLoadingOrder(true);
    setError("");
    try {
      setSelectedOrder(await getOrder(id));
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "جزئیات سفارش دریافت نشد.",
      );
    } finally {
      setLoadingOrder(false);
    }
  };

  const logout = () => {
    clearAccessToken();
    window.location.href = ROUTES.home;
  };

  if (loading)
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[var(--background)]">
        <LoaderCircle className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  if (!getAccessToken()) return <LoginRequired />;

  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "کاربر کارتیوُ";

  return (
    <main className="bg-[var(--background)] pb-20 pt-24 sm:pt-28">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="مسیر ناوبری"
          className="mb-6 text-xs text-text-secondary"
        >
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href={ROUTES.home} className="hover:text-[var(--primary)]">
                خانه
              </Link>
            </li>
            <li>
              <ChevronLeft className="size-3" />
            </li>
            <li className="font-bold text-text-muted">حساب کاربری</li>
          </ol>
        </nav>

        <section className="relative isolate overflow-hidden rounded-[2rem] bg-primary px-6 py-9 text-white shadow-[0_24px_70px_rgb(15_23_42/0.12)] sm:px-10 lg:px-12">
          <div className="absolute -right-20 -top-28 size-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <CircleUserRound className="size-8 text-accent" />
              </div>
              <div>
                <p className="text-xs font-bold text-accent">حساب کاربری من</p>
                <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                  {displayName}
                </h1>
                <p dir="ltr" className="mt-1 text-right text-xs text-white/45">
                  {localPhone(profile?.phoneNumber)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Stat
                value={orders.length.toLocaleString("fa-IR")}
                label="سفارش"
              />
              <Stat
                value={partRequests.length.toLocaleString("fa-IR")}
                label="درخواست قطعه"
              />
              <Stat
                value={profile?.email ? "کامل" : "ناقص"}
                label="وضعیت پروفایل"
              />
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit rounded-[1.5rem]  bg-white p-3 shadow-sm">
            <NavButton
              active={tab === "profile"}
              icon={UserRound}
              label="اطلاعات حساب"
              onClick={() => {
                setTab("profile");
                setSelectedOrder(null);
              }}
            />
            <NavButton
              active={tab === "cars"}
              icon={CarFront}
              label="خودروهای من"
              badge={garageVehicles.length}
              onClick={() => {
                setTab("cars");
                setSelectedOrder(null);
              }}
            />
            <NavButton
              active={tab === "orders"}
              icon={ShoppingBag}
              label="سفارش‌های من"
              badge={orders.length}
              onClick={() => setTab("orders")}
            />
            <NavButton
              active={tab === "requests"}
              icon={ClipboardList}
              label="درخواست‌های قطعه"
              badge={partRequests.length}
              onClick={() => {
                setTab("requests");
                setSelectedOrder(null);
              }}
            />
            <div className="my-2 h-px bg-border/20" />
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-text-secondary transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="size-4" /> خروج از حساب
            </button>
          </aside>

          <section className="min-w-0 rounded-[1.75rem]  bg-white p-5 shadow-[0_16px_50px_rgb(15_23_42/0.045)] sm:p-7 lg:p-9">
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}
            {tab === "profile" ? (
              <ProfileFormView
                form={form}
                profile={profile}
                saved={saved}
                feedback={profileFeedback}
                onSubmit={saveProfile}
                onInvalid={handleInvalidProfileSubmit}
              />
            ) : tab === "cars" ? (
              <GarageVehiclesList
                vehicles={garageVehicles}
                onCreated={(created) =>
                  setGarageVehicles((current) => [
                    created,
                    ...current.filter((item) => item.id !== created.id),
                  ])
                }
              />
            ) : tab === "requests" ? (
              <PartRequestsList requests={partRequests} />
            ) : selectedOrder || loadingOrder ? (
              <OrderDetail
                order={selectedOrder}
                loading={loadingOrder}
                onBack={() => setSelectedOrder(null)}
              />
            ) : (
              <OrdersList orders={orders} onOpen={openOrder} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function GarageVehiclesList({
  vehicles,
  onCreated,
}: {
  vehicles: GarageVehicle[];
  onCreated: (vehicle: GarageVehicle) => void;
}) {
  return (
    <div>
      <Header
        eyebrow="گاراژ شخصی"
        title="خودروهای من"
        subtitle="خودروهای ذخیره‌شده برای دسترسی سریع به قطعات سازگار را اینجا مدیریت کنید."
      />
      <GarageVehicleForm onCreated={onCreated} />

      <div className="mt-9 border-t border-border pt-7">
        <h3 className="text-base font-black text-dark">خودروهای ذخیره‌شده</h3>
        {vehicles.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-border py-12 text-center">
            <CarFront className="size-10 text-text-secondary" />
            <p className="mt-3 text-sm font-bold text-text-secondary">
              هنوز خودرویی ذخیره نکرده‌اید
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {vehicles.map((garageVehicle, index) => {
              const vehicle = garageVehicle.vehicle;
              const name =
                vehicle?.displayName ||
                [
                  vehicle?.brand?.name,
                  vehicle?.model?.name,
                  vehicle?.variant?.name,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                "خودرو";
              return (
                <article
                  key={garageVehicle.id ?? index}
                  className="flex items-center gap-4 rounded-2xl  p-4 transition hover:border-accent hover:shadow-sm"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                    <CarFront className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-dark">
                      {name}
                    </h3>
                    <p className="mt-1 text-xs text-text-secondary">
                      سال تولید:{" "}
                      {vehicle?.year?.toLocaleString("fa-IR", {
                        useGrouping: false,
                      }) ?? "—"}
                      {garageVehicle.isDefault ? " • پیش‌فرض" : ""}
                    </p>
                    {(garageVehicle.nickname ||
                      garageVehicle.color ||
                      garageVehicle.mileage != null) && (
                      <p className="mt-1 truncate text-[11px] text-text-secondary">
                        {[
                          garageVehicle.nickname,
                          garageVehicle.color,
                          garageVehicle.mileage != null
                            ? `${garageVehicle.mileage.toLocaleString("fa-IR")} کیلومتر`
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileFormView({
  form,
  profile,
  saved,
  feedback,
  onSubmit,
  onInvalid,
}: {
  form: ReturnType<typeof useForm<ProfileForm>>;
  profile: CustomerProfile | null;
  saved: boolean;
  feedback: ProfileFeedback;
  onSubmit: (values: ProfileForm) => Promise<void>;
  onInvalid: () => void;
}) {
  return (
    <div>
      <Header
        eyebrow="مشخصات فردی"
        title="اطلاعات حساب"
        subtitle="اطلاعات تماس و هویتی خود را مشاهده یا ویرایش کنید."
      />
      {feedback && (
        <div
          role="alert"
          className={cn(
            "mt-6 rounded-xl px-4 py-3 text-sm",
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700",
          )}
        >
          {feedback.message}
        </div>
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="mt-8 grid gap-5 sm:grid-cols-2"
        noValidate
      >
        <Field label="نام" icon={UserRound}>
          <Input className="h-12 rounded-xl" {...form.register("firstName")} />
        </Field>
        <Field label="نام خانوادگی" icon={UserRound}>
          <Input className="h-12 rounded-xl" {...form.register("lastName")} />
        </Field>
        <Field label="شماره موبایل" icon={Phone}>
          <Input
            dir="ltr"
            disabled
            value={localPhone(profile?.phoneNumber)}
            className="h-12 rounded-xl bg-background text-left"
          />
        </Field>
        <Field
          label="ایمیل"
          icon={Mail}
          error={form.formState.errors.email?.message}
        >
          <Input
            dir="ltr"
            type="email"
            className="h-12 rounded-xl text-left"
            {...form.register("email", {
              validate: (value) =>
                !value || /^\S+@\S+\.\S+$/.test(value) || "ایمیل معتبر نیست.",
            })}
          />
        </Field>
        <Field
          label="کد ملی (اختیاری)"
          icon={BadgeCheck}
          error={form.formState.errors.nationalCode?.message}
          hint="پر کردن این فیلد الزامی نیست."
        >
          <Input
            inputMode="numeric"
            maxLength={10}
            className="h-12 rounded-xl"
            {...form.register("nationalCode", {
              validate: (value) =>
                !value || /^\d{10}$/.test(value) || "کد ملی باید ۱۰ رقم باشد.",
            })}
          />
        </Field>
        <div className="flex items-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 w-full rounded-xl text-sm font-bold"
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : saved ? (
              <>
                <CheckCircle2 /> ذخیره شد
              </>
            ) : (
              <>
                <Save /> ذخیره تغییرات
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function OrdersList({
  orders,
  onOpen,
}: {
  orders: Order[];
  onOpen: (id?: number) => void;
}) {
  return (
    <div>
      <Header
        eyebrow="تاریخچه خرید"
        title="سفارش‌های من"
        subtitle="وضعیت سفارش‌ها و جزئیات هر خرید را اینجا دنبال کنید."
      />
      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Package className="size-12 text-text-secondary" />
          <p className="mt-4 text-sm font-bold text-text-secondary">
            هنوز سفارشی ثبت نکرده‌اید
          </p>
          <Link
            href={ROUTES.parts}
            className="mt-4 text-sm font-bold text-accent"
          >
            مشاهده قطعات
          </Link>
        </div>
      ) : (
        <div className="mt-7 space-y-3">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onOpen={() => onOpen(order.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PartRequestsList({ requests }: { requests: PartRequest[] }) {
  return (
    <div>
      <Header
        eyebrow="پیگیری درخواست‌ها"
        title="درخواست‌های قطعه"
        subtitle="نتیجه بررسی کارشناسان و وضعیت درخواست‌های خود را اینجا ببینید."
      />
      {requests.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
          <ClipboardList className="size-12 text-text-secondary" />
          <p className="mt-4 text-sm font-bold text-text-secondary">
            هنوز درخواست قطعه‌ای ثبت نکرده‌اید
          </p>
          <Link
            href={ROUTES.home}
            className="mt-4 text-sm font-bold text-accent"
          >
            ثبت درخواست از صفحه اصلی
          </Link>
        </div>
      ) : (
        <div className="mt-7 space-y-3">
          {requests.map((request, index) => {
            const status = REQUEST_STATUS[request.status || ""] || {
              label: request.status || "نامشخص",
              className: "bg-background text-text-muted",
            };
            return (
              <article
                key={request.id ?? index}
                className="rounded-2xl  p-4 sm:p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-[var(--primary)]">
                      <ClipboardList className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-dark">
                        {request.requestedPartName || "قطعه درخواستی"}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-text-secondary">
                        <CalendarDays className="size-3" />
                        {formatDate(request.createdAt)}
                        {request.id != null &&
                          ` • کد ${request.id.toLocaleString("fa-IR")}`}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "w-fit rounded-full px-3 py-1.5 text-[10px] font-bold",
                      status.className,
                    )}
                  >
                    {status.label}
                  </span>
                </div>
                {request.description && (
                  <p className="mt-4 rounded-xl bg-background px-4 py-3 text-sm leading-7 text-text-secondary">
                    {request.description}
                  </p>
                )}
                {request.adminResponse && (
                  <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                    <p className="text-[10px] font-bold text-emerald-700">
                      پاسخ کارشناس
                    </p>
                    <p className="mt-1 text-sm leading-7 text-emerald-900/70">
                      {request.adminResponse}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderRow({ order, onOpen }: { order: Order; onOpen: () => void }) {
  const status = STATUS[order.status || ""] || {
    label: order.status || "نامشخص",
    className: "bg-background text-text-muted",
  };
  return (
    <button
      onClick={onOpen}
      className="group grid w-full gap-4 rounded-2xl  p-4 text-right transition hover:border-accent hover:shadow-md sm:grid-cols-[1fr_auto_auto] sm:items-center"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-background text-[var(--primary)]">
          <ReceiptText className="size-5" />
        </span>
        <div>
          <p className="text-sm font-black text-dark">
            سفارش #{order.id?.toLocaleString("fa-IR")}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-text-secondary">
            <CalendarDays className="size-3" />
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>
      <span
        className={cn(
          "w-fit rounded-full px-3 py-1.5 text-[10px] font-bold",
          status.className,
        )}
      >
        {status.label}
      </span>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <p className="text-sm font-black text-[var(--primary)]">
          {formatPrice(order.totalAmountRial)}
        </p>
        <ArrowLeft className="size-4 text-text-secondary transition group-hover:-translate-x-1 group-hover:text-accent" />
      </div>
    </button>
  );
}

function OrderDetail({
  order,
  loading,
  onBack,
}: {
  order: Order | null;
  loading: boolean;
  onBack: () => void;
}) {
  if (loading || !order)
    return (
      <div className="flex min-h-72 items-center justify-center">
        <LoaderCircle className="size-7 animate-spin text-[var(--primary)]" />
      </div>
    );
  const status = STATUS[order.status || ""] || {
    label: order.status || "نامشخص",
    className: "bg-background text-text-muted",
  };
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-[var(--primary)]"
      >
        <ChevronLeft className="size-4 rotate-180" /> بازگشت به سفارش‌ها
      </button>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Header
          eyebrow={`سفارش #${order.id?.toLocaleString("fa-IR")}`}
          title="جزئیات سفارش"
          subtitle={formatDate(order.createdAt)}
        />
        <span
          className={cn(
            "w-fit rounded-full px-3 py-2 text-xs font-bold",
            status.className,
          )}
        >
          {status.label}
        </span>
      </div>
      <div className="mt-7 divide-y divide-border rounded-2xl ">
        {order.items?.map((item, index) => (
          <div
            key={`${item.partId}-${item.sellerId}-${index}`}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div>
              <p className="text-sm font-bold text-text-muted">
                {item.partName || "قطعه خودرو"}
              </p>
              <p className="mt-1 text-xs font-bold text-accent">
                {item.sellerName || `فروشنده #${item.sellerId ?? "—"}`}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {item.quantity?.toLocaleString("fa-IR")} عدد ×{" "}
                {formatPrice(item.unitPriceRial)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-black text-[var(--primary)]">
              {formatPrice(item.lineTotalRial)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Info
          icon={MapPin}
          label="آدرس تحویل"
          value={
            [
              order.address?.city,
              order.address?.fullAddress,
              order.address?.plaque && `پلاک ${order.address.plaque}`,
            ]
              .filter(Boolean)
              .join("، ") || "—"
          }
        />
        <Info
          icon={ReceiptText}
          label="روش پرداخت"
          value={
            order.paymentMethod?.persianName ||
            order.paymentMethod?.englishName ||
            "—"
          }
        />
      </div>
      <div className="mt-5 rounded-2xl bg-background p-5">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-secondary">جمع کالاها</dt>
            <dd>{formatPrice(order.subtotalAmountRial)}</dd>
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
          {order.discountAmountRial != null && order.discountAmountRial > 0 && (
            <div className="flex justify-between text-emerald-700">
              <dt>مبلغ تخفیف</dt>
              <dd>− {formatPrice(order.discountAmountRial)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-3">
            <dt className="text-sm text-text-secondary">مبلغ نهایی سفارش</dt>
            <dd className="text-xl font-black text-[var(--primary)]">
              {formatPrice(order.totalAmountRial)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function LoginRequired() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[var(--background)] px-4 pt-20">
      <div className="max-w-md rounded-[2rem]  bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-white">
          <CircleUserRound className="size-8" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-dark">
          وارد حساب خود شوید
        </h1>
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          برای مشاهده پروفایل و سفارش‌ها ابتدا وارد شوید.
        </p>
        <Button
          onClick={() => window.dispatchEvent(new Event("cartivo-open-auth"))}
          className="mt-6 h-12 w-full rounded-xl"
        >
          ورود به حساب
        </Button>
      </div>
    </main>
  );
}
function Header({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-accent">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-black text-dark">{title}</h2>
      <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
    </div>
  );
}
function Field({
  label,
  icon: Icon,
  children,
  hint,
  error,
}: {
  label: string;
  icon: typeof UserRound;
  children: React.ReactNode;
  hint?: string | undefined;
  error?: string | undefined;
}) {
  return (
    <label className="text-xs font-bold text-text-muted">
      <span className="mb-2 flex items-center gap-1.5">
        <Icon className="size-3.5 text-text-secondary" />
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-2 block text-xs font-medium text-red-600">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-2 block text-[11px] font-medium text-text-secondary">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
function NavButton({
  active,
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  active: boolean;
  icon: typeof UserRound;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition",
        active
          ? "bg-primary text-white"
          : "text-text-secondary hover:bg-background hover:text-dark",
      )}
    >
      <Icon className="size-4" />
      {label}
      {badge != null && (
        <span
          className={cn(
            "mr-auto rounded-full px-2 py-0.5 text-[10px]",
            active ? "bg-white/15" : "bg-border/20",
          )}
        >
          {badge.toLocaleString("fa-IR")}
        </span>
      )}
    </button>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-24 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-center">
      <p className="font-black text-white">{value}</p>
      <p className="mt-1 text-[10px] text-white/45">{label}</p>
    </div>
  );
}
function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl  p-4">
      <p className="flex items-center gap-2 text-xs font-bold text-text-secondary">
        <Icon className="size-4" />
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-text-muted">{value}</p>
    </div>
  );
}
function formatPrice(value?: number) {
  return value == null ? "—" : `${value.toLocaleString("fa-IR")} ریال`;
}
function formatPercent(value?: number) {
  return value == null
    ? "—"
    : `${value.toLocaleString("fa-IR", { maximumFractionDigits: 2 })}٪`;
}
function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date);
}
function localPhone(value?: string) {
  return value?.startsWith("+98") ? `0${value.slice(3)}` : value || "";
}
