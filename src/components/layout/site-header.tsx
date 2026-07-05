"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { label: "برندها", href: ROUTES.brands },
  { label: "دسته‌بندی‌ها", href: "/categories" },
  { label: "خدمات", href: "/services" },
  { label: "تماس با ما", href: "/contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);

  return (
    <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <header
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between",
          "rounded-2xl border border-white/20 px-4 py-3",
          "bg-white/20 shadow-lg shadow-black/5 backdrop-2xl backdrop-blur-2xl",
          "supports-[backdrop-filter]:bg-white/15"
        )}
      >
        {/* Right — Logo */}
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2 text-slate-800"
          aria-label={`${siteConfig.name} — خانه`}
        >
          <span className="text-xl font-extrabold tracking-tight lg:text-2xl">
            {siteConfig.name}
          </span>
          <span className="hidden text-[10px] font-medium tracking-wide text-slate-500 sm:inline">
            {siteConfig.nameEn}
          </span>
        </Link>

        {/* Center — Desktop Navigation */}
        <nav
          aria-label="ناوبری اصلی"
          className="absolute inset-x-0 top-0 hidden h-full items-center justify-center lg:flex"
        >
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href} className="relative">
                <button
                  onMouseEnter={() => setMegaOpen(item.href)}
                  onMouseLeave={() => setMegaOpen(null)}
                  className={cn(
                    "flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-900/5 hover:text-slate-900",
                    megaOpen === item.href && "bg-slate-900/5 text-slate-900"
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      megaOpen === item.href && "rotate-180"
                    )}
                  />
                </button>

                {megaOpen === item.href && (
                  <div
                    onMouseEnter={() => setMegaOpen(item.href)}
                    onMouseLeave={() => setMegaOpen(null)}
                    className={cn(
                      "absolute top-full right-0 mt-2 w-64",
                      "rounded-2xl border border-slate-200/60",
                      "bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-900/5",
                      "p-4"
                    )}
                  >
                    <p className="text-xs text-slate-400">
                      مگا منوی {item.label}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Left — Actions */}
        <div className="flex items-center gap-1">
          <button
            aria-label="جست‌وجو"
            className="rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-900/5 hover:text-slate-800"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            aria-label="سبد خرید"
            className="relative rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-900/5 hover:text-slate-800"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute top-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              0
            </span>
          </button>

          <button
            aria-label="پنل کاربری"
            className="rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-900/5 hover:text-slate-800"
          >
            <User className="h-5 w-5" />
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            className="rounded-xl p-2.5 text-slate-500 transition-all hover:bg-slate-900/5 hover:text-slate-800 lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav
          aria-label="ناوبری موبایل"
          className={cn(
            "mx-auto mt-2 max-w-6xl overflow-hidden",
            "rounded-2xl border border-slate-200/60",
            "bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-900/5",
            "lg:hidden"
          )}
        >
          <ul className="space-y-1 p-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-900/5 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
