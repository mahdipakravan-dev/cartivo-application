"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  CarFront,
  Cog,
  Headphones,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AccountDialog } from "@/components/auth/account-dialog";
import { GlobalSearchDialog } from "@/components/layout/global-search-dialog";
import { getAccessToken } from "@/lib/api/auth-token";
import { getGarageVehicles } from "@/lib/api/garage";
import type { PartFrontofficeResponse } from "@/lib/api/types";
import {
  getTopLevelPartHref,
  getTopLevelPartLabel,
} from "@/lib/catalog-navigation";
import { ROUTES } from "@/lib/routes";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

interface TopLevelNavigationItem {
  id: number;
  href: string;
  label: string;
}

function CartivoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href={ROUTES.home}
      className="flex shrink-0 items-center"
      aria-label="کارتیوُ، صفحه اصلی"
    >
      <Image
        src="/images/brand/cartivo-logo-dark-horizontal-header.webp"
        alt="کارتیوُ"
        width={238}
        height={112}
        priority
        className={cn("h-auto object-contain", compact ? "w-24" : "w-32")}
      />
    </Link>
  );
}

function SupportDrawer({
  items,
  open,
  onClose,
}: {
  items: TopLevelNavigationItem[];
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] transition",
        open ? "visible" : "invisible",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="بستن منو"
        className={cn(
          "absolute inset-0 bg-dark/70 backdrop-blur-[1px] transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
        className={cn(
          "absolute inset-y-0 left-0 w-[min(355px,92vw)] overflow-y-auto bg-white px-6 pb-7 pt-5 text-[var(--primary)] shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-7 flex items-start justify-between" dir="ltr">
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-xl bg-background text-[var(--primary)]"
            aria-label="بستن منو"
          >
            <X className="size-7" />
          </button>
          <div dir="rtl">
            <CartivoLogo />
          </div>
        </div>

        <h2 className="mb-3 mt-5 text-[22px] font-black text-dark">
          دسته‌بندی‌ها
        </h2>
        <nav aria-label="دسته‌بندی‌های محصولات">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-4 rounded-xl py-3 hover:bg-accent/10"
            >
              <Cog className="size-6 stroke-[1.8]" />
              <span className="flex-1 text-[15px] font-bold">{item.label}</span>
              <ChevronLeft className="size-5 text-text-secondary" />
            </Link>
          ))}
          {items.length === 0 && (
            <p className="py-3 text-sm text-text-secondary">
              دسته‌بندی‌ای برای نمایش وجود ندارد.
            </p>
          )}
        </nav>
      </aside>
    </div>
  );
}

type SiteHeaderVariant =
  | "white"
  | "hero"
  | "abslute-on-header"
  | "transparent-background";

