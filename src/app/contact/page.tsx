import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, BadgeCheck, CalendarClock, ChevronLeft, Clock3, Headphones,
  Mail, MapPin, MessageCircleMore, Phone, Send, ShieldCheck, Sparkles,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { ROUTES } from "@/lib/routes";
import { JsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: `راه‌های ارتباط با ${siteConfig.name}، شماره تماس، ایمیل، آدرس و ساعات پاسخ‌گویی پشتیبانی.`,
  alternates: { canonical: ROUTES.contact },
  openGraph: {
    title: `تماس با ${siteConfig.name}`,
    description: "کارشناسان کارتیوو برای انتخاب قطعه، پیگیری سفارش و راهنمایی خرید در کنار شما هستند.",
    url: ROUTES.contact,
    type: "website",
  },
};

const gallery = [
  {
    src: "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/8272c8ed3_generated_0cb84b85.png",
    alt: "تیم و خدمات خودرویی کارتیوو",
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/7634c3849_generated_b7167273.png",
    alt: "فناوری انتخاب قطعه کارتیوو",
    className: "",
  },
  {
    src: "https://media.base44.com/images/public/6a4ca7e91f5491d8941f034f/10877c212_generated_4caa0b9b.png",
    alt: "قطعات یدکی بررسی‌شده در کارتیوو",
    className: "",
  },
];

