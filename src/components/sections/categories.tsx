import Link from "next/link";
import {
  Snowflake,
  Wrench,
  Disc,
  Lightbulb,
  Cog,
  Battery,
} from "lucide-react";

const categories = [
  {
    name: "گرمایش و سرمایش",
    count: 245,
    icon: Snowflake,
    color: "#0066ff",
  },
  {
    name: "تعلیق و جلوبندی",
    count: 180,
    icon: Wrench,
    color: "#00c896",
  },
  {
    name: "سیستم ترمز",
    count: 120,
    icon: Disc,
    color: "#ff6b00",
  },
  {
    name: "روشنایی و چراغ",
    count: 95,
    icon: Lightbulb,
    color: "#ffb800",
  },
  {
    name: "موتور و قدرت",
    count: 310,
    icon: Cog,
    color: "#8b5cf6",
  },
  {
    name: "برق و باتری",
    count: 150,
    icon: Battery,
    color: "#ef4444",
  },
];

export function Categories() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-black text-[#1A1A1B] lg:text-2xl">
            دسته‌بندی قطعات
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-[#0066ff] hover:underline"
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
                className="group rounded-3xl border border-gray-100 bg-[#F8F9FA] p-5 text-center transition-all hover:border-[#0066ff]/20 hover:shadow-lg lg:p-6"
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
                <h3 className="mb-1 text-sm font-bold text-[#1A1A1B] lg:text-base">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#777777]">
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
