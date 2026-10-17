import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Boxes,
  Check,
  ChevronLeft,
  CircleDollarSign,
  ClipboardCheck,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { SellerLeadForm } from "./_components/seller-lead-form";

export const metadata: Metadata = {
  title: "فروشنده کارتیو شوید",
  description:
    "به جمع فروشندگان قطعات خودرو در کارتیو بپیوندید و فروش آنلاین خود را گسترش دهید.",
};

const benefits = [
  {
    icon: Users,
    title: "دسترسی به مشتریان جدید",
    description:
      "محصولات شما در مسیر جست‌وجوی خریداران واقعی قطعات خودرو دیده می‌شود.",
  },
  {
    icon: BarChart3,
    title: "فروش ساختاریافته",
    description:
      "موجودی، قیمت و سفارش‌های خود را در یک مسیر شفاف و قابل‌پیگیری مدیریت کنید.",
  },
  {
    icon: ShieldCheck,
    title: "همکاری مطمئن",
    description:
      "قواعد روشن، پیگیری سفارش و پشتیبانی کارشناسان به شما کمک می‌کند با اطمینان رشد کنید.",
  },
  {
    icon: Headphones,
    title: "پشتیبانی در مسیر",
    description:
      "از راه‌اندازی فروشگاه تا ثبت محصول و بهبود فروش، کارشناسان کارتیو کنار شما هستند.",
  },
] as const;

const steps = [
  {
    icon: ClipboardCheck,
    number: "۰۱",
    title: "ثبت درخواست",
    description: "شماره موبایل خود را در فرم وارد کنید.",
  },
  {
    icon: Headphones,
    number: "۰۲",
    title: "مشاوره کوتاه",
    description: "مدل همکاری و نیازهای فروشگاه شما را بررسی می‌کنیم.",
  },
  {
    icon: Store,
    number: "۰۳",
    title: "شروع فروش",
    description: "پس از تکمیل اطلاعات، محصولات شما آماده نمایش می‌شوند.",
  },
] as const;

