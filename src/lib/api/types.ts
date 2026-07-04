import type { components } from "./generated/schema";

/**
 * نام‌های کوتاه (Type Aliases) روی تایپ‌های تولیدشده از Swagger.
 * بقیه‌ی کد فقط از این فایل import می‌کند تا اگر ساختار generated
 * تغییر کرد، فقط همین‌جا اصلاح شود.
 */
export type BrandFrontDto = components["schemas"]["BrandFrontDto"];
export type PageBrandFrontDto = components["schemas"]["PageBrandFrontDto"];

/**
 * ساختار عمومی Page در Spring Data — برای endpoint هایی که هنوز
 * در schema تولیدشده نیامده‌اند یا برای کدهای generic صفحه‌بندی.
 */
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  /** شماره‌ی صفحه‌ی فعلی (zero-based) */
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
