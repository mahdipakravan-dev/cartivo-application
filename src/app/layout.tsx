import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { GarageProvider } from "@/components/garage/garage-provider";
import { siteConfig } from "@/lib/config/site";
import { getRootCategories } from "@/lib/api/categories";
import { iranYekan } from "@/lib/fonts";
import { StoreProvider } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/lib/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import type { ReactNode } from "react";
import "./globals.css";

/**
 * Layout ریشه — تنظیمات سراسری زبان، جهت، فونت و متادیتای پیش‌فرض.
 *
 * - lang="fa" و dir="rtl" در سطح <html> (استاندارد سئوی چندزبانه)
 * - metadataBase تا همه‌ی URL های نسبی در OG/canonical مطلق شوند
 * - عنوان‌ها با template یکدست می‌شوند: «… | کارتیو»
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
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: siteConfig.logoPath,
    apple: siteConfig.logoPath,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
            ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
            ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
            : {}),
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: siteConfig.colors.black,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const categories = await getRootCategories();

  return (
    <html lang="fa" dir="rtl" className={cn("font-sans", iranYekan.variable)}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <StoreProvider>
          <GarageProvider>
            <SiteHeader
              variant="transparent-background"
              rootCategories={categories.items}
            />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </GarageProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
