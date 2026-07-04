import { apiClient } from "./client";
import type { BrandFrontDto } from "./types";

/**
 * Fetcher دامنه‌ی «برند» — فقط در سمت سرور (RSC / build) اجرا می‌شود.
 *
 * استراتژی کش: `force-cache` + tag تا صفحه‌ی /brands به‌صورت SSG ساخته شود
 * و بعداً بتوان با `revalidateTag("brands")` (مثلاً از یک Route Handler که
 * بک‌اند بعد از تغییر برندها صدا می‌زند) آن را به‌روز کرد.
 */

/** داده‌ی جایگزین برای زمانی که بک‌اند در build در دسترس نیست (DX در dev/CI) */
const FALLBACK_BRANDS: BrandFrontDto[] = [
  { id: 1, name: "سایپا", nameEn: "SAIPA", slug: "saipa", modelCount: 12, logoUrl: null, description: "قطعات یدکی محصولات سایپا از پراید تا شاهین" },
  { id: 2, name: "ایران‌خودرو", nameEn: "IKCO", slug: "ikco", modelCount: 15, logoUrl: null, description: "قطعات یدکی سمند، دنا، تارا، پژو ۲۰۶ و…" },
  { id: 3, name: "ام‌وی‌ام", nameEn: "MVM", slug: "mvm", modelCount: 8, logoUrl: null, description: "قطعات یدکی محصولات مدیران‌خودرو" },
  { id: 4, name: "کیا", nameEn: "Kia", slug: "kia", modelCount: 10, logoUrl: null, description: "قطعات اورجینال و آفتر‌مارکت کیا" },
  { id: 5, name: "هیوندای", nameEn: "Hyundai", slug: "hyundai", modelCount: 11, logoUrl: null, description: "قطعات اورجینال و آفتر‌مارکت هیوندای" },
  { id: 6, name: "رنو", nameEn: "Renault", slug: "renault", modelCount: 6, logoUrl: null, description: "قطعات تندر ۹۰، ساندرو و مگان" },
];

/**
 * دریافت همه‌ی برندها برای صفحه‌ی SSG شده‌ی /brands.
 * چون تعداد برندها محدود است، با size بزرگ همه را یک‌جا می‌گیریم؛
 * صفحه‌بندی واقعی برای لیست‌های بزرگ (قطعات) استفاده می‌شود.
 */
export async function getAllBrands(): Promise<BrandFrontDto[]> {
  try {
    const { data, error } = await apiClient.GET("/api/v1/front/brands", {
      params: { query: { page: 0, size: 200, sort: ["name,asc"] } },
      cache: "force-cache",
      next: { tags: ["brands"] },
    });

    if (error || !data) {
      throw new Error("API error while fetching brands");
    }
    return data.content;
  } catch {
    // در build بدون بک‌اند (مثلاً CI) پروژه نباید بشکند.
    // در production واقعی، لاگ/مانیتورینگ اضافه کنید و fallback را حذف کنید.
    if (process.env.NODE_ENV === "production" && process.env.CI !== "true") {
      console.warn("[brands] backend unavailable at build time — using fallback data");
    }
    return FALLBACK_BRANDS;
  }
}
