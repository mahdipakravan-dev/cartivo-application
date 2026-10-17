import { HomeHero } from "@/components/sections/home-hero";
import { BrandsSection } from "@/components/sections/brands";
import { PositionTypeSection } from "@/components/sections/position-type";
import { Features } from "@/components/sections/features";
import { Bestsellers } from "@/components/sections/bestsellers";
import { PartBrandsSection } from "@/components/sections/part-brands";
import { Articles } from "@/components/sections/articles";
import { PartRequestCover } from "@/components/sections/part-request-cover";
import { getBrands } from "@/lib/api/brands";
import { CatalogHydrator } from "@/lib/store";
import { PreviewEditable } from "@/components/preview/preview-editable";
import { siteConfig } from "@/lib/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // absolute: عنوان صفحه‌ی خانه خودش نام برند را دارد و template لازم نیست
  title: { absolute: siteConfig.homeTitle },
  description: siteConfig.description,
  // canonical بدون پارامتر تا نسخه‌های ?preview=… و مشابه ایندکس جدا نشوند
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.homeTitle,
    description: siteConfig.description,
    url: "/",
    type: "website",
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const previewValue = Array.isArray(query.preview)
    ? query.preview[0]
    : query.preview;
  const preview = previewValue === "true";
  const { items: brands } = await getBrands({ size: 200 });

  return (
    <>
      <CatalogHydrator brands={brands} />
      <PreviewEditable
        enabled={preview}
        componentName="بنر اصلی"
        overlaidHeader
      >
        <HomeHero variant="advertisement" brands={brands} />
      </PreviewEditable>
      <PreviewEditable enabled={preview} componentName="برندهای خودرو">
        <BrandsSection />
      </PreviewEditable>
      <PreviewEditable enabled={preview} componentName="موقعیت قطعات">
        <PositionTypeSection />
      </PreviewEditable>
      <PreviewEditable enabled={preview} componentName="پرفروش‌ترین قطعات">
        <Bestsellers />
      </PreviewEditable>
      <PreviewEditable enabled={preview} componentName="مزایای کارتیو">
        <Features />
      </PreviewEditable>
      <PreviewEditable enabled={preview} componentName="برندهای قطعات">
        <PartBrandsSection />
      </PreviewEditable>
      <PreviewEditable enabled={preview} componentName="درخواست قطعه">
        <PartRequestCover />
      </PreviewEditable>
      <PreviewEditable enabled={preview} componentName="آخرین مقالات">
        <Articles />
      </PreviewEditable>
    </>
  );
}
