/**
 * سازنده‌های داده‌ی ساختاریافته (Schema.org) — یک منبع برای همه‌ی صفحات.
 *
 * - Organization و WebSite یک بار در layout ریشه منتشر می‌شوند و بقیه‌ی
 *   اسکیماها با @id به آن‌ها ارجاع می‌دهند (یک Entity واحد برای برند).
 * - Product فقط از داده‌ی واقعی API ساخته می‌شود: قیمت و موجودی از پیشنهاد
 *   فروشندگان، نه مقدار ثابت.
 */
import type { PartFrontofficeResponse } from "@/lib/api/types";
import type { SellerOffer } from "@/lib/api/pricing";
import { absoluteUrl, siteConfig } from "@/lib/config/site";

type Schema = Record<string, unknown>;

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

export function organizationSchema(): Schema {
  const { contact } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    alternateName: siteConfig.nameEn,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(siteConfig.logoPath),
    },
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    ...(siteConfig.sameAs.length ? { sameAs: siteConfig.sameAs } : {}),
    ...(!contact.isPlaceholder
      ? {
          email: contact.email,
          telephone: contact.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.address,
            addressCountry: "IR",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: contact.phone,
            contactType: "customer service",
            availableLanguage: "Persian",
          },
        }
      : { email: contact.email }),
  };
}

export function websiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    alternateName: siteConfig.nameEn,
    url: siteConfig.url,
    inLanguage: "fa-IR",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface BreadcrumbItem {
  name: string;
  /** مسیر نسبی؛ برای آیتم آخر (صفحه‌ی فعلی) اختیاری است. */
  path?: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

const SHIPPING_COUNTRY = "IR";

function offerSchema(offer: SellerOffer, url: string): Schema | null {
  if (offer.priceRial == null || offer.priceRial <= 0) return null;
  const inStock = (offer.availableQuantity ?? 0) > 0;
  return {
    "@type": "Offer",
    url,
    price: offer.priceRial,
    priceCurrency: "IRR",
    availability: inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    ...(offer.validUntil ? { priceValidUntil: offer.validUntil.slice(0, 10) } : {}),
    ...(offer.sellerName
      ? { seller: { "@type": "Organization", name: offer.sellerName } }
      : {}),
    ...(offer.shippingCostRial != null
      ? {
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: offer.shippingCostRial,
              currency: "IRR",
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: SHIPPING_COUNTRY,
            },
          },
        }
      : {}),
  };
}

/** خودروهای سازگار از fitment های قطعه (برای isAccessoryOrSparePartFor). */
export function compatibleVehicleNames(part: PartFrontofficeResponse): string[] {
  const names = (part.fitments ?? [])
    .map((fitment) =>
      [fitment.generationName, fitment.variantName].filter(Boolean).join(" "),
    )
    .filter((name) => name.length > 0);
  return [...new Set(names)];
}

export function productSchema(params: {
  part: PartFrontofficeResponse;
  path: string;
  offers: SellerOffer[];
  description?: string;
}): Schema {
  const { part, offers } = params;
  const url = absoluteUrl(params.path);
  const name = part.name || "قطعه خودرو";
  const images = (part.imageUrls ?? []).filter(Boolean).map(absoluteUrl);
  const brandName = part.partBrand?.persianName || part.partBrand?.englishName;
  const category = part.categories
    ?.map((item) => item.persianName || item.name)
    .filter(Boolean)
    .join(" / ");
  const vehicles = compatibleVehicleNames(part);

  const offerItems = offers
    .map((offer) => offerSchema(offer, url))
    .filter((offer): offer is Schema => offer != null);
  const prices = offerItems.map((offer) => offer.price as number);

  let offersSchema: Schema | undefined;
  if (offerItems.length === 1) {
    offersSchema = offerItems[0];
  } else if (offerItems.length > 1) {
    offersSchema = {
      "@type": "AggregateOffer",
      priceCurrency: "IRR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: offerItems.length,
      availability: "https://schema.org/InStock",
      offers: offerItems,
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    name,
    ...(params.description || part.description
      ? { description: params.description || part.description }
      : {}),
    ...(images.length ? { image: images } : {}),
    ...(part.id != null ? { sku: String(part.id) } : {}),
    ...(part.partNumber ? { mpn: part.partNumber } : {}),
    ...(brandName ? { brand: { "@type": "Brand", name: brandName } } : {}),
    ...(category ? { category } : {}),
    ...(vehicles.length
      ? {
          isAccessoryOrSparePartFor: vehicles.map((vehicle) => ({
            "@type": "Car",
            name: vehicle,
          })),
        }
      : {}),
    ...(offersSchema ? { offers: offersSchema } : {}),
  };
}
