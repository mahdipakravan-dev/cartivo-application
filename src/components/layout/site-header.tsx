"use client";

import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { AccountDialog } from "@/components/auth/account-dialog";
import { getAccessToken } from "@/lib/api/auth-token";
import { CartDropdown } from "@/components/cart/cart-dropdown";
import { GlobalSearchDialog } from "@/components/layout/global-search-dialog";

const navItems = [
  { label: "خانه", href: ROUTES.home },
  { label: "دسته بندی", href: ROUTES.categories },
  { label: "خدمات", href: `${ROUTES.home}#services` },
  { label: "تماس با ما", href: ROUTES.contact },
];

type SiteHeaderVariant = "white" | "hero" | "abslute-on-header" | "transparent-background";

interface SiteHeaderProps {
  variant?: SiteHeaderVariant;
}

export function SiteHeader({ variant = "white" }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const useTransparentHomeHeader =
    variant === "transparent-background" && pathname === ROUTES.home;
  const isHero =
    variant === "hero" ||
    variant === "abslute-on-header" ||
    useTransparentHomeHeader;
  const isAbsoluteOnHero =
    variant === "abslute-on-header" || useTransparentHomeHeader;
  const isTransparentBackground = useTransparentHomeHeader;

  useEffect(() => {
    const syncAuthentication = () => setAuthenticated(Boolean(getAccessToken()));
    syncAuthentication();
    window.addEventListener("cartivo-auth-change", syncAuthentication);
    return () => window.removeEventListener("cartivo-auth-change", syncAuthentication);
  }, []);

  useEffect(() => {
    const openAccount = () => setAccountOpen(true);
    const closeAccount = () => setAccountOpen(false);
    window.addEventListener("cartivo-open-auth", openAccount);
    window.addEventListener("cartivo-close-auth", closeAccount);
    return () => {
      window.removeEventListener("cartivo-open-auth", openAccount);
      window.removeEventListener("cartivo-close-auth", closeAccount);
    };
  }, []);

  return (
    <div
      className={cn(
        "inset-x-0 top-0 z-50 border-b",
        isAbsoluteOnHero ? "absolute" : "fixed",
        isHero
          ? isTransparentBackground
            ? "border-white/10 bg-transparent text-white"
            : "border-white/10 bg-primary text-white shadow-sm shadow-black/10"
          : "border-slate-100 bg-white text-slate-900"
      )}
    >
      <header className="container-cartivo flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Right — Logo */}
        <Link
          href={ROUTES.home}
          className={cn(
            "flex items-center gap-2",
            isHero ? "text-white" : "text-slate-800"
          )}
          aria-label={`${siteConfig.name} — خانه`}
        >
          <span
            className={cn(
              "text-xl font-extrabold tracking-tight lg:text-2xl",
              isHero ? "text-white" : "text-[#14305A]"
            )}
          >
            {siteConfig.name}
          </span>
          <span
            className={cn(
              "hidden text-[10px] font-medium tracking-wide sm:inline",
              isHero ? "text-white/65" : "text-slate-500"
            )}
          >
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
              const hrefWithoutHash = item.href.split("#")[0];
              const isHomeItem = hrefWithoutHash === ROUTES.home;
              const isActive = isHomeItem
                ? pathname === ROUTES.home
                : pathname === hrefWithoutHash || pathname.startsWith(hrefWithoutHash + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all",
                      isHero
                        ? isActive
                          ? "text-white"
                          : "text-white/75 hover:text-white"
                        : isActive
                          ? "text-[#14305A]"
                          : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className={cn(
                          "absolute inset-x-2 -bottom-3 h-0.5 rounded-full",
                          isHero ? "bg-white" : "bg-[#14305A]"
                        )}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Left — Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="جست‌وجو"
            onClick={() => setSearchOpen(true)}
            className={cn(isHero && "relative cursor-pointer text-white hover:bg-white/10 hover:text-white")}
          >
            <Search className="h-5 w-5" />
          </Button>

          <CartDropdown onHero={isHero} />

          {authenticated ? (
            <Link
              href={ROUTES.profile}
              aria-label="پنل کاربری"
              className={cn("relative flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-muted", isHero && "text-white hover:bg-white/10")}
            >
              <User className="h-5 w-5" />
              <span className="absolute bottom-0.5 right-0.5 size-2 rounded-full border border-white bg-emerald-500" />
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="ورود به حساب کاربری"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen(true)}
              className={cn("relative", isHero && "text-white hover:bg-white/10 hover:text-white")}
            >
              <User className="h-5 w-5" />
            </Button>
          )}

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            className={cn(
              "lg:hidden",
              isHero && "text-white hover:bg-white/10 hover:text-white"
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav
          aria-label="ناوبری موبایل"
          className={cn(
            "border-t lg:hidden",
            isHero ? "border-white/10 bg-primary" : "border-slate-100 bg-white"
          )}
        >
          <ul className="space-y-1 p-3">
            {navItems.map((item) => {
              const hrefWithoutHash = item.href.split("#")[0];
              const isHomeItem = hrefWithoutHash === ROUTES.home;
              const isActive = isHomeItem
                ? pathname === ROUTES.home
                : pathname === hrefWithoutHash || pathname.startsWith(hrefWithoutHash + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-md px-4 py-3 text-sm font-medium transition-all",
                      isHero
                        ? isActive
                          ? "border-b-2 border-white text-white"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                        : isActive
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
      <AccountDialog open={accountOpen} onOpenChange={setAccountOpen} onAuthenticationChange={setAuthenticated} />
      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
