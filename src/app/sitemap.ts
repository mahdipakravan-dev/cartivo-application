import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { SERVER_BASE_URL } from "@/lib/api/config";
import { getCategoryHref, getCategoryLabel } from "@/lib/catalog-navigation";
import { ROUTES } from "@/lib/routes";

/**
 * نقشه‌ی سایت داینامیک — /sitemap.xml
 *
 * فقط URL های اصلی (canonical) و قابل‌ایندکس درج می‌شوند:
 * - صفحات ثابت عمومی
 * - برندهای خودرو (/parts/brands/{id}) و مدل‌ها و خودروهای هر برند
 * - همه‌ی دسته‌بندی‌های فعال (ریشه و زیرشاخه‌ها)
 * - قطعات قابل‌خرید (فعال، دارای قیمت و موجودی) با آدرس مرجع /parts/{id}
 * - برندهای قطعه و مقالات بلاگ
 *
 * سبد خرید، پروفایل، مقایسه و URL های فیلتر/پارامتردار عمداً حذف شده‌اند.
 * داده با کش یک‌ساعته خوانده می‌شود تا هر درخواست خزنده بک‌اند را درگیر نکند.
 */
export const revalidate = 3600;

const REVALIDATE_SECONDS = 3600;
const PAGE_SIZE = 100;
/** سقف ایمنی؛ هر sitemap حداکثر ۵۰٬۰۰۰ URL مجاز دارد. */
const MAX_PART_PAGES = 400;
const MAX_CATEGORY_DEPTH = 6;

interface Page<T> {
  content?: T[];
  totalPages?: number;
  hasNext?: boolean;
}

interface IdName {
  id?: number;
  name?: string;
  persianName?: string;
  slug?: string;
  categoryParentId?: number | null;
}

interface CatalogCar {
  modelYearId?: number;
  model?: { id?: number };
}

