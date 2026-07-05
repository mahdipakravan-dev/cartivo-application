import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // خروجی استاندارد Node — در صورت نیاز به Docker می‌توانید "standalone" کنید
  // output: "standalone",

  images: {
    // دامنه‌ی سرویس فایل/تصویر بک‌اند را اینجا اضافه کنید
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.cartivo.ir",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**/*',
      }
    ],
    dangerouslyAllowLocalIP: true,
  },

  // هدرهای امنیتی پایه (مکمل تنظیمات وب‌سرور)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
