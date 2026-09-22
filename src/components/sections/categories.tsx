import Link from "next/link";
import { Snowflake, Wrench, Disc, Lightbulb, Cog, Battery } from "lucide-react";

const categories = [
  {
    name: "گرمایش و سرمایش",
    count: 245,
    icon: Snowflake,
    color: "var(--accent)",
  },
  {
    name: "تعلیق و جلوبندی",
    count: 180,
    icon: Wrench,
    color: "var(--accent-light)",
  },
  {
    name: "سیستم ترمز",
    count: 120,
    icon: Disc,
    color: "var(--accent)",
  },
  {
    name: "روشنایی و چراغ",
    count: 95,
    icon: Lightbulb,
    color: "var(--accent-light)",
  },
  {
    name: "موتور و قدرت",
    count: 310,
    icon: Cog,
    color: "var(--primary)",
  },
  {
    name: "برق و باتری",
    count: 150,
    icon: Battery,
    color: "var(--accent)",
  },
];

export function Categories() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-black text-[var(--dark)] lg:text-2xl">
            دسته‌بندی قطعات
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            مشاهده همه
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/categories/${encodeURIComponent(cat.name)}`}
                className="group rounded-3xl  bg-[var(--background)] p-5 text-center transition-all hover:border-[var(--accent)]/20 hover:shadow-lg lg:p-6"
              >
                <div
                  className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 lg:h-16 lg:w-16"
                  style={{ backgroundColor: `${cat.color}14` }}
                >
                  <Icon
                    className="h-7 w-7 lg:h-8 lg:w-8"
                    style={{ color: cat.color }}
                  />
                </div>
                <h3 className="mb-1 text-sm font-bold text-[var(--dark)] lg:text-base">
                  {cat.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {cat.count.toLocaleString("fa-IR")} محصول
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
