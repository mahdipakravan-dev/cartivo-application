import Image from "next/image";
import { ArrowLeft, BookOpen, CalendarDays } from "lucide-react";
import type { BlogPreview } from "@/lib/api/content";
import { ROUTES } from "@/lib/routes";

export function ProductRelatedBlogs({ blogs }: { blogs: BlogPreview[] }) {
  if (blogs.length === 0) return null;

  return (
    <section className="mt-8 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_16px_50px_rgb(15_23_42/0.04)] sm:p-8">
      <div><p className="text-xs font-bold text-cyan-700">راهنمای خرید و نگهداری</p><h2 className="mt-2 text-2xl font-black text-slate-900">مقالات مرتبط با این قطعه</h2><p className="mt-2 text-sm text-slate-400">مطالبی برای انتخاب بهتر، نصب و نگهداری قطعه.</p></div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {blogs.map((blog, index) => {
          const card = <><div className="relative h-48 overflow-hidden bg-[#14305A]">{blog.imageUrl ? <Image src={blog.imageUrl} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgb(103_232_249/0.16),transparent_65%)]"><BookOpen className="size-12 text-cyan-200/35" /></div>}<div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />{blog.category && <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-slate-950/30 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">{blog.category}</span>}</div><div className="p-4"><p className="flex items-center gap-1.5 text-[10px] text-slate-400"><CalendarDays className="size-3" />{formatDate(blog.publishedAt)}</p><h3 className="mt-2 line-clamp-2 text-sm font-black leading-6 text-slate-800 group-hover:text-[#14305A]">{blog.title}</h3>{blog.excerpt && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{blog.excerpt}</p>}<span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700">مطالعه مقاله <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" /></span></div></>;
          const className = "group block overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg";
          return blog.slug ? <a key={blog.id ?? blog.slug ?? index} href={ROUTES.blogDetail(blog.slug)} className={className}>{card}</a> : <article key={blog.id ?? index} className={className}>{card}</article>;
        })}
      </div>
    </section>
  );
}

function formatDate(value?: string) { if (!value) return "مقاله مرتبط"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "مقاله مرتبط" : new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(date); }
