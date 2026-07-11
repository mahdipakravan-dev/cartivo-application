import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { searchParts } from "@/lib/api/parts";
import { ROUTES } from "@/lib/routes";

export async function Bestsellers() {
  const { items: parts } = await searchParts({
    size: 4,
    sortBy: "createdAt",
    sortDir: "DESC",
  });

  if (parts.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-16" aria-label="پرفروش‌ترین قطعات">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="پرفروش‌ترین قطعات"
          href={ROUTES.parts}
          linkText="مشاهده همه قطعات"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {parts.map((part) => (
            <ProductCard key={part.id} part={part} variant="vertical" />
          ))}
        </div>
      </div>
    </section>
  );
}
