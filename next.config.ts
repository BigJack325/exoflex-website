// next.config.mjs  (TS works too)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1️⃣  Domains / patterns you allow
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
        pathname: "/**",          // all repos
      },
    ],

    // 2️⃣  Modern formats Next should output
    formats: ["image/avif", "image/webp"],

    // 3️⃣  Tailored sizes (px) that match your Tailwind break-points
    deviceSizes: [320, 640, 768, 1024, 1280, 1536],
    imageSizes:  [16, 32, 48, 64, 96],

    // 4️⃣  Optimized images stay cached for ~1 month
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // 5️⃣  (optional) HTTP headers: preconnect to Prismic CDN
  async headers() {
    return [
      {
        source: "/(.*)",          // every route
        headers: [
          {
            key: "Link",
            value: '<https://images.prismic.io>; rel=preconnect',
          },
        ],
      },
    ];
  },
};

export default nextConfig;