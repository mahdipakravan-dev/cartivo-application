import type { Metadata } from "next";
import { BasketPage } from "@/components/cart/basket-page";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "بررسی محصولات انتخاب‌شده و ثبت سفارش در کارتیوو.",
  robots: { index: false, follow: false },
};

export default function BasketRoute() {
  return <BasketPage />;
}
