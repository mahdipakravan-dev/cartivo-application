"use client";

import Image from "next/image";
import Link from "next/link";

import type { BrandFrontofficeResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { PartFinder } from "./part-finder";

type HeroVariant = "full-primary" | "advertisement";

interface HomeHeroProps {
  brands: BrandFrontofficeResponse[];
  variant?: HeroVariant;
}

const HERO_SECTION_HEIGHT = {
  base: "min-h-[620px]",
  lg: "lg:min-h-[700px]",
  innerBase: "min-h-[520px]",
  innerLg: "lg:min-h-[580px]",
  imageBase: "min-h-[280px]",
  imageSm: "sm:min-h-[380px]",
  imageLg: "lg:min-h-[500px]",
} as const;

type AdvertisementPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "bottom-left";
type AdvertisementButtonVariant = "light" | "outline" | "accent";

interface AdvertisementCardProps {
  src: string;
  alt: string;
  text: {
    title: string;
    description: string;
  };
  position: AdvertisementPosition;
  buttonVariant: AdvertisementButtonVariant;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  buttonLabel?: string;
}

const advertisementPositions: Record<AdvertisementPosition, string> = {
  "top-left": "items-start justify-end text-right",
  "top-center": "items-start justify-center text-center",
  "top-right": "items-start justify-start text-right",
  "center-left": "items-center justify-end text-right",
  "bottom-left": "items-end justify-end text-right",
};

const advertisementGradients: Record<AdvertisementPosition, string> = {
  "top-left": "bg-gradient-to-b from-black/45 via-transparent to-transparent",
  "top-center": "bg-gradient-to-b from-black/50 via-transparent to-transparent",
  "top-right": "bg-gradient-to-bl from-black/45 via-transparent to-transparent",
  "center-left": "bg-gradient-to-r from-black/50 via-black/5 to-transparent",
  "bottom-left": "bg-gradient-to-t from-black/60 via-black/5 to-transparent",
};

const advertisementButtons: Record<AdvertisementButtonVariant, string> = {
  light: "border-white bg-white text-primary hover:bg-white/90",
  outline: "border-white/80 bg-black/20 text-white hover:bg-white hover:text-dark",
  accent:
    "border-orange-500 bg-orange-500 text-white hover:border-orange-400 hover:bg-orange-400",
};

interface AdvertisementContentProps {
  text: AdvertisementCardProps["text"];
  position: AdvertisementPosition;
  buttonVariant: AdvertisementButtonVariant;
  buttonLabel?: string;
}

function AdvertisementContent({
  text,
  position,
  buttonVariant,
  buttonLabel = "مشاهده",
}: AdvertisementContentProps) {
  const centered = position === "top-center";

  return (
    <div
      dir="rtl"
      className={cn(
        "absolute inset-0 z-10 flex p-5 text-white sm:p-6",
        advertisementPositions[position],
        advertisementGradients[position],
      )}
    >
      <div
        className={cn(
          "relative isolate flex max-w-[82%] flex-col gap-1.5 sm:max-w-[72%]",
          centered ? "items-center text-center" : "items-start text-right",
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-7 -inset-y-5 -z-10 rounded-[2rem] bg-black/80 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-3 -inset-y-2 -z-10 rounded-2xl bg-black/35 blur-md"
        />

        <h2 className="whitespace-pre-line text-[clamp(1.125rem,4.2cqw,1.875rem)] font-black leading-[1.22] tracking-[-0.035em] text-white [text-shadow:0_3px_14px_rgba(0,0,0,1),0_1px_3px_rgba(0,0,0,1)]">
          {text.title}
        </h2>
        <p className="whitespace-pre-line text-[clamp(0.7rem,2.25cqw,0.875rem)] font-semibold leading-[1.65] text-white/95 [text-shadow:0_2px_8px_rgba(0,0,0,1)]">
          {text.description}
        </p>
        <Link
          href="/parts"
          className={cn(
            "mt-1.5 inline-flex min-h-8 items-center justify-center gap-1.5 rounded-full border px-4 py-1.5 text-[clamp(0.675rem,1.8cqw,0.75rem)] font-bold shadow-lg backdrop-blur-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
            advertisementButtons[buttonVariant],
          )}
        >
          {buttonLabel}
          <span className="text-sm leading-none" aria-hidden="true">
            ←
          </span>
        </Link>
      </div>
    </div>
  );
}

function AdvertisementCard({
  src,
  alt,
  text,
  position,
  buttonVariant,
  className,
  imageClassName,
  priority = false,
  buttonLabel = "مشاهده",
}: AdvertisementCardProps) {
  return (
    <figure
      className={cn(
        "@container relative isolate min-h-56 overflow-hidden rounded-2xl bg-[var(--dark)]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className={cn("object-cover", imageClassName)}
        priority={priority}
      />
      <AdvertisementContent
        text={text}
        position={position}
        buttonVariant={buttonVariant}
        buttonLabel={buttonLabel}
      />
    </figure>
  );
}

const advertisementItems: AdvertisementCardProps[] = [
  {
    src: "/images/advertisements/article-brakes.webp",
    alt: "خودروی سفید برای انتخاب قطعات بدنه",
    text: {
      title: "قطعه مناسب خودروی شما",
      description: "قطعات سازگار با خودروی خود را پیدا کنید",
    },
    position: "bottom-left",
    buttonVariant: "light",
    buttonLabel: "مشاهده قطعات",
    className: "col-span-2 aspect-[16/9] min-h-0 sm:aspect-auto",
    imageClassName: "object-center",
  },
  {
    src: "/images/advertisements/hero-brake-sale-clean.webp",
    alt: "۳۰ درصد تخفیف دیسک ترمز",
    text: {
      title: "۳۰٪ تخفیف\nدیسک ترمز",
      description: "فرصتی ویژه برای خرید مطمئن",
    },
    position: "center-left",
    buttonVariant: "outline",
    className: "col-span-2 aspect-[16/9] min-h-0 sm:aspect-auto",
    priority: true,
  },
  {
    src: "/images/advertisements/hero-brake-pads-clean.webp",
    alt: "لنت ترمز؛ امنیت در هر مسیر",
    text: {
      title: "لنت ترمز",
      description: "امنیت در هر مسیر",
    },
    position: "top-right",
    buttonVariant: "outline",
    className: "col-span-2 aspect-[16/9] min-h-0 sm:aspect-auto",
  },
  {
    src: "/images/advertisements/hero-air-filter-clean.webp",
    alt: "فیلتر هوا؛ هوای پاک و عملکرد بهتر",
    text: {
      title: "فیلتر هوا",
      description: "هوای پاک، عملکرد بهتر",
    },
    position: "top-center",
    buttonVariant: "accent",
    className: "aspect-[9/16] min-h-0 sm:aspect-auto",
  },
  {
    src: "/images/advertisements/hero-suspension-clean.webp",
    alt: "قطعات جلوبندی؛ کنترل بیشتر و رانندگی مطمئن",
    text: {
      title: "قطعات جلوبندی",
      description: "کنترل بیشتر، رانندگی مطمئن",
    },
    position: "top-left",
    buttonVariant: "outline",
    className: "aspect-[9/16] min-h-0 sm:aspect-auto",
  },
];

function AdvertisementHero({ brands }: { brands: BrandFrontofficeResponse[] }) {
  return (
    <section
      className="bg-background pb-12 pt-24 lg:pb-16 lg:pt-38"
      aria-label="ویترین قطعات خودرو"
    >
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="flex flex-col justify-center rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-7 lg:order-2 lg:col-span-5">
            <h1 className="mb-6 text-2xl font-black text-foreground">
              خودروی خود را انتخاب کنید
            </h1>
            <PartFinder
              brands={brands}
              layout="stacked"
              searchButtonClassName="bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </div>

          <div
            dir="ltr"
            className="grid grid-cols-2 gap-3 sm:aspect-[8/5] sm:grid-cols-4 sm:grid-rows-2 sm:gap-4 lg:order-1 lg:col-span-7"
            aria-label="پیشنهادهای ویژه قطعات"
          >
            {advertisementItems.map((item) => (
              <AdvertisementCard key={item.src} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FullPrimaryHero({ brands }: { brands: BrandFrontofficeResponse[] }) {
  return (
    <section
      className={cn(
        "relative z-10 isolate overflow-x-clip bg-primary pt-24 text-primary-foreground lg:pt-28",
        HERO_SECTION_HEIGHT.base,
        HERO_SECTION_HEIGHT.lg,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_38%,rgba(103,232,249,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/15" />

      <div
        className={cn(
          "container-cartivo relative z-10 flex items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16",
          HERO_SECTION_HEIGHT.innerBase,
          HERO_SECTION_HEIGHT.innerLg,
        )}
      >
        <div className="grid w-full items-center justify-between gap-2 sm:gap-8 lg:grid-cols-[minmax(460px,1.2fr)_minmax(0,0.9fr)] lg:gap-6">
          <div className="max-w-2xl justify-self-start text-right">
            <p className="mb-4 inline-flex rounded-full px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
              جست‌وجوی سریع قطعات یدکی
            </p>
            <h1 className="mb-4 text-3xl font-black leading-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              جست و جوی قطعات خودرو
            </h1>
            <p className="mb-8 mr-auto max-w-xl text-base leading-relaxed text-white/80 lg:text-lg">
              قطعات خودروی شما، جامع، اصیل و دارای ضمانت با امکان خرید اقساطی
            </p>

            <div className="max-w-xl">
              <PartFinder
                brands={brands}
                searchButtonClassName="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[760px] lg:mx-0">
            <figure
              aria-label="ویترین خودروها"
              className={cn(
                "relative isolate",
                HERO_SECTION_HEIGHT.imageBase,
                HERO_SECTION_HEIGHT.imageSm,
                HERO_SECTION_HEIGHT.imageLg,
              )}
            >
              <div className="pointer-events-none absolute inset-[10%_8%_5%] rounded-full bg-gradient-to-br from-accent/30 via-accent/10 to-transparent blur-3xl" />
              <div className="pointer-events-none absolute inset-x-[8%] bottom-[7%] h-[12%] rounded-[50%] bg-dark/45 blur-2xl" />

              <div
                role="group"
                aria-label="خودروها در یک ردیف"
                dir="ltr"
                className="absolute inset-x-0 bottom-[5%] z-10 h-[86%]"
              >
                <span className="absolute bottom-[9%] left-0 z-10 aspect-[4/3] w-[56%] sm:w-[50%] lg:left-[2%]">
                  <Image
                    src="/images/home-hero/car-kapra.png"
                    alt="کاپرا نقره‌ای"
                    fill
                    sizes="(min-width: 1024px) 20vw, 48vw"
                    className="object-contain object-bottom drop-shadow-[0_24px_38px_rgba(2,6,23,0.42)]"
                  />
                </span>

                <span className="absolute bottom-[2%] left-1/2 z-30 aspect-[4/3] w-[68%] -translate-x-1/2 sm:w-[61%]">
                  <Image
                    src="/images/home-hero/car-jack.png"
                    alt="جک S5 سفید"
                    fill
                    sizes="(min-width: 1024px) 24vw, 58vw"
                    className="object-contain object-bottom drop-shadow-[0_26px_42px_rgba(2,6,23,0.48)]"
                  />
                </span>

                <span className="absolute bottom-[8%] right-0 z-20 aspect-[4/3] w-[56%] sm:w-[50%] lg:right-[2%]">
                  <Image
                    src="/images/home-hero/car-benz.png"
                    alt="مرسدس بنز C200 سفید"
                    fill
                    sizes="(min-width: 1024px) 20vw, 48vw"
                    className="object-contain object-bottom drop-shadow-[0_24px_38px_rgba(2,6,23,0.46)]"
                    priority
                  />
                </span>
              </div>

              <figcaption className="sr-only">
                مجموعه‌ای از خودروهای سواری، شاسی‌بلند و پیکاپ برای جست‌وجوی
                قطعات سازگار
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeHero({ brands, variant = "full-primary" }: HomeHeroProps) {
  if (variant === "advertisement") {
    return <AdvertisementHero brands={brands} />;
  }

  return <FullPrimaryHero brands={brands} />;
}
