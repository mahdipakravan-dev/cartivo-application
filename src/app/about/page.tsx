import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  BadgeCheck,
  CarFront,
  Check,
  ChevronLeft,
  CircleGauge,
  Handshake,
  HeartHandshake,
  PackageSearch,
  Route,
  SearchCheck,
  ShieldCheck,
  Store,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "درباره کارتیو",
  description:
    "با داستان، ماموریت و ارزش‌های کارتیو؛ همراه مسیر خرید هوشمند قطعات خودرو، آشنا شوید.",
};

const values = [
  {
    icon: SearchCheck,
    title: "شفافیت در انتخاب",
    description:
      "اطلاعات قطعه، قیمت و فروشنده باید روشن باشد تا با اطمینان تصمیم بگیرید.",
  },
  {
    icon: CarFront,
    title: "سازگاری قبل از خرید",
    description:
      "انتخاب قطعه باید از خودروی شما شروع شود؛ نه از حدس و آزمون‌وخطا.",
  },
  {
    icon: ShieldCheck,
    title: "اعتماد در هر مرحله",
    description:
      "از لحظه جست‌وجو تا پیگیری سفارش، مسیر خرید باید قابل‌فهم و قابل‌پیگیری بماند.",
  },
  {
    icon: HeartHandshake,
    title: "همراهی، نه فقط فروش",
    description:
      "هدف ما یک خرید مقطعی نیست؛ می‌خواهیم در مسیر نگهداری از خودرو کنار شما باشیم.",
  },
] as const;

const connections = [
  {
    icon: CarFront,
    title: "راننده‌ها",
    description: "جست‌وجوی ساده‌تر و انتخابی با اطمینان بیشتر",
  },
  {
    icon: Store,
    title: "فروشندگان",
    description: "دیده‌شدن بهتر و مسیری شفاف‌تر برای فروش آنلاین",
  },
  {
    icon: PackageSearch,
    title: "بازار قطعات",
    description: "اطلاعات منسجم‌تر و ارتباطی نزدیک‌تر میان عرضه و نیاز",
  },
] as const;

