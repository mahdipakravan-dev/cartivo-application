import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Send, Phone, Mail, MapPin } from "lucide-react";

/*
 * فقط به صفحاتی لینک بدهید که واقعاً وجود دارند. لینک‌های سراسری فوتر به
 * صفحات ۴۰۴ (bestsellers ،deals ،faq ،guide ،returns ،track-order ،terms،
 * privacy ،careers ،blog) حذف شدند؛ پس از ساخت هر صفحه دوباره اضافه شوند.
 * صفحات faq ،returns ،terms و privacy برای اعتماد و سئو اولویت ساخت دارند.
 */
const quickLinks = [
  { label: "خانه", href: ROUTES.home },
  { label: "قطعات", href: ROUTES.parts },
  { label: "برندهای خودرو", href: ROUTES.brands },
  { label: "دسته‌بندی‌ها", href: ROUTES.categories },
  { label: "برندهای قطعه", href: ROUTES.partBrands },
];

const customerService = [
  { label: "تماس با ما", href: ROUTES.contact },
  { label: "مقایسه قطعات", href: ROUTES.compare },
];

const aboutLinks = [
  { label: "درباره ما", href: ROUTES.about },
  { label: "فروشنده شوید", href: ROUTES.sellerJoin },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary pb-24 pt-16 text-white md:pb-10">
      <div className="container-cartivo px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="mb-12 grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link
              href="/"
              aria-label="کارتیو، صفحه اصلی"
              className="mb-5 inline-flex"
            >
              <Image
                src="/images/brand/cartivo-logo-light-footer.webp"
                alt="کارتیو"
                width={198}
                height={256}
                className="h-auto w-24 object-contain"
              />
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/70">
              کارتیو، پلتفرم هوشمند خرید قطعات خودرو. با وارد کردن VIN خودرو
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
            <h3 className="mb-4 text-sm font-bold">درباره کارتیو</h3>
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
            <span dir="ltr">-</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Mail className="h-4 w-4" />
            <span>info@cartivo.ir</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4" />
            <span>-</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/50">
            © ۱۴۰۳ کارتیو. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
