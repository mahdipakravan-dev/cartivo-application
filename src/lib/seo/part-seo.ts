/**
 * متادیتا و داده‌ی سئوی صفحه‌ی قطعه — عنوان و توضیح از داده‌ی واقعی همان قطعه
 * (نام، شماره فنی، برند، خودروهای سازگار، سال‌ها و بازه‌ی قیمت) ساخته می‌شود
 * تا هر صفحه متن اختصاصی و قابل‌استناد داشته باشد.
 */
import type { Metadata } from "next";
import { SERVER_BASE_URL } from "@/lib/api/config";
import type { SellerOffer } from "@/lib/api/pricing";
import type { PartFrontofficeResponse } from "@/lib/api/types";
import { absoluteUrl, siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { compatibleVehicleNames } from "./schema";

/** پیشنهاد فروشندگان برای SSR (سمت سرور، با کش کوتاه). */
export async function getSellerOffersForSeo(partId: number): Promise<SellerOffer[]> {
  try {
    const url = new URL(`/api/frontoffice/parts/${partId}/sellers`, SERVER_BASE_URL);
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300, tags: ["parts", `part:${partId}:sellers`] },
    });
    if (!response.ok) return [];
    const data = (await response.json()) as unknown;
    return Array.isArray(data) ? (data as SellerOffer[]) : [];
  } catch {
    return [];
  }
}

const faDigits = (value: number) => value.toLocaleString("fa-IR", { useGrouping: false });
/** مانند بقیه‌ی سایت، قیمت به ریال نمایش داده می‌شود. */
const faPrice = (rial: number) => `${rial.toLocaleString("fa-IR")} ریال`;

function yearsLabel(years: number[] | undefined): string | null {
  const sorted = [...new Set(years ?? [])].sort((a, b) => a - b);
  if (!sorted.length) return null;
  if (sorted.length === 1) return `مدل ${faDigits(sorted[0]!)}`;
  const consecutive = sorted.every((year, i) => i === 0 || year === sorted[i - 1]! + 1);
  return consecutive
    ? `مدل ${faDigits(sorted[0]!)} تا ${faDigits(sorted[sorted.length - 1]!)}`
    : `مدل‌های ${sorted.map(faDigits).join("، ")}`;
}

export function buildPartSeoText(
  part: PartFrontofficeResponse,
  offers: SellerOffer[] = [],
): { title: string; description: string } {
  const name = part.name?.trim() || "قطعه خودرو";
  const brand = part.partBrand?.persianName || part.partBrand?.englishName;
  const vehicles = compatibleVehicleNames(part);
  const years = yearsLabel(part.manufacturerYears);

  const titleParts = [name];
  if (brand && !name.includes(brand)) titleParts.push(brand);
  if (part.partNumber) titleParts.push(part.partNumber);
  if (vehicles.length) titleParts.push(`مناسب ${vehicles.slice(0, 2).join(" و ")}`);
  const title = `${titleParts.join(" ")} — قیمت و خرید`;

  const prices = offers
    .map((offer) => offer.priceRial)
    .filter((price): price is number => price != null && price > 0);

  const sentences: string[] = [];
  sentences.push(
    `خرید ${name}${brand ? ` برند ${brand}` : ""}${
      part.partNumber ? ` با شماره فنی ${part.partNumber}` : ""
    }`,
  );
  if (vehicles.length) {
    const more = vehicles.length > 3 ? ` و ${faDigits(vehicles.length - 3)} خودروی دیگر` : "";
    sentences[0] += `، سازگار با ${vehicles.slice(0, 3).join("، ")}${more}${years ? ` (${years})` : ""}`;
  } else if (years) {
    sentences[0] += ` (${years})`;
  }
  if (prices.length > 1) {
    sentences.push(
      `مقایسه قیمت ${faDigits(prices.length)} فروشنده از ${faPrice(Math.min(...prices))}`,
    );
  } else if (prices.length === 1) {
    sentences.push(`قیمت ${faPrice(prices[0]!)}`);
  }
  sentences.push(`ارسال از فروشندگان معتبر در ${siteConfig.name}`);

  return { title, description: `${sentences.join(". ")}.` };
}

export function buildPartMetadata(
  part: PartFrontofficeResponse,
  offers: SellerOffer[] = [],
): Metadata {
  const { title, description } = buildPartSeoText(part, offers);
  const canonical = ROUTES.partDetail(String(part.id));
  const image = part.imageUrls?.find(Boolean);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: canonical,
      type: "website",
      ...(image ? { images: [{ url: absoluteUrl(image) }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