export function SiteHeader({
  variant = "white",
  topLevelParts = [],
}: {
  variant?: SiteHeaderVariant;
  topLevelParts?: PartFrontofficeResponse[];
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryBarPinned, setCategoryBarPinned] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [defaultVehicleName, setDefaultVehicleName] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const quantity = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const isAbsolute =
    (variant === "transparent-background" && pathname === ROUTES.home) ||
    variant === "abslute-on-header";
  const navigationItems = topLevelParts.flatMap<TopLevelNavigationItem>(
    (part) => {
      const href = getTopLevelPartHref(part);
      const label = getTopLevelPartLabel(part);

      return href && label && part.id != null
        ? [{ id: part.id, href, label }]
        : [];
    },
  );

  useEffect(() => {
    const sync = () => setAuthenticated(Boolean(getAccessToken()));
    sync();
    window.addEventListener("cartivo-auth-change", sync);
    return () => window.removeEventListener("cartivo-auth-change", sync);
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

  useEffect(() => {
    let active = true;

    const syncGarage = () => {
      if (!authenticated) {
        setDefaultVehicleName("");
        return;
      }

      getGarageVehicles()
        .then((garageVehicles) => {
          if (!active) return;
          const selected =
            garageVehicles.find((item) => item.isDefault) ?? garageVehicles[0];
          setDefaultVehicleName(selected?.vehicle?.displayName ?? "");
        })
        .catch(() => active && setDefaultVehicleName(""));
    };

    syncGarage();
    window.addEventListener("cartivo-garage-change", syncGarage);
    return () => {
      active = false;
      window.removeEventListener("cartivo-garage-change", syncGarage);
    };
  }, [authenticated]);

  const openGarage = () => {
    if (authenticated) {
      window.dispatchEvent(new Event("cartivo-show-garage"));
      router.push(`${ROUTES.profile}?tab=cars`);
      return;
    }
    window.sessionStorage.setItem("cartivo_post_login_action", "garage");
    setAccountOpen(true);
  };

  useEffect(() => {
    const syncPinnedState = () => setCategoryBarPinned(window.scrollY >= 72);
    syncPinnedState();
    window.addEventListener("scroll", syncPinnedState, { passive: true });
    return () => window.removeEventListener("scroll", syncPinnedState);
  }, []);

  return (
    <>
      <div
        className={cn(
          "inset-x-0 top-0 z-50 border-b border-border bg-white text-[var(--primary)]",
          isAbsolute ? "absolute" : "relative",
        )}
      >
        <header className="container-cartivo flex h-[72px] items-center gap-4 px-5 lg:gap-5">
          <CartivoLogo />

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-11 min-w-0 flex-1 items-center gap-3 rounded-xl  bg-background/80 px-4 text-right text-sm text-text-secondary lg:flex mx-22"
          >
            <Search className="size-5 shrink-0 text-[var(--primary)]" />
            <span className="truncate">
              جستجو بر اساس خودرو، سال، قطعه، کد فنی یا برند...
            </span>
          </button>

          <button
            type="button"
            className="hidden shrink-0 items-center gap-2 xl:flex"
          >
            <Headphones className="size-7 text-[var(--primary)]" />
            <span className="text-right">
              <small className="block text-[11px]">مشاوره تخصصی</small>
              <b className="block text-xs">۰۲۱-۹۱۰۰۱۲۳۴</b>
            </span>
          </button>

          <div className="mr-auto flex shrink-0 items-center gap-1" dir="rtl">
            <button
              type="button"
              onClick={openGarage}
              className={cn(
                "flex h-10 items-center justify-center gap-2 rounded-lg px-2 hover:bg-border/20",
                !defaultVehicleName && "w-10",
              )}
              aria-label={defaultVehicleName || "افزودن خودرو به گاراژ"}
            >
              <CarFront className="size-5 shrink-0" />
              {defaultVehicleName && (
                <span className="hidden max-w-32 truncate text-xs font-bold sm:block">
                  {defaultVehicleName}
                </span>
              )}
            </button>
            {authenticated ? (
              <Link
                href={ROUTES.profile}
                className="flex size-10 items-center justify-center rounded-lg hover:bg-border/20"
                aria-label="حساب کاربری"
              >
                <UserRound className="size-5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setAccountOpen(true)}
                className="flex size-10 items-center justify-center rounded-lg hover:bg-border/20"
                aria-label="ورود به حساب کاربری"
              >
                <UserRound className="size-5" />
              </button>
            )}
            <Link
              href={ROUTES.basket}
              className="relative flex size-10 items-center justify-center rounded-lg hover:bg-border/20"
              aria-label="سبد خرید"
            >
              <ShoppingCart className="size-6" />
              <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                {quantity.toLocaleString("fa-IR")}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex size-10 items-center justify-center rounded-lg hover:bg-border/20"
              aria-label="باز کردن منو"
            >
              <Menu className="size-7" />
            </button>
          </div>
        </header>
      </div>

      <div
        className={cn(
          "inset-x-0 z-50 bg-white text-[var(--primary)] shadow-sm",
          isAbsolute
            ? categoryBarPinned
              ? "fixed top-0"
              : "absolute top-[72px]"
            : "sticky top-0",
        )}
      >
        <nav
          aria-label="دسته‌بندی محصولات"
          className="hidden  h-[50px] border-t border-border lg:block"
        >
          <div className="container-cartivo flex h-full items-center gap-5 overflow-x-auto px-5 overflow-x-hidden justify-center">
            {navigationItems?.slice(0, 13).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex h-full shrink-0 items-center border-b-2 border-transparent px-2 text-[13px] font-bold transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <SupportDrawer
        items={navigationItems}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <AccountDialog
        open={accountOpen}
        onOpenChange={setAccountOpen}
        onAuthenticationChange={setAuthenticated}
      />
      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
