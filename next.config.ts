import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A lockfile also exists above this repository. Keep Turbopack scoped to this
  // app so it does not mix manifests and modules from the parent workspace.
  turbopack: {
    root: process.cwd(),
  },
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
        protocol: "https",
        hostname: "media.base44.com",
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

  async redirects() {
    return [
      // مسیر اصلی صفحه‌ی برندها /parts/brands است؛ /brands قبلاً در فوتر لینک
      // شده بود و صفحه‌ای نداشت (۴۰۴).
      { source: "/brands", destination: "/parts/brands", permanent: true },
      { source: "/brands/:slug", destination: "/parts/brands/:slug", permanent: true },
      // یکپارچه‌سازی دامنه: www به دامنه‌ی اصلی بدون www
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.cartivo.ir" }],
        destination: "https://cartivo.ir/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' http://localhost:5173 http://127.0.0.1:5173",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
