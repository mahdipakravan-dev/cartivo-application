import { Calendar } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

interface Article {
  title: string;
  image: string;
  date: string;
  tag: string;
  slug: string;
}

const articles: Article[] = [
  {
    title: "راهنمای تعویض روغن موتور خودرو",
    image:
      "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/870d18938_generated_f0ad972c.png",
    date: "۱۴۰۳/۰۲/۲۸",
    tag: "آموزشی",
    slug: "oil-change-guide",
  },
  {
    title: "نکات نگهداری از سیستم ترمز",
    image:
      "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/74bc0cdff_generated_0ef0d56a.png",
    date: "۱۴۰۳/۰۲/۱۵",
    tag: "نگهداری",
    slug: "brake-maintenance",
  },
  {
    title: "راهنمای انتخاب و نگهداری لاستیک",
    image:
      "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/d9289955c_generated_ca1d66aa.png",
    date: "۱۴۰۳/۰۱/۳۰",
    tag: "راهنما",
    slug: "tire-guide",
  },
  {
    title: "بررسی و نگهداری باتری خودرو",
    image:
      "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/65c2c345b_generated_65533ac9.png",
    date: "۱۴۰۳/۰۱/۱۲",
    tag: "آموزشی",
    slug: "battery-maintenance",
  },
];

export function Articles() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="مقالات و راهنما"
          href="/articles"
          linkText="مشاهده همه"
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <a
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group overflow-hidden rounded-3xl border border-gray-100 transition-all hover:border-[#0066ff]/20 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0066ff] backdrop-blur-sm">
                  {article.tag}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="mb-2 text-sm font-bold leading-relaxed text-[#1A1A1B] line-clamp-2 transition-colors group-hover:text-[#0066ff]">
                  {article.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#777777]">
                  <Calendar className="h-3.5 w-3.5" />
                  {article.date}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
