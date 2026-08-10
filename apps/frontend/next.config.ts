import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const assetCacheHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=604800, stale-while-revalidate=2592000",
  },
];

const nextConfig: NextConfig = {
  experimental: {},
  images: {
    // WebP gives us a strong size reduction without AVIF's slower first encode.
    formats: ["image/webp"],

    // Next 16 only allows configured qualities. Existing Vita components use
    // quality={100} for a few brand/product assets, so keep the full useful set.
    qualities: [70, 75, 80, 85, 90, 95, 100],

    // Reuse generated variants instead of repeatedly re-optimizing the same
    // public/CMS images. Keep this moderate because public asset filenames are
    // not content hashed.
    minimumCacheTTL: 86400,

    // SVGs are still explicitly served unoptimized in image-heavy components.
    // These settings keep SVG responses renderable inline if one reaches the
    // optimizer through a dynamic source.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: assetCacheHeaders,
      },
      {
        source: "/landing-hero.svg",
        headers: assetCacheHeaders,
      },
      {
        source: "/product-vector.svg",
        headers: assetCacheHeaders,
      },
      {
        source: "/wave-2.svg",
        headers: assetCacheHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
