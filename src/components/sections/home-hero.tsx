"use client";

import Image from "next/image";

import type { BrandFrontofficeResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { PartFinder } from "./part-finder";

type HeroVariant = "default" | "boxed" | "full-primary";

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

export function HomeHero({ brands, variant = "default" }: HomeHeroProps) {
  if (variant === "boxed") {
    return (
      <section className={
        cn(
          "relative px-4 py-10 sm:px-6 lg:px-8",
          variant === "boxed" && "mt-8"
        )
      }>
        <div className="container-cartivo overflow-hidden rounded-3xl bg-[#14305A] shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Image - Left side */}
            <div className="relative w-full lg:w-1/2">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-60"
                style={{
                  backgroundImage: "url(https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/8272c8ed3_generated_0cb84b85.png)",
                }}
              />
            </div>

            {/* Content - Right side */}
            <div className="relative flex w-full items-center p-8 sm:p-12 lg:w-1/2 lg:p-16">
              <div className="w-full max-w-lg">
                <h1 className="mb-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  قطعات خودروی شما
                </h1>
                <p className="mb-8 text-base leading-relaxed text-white/80 lg:text-lg">
                  برند و مدل خودروی خود را انتخاب کنید تا قطعات سازگار را مشاهده
                  کنید
                </p>

                {/* Search Card */}
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
                  <PartFinder
                    brands={brands}
                    searchButtonClassName="bg-white text-[#14305A] hover:bg-white/90"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "full-primary") {
    return (
      <section
        className={cn(
          "relative z-10 isolate overflow-x-clip bg-primary pt-24 text-white lg:pt-28",
          HERO_SECTION_HEIGHT.base,
          HERO_SECTION_HEIGHT.lg
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_38%,rgba(103,232,249,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/15" />

        <div
          className={cn(
            "container-cartivo relative z-10 flex items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16",
            HERO_SECTION_HEIGHT.innerBase,
            HERO_SECTION_HEIGHT.innerLg
          )}
        >
          <div className="grid w-full items-center justify-between gap-2 sm:gap-8 lg:grid-cols-[minmax(460px,1.2fr)_minmax(0,0.9fr)] lg:gap-6">

            <div className="max-w-2xl justify-self-start text-right">
              <p className="mb-4 inline-flex rounded-full  px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
                جست‌وجوی سریع قطعات یدکی
              </p>
              <h1 className="mb-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                جست و جوی قطعات خودرو
              </h1>
              <p className="mb-8 mr-auto max-w-xl text-base leading-relaxed text-white/80 lg:text-lg">
              قطعات خودروی شما , جامع , اصیل و دارای ضمانت با امکان خرید اقساطی
              </p>

              <div className="max-w-xl">
                <PartFinder
                  brands={brands}
                  searchButtonClassName="bg-white text-primary hover:bg-white/90"
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
                  HERO_SECTION_HEIGHT.imageLg
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

  return (
    <section
      className="relative flex min-h-[600px] items-center bg-cover bg-center bg-no-repeat pt-16 lg:min-h-[680px] lg:pt-20"
      style={{ backgroundImage: "var(--cartivo-hero-background)" }}
    >
      {/* Content */}
      <div className="relative z-10 w-full container-cartivo px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            قطعات خودروی شما
          </h1>
          <p className="mb-8 text-base leading-relaxed text-white/80 lg:text-lg">
            برند و مدل خودروی خود را انتخاب کنید تا قطعات سازگار را مشاهده
            کنید
          </p>

          {/* Search Card */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
            <PartFinder
              brands={brands}
              searchButtonClassName="bg-[#14305A] text-white hover:bg-[#1a3d6f]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
