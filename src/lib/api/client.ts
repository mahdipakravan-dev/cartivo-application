import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

/**
 * کلاینت تایپ‌سِیف OpenAPI — لایه‌ی مشترک ارتباط با بک‌اند Spring Boot.
 *
 * - تایپ‌ها مستقیماً از Swagger بک‌اند تولید می‌شوند (npm run openapi)
 * - مسیرها، پارامترهای query و بدنه‌ی پاسخ همگی در compile-time چک می‌شوند
 * - این ماژول «Shared» است؛ همه‌ی fetcher های دامنه (brands و…) از آن استفاده می‌کنند
 *
 * نکته: چون فقط در Server Component ها صدا زده می‌شود، از متغیر
 * `API_BASE_URL` (بدون پیشوند NEXT_PUBLIC_) استفاده می‌کنیم تا آدرس
 * داخلی بک‌اند به کلاینت لو نرود.
 */
const baseUrl = process.env.API_BASE_URL ?? "http://localhost:8080";

export const apiClient = createClient<paths>({
  baseUrl,
  headers: {
    Accept: "application/json",
  },
});