export default function SellWithCartivoPage() {
  return (
    <div className="overflow-hidden bg-background pb-20 pt-8 sm:pt-24">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <nav aria-label="مسیر ناوبری" className="mb-5 text-xs text-text-muted sm:mb-7">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                href={ROUTES.home}
                className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                خانه
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronLeft className="size-3" />
            </li>
            <li aria-current="page" className="font-bold text-dark">
              همکاری با کارتیو
            </li>
          </ol>
        </nav>

        <header className="relative isolate overflow-hidden rounded-[2rem] bg-primary text-white shadow-[0_28px_80px_rgb(15_23_42/0.16)]">
          <div className="absolute -right-32 -top-40 size-[28rem] rounded-full border border-white/10" />
          <div className="absolute -right-16 -top-24 size-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 left-1/4 size-80 rounded-full bg-accent/15 blur-3xl" />
          <div className="grid gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_.75fr] lg:items-center lg:gap-16 lg:px-14 lg:py-16">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-accent-light">
                <Sparkles className="size-4" aria-hidden="true" />
                همکاری برای رشد فروش
              </span>
              <h1 className="mt-6 max-w-3xl text-3xl font-black leading-[1.5] text-balance sm:text-4xl lg:text-5xl">
                فروشگاه شما، در مسیر هزاران خریدار قطعات خودرو
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
                به جمع فروشندگان کارتیو بپیوندید؛ بازار آنلاین خود را گسترش دهید و با
                ابزارهای مدیریتی و پشتیبانی تخصصی، متمرکزتر بفروشید.
              </p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-white/75 sm:text-sm">
                {["شروع ساده", "پشتیبانی کارشناسی", "مدیریت شفاف"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-accent/15 text-accent-light">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
              <a
                href="#seller-callback-form"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary lg:hidden"
              >
                ثبت درخواست همکاری
                <ArrowLeft className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="relative z-10">
              <SellerLeadForm />
            </div>
          </div>
        </header>
      </div>

      <section className="py-16 sm:py-20" aria-labelledby="seller-benefits-title">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black text-accent">چرا کارتیو؟</p>
            <h2 id="seller-benefits-title" className="mt-3 text-2xl font-black text-dark sm:text-4xl">
              زیرساخت فروش آنلاین، بدون پیچیدگی اضافی
            </h2>
            <p className="mt-4 text-sm leading-8 text-text-muted sm:text-base">
              شما روی محصول و مشتری متمرکز بمانید؛ ما مسیر دیده‌شدن و مدیریت سفارش را روان‌تر می‌کنیم.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-border/60 bg-white p-6 shadow-[0_10px_35px_rgb(15_23_42/0.04)]"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-black text-dark">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20" aria-labelledby="seller-flow-title">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-black text-accent">
                <BadgeCheck className="size-4" aria-hidden="true" />
                مسیر همکاری
              </span>
              <h2 id="seller-flow-title" className="mt-4 text-2xl font-black leading-[1.5] text-dark sm:text-4xl">
                سه قدم تا شروع فروش در کارتیو
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-text-muted">
                فرآیند اولیه کوتاه است. کارشناس ما اطلاعات دقیق‌تر و شرایط همکاری را در تماس توضیح می‌دهد.
              </p>
              <a
                href="#seller-callback-form"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                من هم فروشنده می‌شوم
                <ArrowLeft className="size-4" aria-hidden="true" />
              </a>
              <figure className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border/60 bg-muted shadow-[0_18px_50px_rgb(15_23_42/0.1)]">
                <Image
                  src="/images/sell-with-cartivo/seller-inventory.webp"
                  alt="فروشنده قطعات خودرو در حال بررسی موجودی فروشگاه"
                  fill
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="object-cover"
                />
                <figcaption className="absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-dark/80 px-4 py-3 text-xs font-bold leading-6 text-white backdrop-blur-md">
                  موجودی شما، در مسیر دیده‌شدن و فروش بیشتر
                </figcaption>
              </figure>
            </div>
            <ol className="grid gap-4">
              {steps.map(({ icon: Icon, number, title, description }) => (
                <li
                  key={number}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-border/60 bg-background p-4 sm:gap-5 sm:p-5"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm sm:size-14">
                    <Icon className="size-5 sm:size-6" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-base font-black text-dark">{title}</strong>
                    <span className="mt-1 block text-sm leading-7 text-text-muted">{description}</span>
                  </span>
                  <span className="text-2xl font-black text-border sm:text-3xl" aria-hidden="true">
                    {number}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="seller-operations-title">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#111923] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
            <div className="absolute -left-24 -top-24 size-72 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_.95fr] lg:items-center lg:gap-12">
              <div>
                <p className="text-xs font-black text-accent-light">یک همکاری عملی</p>
                <h2 id="seller-operations-title" className="mt-3 text-2xl font-black leading-[1.5] sm:text-4xl">
                  از قفسه فروشگاه تا درِ خانه مشتری
                </h2>
                <p className="mt-4 text-sm leading-8 text-white/65">
                  موجودی و اطلاعات محصول را به‌روز نگه دارید؛ کارتیو به ساختن یک تجربه خرید شفاف و قابل‌اعتماد کمک می‌کند.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: Boxes, label: "مدیریت موجودی و قیمت" },
                    { icon: PackageCheck, label: "پیگیری وضعیت سفارش" },
                    { icon: Truck, label: "هماهنگی مرسوله" },
                    { icon: CircleDollarSign, label: "فرآیند مالی شفاف" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-light">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-bold text-white/80">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <figure className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-2xl lg:aspect-[4/5]">
                <Image
                  src="/images/sell-with-cartivo/order-fulfillment.webp"
                  alt="بسته‌بندی ایمن دیسک ترمز در انبار قطعات خودرو"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center lg:object-[42%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/35 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 right-4 rounded-xl border border-white/15 bg-dark/75 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md">
                  آماده‌سازی دقیق، تحویل مطمئن
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
