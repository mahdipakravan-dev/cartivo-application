import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getAllBrands } from "@/lib/api/brands";

/**
 * نقشه‌ی سایت داینامیک — در build تولید و روی /sitemap.xml سرو می‌شود.
 * صفحات برند از بک‌اند خوانده می‌شوند؛ با اضافه‌شدن ماژول‌های بعدی
 * (مدل خودرو، قطعه، مقاله) همین‌جا گسترش پیدا می‌کند.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const brands = await getAllBrands();

  const brandEntries: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${siteConfig.url}/brands/${brand.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.url,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/brands`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...brandEntries,
  ];
}
