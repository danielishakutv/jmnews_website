/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // WordPress media library (Menorah / WP CDN). Update host if you
      // move media to an offload bucket (S3, Cloudflare R2) later.
      { protocol: "https", hostname: "menorah.com.ng" },
      { protocol: "https", hostname: "secure.gravatar.com" },
      // Secondary source: jabbamanews.wordpress.com (WordPress.com REST feed).
      // Media is served from the site host, the WP.com image CDN (i0/i1/i2.wp.com),
      // and avatars from any gravatar subdomain.
      { protocol: "https", hostname: "jabbamanews.wordpress.com" },
      { protocol: "https", hostname: "**.wp.com" },
      { protocol: "https", hostname: "**.gravatar.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Featured-image uploads flow through the article-editor server action;
    // the default 1MB cap is too small for real news photos.
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
