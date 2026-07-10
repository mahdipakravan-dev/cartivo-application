"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/lib/routes";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

export function CartDropdown({ onHero }: { onHero: boolean }) {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  useEffect(() => setMounted(true), []);

  const quantity = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const total = mounted ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
  const show = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <span onMouseEnter={show} onMouseLeave={hide}>
        <DropdownMenuTrigger render={<Link href={ROUTES.basket} aria-label={`سبد خرید، ${quantity.toLocaleString("fa-IR")} کالا`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative", onHero && "text-white hover:bg-white/10 hover:text-white")} />}>
          <ShoppingCart className="h-5 w-5" />
          {quantity > 0 && <span className="absolute -left-1 -top-1 flex min-w-4 h-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{quantity.toLocaleString("fa-IR")}</span>}
        </DropdownMenuTrigger>
      </span>
      <DropdownMenuContent align="end" sideOffset={10} className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl p-0 shadow-2xl" onMouseEnter={show} onMouseLeave={hide}>
        <div dir="rtl" className="p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <p className="font-extrabold text-slate-800">سبد خرید من</p>
            <span className="text-xs text-slate-400">{quantity.toLocaleString("fa-IR")} کالا</span>
          </div>
          {items.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-slate-400"><Package className="size-10 text-slate-200" /><p className="mt-3 text-sm">سبد خرید شما خالی است.</p></div>
          ) : (
            <div className="max-h-64 divide-y divide-slate-100 overflow-y-auto">
              {items.slice(0, 4).map((item) => (
                <div key={item.partId} className="flex items-center gap-3 py-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-50"><Package className="size-5 text-[#14305A]" /></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-700">{item.name}</p><p className="mt-1 text-[11px] text-slate-400">{item.quantity.toLocaleString("fa-IR")} × {item.price.toLocaleString("fa-IR")} ریال</p></div>
                </div>
              ))}
              {items.length > 4 && <p className="py-2 text-center text-xs text-slate-400">و {(items.length - 4).toLocaleString("fa-IR")} محصول دیگر</p>}
            </div>
          )}
          {items.length > 0 && <div className="border-t border-slate-100 pt-3"><div className="mb-3 flex justify-between text-sm"><span className="text-slate-500">مجموع</span><b className="text-[#14305A]">{total.toLocaleString("fa-IR")} ریال</b></div><Button render={<Link href={ROUTES.basket} />} className="h-10 w-full rounded-xl" onClick={() => setOpen(false)}>مشاهده سبد خرید <ArrowLeft /></Button></div>}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
