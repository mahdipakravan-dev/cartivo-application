import { apiClient } from "./client";
import { searchParts } from "./parts";
import type { BlogDetailResponse, PageResponse, PartBrandFrontofficeResponse } from "./types";

export interface BlogPreview {
  id?: number;
  title: string;
  slug?: string;
  excerpt?: string;
  imageUrl?: string;
  publishedAt?: string;
  category?: string;
}

export async function getPartBrands(size = 16): Promise<PartBrandFrontofficeResponse[]> {
  try {
    const { data, error } = await apiClient.GET("/api/frontoffice/brand-parts", {
      params: { query: { page: 0, size, sortBy: "persianName", sortDir: "ASC" } },
      cache: "force-cache",
      next: { tags: ["part-brands"] },
    });
    if (error || !data) return [];
    return ((data as PageResponse).content ?? []) as PartBrandFrontofficeResponse[];
  } catch {
    return [];
  }
}

export async function getPartBrandBySlug(slug: string): Promise<PartBrandFrontofficeResponse | null> {
  try {
    const { data, error } = await apiClient.GET("/api/frontoffice/brand-parts", {
      params: { query: { slug, page: 0, size: 20 } },
      cache: "force-cache",
      next: { tags: ["part-brands", `part-brand:${slug}`] },
    });
    if (error || !data) return null;
    const brands = ((data as PageResponse).content ?? []) as PartBrandFrontofficeResponse[];
    return brands.find((brand) => brand.slug === slug) ?? brands[0] ?? null;
  } catch {
    return null;
  }
}

export async function getLatestRelatedBlogs(size = 4): Promise<BlogPreview[]> {
  try {
    const seed = await searchParts({ size: 1, sortBy: "createdAt", sortDir: "DESC" });
    const partId = seed.items[0]?.id;
    if (partId == null) return [];

    const { data, error } = await apiClient.GET("/api/frontoffice/blogs/top", {
      params: { query: {  page: 0, size : 3, sortBy: "createdAt", sortDir: "DESC" } },
      cache: "no-store",
    });
    if (error || !data) return [];

    return (((data as PageResponse).content ?? []) as Record<string, unknown>[])
      .map(normalizeBlog)
      .filter((blog): blog is BlogPreview => blog !== null);
  } catch {
    return [];
  }
}

export async function getRelatedBlogs(partId: number, size = 3): Promise<BlogPreview[]> {
  try {
    const { data, error } = await apiClient.GET("/api/frontoffice/blogs/related", {
      params: { query: { partId, page: 0, size, sortBy: "createdAt", sortDir: "DESC" } },
      cache: "no-store",
    });
    if (error || !data) return [];
    return (((data as PageResponse).content ?? []) as Record<string, unknown>[])
      .map(normalizeBlog)
      .filter((blog): blog is BlogPreview => blog !== null);
  } catch {
    return [];
  }
}

export async function getBlogDetail(slug: string): Promise<BlogDetailResponse | null> {
  try {
    const { data, error } = await apiClient.GET("/api/frontoffice/blogs/detail", {
      params: { query: { slug } },
      cache: "force-cache",
      next: { tags: ["blogs", `blog:${slug}`] },
    });
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

function normalizeBlog(value: Record<string, unknown>): BlogPreview | null {
  const title = stringValue(value.title) ?? stringValue(value.name);
  if (!title) return null;

  const blog: BlogPreview = { title };
  if (typeof value.id === "number") blog.id = value.id;
  const slug = stringValue(value.slug);
  const excerpt = stringValue(value.excerpt) ?? stringValue(value.summary) ?? stringValue(value.description);
  const imageUrl = stringValue(value.imageUrl) ?? stringValue(value.coverImageUrl) ?? firstString(value.imageUrls);
  const publishedAt = stringValue(value.publishedAt) ?? stringValue(value.createdAt);
  const category = stringValue(value.categoryName) ?? nestedName(value.category);
  if (slug) blog.slug = slug;
  if (excerpt) blog.excerpt = excerpt;
  if (imageUrl) blog.imageUrl = imageUrl;
  if (publishedAt) blog.publishedAt = publishedAt;
  if (category) blog.category = category;
  return blog;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function firstString(value: unknown): string | undefined {
  return Array.isArray(value) ? value.find((item): item is string => typeof item === "string") : undefined;
}

function nestedName(value: unknown): string | undefined {
  return value && typeof value === "object" ? stringValue((value as Record<string, unknown>).name) : undefined;
}
