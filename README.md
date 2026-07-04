# Cartivo Frontend — زیرساخت پایه (Basement)

فرانت‌اند مارکت‌پلیس قطعات یدکی خودرو **کارتیوو**، ساخته‌شده روی آخرین نسخه‌ی پایدار Next.js با تمرکز کامل روی **سئو**، **تایپ‌سیفتی** و **اتصال تایپ‌شده به بک‌اند Spring Boot از طریق Swagger/OpenAPI**.

---

## استک فنی

| ابزار | نسخه | نقش |
|---|---|---|
| Next.js | **16.2.x** (آخرین Stable — Turbopack پیش‌فرض) | فریم‌ورک، App Router |
| React | 19.2 | UI |
| TypeScript | 5.8 — حالت `strict` کامل | تایپ‌سیفتی |
| Tailwind CSS | **v4** (CSS-first، بدون tailwind.config) | استایل |
| shadcn/ui | سبک new-york | کامپوننت‌های پایه |
| openapi-typescript + openapi-fetch | — | تولید تایپ و کلاینت از Swagger بک‌اند |
| فونت وزیرمتن | از طریق `next/font` (self-hosted) | تایپوگرافی فارسی |

> **چرا Next.js 16؟** آخرین نسخه‌ی پایدار است؛ Turbopack بایندلر پیش‌فرض build و dev است، `params` ها async هستند و فایل middleware به `proxy.ts` تغییر نام داده. کدهای این پروژه با همین قراردادها نوشته شده‌اند.

---

## راه‌اندازی

```bash
# 1) نصب وابستگی‌ها (Node.js >= 20.9 الزامی است)
npm install

# 2) متغیرهای محیطی
cp .env.example .env.local
# API_BASE_URL را روی آدرس بک‌اند Spring Boot تنظیم کنید

# 3) تولید تایپ‌ها از Swagger بک‌اند (بک‌اند باید بالا باشد)
npm run openapi

# 4) اجرا
npm run dev
```

بدون بک‌اند هم پروژه **build و اجرا می‌شود** — فایل `src/lib/api/generated/schema.d.ts` یک Placeholder تایپ‌شده دارد و fetcher برندها در نبود بک‌اند از داده‌ی fallback استفاده می‌کند (توضیح در `src/lib/api/README.md`).

---

## ساختار پروژه

```
src/
├── app/                       # App Router
│   ├── layout.tsx             # RTL + فونت وزیرمتن + متادیتای پیش‌فرض
│   ├── page.tsx               # صفحه‌ی خانه (مینیمال)
│   ├── globals.css            # Tailwind v4 + توکن‌های shadcn
│   ├── sitemap.ts             # نقشه‌ی سایت داینامیک (برندها از بک‌اند)
│   ├── robots.ts              # robots.txt
│   └── brands/                # 📄 صفحه‌ی نمونه‌ی SSG + سئو → README دارد
│       ├── page.tsx
│       └── _components/       # کامپوننت‌های محلی صفحه
├── components/
│   ├── ui/                    # کامپوننت‌های shadcn (button, card)
│   └── layout/                # هدر و فوتر سراسری → README دارد
└── lib/
    ├── api/                   # 🔌 لایه‌ی OpenAPI/Swagger → README دارد
    │   ├── generated/         # خروجی خودکار openapi-typescript
    │   ├── client.ts          # کلاینت تایپ‌سیف مشترک
    │   ├── types.ts           # Alias ها + SpringPage<T>
    │   └── brands.ts          # fetcher دامنه‌ی برند
    ├── config/site.ts         # 🔁 Shared: پیکربندی مرکزی سایت
    ├── seo/json-ld.tsx        # 🔁 Shared: کامپوننت JSON-LD
    ├── fonts.ts               # 🔁 Shared: فونت وزیرمتن
    └── utils.ts               # 🔁 Shared: تابع cn (استاندارد shadcn)
```

**ماژول‌های Shared در سطح پروژه** (هر فایلی که از این‌ها استفاده کند در کامنت بالای خودش اشاره کرده):

- `lib/config/site.ts` — تک‌منبع حقیقت برای نام، URL و locale؛ در layout ،sitemap ،robots و صفحات مصرف می‌شود.
- `lib/api/client.ts` — کلاینت مشترک OpenAPI؛ همه‌ی fetcher های دامنه از آن استفاده می‌کنند.
- `lib/seo/json-ld.tsx` — تزریق امن Schema.org در همه‌ی صفحات سئومحور.
- `lib/utils.ts` و `lib/fonts.ts` — ابزارهای عمومی UI.

---

## قراردادهای پروژه (Conventions)

1. **Server Component پیش‌فرض** — `"use client"` فقط وقتی واقعاً تعامل کلاینتی لازم است.
2. **کامپوننت‌های محلی هر صفحه** در پوشه‌ی `_components` کنار همان route (پیشوند `_` یعنی Next آن را route حساب نمی‌کند).
3. **آدرس بک‌اند فقط سمت سرور** — `API_BASE_URL` بدون پیشوند `NEXT_PUBLIC_` تا به باندل کلاینت نشت نکند.
4. **تایپ‌ها از Swagger** — هیچ DTO ای دستی تعریف نمی‌شود مگر به‌صورت Alias در `lib/api/types.ts`.
5. **هر صفحه‌ی عمومی**: `metadata` یا `generateMetadata` + canonical + JSON-LD + یک H1 یکتا.
6. **صفحه‌بندی**: قرارداد Spring Data (`page` صفر-مبنا، `size`، `sort`) — تایپ `SpringPage<T>` در `lib/api/types.ts`.

---

## چک‌لیست سئو که در این Basement پیاده شده

- [x] `lang="fa"` و `dir="rtl"` در سطح `<html>`
- [x] `metadataBase` + قالب یکدست عنوان‌ها (`%s | کارتیوو`)
- [x] Canonical برای هر صفحه (`alternates.canonical`)
- [x] Open Graph و Twitter Card سراسری + بازنویسی per-page
- [x] `sitemap.xml` داینامیک از داده‌ی بک‌اند
- [x] `robots.txt` با حذف بک‌آفیس از ایندکس
- [x] JSON-LD (BreadcrumbList + ItemList/Brand) در صفحه‌ی برندها
- [x] SSG (`force-static`) + قابلیت به‌روزرسانی با `revalidateTag`
- [x] HTML معنایی: `nav` ،`header` ،`main` ،`ul/li` ،breadcrumb با `aria-current`
- [x] فونت self-hosted با `display: swap` → بدون CLS و بدون وابستگی به CDN خارجی
- [x] `next/image` برای لوگوها (lazy + بهینه‌سازی خودکار)

---

## اسکریپت‌ها

| دستور | کار |
|---|---|
| `npm run dev` | اجرای توسعه (Turbopack) |
| `npm run build` | build تولیدی — صفحات SSG همین‌جا ساخته می‌شوند |
| `npm run openapi` | تولید تایپ‌ها از `http://localhost:8080/v3/api-docs` |
| `npm run typecheck` | چک تایپ بدون build |
| `npm run lint` | ESLint |

---

## قدم‌های بعدی پیشنهادی

- صفحه‌ی جزئیات برند `brands/[slug]` با `generateStaticParams` (الگویش دقیقاً همین صفحه‌ی لیست است)
- کامپوننت `Pagination` عمومی مبتنی بر `SpringPage<T>` برای لیست قطعات
- `proxy.ts` (میدل‌ور Next 16) برای محافظت از مسیرهای بک‌آفیس پس از اضافه‌شدن احراز هویت
