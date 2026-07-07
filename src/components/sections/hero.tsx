"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface HeroProps {
  bgSrc?: string;
  videoSrc?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Hero({ bgSrc, videoSrc, className, children }: HeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[92vh] items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Mesh gradient orbs */}
        <div className="animate-pulse-slow absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-500/15 blur-[120px]" />
        <div className="animate-pulse-slow absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]" style={{ animationDelay: "2s" }} />
        <div className="animate-pulse-slow absolute top-1/3 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[100px]" style={{ animationDelay: "4s" }} />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Media overlay if provided */}
      {videoSrc ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={bgSrc}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : bgSrc ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${bgSrc})` }}
        />
      ) : null}

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center">
        {children ?? (
          <>
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              مارکت‌پلیس قطعات یدکی خودرو
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              قطعه‌ی درست
              <br />
              <span className="bg-gradient-to-l from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                برای خودروی درست
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/50 sm:text-lg">
              جست‌وجو و مقایسه‌ی قیمت قطعات یدکی از هزاران فروشنده‌ی معتبر —
              بر اساس برند، مدل و شماره فنی.
            </p>

            {/* Glassy Search Card */}
            <div className="mx-auto mt-10 max-w-2xl">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/15">
                {/* Glow effect */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-transparent to-emerald-500/20 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative flex items-center rounded-xl bg-white/5 backdrop-blur-sm">
                  <div className="flex-1 px-5 py-4">
                    <input
                      type="text"
                      placeholder="خودرو، قطعه یا شماره فنی را جست‌وجو کنید..."
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                      dir="rtl"
                    />
                  </div>
                  <button
                    aria-label="جست‌وجو"
                    className="m-1.5 flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/20"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">جست‌وجو</span>
                  </button>
                </div>
              </div>

              {/* Quick suggestions */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-white/30">پرجست‌وجو:</span>
                {["لنت ترمز", "فیلتر روغن", "فیلتر هوا", "شمع موتور"].map(
                  (tag) => (
                    <button
                      key={tag}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white/80"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-md grid-cols-3 gap-8 border-t border-white/10 pt-8">
              {[
                { value: "+۱۲,۰۰۰", label: "قطعه یدکی" },
                { value: "+۵۰۰", label: "فروشنده معتبر" },
                { value: "+۵۰", label: "برند خودرو" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-bold text-white sm:text-xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FBFCFD] to-transparent" />
    </section>
  );
}