async function getJson<T>(
  path: string,
  query: Record<string, string | number> = {},
): Promise<T | null> {
  try {
    const url = new URL(`/api/frontoffice/${path}`, SERVER_BASE_URL);
    Object.entries(query).forEach(([key, value]) =>
      url.searchParams.set(key, String(value)),
    );
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["sitemap"] },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function getAllPages<T>(
  path: string,
  query: Record<string, string | number> = {},
  maxPages = 50,
): Promise<T[]> {
  const items: T[] = [];
  for (let page = 0; page < maxPages; page += 1) {
    const data = await getJson<Page<T> | T[]>(path, { ...query, page, size: PAGE_SIZE });
    if (!data) break;
    // بعضی endpoint ها آرایه‌ی ساده برمی‌گردانند (بدون صفحه‌بندی)
    if (Array.isArray(data)) {
      items.push(...data);
      break;
    }
    items.push(...(data.content ?? []));
    const hasNext = data.hasNext ?? (data.totalPages ?? 0) > page + 1;
    if (!hasNext) break;
  }
  return items;
}

const url = (path: string) => `${siteConfig.url}${path}`;

async function brandAndCarEntries(): Promise<MetadataRoute.Sitemap> {
  const brands = (await getJson<IdName[]>("brands")) ?? [];
  const entries: MetadataRoute.Sitemap = [];

  await Promise.all(
    brands.map(async (brand) => {
      if (brand.id == null) return;
      const brandSlug = String(brand.id);
      entries.push({
        url: url(ROUTES.brandDetail(brandSlug)),
        changeFrequency: "weekly",
        priority: 0.8,
      });

      const cars = await getAllPages<CatalogCar>("cars", {
        brandId: brand.id,
        sort: "year,desc",
      });
      const modelIds = new Set<number>();
      for (const car of cars) {
        if (car.model?.id != null) modelIds.add(car.model.id);
        if (car.modelYearId != null) {
          entries.push({
            url: url(ROUTES.partsCar(brandSlug, String(car.modelYearId))),
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
      for (const modelId of modelIds) {
        entries.push({
          url: url(ROUTES.partsModel(brandSlug, modelId)),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }),
  );

  return entries;
}

async function categoryEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const roots = await getAllPages<IdName>("categories", {
    sortBy: "name",
    sortDir: "ASC",
  });

  async function walk(parentId: number, rootLabel: string, depth: number) {
    if (depth > MAX_CATEGORY_DEPTH) return;
    const children = await getAllPages<IdName>("categories", {
      categoryParentId: parentId,
      sortBy: "name",
      sortDir: "ASC",
    });
    await Promise.all(
      children.map(async (child) => {
        if (child.id == null) return;
        entries.push({
          url: url(ROUTES.parentCategory(rootLabel, child.id)),
          changeFrequency: "weekly",
          priority: 0.7,
        });
        await walk(child.id, rootLabel, depth + 1);
      }),
    );
  }

  await Promise.all(
    roots.map(async (root) => {
      const href = getCategoryHref(root);
      const label = getCategoryLabel(root);
      if (!href || !label || root.id == null) return;
      entries.push({ url: url(href), changeFrequency: "weekly", priority: 0.8 });
      await walk(root.id, label, 1);
    }),
  );

  return entries;
}

async function partEntries(): Promise<MetadataRoute.Sitemap> {
  // /parts/search فقط قطعات فعال، دارای قیمت فعلی و موجودی مثبت را برمی‌گرداند —
  // دقیقاً همان صفحاتی که ارزش ایندکس دارند.
  const parts = await getAllPages<IdName>(
    "parts/search",
    {},
    MAX_PART_PAGES,
  );
  const seen = new Set<number>();
  return parts.flatMap((part) => {
    if (part.id == null || seen.has(part.id)) return [];
    seen.add(part.id);
    return [
      {
        url: url(ROUTES.partDetail(String(part.id))),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
    ];
  });
}

async function partBrandEntries(): Promise<MetadataRoute.Sitemap> {
  const brands = await getAllPages<IdName>("brand-parts", {
    sortBy: "persianName",
    sortDir: "ASC",
  });
  return brands.flatMap((brand) =>
    brand.slug
      ? [
          {
            url: url(ROUTES.partBrandDetail(brand.slug)),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          },
        ]
      : [],
  );
}

async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getAllPages<IdName & { updatedAt?: string; createdAt?: string }>(
    "blogs/top",
    { sortBy: "createdAt", sortDir: "DESC" },
    10,
  );
  return blogs.flatMap((blog) =>
    blog.slug
      ? [
          {
            url: url(ROUTES.blogDetail(blog.slug)),
            ...((blog.updatedAt ?? blog.createdAt)
              ? { lastModified: blog.updatedAt ?? blog.createdAt }
              : {}),
            changeFrequency: "monthly" as const,
            priority: 0.5,
          },
        ]
      : [],
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: url(ROUTES.parts), changeFrequency: "daily", priority: 0.9 },
    { url: url(ROUTES.brands), changeFrequency: "weekly", priority: 0.9 },
    { url: url(ROUTES.categories), changeFrequency: "weekly", priority: 0.9 },
    { url: url(ROUTES.partBrands), changeFrequency: "weekly", priority: 0.7 },
    { url: url(ROUTES.sellerJoin), changeFrequency: "monthly", priority: 0.5 },
    { url: url(ROUTES.about), changeFrequency: "monthly", priority: 0.4 },
    { url: url(ROUTES.contact), changeFrequency: "monthly", priority: 0.4 },
  ];

  const groups = await Promise.all([
    partEntries(),
    categoryEntries(),
    brandAndCarEntries(),
    partBrandEntries(),
    blogEntries(),
  ]);

  // حذف URL تکراری با حفظ اولین (بالاترین اولویت) مورد
  const seen = new Set<string>();
  return [...staticEntries, ...groups.flat()].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
