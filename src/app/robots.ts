import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

/**
 * فایل robots.txt
 *
 * - بک‌آفیس، API و صفحات شخصی (سبد، پروفایل) خزیده نمی‌شوند.
 * - خزنده‌های موتورهای پاسخ و AI (برای GEO) صریحاً مجازند. اگر سایت پشت
 *   CDN/فایروال است، همین ربات‌ها نباید آن‌جا هم مسدود شوند.
 */
const PRIVATE_PATHS = ["/admin", "/api/", "/basket", "/profile"];

const AI_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
