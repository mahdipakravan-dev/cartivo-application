"use client";

import Image from "next/image";

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

interface AdvertisementImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

function AdvertisementImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
}: AdvertisementImageProps) {
  return (
    <figure
      className={cn(
        "relative isolate min-h-56 overflow-hidden rounded-2xl bg-slate-100",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={cn("object-cover", imageClassName)}
        priority={priority}
      />
    </figure>
  );
}

function AdvertisementHero({ brands }: { brands: BrandFrontofficeResponse[] }) {
  return (
    <section className="bg-background pb-12 pt-24 lg:pb-16 lg:pt-38">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-12">
          <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-7 lg:col-span-4">
            <h1 className="mb-6 text-2xl font-black text-foreground">
              خودروی خود را انتخاب کنید
            </h1>
            <PartFinder
              brands={brands}
              layout="stacked"
              searchButtonClassName="bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </aside>

          <AdvertisementImage
            src="/images/home-hero/car-innerior.png"
            alt="نمای قطعات داخلی خودرو"
            className="min-h-[320px] lg:col-span-8"
            priority
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
            <AdvertisementImage
              src="/images/home-hero/car-kapra.png"
              alt="لوازم و قطعات خودروی کاپرا"
              imageClassName="object-contain p-4"
            />
            <AdvertisementImage
              src="/images/home-hero/car-benz.png"
              alt="لوازم و قطعات مرسدس بنز"
              imageClassName="object-contain p-4"
            />
          </div>

          <AdvertisementImage
            src="/images/home-hero/car-exterior.png"
            alt="نمای قطعات بیرونی خودرو"
            className="min-h-[456px] lg:col-span-6"
          />

          <AdvertisementImage
            src="/images/home-hero/car-jack.png"
            alt="لوازم و قطعات جک"
            className="min-h-[456px] lg:col-span-3"
            imageClassName="object-contain p-5"
          />
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
              <div className="pointer-events-none absolute inset-[10%_8%_5%] rounded-full bg-gradient-to-br from-cyan-300/30 via-sky-300/10 to-transparent blur-3xl" />
              <div className="pointer-events-none absolute inset-x-[8%] bottom-[7%] h-[12%] rounded-[50%] bg-slate-950/45 blur-2xl" />

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
