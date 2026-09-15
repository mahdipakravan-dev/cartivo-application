export interface TopLevelPartNavigationSource {
  id?: number;
  name?: string;
  businessName?: string;
  manufacturerName?: string;
}

interface PaginationSlice<T> {
  items: T[];
  page: number;
  totalPages: number;
  hasNext: boolean;
}

export function getTopLevelPartHref(
  part: TopLevelPartNavigationSource,
): string | null {
  const manufacturerName = cleanText(part.manufacturerName);
  if (typeof part.id !== "number" || !Number.isSafeInteger(part.id) ) return null;

  return `/${encodeURIComponent(manufacturerName)}?parentId=${part.id}`;
}

export function getTopLevelPartLabel(
  part: TopLevelPartNavigationSource,
): string | null {
  return cleanText(part.name)
    ?? cleanText(part.businessName)
    ?? cleanText(part.manufacturerName);
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
