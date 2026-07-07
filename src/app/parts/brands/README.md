# صفحه‌ی `/brands` — پیاده‌سازی مرجع صفحات لیستی سئومحور

## این بخش دقیقاً چه می‌کند؟

لیست کامل برندهای خودرو را از بک‌اند می‌گیرد، به‌صورت **SSG** (رندر در زمان
build) سرو می‌کند و همه‌ی سیگنال‌های سئو را ارسال می‌کند. هر صفحه‌ی لیستی
بعدی (مدل‌ها، دسته‌بندی قطعات، مقالات) باید از همین الگو کپی شود.

## استراتژی رندر: چرا SSG و چطور؟

1. `export const dynamic = "force-static"` ➜ Next مجبور است صفحه را در build بسازد.
2. `getAllBrands()` (در `lib/api/brands.ts`) با `cache: "force-cache"` و
   `next: { tags: ["brands"] }` fetch می‌کند.
3. **به‌روزرسانی بدون rebuild**: هر وقت ادمین در بک‌آفیس برندی را تغییر داد،
   بک‌اند یک webhook به یک Route Handler (که بعداً می‌سازید) بزند که
   `revalidateTag("brands")` را صدا کند — صفحه و sitemap هر دو تازه می‌شوند.

## سئو — چه چیزهایی و کجا؟

| سیگنال | محل پیاده‌سازی |
|---|---|
| `<title>` و description یکتا | `metadata` بالای `page.tsx` (با template سراسری `%s | کارتیوو` از layout ترکیب می‌شود) |
| Canonical | `alternates.canonical: "/brands"` — با `metadataBase` مطلق می‌شود |
| Open Graph | `metadata.openGraph` |
| JSON-LD `BreadcrumbList` | داخل `page.tsx` از طریق کامپوننت Shared `lib/seo/json-ld.tsx` |
| JSON-LD `ItemList` از `Brand` | همان‌جا — به گوگل می‌گوید این صفحه لیست برند است و به صفحات `brands/[slug]` لینک می‌دهد |
| Breadcrumb قابل مشاهده | `nav aria-label` + `aria-current="page"` — هم‌راستا با JSON-LD (الزام گوگل) |
| H1 یکتا | یک `<h1>` در header صفحه؛ نام برندها در کارت‌ها `<h2>` هستند |
| HTML معنایی | `ul/li` برای لیست، لینک کامل روی کارت با `aria-label` |
| حضور در sitemap | `src/app/sitemap.ts` هم `/brands` و هم تک‌تک `brands/[slug]` را از همین fetcher تولید می‌کند |

## ساختار فایل‌ها

```
brands/
├── page.tsx            # Server Component + metadata + JSON-LD
├── _components/
│   └── brand-card.tsx  # کارت برند (Server Component، صفر JS کلاینتی)
└── README.md
```

پیشوند `_` در `_components` یعنی Next این پوشه را route حساب نمی‌کند —
قرارداد پروژه برای کامپوننت‌های محلیِ هر صفحه.

## وابستگی به ماژول‌های Shared

- `lib/api/brands.ts` ← داده (که خودش از `lib/api/client.ts` استفاده می‌کند)
- `lib/seo/json-ld.tsx` ← تزریق Schema.org
- `lib/config/site.ts` ← URL مطلق برای JSON-LD
- `components/ui/card.tsx` ← کارت shadcn

## قدم بعدی طبیعی

`brands/[slug]/page.tsx` با `generateStaticParams` (لیست slug ها از همین
`getAllBrands`) + JSON-LD نوع `Brand` — تا هر برند هم صفحه‌ی SSG یکتای
خودش را داشته باشد.
