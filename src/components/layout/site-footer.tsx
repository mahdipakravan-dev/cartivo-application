import { siteConfig } from "@/lib/config/site";

/** فوتر سراسری — مینیمال؛ لینک‌های واقعی بعد از تعریف صفحات اضافه می‌شوند */
export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {new Date().toLocaleDateString("fa-IR", { year: "numeric" })}{" "}
        {siteConfig.name} — همه‌ی حقوق محفوظ است.
      </div>
    </footer>
  );
}
