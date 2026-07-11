import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, BookOpen, CalendarDays, CarFront, ChevronLeft, Clock3,
  Images, Package, Quote, Wrench,
} from "lucide-react";
import { getBlogDetail } from "@/lib/api/content";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { JsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogDetail(slug);
  if (!blog) return { title: "مقاله یافت نشد" };
  const title = blog.title || "مقاله کارتیوو";
  const description = blog.excerpt || excerptFromContent(blog.content);
  return {
    title,
    description,
    alternates: { canonical: ROUTES.blogDetail(slug) },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: "article",
      url: ROUTES.blogDetail(slug),
      ...(blog.publishedAt ? { publishedTime: blog.publishedAt } : {}),
      ...(blog.coverImageUrl ? { images: [{ url: blog.coverImageUrl }] } : {}),
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogDetail(slug);
  if (!blog) notFound();

  const title = blog.title || "مقاله کارتیوو";
  const body = plainText(blog.content || blog.excerpt || "");
  const paragraphs = body.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  const readTime = Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 220));
  const gallery = (blog.imageUrls || []).filter((image) => image && image !== blog.coverImageUrl);
  const articleUrl = `${siteConfig.url}${ROUTES.blogDetail(slug)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: blog.excerpt || excerptFromContent(blog.content),
    url: articleUrl,
    ...(blog.coverImageUrl ? { image: [blog.coverImageUrl, ...gallery] } : {}),
    ...(blog.publishedAt ? { datePublished: blog.publishedAt } : {}),
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <nav aria-label="مسیر ناوبری" className="mb-6 overflow-hidden text-xs text-slate-400">
            <ol className="flex items-center gap-1.5 whitespace-nowrap"><li><Link href={ROUTES.home} className="hover:text-[#14305A]">خانه</Link></li><li><ChevronLeft className="size-3" /></li><li className="text-slate-500">مجله کارتیوو</li><li><ChevronLeft className="size-3" /></li><li className="truncate font-bold text-slate-600">{title}</li></ol>
          </nav>

          <header className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
            <div className="absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="grid lg:min-h-[460px] lg:grid-cols-[1fr_1.05fr]">
              <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 lg:px-14">
                <div><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100"><BookOpen className="size-4" /> مجله کارتیوو</span><h1 className="mt-6 text-3xl font-black leading-[1.55] text-white sm:text-4xl lg:text-5xl">{title}</h1>{blog.excerpt && <p className="mt-5 max-w-xl text-sm leading-8 text-white/60 sm:text-base">{blog.excerpt}</p>}<div className="mt-7 flex flex-wrap gap-2 text-xs text-white/55">{blog.publishedAt && <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2"><CalendarDays className="size-3.5 text-cyan-300" />{formatDate(blog.publishedAt)}</span>}<span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2"><Clock3 className="size-3.5 text-cyan-300" />{readTime.toLocaleString("fa-IR")} دقیقه مطالعه</span></div></div>
              </div>
              <div className="relative min-h-[300px] overflow-hidden border-t border-white/10 lg:min-h-[460px] lg:border-r lg:border-t-0">{blog.coverImageUrl ? <Image src={blog.coverImageUrl} alt={title} fill sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" priority /> : <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgb(103_232_249/0.14),transparent_65%)]"><BookOpen className="size-28 text-cyan-200/25" strokeWidth={1} /></div>}<div className="absolute inset-0 bg-gradient-to-t from-[#14305A]/45 via-transparent to-transparent lg:bg-gradient-to-r" /></div>
            </div>
          </header>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_16px_50px_rgb(15_23_42/0.04)] sm:p-9 lg:p-12">
              {blog.excerpt && <div className="mb-9 flex gap-4 rounded-2xl bg-cyan-50/70 p-5 text-[#14305A]"><Quote className="mt-1 size-6 shrink-0 text-cyan-700" /><p className="text-base font-bold leading-8">{blog.excerpt}</p></div>}
              <div className="space-y-6 text-[15px] leading-9 text-slate-600 sm:text-base sm:leading-9">{paragraphs.length > 0 ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>محتوای این مقاله به‌زودی تکمیل می‌شود.</p>}</div>

              {gallery.length > 0 && <section className="mt-10 border-t border-slate-100 pt-8"><div className="mb-5 flex items-center gap-2"><Images className="size-5 text-cyan-700" /><h2 className="text-lg font-black text-slate-900">تصاویر مقاله</h2></div><div className={`grid gap-3 ${gallery.length > 1 ? "sm:grid-cols-2" : ""}`}>{gallery.map((image, index) => <div key={image} className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100"><Image src={image} alt={`${title} - تصویر ${index + 1}`} fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover transition-transform duration-500 hover:scale-105" /></div>)}</div></section>}
            </article>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <RelatedCars cars={blog.cars || []} />
              <RelatedParts parts={blog.parts || []} />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function RelatedCars({ cars }: { cars: NonNullable<Awaited<ReturnType<typeof getBlogDetail>>>["cars"] extends infer T ? NonNullable<T> : never }) {
  if (!cars?.length) return null;
  return <section className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><CarFront className="size-4" /></span><div><p className="text-[10px] font-bold text-cyan-700">خودروهای مرتبط</p><h2 className="text-base font-black text-slate-800">این مقاله برای چه خودروهایی است؟</h2></div></div><div className="mt-5 space-y-2">{cars.map((car, index) => <div key={car.id ?? car.slug ?? index} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3"><CarFront className="size-4 shrink-0 text-slate-300" /><span className="truncate text-sm font-bold text-slate-600">{car.model || car.slug || "خودرو"}</span></div>)}</div></section>;
}

function RelatedParts({ parts }: { parts: NonNullable<Awaited<ReturnType<typeof getBlogDetail>>>["parts"] extends infer T ? NonNullable<T> : never }) {
  if (!parts?.length) return null;
  return <section className="rounded-[1.5rem] bg-[#14305A] p-5 text-white shadow-lg"><div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-cyan-300"><Wrench className="size-4" /></span><div><p className="text-[10px] font-bold text-cyan-300">قطعات مرتبط</p><h2 className="text-base font-black">محصولات این راهنما</h2></div></div><div className="mt-5 space-y-2">{parts.map((part, index) => part.id != null ? <Link key={part.id} href={ROUTES.partDetail(String(part.id))} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-3 transition hover:bg-white/12"><Package className="size-4 shrink-0 text-cyan-300" /><span className="min-w-0 flex-1 truncate text-sm font-bold text-white/80">{part.name || "قطعه خودرو"}</span><ArrowLeft className="size-3.5 text-white/30 transition-transform group-hover:-translate-x-1" /></Link> : <div key={index} className="rounded-xl bg-white/[0.07] px-3 py-3 text-sm text-white/70">{part.name || "قطعه خودرو"}</div>)}</div></section>;
}

function plainText(value: string) { return value.replace(/<\s*br\s*\/?\s*>/gi, "\n").replace(/<\/(p|div|h[1-6]|li)>/gi, "\n\n").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n{3,}/g, "\n\n").trim(); }
function excerptFromContent(value?: string) { const text = plainText(value || ""); return text.length > 160 ? `${text.slice(0, 157)}...` : text || "مطالب تخصصی خودرو و قطعات یدکی در مجله کارتیوو."; }
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(date); }
