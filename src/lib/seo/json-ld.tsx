import type { ReactElement } from "react";

/**
 * کامپوننت مشترک تزریق داده‌ی ساختاریافته (Schema.org / JSON-LD).
 *
 * - در Server Component ها استفاده می‌شود؛ خروجی مستقیماً در HTML اولیه
 *   قرار می‌گیرد و برای خزنده‌ی گوگل بدون اجرای JS قابل خواندن است.
 * - طبق مستندات Next.js، امن‌ترین روش همین dangerouslySetInnerHTML با
 *   JSON.stringify است؛ برای جلوگیری از XSS کاراکتر < را escape می‌کنیم.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
