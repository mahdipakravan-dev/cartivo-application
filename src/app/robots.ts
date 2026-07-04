import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

/** فایل robots.txt — بک‌آفیس و API از ایندکس خارج می‌شوند */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
