import Link from "next/link";
import { Car, Instagram, Send, Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { label: "خانه", href: "/" },
  { label: "قطعات", href: "/parts" },
  { label: "برندها", href: "/brands" },
  { label: "پرفروش‌ترین‌ها", href: "/bestsellers" },
  { label: "تخفیف‌ها", href: "/deals" },
];

const customerService = [
  { label: "تماس با ما", href: "/contact" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "راهنمای خرید", href: "/guide" },
  { label: "شرایط بازگشت", href: "/returns" },
  { label: "پیگیری سفارش", href: "/track-order" },
];

const aboutLinks = [
  { label: "درباره ما", href: "/about" },
  { label: "قوانین و مقررات", href: "/terms" },
  { label: "حریم خصوصی", href: "/privacy" },
  { label: "فرصت‌های شغلی", href: "/careers" },
  { label: "وبلاگ", href: "/blog" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#102a50] pb-24 pt-16 text-white md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="mb-12 grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black">Cartivo</span>
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/70">
              کارتیوو، پلتفرم هوشمند خرید قطعات خودرو. با وارد کردن VIN خودرو
              خود، سریع‌ترین و دقیق‌ترین قطعات را پیدا کنید.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold">دسترسی سریع</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-sm font-bold">خدمات مشتریان</h3>
            <ul className="space-y-2.5">
              {customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-bold">درباره کارتیوو</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Phone className="h-4 w-4" />
            <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Mail className="h-4 w-4" />
            <span>info@cartivo.ir</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4" />
            <span>تهران، خیابان ولیعصر</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/50">
            © ۱۴۰۳ کارتیوو. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
