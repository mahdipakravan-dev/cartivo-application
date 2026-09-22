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
