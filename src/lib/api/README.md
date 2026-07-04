# ماژول `lib/api` — لایه‌ی اتصال تایپ‌شده به بک‌اند (Swagger → TypeScript)

## این ماژول دقیقاً چه می‌کند؟

بک‌اند Spring Boot شما با springdoc-openapi مشخصات Swagger را روی
`/v3/api-docs` منتشر می‌کند. این ماژول آن مشخصات را به **تایپ‌های TypeScript**
و یک **کلاینت fetch تایپ‌سیف** تبدیل می‌کند؛ نتیجه این است که:

- مسیر اشتباه (`/api/v1/front/brandz`) ➜ خطای کامپایل
- پارامتر query اشتباه ➜ خطای کامپایل
- تغییر DTO در بک‌اند ➜ بعد از `npm run openapi` همه‌ی نقاط شکسته در فرانت مشخص می‌شوند

## فایل‌ها

| فایل | نقش |
|---|---|
| `generated/schema.d.ts` | **خروجی خودکار** `openapi-typescript`. دستی ویرایش نکنید. فعلاً یک Placeholder تایپ‌شده برای endpoint برندهاست تا پروژه بدون بک‌اند build شود. |
| `client.ts` | کلاینت مشترک `openapi-fetch` روی `API_BASE_URL`. **ماژول Shared** — همه‌ی fetcher ها از آن استفاده می‌کنند. |
| `types.ts` | Alias های کوتاه روی تایپ‌های generated + تایپ عمومی `SpringPage<T>` منطبق بر `Page<T>` در Spring Data. |
| `brands.ts` | fetcher دامنه‌ی برند با استراتژی کش SSG (`force-cache` + تگ `brands`). |

## جریان کاری

```bash
# بک‌اند را بالا بیاورید، سپس:
npm run openapi
# ➜ src/lib/api/generated/schema.d.ts بازتولید می‌شود
npm run typecheck
# ➜ اگر DTO ها تغییر کرده باشند، خطاها دقیقاً محل اصلاح را نشان می‌دهند
```

## قرارداد ساخت fetcher جدید (مثلاً برای قطعات)

```ts
// lib/api/parts.ts
import { apiClient } from "./client";

export async function getParts(page: number, size = 24) {
  const { data, error } = await apiClient.GET("/api/v1/front/parts", {
    params: { query: { page, size, sort: ["createdAt,desc"] } },
    next: { revalidate: 300, tags: ["parts"] }, // ISR برای لیست‌های پویا
  });
  if (error || !data) throw new Error("Failed to fetch parts");
  return data;
}
```

## نکات مهم

- **`API_BASE_URL` عمداً `NEXT_PUBLIC_` ندارد** — فقط در Server Component/Route Handler در دسترس است و آدرس داخلی بک‌اند به مرورگر نشت نمی‌کند.
- **Fallback در `brands.ts`**: اگر بک‌اند هنگام build در دسترس نباشد (CI/توسعه)، از داده‌ی ثابت استفاده می‌شود تا build نشکند. در استقرار نهایی که بک‌اند همیشه در دسترس است، می‌توانید fallback را حذف کنید تا خطا سریع دیده شود.
- **صفحه‌بندی**: قرارداد Spring Data — `page` (صفر-مبنا)، `size`، `sort=field,dir`. برای UI صفحه‌بندی از `SpringPage<T>` استفاده کنید؛ فیلدهای `totalPages` ،`first` ،`last` همه تایپ‌شده در دسترس‌اند.

## وابستگی به ماژول‌های Shared

- `lib/api/client.ts` ← خودش Shared است
- از `process.env.API_BASE_URL` (تعریف در `.env.local`)
