export interface CategoryNavigationSource {
  id?: number;
  name?: string;
  persianName?: string;
}

interface PaginationSlice<T> {
  items: T[];
  page: number;
  totalPages: number;
  hasNext: boolean;
}

export function getCategoryHref(
  category: CategoryNavigationSource,
): string | null {
  if (typeof category.id !== "number" || !Number.isSafeInteger(category.id)) {
    return null;
  }
  const label = getCategoryLabel(category) ?? "category";

  return `/parent/${encodeURIComponent(label)}?categoryId=${category.id}`;
}

export function getCategoryLabel(
  category: CategoryNavigationSource,
): string | null {
  return cleanText(category.persianName) ?? cleanText(category.name);
}

export async function collectPaginatedItems<T>(
  fetchPage: (page: number) => Promise<PaginationSlice<T>>,
): Promise<T[]> {
  const items: T[] = [];
  let nextPage = 0;

  while (true) {
    const result = await fetchPage(nextPage);
    items.push(...result.items);

    if (!result.hasNext) return items;

    const followingPage = result.page + 1;
    if (result.totalPages > 0 && followingPage >= result.totalPages) return items;
    if (followingPage <= nextPage) throw new Error("Paginated endpoint did not advance");
    nextPage = followingPage;
  }
}

function cleanText(value: string | undefined): string | null {
  const cleaned = value?.trim();
  return cleaned || null;
}
