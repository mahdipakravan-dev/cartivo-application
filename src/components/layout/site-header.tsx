import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

/**
 * هدر سراسری سایت — Server Component، بدون JS کلاینتی.
 * از ماژول Shared «siteConfig» برای نام برند استفاده می‌کند.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          {siteConfig.name}
          <span className="mr-1 text-xs font-medium text-muted-foreground">
            {siteConfig.nameEn}
          </span>
        </Link>

        <nav aria-label="ناوبری اصلی">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link
                href="/brands"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                برندهای خودرو
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