export default function AboutPage() {
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
              درباره کارتیو
            </li>
          </ol>
        </nav>

        <header className="relative isolate min-h-[35rem] overflow-hidden rounded-[2rem] bg-[#111923] text-white shadow-[0_28px_80px_rgb(15_23_42/0.16)] sm:min-h-[32rem]">
          <Image
            src="/images/about/open-road-hero.webp"
            alt="خودرویی در مسیر کوهستانی هنگام طلوع آفتاب"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 1600px"
            className="object-cover object-center sm:object-left"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(9_15_23/0.15)_0%,rgb(9_15_23/0.48)_45%,rgb(9_15_23/0.96)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(9_15_23/0.85)_0%,transparent_55%)] sm:bg-none" />
          <div className="relative z-10 flex min-h-[35rem] max-w-3xl flex-col justify-between px-6 py-8 sm:min-h-[32rem] sm:px-10 sm:py-11 lg:px-14 lg:py-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md">
                <Route className="size-4 text-accent-light" aria-hidden="true" />
                داستان کارتیو
              </span>
              <h1 className="mt-6 max-w-2xl text-3xl font-black leading-[1.5] text-balance sm:text-4xl lg:text-[3.25rem]">
                همراه مسیر شما، در هر انتخاب و هر کیلومتر
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-8 text-white/75 sm:text-base">
                کارتیو برای ساده‌تر کردن بازار قطعات خودرو شکل گرفته است؛ جایی که انتخاب درست، اطلاعات شفاف و فروشنده مطمئن به هم می‌رسند.
              </p>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link
                href={ROUTES.parts}
                className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgb(246_107_27/0.25)] transition-colors hover:bg-[#dc5710] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                پیدا کردن قطعه
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
              <a
                href="#our-story"
                className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg px-2 text-sm font-bold text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                ادامه داستان ما
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </header>

        <div className="relative z-20 -mt-5 mx-4 grid gap-2 rounded-2xl border border-border/60 bg-white p-3 shadow-[0_18px_50px_rgb(15_23_42/0.1)] sm:mx-10 sm:grid-cols-3 sm:gap-0 sm:p-4 lg:mx-16">
          {[
            { icon: BadgeCheck, label: "انتخاب مطمئن" },
            { icon: CircleGauge, label: "اطلاعات شفاف" },
            { icon: Handshake, label: "همراهی در مسیر" },
          ].map(({ icon: Icon, label }, index) => (
            <div
              key={label}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-black text-dark sm:text-sm ${index > 0 ? "sm:border-r sm:border-border/60" : ""}`}
            >
              <Icon className="size-4 text-accent" aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
      </div>

      <section id="our-story" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="story-title">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_.92fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-xs font-black text-accent">از یک پرسش ساده</p>
              <h2 id="story-title" className="mt-3 text-2xl font-black leading-[1.55] text-dark sm:text-4xl">
                چرا پیدا کردن قطعه درست باید این‌قدر سخت باشد؟
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-8 text-text-muted sm:text-base">
                <p>
                  بازار قطعات خودرو پر از انتخاب است، اما اطلاعات پراکنده، نگرانی از سازگاری و مسیر پیچیده خرید، تصمیم‌گیری را دشوار می‌کند.
                </p>
                <p>
                  کارتیو می‌خواهد این فاصله را کم کند؛ با یک تجربه یکپارچه که خودرو، قطعه و فروشنده را دقیق‌تر به هم متصل می‌کند.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {["جست‌وجوی دقیق‌تر", "مقایسه روشن‌تر", "پیگیری ساده‌تر"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white px-3 py-2 text-xs font-bold text-text-muted">
                    <Check className="size-3.5 text-accent" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <figure className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-muted shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
              <Image
                src="/images/about/cartivo-team.webp"
                alt="تیم کارتیو در حال بررسی قطعات و اطلاعات محصول"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-dark/80 px-4 py-3 text-xs font-bold leading-6 text-white backdrop-blur-md sm:inset-x-auto sm:right-4">
                پیوند دانش قطعه، فناوری و تجربه انسانی
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20" aria-labelledby="values-title">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black text-accent">آنچه راه را نشانمان می‌دهد</p>
            <h2 id="values-title" className="mt-3 text-2xl font-black text-dark sm:text-4xl">
              ارزش‌هایی که تجربه کارتیو را می‌سازند
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[1.5rem] border border-border/60 bg-background p-6">
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

      <section className="py-16 sm:py-20" aria-labelledby="connection-title">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#111923] px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
            <div className="absolute -left-24 -top-24 size-72 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative">
              <div className="max-w-3xl">
                <p className="text-xs font-black text-accent-light">کارتیو یک پل است</p>
                <h2 id="connection-title" className="mt-3 text-2xl font-black leading-[1.5] sm:text-4xl">
                  نزدیک‌تر کردن آدم‌ها، اطلاعات و قطعات
                </h2>
                <p className="mt-4 text-sm leading-8 text-white/65">
                  ما بازاری می‌سازیم که در آن هر طرف ارتباط، مسیر روشن‌تری پیش رو دارد.
                </p>
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {connections.map(({ icon: Icon, title, description }) => (
                  <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-accent/15 text-accent-light">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-black">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/60">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-4 pt-2" aria-labelledby="about-cta-title">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-[1.75rem] border border-border/60 bg-white px-6 py-8 shadow-[0_14px_45px_rgb(15_23_42/0.06)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <h2 id="about-cta-title" className="text-xl font-black text-dark sm:text-2xl">
                مسیر بعدی از خودروی شما شروع می‌شود
              </h2>
              <p className="mt-2 text-sm leading-7 text-text-muted">
                خودرو یا قطعه موردنظر را انتخاب کنید؛ ما بقیه راه را روشن‌تر می‌کنیم.
              </p>
            </div>
            <Link
              href={ROUTES.parts}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              شروع جست‌وجو
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
