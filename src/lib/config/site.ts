/**
 * پیکربندی مرکزی سایت — تک‌منبع حقیقت (Single Source of Truth)
 * برای متادیتا، sitemap ،JSON-LD و لینک‌های canonical.
 *
 * این ماژول «Shared» است و در layout ،sitemap ،robots و صفحات استفاده می‌شود.
 */
export const siteConfig = {
  name: "کارتیوو",
  nameEn: "Cartivo",
  description:
    "مرجع خرید قطعات یدکی خودرو در ایران؛ مقایسه قیمت فروشندگان، جست‌وجو بر اساس خودرو و شماره فنی.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cartivo.ir",
  locale: "fa_IR",
  twitterHandle: "@cartivo",
} as const;

export type SiteConfig = typeof siteConfig;
