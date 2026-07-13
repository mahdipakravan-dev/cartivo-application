"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { BrandFrontofficeResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { PartFinder } from "./part-finder";

type HeroVariant = "default" | "boxed" | "full-primary";

interface HomeHeroProps {
  brands: BrandFrontofficeResponse[];
  variant?: HeroVariant;
}

type HeroHotspot = {
  id: string;
  label: string;
  top: string;
  left: string;
  size: string;
  delay: string;
  tooltipClassName?: string;
};

type HeroScene = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  accent: string;
  hotspots: HeroHotspot[];
};

const HERO_ROTATION_MS = 4000;
const HERO_SECTION_HEIGHT = {
  base: "min-h-[620px]",
  lg: "lg:min-h-[700px]",
  innerBase: "min-h-[520px]",
  innerLg: "lg:min-h-[580px]",
  imageBase: "min-h-[380px]",
  imageSm: "sm:min-h-[470px]",
  imageLg: "lg:min-h-[540px]",
} as const;
const HERO_SCENES = [
  {
    id: "exterior",
    imageSrc: "/images/home-hero/car-exterior.png",
    imageAlt: "نمای بیرونی خودرو",
    accent: "from-cyan-300/35 via-sky-300/10 to-transparent",
    hotspots: [
      {
        id: "body",
        label: "بدنه",
        top: "26%",
        left: "54%",
        size: "0.9rem",
        delay: "0ms",
        tooltipClassName: "-translate-x-1/2 -translate-y-[calc(100%+1.1rem)]",
      },
      {
        id: "glass",
        label: "شیشه جلو",
        top: "34%",
        left: "42%",
        size: "0.8rem",
        delay: "220ms",
        tooltipClassName: "-translate-x-[78%] -translate-y-[calc(100%+0.9rem)]",
      },
      {
        id: "wheel",
        label: "چرخ",
        top: "69%",
        left: "33%",
        size: "1rem",
        delay: "440ms",
        tooltipClassName: "-translate-x-[76%] translate-y-4",
      },
      {
        id: "mirror",
        label: "آیینه",
        top: "43%",
        left: "66%",
        size: "0.7rem",
        delay: "660ms",
        tooltipClassName: "translate-x-3 -translate-y-[calc(100%+0.7rem)]",
      },
      {
        id: "light",
        label: "چراغ",
        top: "50%",
        left: "24%",
        size: "0.85rem",
        delay: "880ms",
        tooltipClassName: "-translate-x-[82%] -translate-y-[calc(100%+0.4rem)]",
      },
    ],
  },
  {
    id: "interior",
    imageSrc: "/images/home-hero/car-innerior.png",
    imageAlt: "نمای فنی خودرو",
    accent: "from-amber-300/30 via-orange-300/10 to-transparent",
    hotspots: [
      {
        id: "engine",
        label: "موتور",
        top: "34%",
        left: "31%",
        size: "1rem",
        delay: "0ms",
        tooltipClassName: "-translate-x-[76%] -translate-y-[calc(100%+0.7rem)]",
      },
      {
        id: "steering",
        label: "فرمان",
        top: "32%",
        left: "61%",
        size: "0.82rem",
        delay: "200ms",
        tooltipClassName: "translate-x-3 -translate-y-[calc(100%+0.8rem)]",
      },
      {
        id: "gearbox",
        label: "جعبه دنده",
        top: "57%",
        left: "49%",
        size: "0.92rem",
        delay: "400ms",
        tooltipClassName: "-translate-x-1/2 translate-y-4",
      },
      {
        id: "pedal",
        label: "پدال",
        top: "63%",
        left: "59%",
        size: "0.72rem",
        delay: "600ms",
        tooltipClassName: "translate-x-3 translate-y-4",
      },
    ],
  },
] satisfies [HeroScene, ...HeroScene[]];

