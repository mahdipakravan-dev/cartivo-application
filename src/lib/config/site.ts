/**
 * پیکربندی مرکزی سایت — تک‌منبع حقیقت (Single Source of Truth)
 * برای متادیتا، sitemap ،JSON-LD و لینک‌های canonical.
 *
 * این ماژول «Shared» است و در layout ،sitemap ،robots و صفحات استفاده می‌شود.
 *
 * نام برند طبق برندبوک «کارتیو / Cartivo» است و باید در عنوان صفحات، اسکیما و
 * شبکه‌های اجتماعی دقیقاً یکسان بماند تا موتورهای جست‌وجو و AI یک Entity واحد
 * از برند بسازند.
 */
export const siteConfig = {
  name: "کارتیو",
  nameEn: "Cartivo",
  tagline: "همراه مطمئن در مسیر شما",
  taglineEn: "More than a drive",
  homeTitle: "کارتیو | خرید قطعات خودرو با جستجوی شماره فنی و تطبیق با خودرو",
  description:
    "خرید قطعات یدکی خودرو از فروشندگان معتبر؛ جست‌وجو با شماره فنی، تطبیق قطعه با خودروی شما و مقایسه قیمت و هزینه ارسال.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cartivo.ir",
  /** مسیر لوگوی مربعی برای اسکیما Organization (حداقل ۱۱۲×۱۱۲ پیکسل). */
  logoPath: "/images/brand/cartivo-logo-dark.png",
  /** رنگ‌های برندبوک */
  colors: {
    orange: "#FF6F00",
    black: "#1B1B1B",
    white: "#FFFFFF",
  },
  locale: "fa_IR",
  twitterHandle: "@cartivo",
  /**
   * آدرس صفحات رسمی برند در شبکه‌های اجتماعی (sameAs در اسکیما).
   * TODO: آدرس‌های واقعی اینستاگرام، لینکدین و … را اضافه کنید.
   */
  sameAs: [] as string[],
  contact: {
    // TODO: مقادیر واقعی تماس را جایگزین کنید؛ مقادیر فعلی نمونه هستند و
    // تا جایگزینی در اسکیما Organization منتشر نمی‌شوند.
    phone: "021-12345678",
    phoneDisplay: "۰۲۱-۱۲۳۴۵۶۷۸",
    email: "info@cartivo.ir",
    address: "تهران، خیابان ولیعصر",
    workingHours: "شنبه تا چهارشنبه، ۹ تا ۱۸",
    isPlaceholder: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** تبدیل مسیر نسبی به URL مطلق روی دامنه‌ی اصلی. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
