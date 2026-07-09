import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/config/site";
import { iranYekan } from "@/lib/fonts";
import { StoreProvider } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

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
    <html lang="fa" dir="rtl" className={cn("font-sans", iranYekan.variable)}>
      <body className="flex min-h-dvh flex-col">
        <StoreProvider>
          <SiteHeader variant="abslute-on-header" />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
