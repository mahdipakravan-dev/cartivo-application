import localFont from "next/font/local";

/**
 * فونت وزیرمتن — نسخه‌ی «متغیر» (Variable Font) رسمی از مخزن
 * rastikerdar/vazirmatn، به‌صورت کاملاً self-hosted داخل خود ریپو.
 *
 * چرا local و نه next/font/google؟
 * 1) build و کاربر نهایی هیچ وابستگی‌ای به سرورهای گوگل ندارند
 *    (برای سرورهای build و کاربران داخل ایران حیاتی است).
 * 2) یک فایل woff2 متغیر، همه‌ی وزن‌های 100 تا 900 را پوشش می‌دهد
 *    ➜ فقط یک درخواست فونت، CLS صفر، بهترین Core Web Vitals.
 *
 * متغیر CSS ‏`--font-vazirmatn` در globals.css به `--font-sans` تیلویند
 * وصل شده است.
 */
export const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-vazirmatn",
});