export function HomeHero({ brands, variant = "default" }: HomeHeroProps) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    if (variant !== "full-primary") return;

    const interval = window.setInterval(() => {
      setActiveSceneIndex((current) => (current + 1) % HERO_SCENES.length);
    }, HERO_ROTATION_MS);

    return () => window.clearInterval(interval);
  }, [variant]);

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
    const activeScene = HERO_SCENES[activeSceneIndex] ?? HERO_SCENES[0];

    return (
      <section
        className={cn(
          "relative isolate overflow-hidden bg-primary pt-24 text-white lg:pt-28",
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
          <div className="grid w-full items-center justify-between gap-14 lg:grid-cols-[minmax(460px,1.2fr)_minmax(0,0.9fr)] lg:gap-4">

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
            
            <div className="relative mx-auto w-full max-w-[860px] lg:mx-0">
              <div
                className={cn(
                  "relative",
                  HERO_SECTION_HEIGHT.imageBase,
                  HERO_SECTION_HEIGHT.imageSm,
                  HERO_SECTION_HEIGHT.imageLg
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-[14%_6%_10%_6%] rounded-full bg-gradient-to-br blur-3xl",
                    activeScene.accent
                  )}
                />

                {activeScene.hotspots.map((hotspot, index) => (
                  <HeroPulseDot
                    key={`${activeScene.id}-${hotspot.id}`}
                    hotspot={hotspot}
                    index={index}
                  />
                ))}

                <div className="scene-fade absolute inset-[2%_0_10%_0] flex items-center justify-center">
                    <Image
                      key={activeScene.id}
                      src={activeScene.imageSrc}
                      alt={activeScene.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 46vw, 96vw"
                      className="object-contain drop-shadow-[0_36px_70px_rgba(2,6,23,0.42)]"
                      priority
                    />
                </div>

                <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2.5">
                  {HERO_SCENES.map((scene, index) => {
                    const isActive = scene.id === activeScene.id;
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        aria-label={`نمایش اسلاید ${index + 1}`}
                        aria-pressed={isActive}
                        onClick={() => setActiveSceneIndex(index)}
                        className={cn(
                          "group relative h-2.5 rounded-full transition-all duration-500",
                          isActive ? "w-9 bg-white" : "w-2.5 bg-white/35 hover:bg-white/55"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute inset-0 rounded-full",
                            isActive && "slider-progress bg-gradient-to-r from-cyan-300 via-white to-cyan-200"
                          )}
                        />
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        </div>

        <style jsx>{`
          .scene-fade {
            animation: sceneFade 0.7s ease;
          }

          .slider-progress {
            animation: sliderProgress ${HERO_ROTATION_MS}ms linear infinite;
          }

          @keyframes sceneFade {
            from {
              opacity: 0;
              filter: blur(8px);
              transform: scale(0.985);
            }
            to {
              opacity: 1;
              filter: blur(0);
              transform: scale(1);
            }
          }

          @keyframes sliderProgress {
            from {
              clip-path: inset(0 100% 0 0 round 999px);
            }
            to {
              clip-path: inset(0 0 0 0 round 999px);
            }
          }
        `}</style>
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

function HeroPulseDot({
  hotspot,
  index,
}: {
  hotspot: HeroHotspot;
  index: number;
}) {
  return (
    <button
      type="button"
      aria-label={hotspot.label}
      title={hotspot.label}
      className="dot-enter absolute z-10 cursor-pointer"
      style={{
        top: hotspot.top,
        left: hotspot.left,
        width: hotspot.size,
        height: hotspot.size,
        animationDelay: `${index * 140}ms`,
      }}
    >
      <span className="absolute inset-0 rounded-full bg-white/95 shadow-[0_0_0_5px_rgba(255,255,255,0.08),0_0_30px_rgba(103,232,249,0.95)]" />
      <span
        className="ring-pulse absolute inset-[-0.55rem] rounded-full border border-cyan-200/60"
        style={{ animationDelay: hotspot.delay }}
      />
      <span
        className="ring-pulse absolute inset-[-1rem] rounded-full border border-cyan-200/25"
        style={{ animationDelay: hotspot.delay }}
      />
      <span className="absolute left-1/2 top-1/2 h-[180%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-200/60 to-transparent opacity-70" />
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-white/15 bg-slate-950/72 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_14px_35px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:text-xs",
          hotspot.tooltipClassName
        )}
      >
        {hotspot.label}
      </span>

      <style jsx>{`
        .dot-enter {
          animation: dotEnter 0.7s cubic-bezier(0.2, 0.9, 0.25, 1) both;
        }

        .ring-pulse {
          animation: ringPulse 2.6s ease-out infinite;
        }

        @keyframes dotEnter {
          from {
            opacity: 0;
            transform: scale(0.72);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .dot-enter:hover,
        .dot-enter:focus-visible {
          transform: scale(1.08);
          outline: none;
        }

        @keyframes ringPulse {
          from {
            opacity: 0.75;
            transform: scale(0.82);
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }
      `}</style>
    </button>
  );
}
