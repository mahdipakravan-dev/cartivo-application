import Image from "next/image";
import { ArrowLeft, BookOpen, CalendarDays } from "lucide-react";
import { getLatestRelatedBlogs, type BlogPreview } from "@/lib/api/content";
import { SectionHeader } from "@/components/ui/section-header";

function formatDate(value?: string) {
  if (!value) return "تازه منتشر شده";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "تازه منتشر شده";
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function ArticleCard({ article, featured = false }: { article: BlogPreview; featured?: boolean }) {
  const content = (
    <>
      <div className="relative min-h-52 overflow-hidden bg-[#14305A] sm:min-h-56">
        {article.imageUrl ? (
          <Image src={article.imageUrl} alt={article.title} fill sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"} className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgb(103_232_249/0.16),transparent_65%)]">
            <BookOpen className="size-16 text-cyan-200/35" strokeWidth={1.2} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
        <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-slate-950/30 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
          {article.category || "مجله کارتیوو"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <CalendarDays className="size-3.5" />
          {formatDate(article.publishedAt)}
        </div>
        <h3 className={`mt-3 line-clamp-2 font-black leading-7 text-slate-800 transition-colors group-hover:text-[#14305A] ${featured ? "text-lg sm:text-xl" : "text-base"}`}>
          {article.title}
        </h3>
        {article.excerpt && <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-400">{article.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold text-cyan-700">
          مطالعه مقاله <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </div>
    </>
  );

  const className = `group flex overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-[0_10px_35px_rgb(15_23_42/0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgb(15_48_90/0.1)] ${featured ? "flex-col md:grid md:grid-cols-[1.1fr_.9fr] lg:col-span-2" : "flex-col"}`;
  return article.slug ? <a href={`/blogs/${article.slug}`} className={className}>{content}</a> : <article className={className}>{content}</article>;
}

export async function Articles() {
  const articles = await getLatestRelatedBlogs(4);
  if (articles.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-16" aria-label="آخرین مقالات">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        <SectionHeader title="آخرین مقالات" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, index) => <ArticleCard key={article.id ?? article.slug ?? index} article={article} featured={index === 0} />)}
        </div>
      </div>
    </section>
  );
}
