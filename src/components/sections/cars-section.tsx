"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { CarFrontofficeDetailResponse } from "@/lib/api/types";

const MARQUEE_LIMIT = 10;

function CarPill({
  car,
  brandSlug,
  brandName,
}: {
  car: CarFrontofficeDetailResponse;
  brandSlug: string;
  brandName: string;
}) {
  const primaryImage = car.imageUrls?.[0];
  const carName = [brandName, car.model, car.trimLevel]
    .filter(Boolean)
    .join(" ");
  const year = car.year?.toLocaleString("fa-IR", { useGrouping: false });

  return (
    <a
      href={`/parts/${brandSlug}/${car.id}`}
      className="group/car flex shrink-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 py-2.5 pl-3 pr-2.5 transition duration-300 hover:border-slate-200 hover:bg-white hover:shadow-md"
      aria-label={`${carName} — مشاهده قطعات سازگار`}
    >
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[radial-gradient(circle_at_center,#fff_0%,#f1f5f9_75%)]">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage}
            alt={carName}
            className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover/car:scale-110"
            loading="lazy"
          />
        ) : (
          <svg
            className="size-6 text-slate-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold text-slate-800">
          {car.model || "مدل خودرو"}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-slate-400">
          {[car.trimLevel, year].filter(Boolean).join(" — ") || "مشاهده قطعات"}
        </p>
      </div>
      <ChevronLeft className="size-3.5 shrink-0 text-slate-300 transition-colors group-hover/car:text-[#14305A]" />
    </a>
  );
}

function CarCard({
  car,
  brandSlug,
  brandName,
}: {
  car: CarFrontofficeDetailResponse;
  brandSlug: string;
  brandName: string;
}) {
  const primaryImage = car.imageUrls?.[0];
  const carName = [brandName, car.model, car.trimLevel]
    .filter(Boolean)
    .join(" ");
  const year = car.year?.toLocaleString("fa-IR", { useGrouping: false });

  return (
    <a
      href={`/parts/${brandSlug}/${car.id}`}
      className="group/car overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 outline-none transition duration-300 hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow-[0_18px_40px_rgb(15_23_42/0.08)] focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${carName} — مشاهده قطعات سازگار`}
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#fff_0%,#f1f5f9_75%)] p-4 sm:p-5">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage}
            alt={carName}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover/car:scale-105 sm:p-5"
            loading="lazy"
          />
        ) : (
          <svg
            className="size-14 text-slate-200 transition-colors group-hover/car:text-cyan-600/30"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        )}
        <span className="absolute right-3 top-3 rounded-lg border border-white/80 bg-white/80 px-2 py-1 text-[9px] font-bold text-slate-500 shadow-sm backdrop-blur-sm">
          {brandName}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3.5">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-extrabold text-slate-800">
            {car.model || "مدل خودرو"}
          </h3>
          <p className="mt-0.5 truncate text-[10px] text-slate-400">
            {[car.trimLevel, year].filter(Boolean).join(" — ") || "مشاهده قطعات سازگار"}
          </p>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover/car:bg-primary group-hover/car:text-white">
          <ChevronLeft className="size-4" />
        </span>
      </div>
    </a>
  );
}

export function CarsSection({
  cars,
  brandSlug,
  brandName,
}: {
  cars: CarFrontofficeDetailResponse[];
  brandSlug: string;
  brandName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showExpand = cars.length > MARQUEE_LIMIT;
  const marqueeCars = cars.slice(0, MARQUEE_LIMIT);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "right" ? 280 : -280;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (expanded) {
    return (
      <div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              brandSlug={brandSlug}
              brandName={brandName}
            />
          ))}
        </div>
        {showExpand && (
          <div className="flex justify-center pt-5">
            <button
              onClick={() => {
                setExpanded(false);
                document
                  .getElementById("brand-cars")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#14305A]"
            >
              نمایش کمتر
              <ChevronDown className="size-4 rotate-180" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="relative group/scroll">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#f8fafc] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#f8fafc] to-transparent" />

        <button
          onClick={() => scroll("right")}
          className="absolute left-2 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-md opacity-0 transition-all group-hover/scroll:opacity-100 hover:bg-slate-50 hover:text-[#14305A] backdrop-blur-sm"
          aria-label="اسکرول به چپ"
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          onClick={() => scroll("left")}
          className="absolute right-2 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-md opacity-0 transition-all group-hover/scroll:opacity-100 hover:bg-slate-50 hover:text-[#14305A] backdrop-blur-sm"
          aria-label="اسکرول به راست"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {marqueeCars.map((car) => (
            <CarPill
              key={car.id}
              car={car}
              brandSlug={brandSlug}
              brandName={brandName}
            />
          ))}
        </div>
      </div>

      {showExpand && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#14305A]"
          >
            مشاهده همه مدل‌ها ({cars.length.toLocaleString("fa-IR")})
            <ChevronDown className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
