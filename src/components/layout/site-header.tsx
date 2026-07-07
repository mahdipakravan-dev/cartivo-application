"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "برندها", href: ROUTES.brands },
  { label: "دسته‌بندی‌ها", href: "/categories" },
  { label: "خدمات", href: "/services" },
  { label: "تماس با ما", href: "/contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Right — Logo */}
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2 text-slate-800"
          aria-label={`${siteConfig.name} — خانه`}
        >
          <span className="text-xl font-extrabold tracking-tight text-[#14305A] lg:text-2xl">
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
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "text-[#14305A]"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute inset-x-2 -bottom-3 h-0.5 rounded-full bg-[#14305A]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Left — Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="جست‌وجو">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="سبد خرید" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              0
            </span>
          </Button>

          <Button variant="ghost" size="icon" aria-label="پنل کاربری">
            <User className="h-5 w-5" />
          </Button>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            className="lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav
          aria-label="ناوبری موبایل"
          className="border-t border-slate-100 bg-white lg:hidden"
        >
          <ul className="space-y-1 p-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-md px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "border-b-2 border-[#14305A] text-[#14305A]"
                        : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
