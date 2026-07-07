import type { Metadata } from "next";
import type { ReactNode } from "react";
import { vazirmatn } from "@/lib/fonts";
import { siteConfig } from "@/lib/config/site";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

/**
 * Layout ریشه — تنظیمات سراسری زبان، جهت، فونت و متادیتای پیش‌فرض.
 *
 * - lang="fa" و dir="rtl" در سطح <html> (استاندارد سئوی چندزبانه)
 * - metadataBase تا همه‌ی URL های نسبی در OG/canonical مطلق شوند
 * - عنوان‌ها با template یکدست می‌شوند: «… | کارتیوو»
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — قطعات یدکی خودرو`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.nameEn,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={cn("font-sans", geist.variable)}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