export default function ContactPage() {
  const { contact } = siteConfig;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: contact.email,
    telephone: contact.phone,
    address: { "@type": "PostalAddress", streetAddress: contact.address, addressCountry: "IR" },
    contactPoint: { "@type": "ContactPoint", telephone: contact.phone, contactType: "customer service", availableLanguage: "Persian" },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="bg-[#f8fafc] pb-20 pt-24 sm:pt-28">
        <div className="container-cartivo px-4 sm:px-6 lg:px-8">
          <nav aria-label="مسیر ناوبری" className="mb-6 text-xs text-slate-400">
            <ol className="flex items-center gap-1.5"><li><Link href={ROUTES.home} className="hover:text-[#14305A]">خانه</Link></li><li><ChevronLeft className="size-3" /></li><li className="font-bold text-slate-600">تماس با ما</li></ol>
          </nav>

          <header className="relative isolate overflow-hidden rounded-[2rem] bg-[#14305A] shadow-[0_24px_70px_rgb(15_23_42/0.12)]">
            <div className="absolute -right-24 -top-32 size-80 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="grid lg:min-h-[470px] lg:grid-cols-[1fr_1.05fr]">
              <div className="relative z-10 flex items-center px-6 py-12 sm:px-10 lg:px-14">
                <div><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-100"><Headphones className="size-4" /> همراه شما هستیم</span><h1 className="mt-6 text-3xl font-black leading-[1.5] text-white sm:text-4xl lg:text-5xl">یک گفت‌وگوی خوب،<span className="block text-cyan-300">شروع یک انتخاب درست است</span></h1><p className="mt-5 max-w-xl text-sm leading-8 text-white/60 sm:text-base">برای انتخاب قطعه، بررسی سازگاری، پیگیری سفارش یا هر پرسش دیگری با کارشناسان کارتیوو در ارتباط باشید.</p><div className="mt-8 flex flex-wrap gap-3"><a href={`tel:${contact.phone}`} className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#14305A] transition hover:-translate-y-0.5 hover:bg-cyan-50"><Phone className="size-4" /> تماس با پشتیبانی</a><a href={`mailto:${contact.email}`} className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/15"><Mail className="size-4" /> ارسال ایمیل</a></div></div>
              </div>
              <div className="relative min-h-[320px] overflow-hidden border-t border-white/10 lg:min-h-[470px] lg:border-r lg:border-t-0"><Image src={gallery[0]!.src} alt={gallery[0]!.alt} fill sizes="(max-width: 1024px) 100vw, 52vw" className="object-contain p-6 opacity-80 lg:p-10" priority /><div className="absolute inset-0 bg-gradient-to-t from-[#14305A]/50 via-transparent to-transparent lg:bg-gradient-to-r" /><div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-xl border border-white/15 bg-slate-950/25 px-4 py-3 text-xs font-bold text-white/75 backdrop-blur-md"><BadgeCheck className="size-4 text-cyan-300" /> پشتیبانی تخصصی قطعات خودرو</div></div>
            </div>
          </header>

          <section className="relative z-10 -mt-5 px-3 sm:px-6" aria-label="راه‌های ارتباطی">
            <div className="grid gap-3 rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-[0_20px_55px_rgb(15_23_42/0.08)] sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
              <ContactCard icon={Phone} label="شماره تماس" value={contact.phoneDisplay} href={`tel:${contact.phone}`} ltr />
              <ContactCard icon={Mail} label="ایمیل" value={contact.email} href={`mailto:${contact.email}`} ltr />
              <ContactCard icon={MapPin} label="آدرس دفتر" value={contact.address} />
              <ContactCard icon={Clock3} label="ساعات پاسخ‌گویی" value={contact.workingHours} />
            </div>
          </section>

          <section className="grid gap-6 py-12 lg:grid-cols-[.9fr_1.1fr] lg:py-16">
            <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold text-cyan-700">پشتیبانی کارتیوو</p><h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">چطور می‌توانیم کمک کنیم؟</h2><p className="mt-3 text-sm leading-7 text-slate-500">مسیر ارتباطی مناسب را انتخاب کنید؛ تیم ما تلاش می‌کند در کوتاه‌ترین زمان پاسخ شما را بدهد.</p>
              <div className="mt-7 space-y-3"><SupportRow icon={ShieldCheck} title="راهنمای انتخاب قطعه" description="بررسی سازگاری قطعه با برند و مدل خودرو" /><SupportRow icon={Send} title="پیگیری سفارش" description="بررسی وضعیت آماده‌سازی، ارسال و تحویل" /><SupportRow icon={MessageCircleMore} title="پیشنهاد و بازخورد" description="شنیدن تجربه شما برای بهتر شدن کارتیوو" /></div>
              <div className="mt-7 rounded-2xl bg-[#14305A] p-5 text-white"><CalendarClock className="size-6 text-cyan-300" /><h3 className="mt-3 font-black">پاسخ‌گویی در روزهای کاری</h3><p className="mt-2 text-sm leading-7 text-white/55">پیام‌های خارج از ساعات کاری ثبت می‌شوند و در اولین فرصت بررسی خواهند شد.</p></div>
            </div>

            <div>
              <div className="mb-5"><p className="text-xs font-bold text-cyan-700">نگاهی به کارتیوو</p><h2 className="mt-2 text-2xl font-black text-slate-900">فناوری در کنار تخصص خودرو</h2></div>
              <div className="grid auto-rows-[180px] gap-3 sm:grid-cols-3 sm:auto-rows-[190px]">
                {gallery.map((image, index) => <div key={image.src} className={`group relative overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white ${image.className}`}><Image src={image.src} alt={image.alt} fill sizes={index === 0 ? "(max-width: 640px) 100vw, 55vw" : "(max-width: 640px) 100vw, 25vw"} className="object-contain p-4 transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#14305A]/30 via-transparent to-transparent" /></div>)}
              </div>
            </div>
          </section>

          <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-slate-100 px-6 py-9 sm:px-9">
            <Sparkles className="absolute left-8 top-8 size-12 text-cyan-700/10" /><div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold text-cyan-700">قبل از تماس</p><h2 className="mt-2 text-xl font-black text-[#14305A] sm:text-2xl">قطعه موردنظرتان را پیدا نکرده‌اید؟</h2><p className="mt-2 text-sm text-slate-500">درخواست قطعه ثبت کنید تا نتیجه بررسی از طریق پیامک و پروفایل اطلاع داده شود.</p></div><Link href="/#part-request" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#14305A] px-5 text-sm font-bold text-white">ثبت درخواست قطعه <ArrowLeft className="size-4" /></Link></div>
          </section>
        </div>
      </main>
    </>
  );
}

function ContactCard({ icon: Icon, label, value, href, ltr = false }: { icon: typeof Phone; label: string; value: string; href?: string; ltr?: boolean }) {
  const content = <><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><Icon className="size-5" /></span><span className="min-w-0"><small className="block text-[10px] font-bold text-slate-400">{label}</small><strong dir={ltr ? "ltr" : undefined} className={`mt-1 block text-sm text-slate-700 ${ltr ? "text-right" : ""}`}>{value}</strong></span></>;
  return href ? <a href={href} className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-slate-50">{content}</a> : <div className="flex items-center gap-3 rounded-2xl p-3">{content}</div>;
}

function SupportRow({ icon: Icon, title, description }: { icon: typeof Phone; title: string; description: string }) { return <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[#14305A]"><Icon className="size-5" /></span><div><h3 className="text-sm font-black text-slate-700">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{description}</p></div></div>; }
