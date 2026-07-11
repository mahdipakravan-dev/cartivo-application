import { HomeHero } from "@/components/sections/home-hero";
import { BrandsSection } from "@/components/sections/brands";
import { PositionTypeSection } from "@/components/sections/position-type";
import { Features } from "@/components/sections/features";
import { Bestsellers } from "@/components/sections/bestsellers";
import { PartBrandsSection } from "@/components/sections/part-brands";
import { Articles } from "@/components/sections/articles";
import { getBrands } from "@/lib/api/brands";
import { CatalogHydrator } from "@/lib/store";

export default async function HomePage() {
  const { items: brands } = await getBrands({ size: 200 });

  return (
    <>
      <CatalogHydrator brands={brands} />
      <HomeHero variant="full-primary" brands={brands} />
      <BrandsSection />
      <PositionTypeSection />
      <Bestsellers />
      <Features />
      <PartBrandsSection />
      <Articles />
    </>
  );
}
